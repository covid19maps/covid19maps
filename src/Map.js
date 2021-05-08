import './Map.css'

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import ReactTimeAgo from 'react-time-ago'


import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import 'font-awesome/css/font-awesome.min.css';

import LocateControl from './components/LocateControl'
import SearchControl from './components/SearchControl'
import RightControls from './components/RightControls'

import fetchAllData from './data-source'


class CovidMap extends React.Component {
    constructor() {
        super();
        this.state = {
            // lastUpdated: undefined,
            allHospitals: [],
            center: {
                lat: 15.9129,
                lng: 79.7400,
            }
        }
    }
    componentDidMount() {
        fetchAllData().forEach(dataPromise => {
            dataPromise.then(h => {
                if (!h) {
                    return;
                }
                h.stateOrLocality = h.stateOrLocality || "Andhra Pradesh";
                h.source = h.source || "http://dashboard.covid19.ap.gov.in/";
                h.lastUpdatedAt = h.time || h.lastUpdatedAt;
                this.setState(prevState => ({
                    allHospitals: [...prevState.allHospitals, h]
                }))
            }, error => {
                console.log('Error fetching data ', error);
            });
        })
    }

    setCenter(location) {
        this.setState({
            center: location
        })
    }

    render() {
        const { center } = this.state;
        const locateOptions = {
            position: 'topleft',
            strings: {
                title: 'Show me where I am'
            },
            onActivate: () => { } // callback before engine starts retrieving locations
        }

        const { allHospitals } = this.state;

        return (<MapContainer center={center} zoom={7} >

            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
                attribution='Created by <a href="https://github.com/pgollangi" target="_blank" rel="noreferrer">github.com/pgollangi</a>'
                url="https://github.com/pgollangi"
            />
            <LocateControl key="locate" options={locateOptions} />
            <SearchControl />
            <RightControls dataSources={allHospitals} />

            {/* <div className="map-search-container">
                <ReactSearchBox
                    placeholder="Search hospital or address"
                    data={data}
                    onSelect={record => {
                        this.setCenter({
                            lat: record.location.latitude,
                            lng: record.location.longitude,
                        })
                    }}
                    onFocus={() => {
                        console.log('This function is called when is focussed')
                    }}
                    onChange={value => console.log(value)}
                    fuseConfigs={{
                        threshold: 0.05,
                    }}
                    value=""
                />
            </div> */}

            {allHospitals.map((d) => {
                return d.hospitals.map((h, idx) => {
                    return (<Marker key={`h${idx}`} position={[h.location.latitude, h.location.longitude]}>
                        <Popup>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Hospital:</th>
                                        <td colSpan="3">{h.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone:</th>
                                        <td colSpan="3">
                                            <a href={`tel:${Array.isArray(h.phoneNumber) ? h.phoneNumber[0] : h.phoneNumber}`} target="_blank" rel="noreferrer">
                                                {Array.isArray(h.phoneNumber) ? h.phoneNumber[0] : h.phoneNumber}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Address:</th>
                                        <td colSpan="3">{h.location.formattedAddress || (h.location.streetName + "," + h.location.city)}</td>
                                    </tr>
                                    <tr>
                                        <th>Directions:</th>
                                        <td colSpan="3">
                                            <a href={h.location.link || `https://www.google.com/maps/search/?api=1&query=${h.location.latitude},${h.location.longitude}`} target="_blank" rel="noreferrer">
                                                Click Here
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>LastUpdated:</th>
                                        <td colSpan="3">
                                            <ReactTimeAgo date={new Date(h.lastUpdatedAt || d.lastUpdatedAt)} />
                                        </td>
                                    </tr>
                                    <tr>

                                        <th>Beds</th>
                                        <th>Total</th>
                                        <th>Occupied</th>
                                        <th>Available</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td>General</td>
                                        <td>{h.general.total || '-'}</td>
                                        <td>{h.general.occupied || '-'}</td>
                                        <td>{h.general.available || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>ICU</td>
                                        <td>{h.icu.total || '-'}</td>
                                        <td>{h.icu.occupied || '-'}</td>
                                        <td>{h.icu.available || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>O2</td>
                                        <td>{h.o2.total || '-'}</td>
                                        <td>{h.o2.occupied || '-'}</td>
                                        <td>{h.o2.available || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Popup>
                    </Marker>)
                })
            })}

        </MapContainer>)
    }
}

export default CovidMap