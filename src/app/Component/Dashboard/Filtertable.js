import '@fortawesome/fontawesome-svg-core/styles.css';
import Card from '@mui/material/Card';

import { useEffect, useState } from 'react';

import DataTable, { Alignment }  from 'react-data-table-component';

import { Typography } from '@mui/material';

import DownloadCSV_Button from './DownloadCSV_Button';
import { DATATABLE_CUSTOMSTYLES } from 'app/utils/constantVariables';
import FilterTableHeader from './FilterTableHeader';

const FilterTable = (props) => {

   const [unfilteredData, setUnfilteredData] = useState(props.data)
   const [filteredData, setFilteredData] = useState(null)

   const [loading, setLoading] = useState(false);
   const [defaultPage, setDefaultPage] = useState(1);


   const [filterItem, setFilterItem] = useState('')

   useEffect(() => {
      changeData()
   },[filterItem])

   useEffect(() => {
      setUnfilteredData(props.data)
   },[])

   const changeData = () => {
      console.log(filterItem)
      switch(props.typeKey){
         case 'transaction-type':
            if (filterItem !== '' ){
               setFilteredData(unfilteredData.filter(ticket => ticket.ticket_type === filterItem))
            } else {
               setFilteredData(unfilteredData)
            }
            break

         case 'category':
            if (filterItem !== '' ){
               setFilteredData(unfilteredData.filter(ticket => ticket.category === filterItem))
            } else {
               setFilteredData(unfilteredData)
            }
            break

         case 'active-org':
            if (filterItem !== '') {
               setFilteredData(unfilteredData.filter(ticket => ticket.active_org === filterItem)) 
            } else {
               setFilteredData(unfilteredData)
            }
            break
         default:
            setFilteredData(unfilteredData)
      }
   }

   const filterCallback = (item) => setFilterItem(item)

   return (
      <div className='h-full'>
         {filteredData ? <DataTable 
            columns={props.tableColumns}
            data={filteredData}
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

            subHeader={true}
            subHeaderAlign={Alignment.LEFT}
            subHeaderComponent={
               <FilterTableHeader 
                  typeKey={props.typeKey}
                  filterCallback={filterCallback}
                  extractData={filteredData}
               />
            }
            
         />
         :
         <Typography>Nothing</Typography>
         }

      </div>
   )
}

export default FilterTable