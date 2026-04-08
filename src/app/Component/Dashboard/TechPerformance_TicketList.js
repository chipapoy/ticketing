import React from 'react'

import { useState } from 'react';

import Card from '@mui/material/Card';

import DataTable from 'react-data-table-component';

import { DATATABLE_CUSTOMSTYLES } from 'app/utils/constantVariables';

const TechPerformance_TicketList = (props) => {
   const [loading, setLoading] = useState(false);
   const [defaultPage, setDefaultPage] = useState(1);

   const columns = [
      {
         id: 'tech_name',
         name: 'Technician Name',
         selector: row => row.technician_name,
         wrap:true,
         minWidth: '15rem',
      },
      {
         id: 'open_ticket_count',
         name: 'Open Tickets',
         selector: row => row.open_total,
         wrap: true,
         minWidth: '15rem',
         center: true
      },
      {
         id: 'resolved_ticket_count',
         name: 'Resolved Tickets',
         selector: row => row.resolved_total,
         wrap: true, 
         minWidth: '15rem',
         center: true
      },
      {
         id: 'closed_ticket_count',
         name: 'Closed Tickets',
         selector: row => row.closed_total,
         wrap: true,
         minWidth: '15rem',
         center: true
      },
      {
         id: 'total_ticket_count',
         name: 'Total Tickets',
         selector: row => row.total,
         wrap: true,
         minWidth: '15rem',
         center: true
      }
   ]

  return (
      <div>
         <DataTable
            columns={columns}
            data={props.data}
            persistTableHead={true}
            progressPending={loading}
            // dense
            pagination
            fixedHeader={true}
            fixedHeaderScrollHeight={"50vh"}
            highlightOnHover={true}
            striped={true}
            pointerOnHover={true}
            paginationDefaultPage={defaultPage}
            // paginationResetDefaultPage={isReset}
         
            customStyles={DATATABLE_CUSTOMSTYLES}
         />
   </div>
  )
}

export default TechPerformance_TicketList