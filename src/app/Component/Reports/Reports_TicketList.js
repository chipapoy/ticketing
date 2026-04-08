import axios from 'axios';
import { useEffect, useState } from 'react';
import DataTable, { Alignment } from 'react-data-table-component';

import '@fortawesome/fontawesome-svg-core/styles.css';

import moment from 'moment';

import Card from '@mui/material/Card'

import ReportMenu from '@/Component/Reports/ReportMenu';
import { updateToast } from 'app/utils/toast';
import { DATATABLE_COLUMNS, DATATABLE_CUSTOMSTYLES } from 'app/utils/constantVariables';


const Reports_TicketList = (props) => {

   const [data, setData] = useState([]); // used for displaying data in the data table & for downloading the data
   const [unfilteredData, setUnfilteredData] = useState([]) // Needed for fetching data from axios & used in useEffect everytime it changes
   const [downloadData, setDownloadData] = useState([])

   const [loading, setLoading] = useState(false);
   const [totalRows, setTotalRows] = useState(0);
   const [perPage, setPerPage] = useState(10);
   const [refresh, setRefresh] = useState(false);
   const [defaultPage, setDefaultPage] = useState(1);
   const [isReset, setIsReset] = useState(false);

   const[filterItem, setFilterItem] = useState({
      label: '',
      item: ''
   })

   useEffect(() => {

      fetchData(1); // fetch page 1 of users

      refresh ? fetchData(1) : null;

      return () => {
         setRefresh(false);
         setIsReset(false);
      }

   }, [props.filterDate, refresh])

   useEffect(() => {

      filterDataSpecified()      
   }, [filterItem, unfilteredData])

   //#region SEARCH 

   // This handles the dynamic search for tickets based on ticket ID
   const getSearchCallback = (data) => data.search === '' ? fetchData(1) : searchData(1, data.search)

   const searchData = async (page, search) => {
      try {
         
         setLoading(true)
         const fromDate = moment(props.filterDate.from).format('YYYY-MM-DD HH:mm')
         const toDate = moment(props.filterDate.to).format('YYYY-MM-DD HH:mm')
         const response = await axios.get(`/api/Reports/searchTicket?page=${page}&per_page=${perPage}&search=${search}&from_date=${fromDate}&to_date=${toDate}`)
         setUnfilteredData(response.data.result.data)
         setTotalRows(response.data.result.total)
         setLoading(false)
      
      } catch (error) {

         setLoading(false)
         updateToast(error.message, 'error', 0)
      }
   }

   //#endregion

   //#region SELECT ROWS

   const selectedCallback = ({allSelected, selectedCount, selectedRows}) => {
      // allSelected - returns bool if all rows are selected (including in the different pages). 
      // selectedCount - returns the count of the selected rows
      // selectedRows - returns an array of objects containing all the selected rows

      // When there is no selected rows, by default, it would download all of the rows.
      selectedCount === 0 ? 
         setDownloadData(data) : setDownloadData(selectedRows)
   }

   //#endregion

   //#region FILTER 

   const getFilterCallback = (filter) => {
      setFilterItem({
         label: filter.label,
         item: filter.item
      })
   }

   const filterDataSpecified = () => {
      
      switch(filterItem.label){
         case 'active org':
            setData(
               unfilteredData.filter(ticket => ticket.active_org === filterItem.item)
            )
         break
         case 'category':
            setData(
               unfilteredData.filter(ticket => ticket.category === filterItem.item)
            )
         break
         case 'priority':
            setData(
               unfilteredData.filter(ticket => ticket.priority === filterItem.item)
            )
         break
         case 'shop':
            setData(
               unfilteredData.filter(ticket => ticket.shop_name === filterItem.item)
            )
         break

         case 'tagging':
            setData(
               unfilteredData.filter(ticket => ticket.tagging === filterItem.item)
            )
         break
         case 'tech_loc':
            setData(
               unfilteredData.filter(ticket => ticket.tech_location === filterItem.item)
            )
         break
         case 'technician':
            setData(
               unfilteredData.filter(ticket => ticket.technician_name === filterItem.item)
            )
         break
         default:
            setData(unfilteredData)
            setDownloadData(unfilteredData)
         break;
      }
   }

   //#endregion

   //#region DATA REQUEST

   const fetchData = async page => {

      try {

         setLoading(true);
         const fromDate = moment(props.filterDate.from).format('YYYY-MM-DD HH:mm')
         const toDate = moment(props.filterDate.to).format('YYYY-MM-DD HH:mm')
         const response = await axios.get(`/api/Reports/getTicketList?page=${page}&per_page=${perPage}&from_date=${fromDate}&to_date=${toDate}`);
         
         
         setUnfilteredData(response.data.result.data)
         // setDownloadData(response.data.result.data)
         setTotalRows(response.data.result.total)
         setLoading(false);
      } catch (error) {

         setLoading(false)
         updateToast(error.message, 'error', 1500)
      }

   };

   const handlePageChange = page => {
      fetchData(page);
   };

   const handlePerRowsChange = async (newPerPage, page) => {
      
      try {
         setLoading(true);
         
         const fromDate = moment(props.filterDate.from).format('YYYY-MM-DD HH:mm')
         const toDate = moment(props.filterDate.to).format('YYYY-MM-DD HH:mm')
         const response = await axios.get(`/api/Reports/getTicketList?page=${page}&per_page=${perPage}&from_date=${fromDate}&to_date=${toDate}`);
         setUnfilteredData(response.data.result.data)
         setDownloadData(response.data.result.data)
         setTotalRows(response.data.result.total)
         setPerPage(newPerPage);
         setLoading(false);
      } catch (error) {

         setLoading(false)
         updateToast(error.message, 'error', 1500)
      }

   };

   const refreshData = () => {
      setData([]);
      setRefresh(true);
      setDefaultPage(1);
      setIsReset(true);
   }

   //#endregion
   
   return (
      <>
         <DataTable
            // className='z-0'
            columns={DATATABLE_COLUMNS}
            data={data}
            persistTableHead={true}
            progressPending={loading}
            // dense
            pagination
            // paginationServer
            paginationTotalRows={totalRows}
            paginationRowsPerPageOptions={[10, 20, 30]}
            paginationPerPage={10}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            fixedHeader={true}
            fixedHeaderScrollHeight={"50vh"}
            highlightOnHover={true}
            striped={true}
            pointerOnHover={true}
            paginationDefaultPage={defaultPage}
            paginationResetDefaultPage={isReset}
            customStyles={DATATABLE_CUSTOMSTYLES}
            
            selectableRows
            onSelectedRowsChange={selectedCallback}

            subHeader={true}
            subHeaderAlign={Alignment.LEFT}
            subHeaderComponent={
               <ReportMenu 
                  searchCallback={getSearchCallback}
                  refreshCallback={refreshData}
                  downloadData={downloadData} 
                  filterCallback={getFilterCallback}
               />
            }
         />
      </>
      
   );
}

export default Reports_TicketList