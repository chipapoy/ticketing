import '@fortawesome/fontawesome-svg-core/styles.css';
import Card from '@mui/material/Card';
import { DATATABLE_COLUMNS, DATATABLE_CUSTOMSTYLES } from 'app/utils/constantVariables';
import React from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';




const Dashboard_TicketList = (props) => {

  const [loading, setLoading] = useState(false);
  const [defaultPage, setDefaultPage] = useState(1);

  return (
    <div>
      <DataTable
         columns={DATATABLE_COLUMNS}
         data={props.filteredData}
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
      
         customStyles={DATATABLE_CUSTOMSTYLES}
      />
    </div>
  );
}

export default Dashboard_TicketList