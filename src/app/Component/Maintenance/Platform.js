import { useEffect, useState } from 'react';

import axios from 'axios';
import moment from 'moment';
import DataTable from 'react-data-table-component';

import {
   EllipsisHorizontalIcon,
   PlusCircleIcon,
   DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

import { FormControlLabel, FormGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { CSVLink } from 'react-csv';

import Invalid from "@/Component/Maintenance/Invalid";
import { doesStringExist, doesUpdateStringExist } from 'app/utils/duplicateChecker';
import { updateToast } from 'app/utils/toast';
import Modal_MaintenanceWindow from './Modal_MaintenanceWIndow';

const Platform = (props) => {
   const [platformArr, setPlatformArr] = useState([])

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
   })
    
   //#region useEffect
   useEffect(() => {

      setUserDataID(localStorage.id)
      setRoleID(localStorage.role_id)

      roleID ? fetchData(1) : null; // fetch page 1 of users
   
      refresh ? fetchData(1) : null;
   
      return () => {
         setRefresh(false);
         setIsReset(false);
         setUserDataID(null)
         setRoleID(null)
      }
   
   }, [userDataID, roleID, refresh])

   useEffect(() => {
      if (window.localStorage.length === 0) {
         router.push("/login");
      }
      else{
         setUserDataID(window.localStorage.getItem('id'))
      }
   },[])


   //#endregion
   
   //#region DATA TABLE
   const columns = [
      {
      id: 'edit_btn',
      name: 'Edit',
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
         name: 'id',
         selector: row => row.id,
      },
      {
         name: 'Platform',
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

   const toggleCallback = (data) => {
      setModalInfo({
         open: data.open,
         module: data.module,
         title: data.title,
         content: data.content
      });
   };

   const fetchData = async page => {

      try {
   
         setLoading(true)
         const response = await axios.get(`/api/Platform/getDetails?page=${page}&per_page=${perPage}`)
         setPlatformArr(response.data.result.data)
         setTotalRows(response.data.result.total);
         setLoading(false);
   
      } catch (error) {
         setLoading(false)
         updateToast(error.message, 'error', 0)
      }
   
   };

   const handlePageChange = page => {
      fetchData(page);
   };

   const handlePerRowsChange = async (newPerPage, page) => {

      try {
         setLoading(true);
   
         const response = await axios.get(`/api/Platform/getDetails?page=${page}&per_page=${newPerPage}`);
         setPlatformArr(response.data.result.data)
         setPerPage(newPerPage)
         setLoading(false)
   
      } catch (error) {
         
         setLoading(false)
         updateToast(error.message, 'error', 0)
      }
   
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
            
            const url = '/api/Platform/disableData'

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
      const [newPlatform, setNewPlatform] = useState('')

      const getInputCallback = (data) => setNewPlatform(data.target.value)

      const submitForm = (e) => {
         e.preventDefault()

         const data = {
            platform: newPlatform,
            added_by: userDataID,
            added_date: moment().format('YYYY-MM-DD HH:mm:ss')
         }

         if(doesStringExist(data.platform, platformArr)){
            updateToast('item already exists!', 'error', 1000)
            return
         }

         const url = '/api/Platform/insertData'

         axios.post(url, data, {
            headers: {
               'Content-Type' : 'multipart/form-data'
            }
         }).then(response => {
            if (!response.data.result.error){
               setModalInfo({
                  open: false,
                  module: '',
                  title: '',
                  content: null
               })
               updateToast(`${data.platform} has been added!`, 'success', 3000, 
               () => {
                  setRefresh(true)
               })
            }
            else {
               updateToast(response.data.result.error.code, 'error')
            }
         }).catch(error => {
            updateToast(error.message, 'error')
         })
      }
      return(
         <Box
            component="form"
            onSubmit={submitForm}
            autoComplete="off"
         >
            <div>
            <TextField
               required
               id="outlined-required"
               label="New Platform"
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
   
   //#region  EDIT
   const Edit = ( {selectedID} ) => {
   const [ selectedPlatform, setSelectedPlatform ] = useState({})
   const [ initPlatform, setInitPlatform ] = useState('')
   const [ active, setActive ] = useState( true )

   useEffect(() => {
      getTicketDetails()
   }, [])

   const getTicketDetails = async () => {
      await axios.post(`/api/Platform/getData`,
      {
         id: selectedID
      }, {
      headers: {
         'Content-Type': 'multipart/form-data'
      }
      })
      .then((response) => {
         setSelectedPlatform(response.data.result)

         if (response.data.result.is_active == true){
            setActive(true)
         } else {
            setActive(false)
         }
      })
   }

   const onSetActive = (event) => setActive(event.target.checked)
   const getInputCallback = (data) => setInitPlatform(data.target.value)

   const submitForm = (e) => {
      e.preventDefault();

      const data = {
         platform: initPlatform === '' ? selectedPlatform.platform : initPlatform,
         update_by: userDataID,
         update_date: moment().format('YYYY-MM-DD HH:mm'),
         is_active: active == true? 1 : 0,
         id: selectedID
      }

      if (doesUpdateStringExist(data.id, data.platform, platformArr)){
         updateToast('item already exists!', 'error', 1000)
         return
      }

      setModalInfo({
         open: false,
         module: '',
         title: '',
         content: null
      })

      const url = '/api/Platform/updateData'

      axios.post(url, data, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      }).then(response => {
         if(!response.data.result.error){
            updateToast( `${data.platform} has been updated!`, 'success', 3000, 
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

      return(       
         Object.keys(selectedPlatform).length === 0 ? null :
         ( 
            <Box
               component="form"      
               onSubmit={submitForm}
               autoComplete="off"
            >
               <div>
                  <TextField
                     required
                     id="outlined-required"
                     label="Rename Platform"
                     onChange={getInputCallback}
                     defaultValue={selectedPlatform.platform}                    
                  />
               </div>
            
               <FormGroup>
                  <FormControlLabel
                     control=
                     {
                        <Switch 
                           checked={active}
                           onChange={onSetActive}
                        />
                     }
                     label="Set Active"
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
    
   //#region HEADER 

   const Header = () => {
      return (
         <div>
            <Tooltip placement='top' title='Add Platform'>
            <button
               type="button"
               className="
                     relative 
                     rounded-full 
                     bg-white-800 
                     p-1
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
                     module: 'Platform',
                     title: 'New Platform',
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
                        data={platformArr}
                        filename={`Platform list as of ${moment().format('MM-DD-YY HH-mm')}`}>
                           <DocumentArrowDownIcon className='h-6 w-6' />
                     </CSVLink>
               </button>

            </Tooltip>
         </div>
      )
   }

   //#endregion
     
   //#region SEARCH
   const dataToBeRendered = () => {
      return props.itemSearch != ''?
         platformArr.filter((item) => 
            item.name?.toLowerCase().includes(props.itemSearch.toLowerCase()) ||
            item.id?.toString().includes(props.itemSearch))
         :
         platformArr
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
            subHeaderComponent={<Header />
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

export default Platform