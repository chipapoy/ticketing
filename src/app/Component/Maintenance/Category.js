import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

import Switch from '@mui/material/Switch';

import axios from 'axios';

import moment from 'moment';


import {
   EllipsisHorizontalIcon,
   PlusCircleIcon,
   DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

import Box from '@mui/material/Box';
import Tooltip from "@mui/material/Tooltip";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel, FormGroup } from "@mui/material";

import { CSVLink } from 'react-csv';

import { updateToast } from "app/utils/toast";
import Modal_MaintenanceWindow from "./Modal_MaintenanceWIndow";
import DownloadDataCSV from "app/utils/extractData";

import { doesStringExist, doesUpdateStringExist } from '../../utils/duplicateChecker';

import Invalid from "@/Component/Maintenance/Invalid";

const Category = (props) => {
   const [categoryArr, setCategoryTypeArr] = useState([])

   const [loading, setLoading] = useState(false)
   const [totalRows, setTotalRows] = useState(0)
   const [perPage, setPerPage] = useState(10)
   const [refresh, setRefresh] = useState(false)
   const [defaultPage, setDefaultPage] = useState(1)
   const [isReset, setIsReset] = useState(false)

   const [userDataID, setUserDataID] = useState(null)
   const [roleID, setRoleID] = useState(null)

   const [modalInfo, setModalInfo] = useState({
      open: false,
      module: '',
      title: '',
      content: null,
      additionalButton: null
    });

   //#region Use Effect

   useEffect(() => {

      setUserDataID(localStorage.id)
      setRoleID(localStorage.role_id)

      roleID ? fetchData(1) : null; // fetch page 1 of users
   
      refresh ? fetchData(1) : null;
   
      return () => {
         setRefresh(false);
         setIsReset(false);
         setUserDataID(null);
         setRoleID(null);
      }
   
      }, [userDataID, roleID, refresh])

   useEffect(() => {

      if (window.localStorage.length === 0) {
         router.push("/login");
      }
      else{
         setUserDataID(window.localStorage.getItem('id'))
      }

   }, [])
   //#endregion

   //#region  DATATABLES
   const columns = [
      {
         id: 'action_btn',
         name: 'Actions',
         sortable: false,
         selector: row => row.id,
         button: true,
         cell: (row, index, column, id) => {
            const menuArr = [
               {
                  title: 'Edit Details',
                  icon: '',
                  record_title: row.name,
                  option_type: "Edit",
                  access: true,
                  record_id: row.id
               },
               {
                  title: 'Disable Item',
                  icon: '',
                  record_title: row.name,
                  option_type: "Disable",
                  access: true,
                  record_id: row.id
               },
            ]
            return(
               <MenuButton menuArr={menuArr}/>
            )
         }
      },
      {
         name: 'ID',
         selector: row => row.id,

      },
      {
         name: 'Category',
         selector: row => row.name,
         wrap:true
      },
      {
         name: 'Is Active',
         selector: row => row.is_active,
         center: true,
         conditionalCellStyles: [
            {
               when: row => row.is_active === 1,
               style: {
                  color: '#2FC300'
               },

            },
            {
               when: row => row.is_active === 0,
               style: {
                  color: '#888888',
               },
            }
         ]
      }
   ]

   const toggleCallback = (data) => {
      setModalInfo({
         open: data.open,
         module: data.module,
         title: data.title,
         content: data.content
      });
    }

   const fetchData = async page => {

      try {
         setLoading(true)
         const response = await axios.get(`/api/Category/getDetails?page=${page}&per_page=${perPage}`)
         setCategoryTypeArr(response.data.result.data)
         setTotalRows(response.data.result.total);
         setLoading(false);
  
      } catch (error) {
        
         setLoading(false)
         updateToast(error.message, 'error', 0)
      }
  
   }

   const handlePageChange = page => {
      fetchData(page);
   }

   const handlePerRowsChange = async (newPerPage, page) => {

      try 
      {
        setLoading(true);
  
        const response = await axios.get(`/api/Category/getDetails?page=${page}&per_page=${newPerPage}`);
        setCategoryTypeArr(response.data.result.data)
        setPerPage(newPerPage)
        setLoading(false)
  
      } catch (error) {
        
         setLoading(false)
         updateToast(error.message, 'error', 0)
      }
  
   }

   
   const customStyles = {
   headCells: {
      style: {
         paddingLeft: '2rem',
         paddingRight: '2rem',
      }
   },
   expanderCell: {
      style: {
         flex: '0 0 2rem',
      },
   },
   cells: {
      style: {
         paddingLeft: '2rem',
         paddingRight: '2rem',
         wordBreak: 'break-word',
         
      },
   },
}
//#endregion

   //#region HEADER
   const Header = () => {
      return (
         <div>
            <Tooltip placement="top" title='Add Category'>
               <button
                  type="button"
                  className="
                     relative 
                     rounded-full 
                     bg-white-800 
                     p-0
                     mx-2
                  text-blue-700
                  hover:text-blue-900
                     focus:outline-none 
                     focus:ring-2 
                  focus:ring-white 
                     focus:ring-offset-2
                     "
                  onClick={() => {
                     setModalInfo({
                        open: true,
                        module: 'Category',
                        title: 'New Category',
                        content: roleID == 1 ? <Add /> : <Invalid typeOfModal={"Add"} />
                     })
                  }}
               >
                     <PlusCircleIcon className="h-6 w-6" />
               </button>
            </Tooltip>
            <Tooltip placement='top' title='Download CSV'>
               <button
                  type="button"
                  className="
                     relative 
                     rounded-full 
                     bg-white-800 
                     p-0
                     mx-2
                  text-blue-700
                  hover:text-blue-900
                     focus:outline-none 
                     focus:ring-2 
                  focus:ring-white 
                     focus:ring-offset-2
                     ">
                  <CSVLink
                     data={categoryArr}
                     filename={`Category list as of ${moment().format('MM-DD-YYYY HH-mm')}`}
                     >
                        <DocumentArrowDownIcon className="h-6 w-6"/>
                  </CSVLink>
               </button>
            </Tooltip>
         </div>
      )
   }

   //#endregion

   //#region MENUBUTTON
   const MenuButton = ({menuArr}) => {
      const [anchorEl, setAnchorEl] = useState(null);
      const open = Boolean(anchorEl);
      const handleClick = (event) => {
         setAnchorEl(event.currentTarget);
      }
      const handleClose = () => {
         setAnchorEl(null);
      }

      const EditDetails = (rowID, title) => {

         setModalInfo({
            open: true,
            module: title,
            title: 'Edit ' + title,
            content: roleID == 1 ? <Edit
               selectedID = {rowID}
            /> : <Invalid typeOfModal={"Edit"} />,
            additionalButton: null
            })
      }

      const DisableItem = (disableSelectedID) => {
         
         function Disable(){
            setModalInfo({
               open: false,
               module: '',
               title: '',
               content: null,
               additionalButton: null,
            })

            const data = {
               id: disableSelectedID,
            }
            
            const url = '/api/Category/disableData'

         axios.post(url, data, {
            headers: {
               'Content-Type' : 'multipart/form-data'
            }
            }).then(response => {
               if (!response.data.result.error)
               {
                  updateToast( `Successfully disabled!`, 'success', 3000, 
                  () => { 
                     setRefresh(true)
                  })
               } 
               else 
               {
                  setTimeout(() => {
                     updateToast( response.data.result.error.code, 'error')
                  }, 1500);
               }
            }).catch(error => {
               updateToast( response.data.result.error.code, 'error', 1500, 
               () => { 
                  setRefresh(true)
               })
            })
         }
         
         setModalInfo({
            open: true,
            module: 'disable_CatItemWIndow',
            title: 'Disable this Item?',
            cancelName: 'Cancel',
            additionalButton:  
               <button
                  className="sm:ml-3 sm:w-auto mt-1 px-3 py-2 sm:float-right rounded-md bg-gray-300 text-sm text-black shadow-sm hover:bg-gray-600"
                  onClick={Disable}
                  >
                     Disable
               </button>
         })
      }
      
      return (
         <div>
            <button
               type="button"
               className="
               relative 
               rounded-full 
               bg-white-800 
               p-1
            text-blue-400 
            hover:text-blue-900 
               focus:outline-none 
               focus:ring-2 
            focus:ring-white 
               focus:ring-offset-2"
               onClick={handleClick}
            >
               <EllipsisHorizontalIcon className="h5- w-5 text-black-100"/>
            </button>
            <Menu
               anchorEl={anchorEl}
               open={open}
               onClose={handleClose}
               anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                  }}
                  transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                  }}
            >
               {...menuArr.map((item) => (
                  <MenuItem 
                     key={item.title}
                     onClick={() => {
                        console.log(item.record_id)
                        switch(item.option_type)
                        {
                           case "Disable":
                              DisableItem(item.record_id)
                              break;
                           case "Edit":
                              EditDetails(item.record_id, item.record_title)
                              break;
                        }}
                     }
                  >
                  {item.title}
                  </MenuItem>
               ))}

            </Menu>
         </div>
      )
   }

   //#endregion

   //#region ADD
   const Add = () => {

      const [newCategoryName, createNewCategory] = useState('')
      const [ticketID, setTicketID] = useState(0)

      const getSelectCallback = (data) => {
         setTicketID(data.value.id)
      }
   
      const getInputCallback = (data) => {
         createNewCategory(data.target.value)
      }

      const submitForm = (e) => {
         e.preventDefault();

         const data = {
            category: newCategoryName,
            ticket_type_id: ticketID,
            added_by: userDataID,
            added_date: moment().format('YYYY-MM-DD HH:mm')
         }

         if (doesStringExist(data.category, categoryArr)){
            updateToast('item already exists!', 'error', 1000)
            return
         }

         const url = '/api/Category/insertData'

         axios.post(url, data, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         }).then(response => {  
            
            if (!response.data.result.error) {
               setModalInfo({
                  open: false,
                  module: '',
                  title: '',
                  content: null
               })
               updateToast(`${data.category} has been added!`, 'success', 3000, 
               () => { 
                  setRefresh(true)
               })
            } else {
               updateToast(response.data.result.error.code, 'error', 1500)
            }
         }).catch(error => {
            updateToast(error.message,'error', 1500)
         })

      }

      return (
         <Box
            component="form"
            onSubmit={submitForm}
            autoComplete="off"
         >

            <div>
            <TextField
               required
               id="outlined-required"
               label="New Category Name"
               onChange={getInputCallback}
            />
            
            </div>
            <button
               type="Submit"
               className="absolute right-28 bottom-3 justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
               >
               Submit
            </button>
         </Box>
      )
   }


   //#endregion

   //#region EDIT
   const Edit = ({ selectedID }) => {
      const [ selectedCategory, setSelectedCategory ] = useState({})
      const [ initialCategory, setInitCategory ] = useState(0)

      const [ active, setActive ] = useState(true)

      const getInputCallback = (data) => setInitCategory(data.target.value)
      const OnSetActive = (event) => setActive(event.target.checked)

      useEffect(() => {
         getTicketDetails()
      },[])

      const getTicketDetails = async () => {
         await axios.post(`/api/Category/getData`,
         {
            id: selectedID
         }, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
         })
         .then((response) => {
            setSelectedCategory(response.data.result)

            if (response.data.result.is_active == true){
               setActive(true)
            } else {
               setActive(false)
            }
         })
      }

      const submitForm = (e) => {
         e.preventDefault();

         const data = {
            category: initialCategory === 0 ? selectedCategory.category : initialCategory ,
            update_by: userDataID,
            update_date: moment().format('YYYY-MM-DD HH:mm'),
            is_active: active == true? 1 : 0,
            id: selectedCategory.cat_id
         }

         if (doesUpdateStringExist(data.id, data.category, categoryArr))
         {
            updateToast('item already exists!', 'error', 1000)
            return
         }

         setModalInfo({
            open: false,
            module: '',
            title: '',
            content: null
         })

         const url = '/api/Category/updateData'

         axios.post(url, data, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         }).then(response => {
            if(!response.data.result.error){
               updateToast(`${data.category} successfully updated!`, 'success', 3000, 
               () => { 
                  setRefresh(true)
               })
            }
            else 
            {
               updateToast(response.data.result.error.code, 'error')
            }
     
         }).catch(error => {
            updateToast(error.message, 'error', 1500,
            () => { 
               setRefresh(true)
            })
         })
      }

      return (
         Object.keys(selectedCategory).length === 0 ? null :
        ( 
         <Box
            component="form"
            onSubmit={submitForm}
            noValidate
            autoComplete="off"
         >
            
            <div>
               <TextField
                  required
                  id="outlined-required"
                  label="Category Name"
                  onChange={getInputCallback}
                  defaultValue={selectedCategory.category}
                 
               />
            </div>
            
            <FormGroup>
               <FormControlLabel
                  control=
                  {
                     <Switch 
                        checked={active}
                        onChange={OnSetActive}
                     />
                  }
                  label="Set Category Active"
               />
            </FormGroup>
            <button
               type="Submit"
               className="absolute right-28 bottom-3 justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
               >
               Submit
            </button>
         
         </Box>
         )
      )
   }
   //#endregion 

   //#region SEARCH
   const dataToBeRendered = () => {
      return props.itemSearch != ''?
         categoryArr.filter((item) => 
            item.name?.toLowerCase().includes(props.itemSearch.toLowerCase()) ||
            item.id?.toString().includes(props.itemSearch))
         :
         categoryArr
      }
   //#endregion

   return (
      <div className="h-full">
      <DataTable
         className="h-full"
         columns={columns}
         data={dataToBeRendered()}
         persistTableHead={true}
         progressPending={loading}
         // dense
         pagination
         paginationTotalRows={totalRows}
         paginationPerPage={10}
         paginationRowsPerPageOptions={[10, 20, 30]}
         onChangeRowsPerPage={handlePerRowsChange}
         onChangePage={handlePageChange}
         fixedHeader={true}
         fixedHeaderScrollHeight={"50vh"}
         highlightOnHover={true}
         striped={true}
         paginationDefaultPage={defaultPage}
         paginationResetDefaultPage={isReset}
   
         customStyles={customStyles}
         subHeader={true}
         subHeaderAlign={"Right"}
         subHeaderComponent={
            <Header 
            />
         }
      />
      <Modal_MaintenanceWindow 
         modalWindowTitle={modalInfo.title}
         formContent={modalInfo.content}
         modalInfo={modalInfo}
         toggleCallback={toggleCallback}
         modalWidth={'720px'}
         additionalButton={modalInfo.additionalButton}
      />
      
      </div>
   )
}

export default Category