import { useEffect, useState, useRef } from 'react';
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import axios from 'axios';
import Chip from '@mui/material/Chip';

const Details = ({ record_id }) => {

  const [userId, setUserId] = useState(null)
  const cellStyle = {
    width: '20%', 
    backgroundColor:'#757575', 
    color:'white'
  }

  const statusColor = {
    "Open": "error",
    "Closed": "success",
    "Resolved": "warning",
  };

  const activeOrgColor = {
    "Helpdesk-L1": "warning",
    "Helpdesk-L2": "warning",
    "FieldTech-Lead": "primary",
    "FieldTech-L1": "secondary",
    "FieldTech-L2": "secondary",
    "Third Party": "default"
  };

  //#region  Data source list
  const [ticketDetails, setTicketDetails] = useState([])
  //#endregion

  //#region APIs

  const getTicketDetails = async () => {
    await axios.post(`/api/TicketList/getData`,
      {
        id: parseInt(record_id)
      }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        setTicketDetails(response.data.result)

      });
  }

  //#endregion

  useEffect(() => {

    getTicketDetails()

    return (() => {
      setTicketDetails([])
    })

  }, []);


  return (

    Object.keys(ticketDetails).length === 0 ?
      null
      :
      (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={4} sx={{backgroundColor:'#757575',color:'white'}}>
                <strong>TICKET DETAILS</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Ticket#</TableCell>
                <TableCell colSpan={3} align="left">{ticketDetails.ticket_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Customer Name</TableCell>
                <TableCell align="left">{ticketDetails.customer_name}</TableCell>
                <TableCell align="left" sx={cellStyle}>Contact#</TableCell>
                <TableCell align="left">{ticketDetails.contact_num}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Classification</TableCell>
                <TableCell align="left">{ticketDetails.classification}</TableCell>
                <TableCell align="left" sx={cellStyle}>Platform</TableCell>
                <TableCell align="left">{ticketDetails.platform}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>{ ticketDetails.class_id == 1 ? 'Brand' : 'Department' }</TableCell>
                <TableCell align="left">{ ticketDetails.class_id == 1 ? ticketDetails.shop_name : ticketDetails.department }</TableCell>
                <TableCell align="left" sx={cellStyle}>{ ticketDetails.class_id == 1 ? 'Location' : 'Section' }</TableCell>
                <TableCell align="left">{ ticketDetails.class_id == 1 ? ticketDetails.area_location : ticketDetails.section }</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Open Date</TableCell>
                <TableCell align="left">{ticketDetails.open_date}</TableCell>
                <TableCell align="left" sx={cellStyle}>Closed Date</TableCell>
                <TableCell align="left">{ticketDetails.closed_date || '--'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Ticket Type</TableCell>
                <TableCell colSpan={3} align="left">{ticketDetails.ticket_type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Category</TableCell>
                <TableCell align="left">{ticketDetails.category}</TableCell>
                <TableCell align="left" sx={cellStyle}>Sub Category</TableCell>
                <TableCell align="left">{ticketDetails.sub_category}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Priority</TableCell>
                <TableCell align="left">{ticketDetails.priority}</TableCell>
                <TableCell align="left" sx={cellStyle}>SLA</TableCell>
                <TableCell align="left">{ticketDetails.sla}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Status</TableCell>
                <TableCell align="left"><Chip label={ticketDetails.status} color={statusColor[ticketDetails.status]} size='small' /></TableCell>
                <TableCell align="left" sx={cellStyle}>Active Org</TableCell>
                <TableCell align="left"><Chip label={ticketDetails.active_org} color={activeOrgColor[ticketDetails.active_org]} size='small' /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" sx={cellStyle}>Tele-Troubleshoot</TableCell>
                <TableCell align="left">{ticketDetails.tele_ts}</TableCell>
                <TableCell align="left" sx={cellStyle}>Assigned Tech</TableCell>
                <TableCell align="left">{ticketDetails.technician_name}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )

  )

  //#endregion
}

export default Details