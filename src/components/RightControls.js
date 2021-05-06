import React from 'react';


import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';


import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago'
import JavascriptTimeAgo from 'javascript-time-ago'



import en from 'javascript-time-ago/locale/en'
JavascriptTimeAgo.addLocale(en)



const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


function SourceDialog(props) {
    const classes = useStyles();
    const { onClose, open, dataSources } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Data Source
        </DialogTitle>
            <DialogContent >

                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell >State or Locality</StyledTableCell >
                                <StyledTableCell >Site</StyledTableCell >
                                <StyledTableCell >Last updated</StyledTableCell >
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataSources.map((d, idx) => {
                                    return (
                                        <StyledTableRow key={`ds${idx}`}>
                                            <StyledTableCell component="th" scope="row">
                                                Andhra Pradesh
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                <a href="http://dashboard.covid19.ap.gov.in/" target="blank">
                                                    http://dashboard.covid19.ap.gov.in/</a>
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">
                                                <ReactTimeAgo date={new Date(d.time)} />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )
                                })
                            }

                        </TableBody>
                    </Table>
                </TableContainer>

                <p>
                    This site is an open source project.
                    </p>
                <p> Please feel make changes to this, or add more data sources at <a href="https://github.com/covid19maps/covid19maps" target="blank">github.com/covid19maps/covid19maps</a>
                </p>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    );
}

SourceDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    dataSources: PropTypes.array
};



export default function RightControls(props) {
    const [open, setOpen] = React.useState(false);
    const { dataSources } = props;


    const handleClickOpen = (e) => {
        e.preventDefault()
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };
    return <div className="leaflet-top leaflet-right ">
        <div className="leaflet-bar leaflet-control">
            <a className="leaflet-bar-part leaflet-bar-part-single " href="https://github.com/covid19maps/covid19maps" target="_blank" rel="noreferrer">
                <span className="fa fa-github fa-lg"></span>
            </a>
        </div>
        <div className="leaflet-bar leaflet-control">
            <a href="/#" className="leaflet-bar-part leaflet-bar-part-single " onClick={handleClickOpen}>
                <span className="fa fa-database fa-lg"></span>
            </a>
            <SourceDialog open={open} onClose={handleClose} dataSources={dataSources} />
        </div>

    </div>
}
