import { md5 } from 'js-md5';
import { useEffect, useState } from 'react';

import axios from 'axios';
import DataTable from 'react-data-table-component';

import { updateToast } from '../../utils/toast';

import {
   EllipsisHorizontalIcon,
   PlusCircleIcon,
   DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

import { FormControlLabel, FormGroup, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { CSVLink } from 'react-csv';

import Invalid from "@/Component/Maintenance/Invalid";
import Form_Item_dropdown from '../Forms/Form_Item_dropdown';
import Modal_MaintenanceWindow from './Modal_MaintenanceWIndow';
import { doesUserExist, doesUpdateUserExist } from "app/utils/duplicateChecker"

import {
   getRole,
   getTech
} from '@/Collections/DropdownList';
import moment from 'moment';

const User = (props) => {
   const [userArr, setUserArr] = useState([])
   const [roleArr, setRoleArr] = useState([])
   const [techArr, setTechArr] = useState([])

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
      cancelName: undefined,
      additionalButton: null,
      });

   // updated default password to password123. Previous password was pass123
   const defaultPassword = 'password123'

   //#region USE EFFECT
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
   
      }, [ userDataID, roleID, refresh ])

   useEffect(() => {

      getRole().then((response) => {
         
         setRoleArr(response.data.result)
      })

      getTech().then((response) => {
         const tempArr = response.data.result
         tempArr.unshift({id: null, name: "None", location: null})
         setTechArr(tempArr)
      })

      if (window.localStorage.length === 0) {
         router.push("/login");
      }
      else{
         setUserDataID(window.localStorage.getItem('id'))
      }
   
      },[])
   //#endregion

   //#region DATATABLES
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
                  record_title: row.username,
                  option_type: "Edit",
                  access: true,
                  record_id: row.id
               },
               {
                  title: 'Reset Password',
                  icon: '',
                  record_title: row.username,
                  option_type: "Reset",
                  access: true,
                  record_id: row.id
               },
               {
                  title: 'Disable User',
                  icon: '',
                  record_title: 'Disable User',
                  option_type: 'Disable',
                  access: true,
                  record_id: row.id
               }
            ]
            return(
               // <EllipsisHorizontalIcon className="w-8 h-8 text-blue-500"/>
               <MenuButton menuArr={menuArr}/>
            )
         }
      },
      {
         name: 'ID',
         selector: row => row.id,
      },
      {
         name: 'First Name',
         selector: row => row.fname,
      },
      {
         name: 'Last Name',
         selector: row => row.lname,
         wrap:true
      },
      {
         name: 'Username',
         selector: row => row.username,
         wrap:true
      },
      {
         name: 'Email Address',
         selector: row => row.email_add,
         wrap:true
      },
      {
         name: 'Role',
         selector: row => row.role_name,
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
         const response = await axios.get(`/api/Users/getDetails?page=${page}&per_page=${perPage}`)
                        
         setUserArr(response.data.result.data);
         setTotalRows(response.data.result.total);
         setLoading(false);
   
      } catch (error) {
               
         setLoading(false)
         updateToast('error', 'error', null)
         }
      
      };

      const handlePageChange = page => {
      fetchData(page);
      };

      const handlePerRowsChange = async (newPerPage, page) => {

         try {
            setLoading(true);
   
            const response = await axios.get(`/api/Users/getDetails?page=${page}&per_page=${newPerPage}`);
            setUserArr(response.data.result.data)
            setPerPage(newPerPage)
            setLoading(false)
   
         } catch (error) {
            
            setLoading(false)
            updateToast(error.message, 'error',null)

         }
   
      };
   //#endregion

   //#region ADD
   const Add = () => {
      const [ newUsername, setNewUsername ]  = useState('')
      const [ newFirstName, setNewFirstName ] = useState('')
      const [ newLastName, setNewLastName ] = useState('')
      const [ newEmail, setNewEmail ] = useState('')
      const [ selectedTechID, setSelectedTechID ] = useState(0)
      const [ selectedRoleID, setSelectedRoleID ] = useState(0) 

      const getNewFirstName = (data) => setNewFirstName(data.target.value)
      const getNewLastName = (data) => setNewLastName(data.target.value)
      const getNewEmail = (data) => setNewEmail(data.target.value)
      const getNewUsername = (data) => setNewUsername(data.target.value)
      const getSelectedTech = (data) => setSelectedTechID(data.value.id)
      const getSelectedRole = (data) => setSelectedRoleID(data.value.id)

      

      const submitForm = (e) => {
         e.preventDefault();

         const url = `/api/Users/insertData`

         const data = {
            username: newUsername,
            fname: newFirstName,
            lname: newLastName,
            email_add: newEmail,
            password: md5(defaultPassword),
            role_id: selectedRoleID,
            tech_id: selectedTechID,
            token: null,
            is_active: 1
         }

         if(doesUserExist(data.username, userArr)){
            updateToast('item already exists!', 'error', 1000)
            return
         }

         axios.post(url, data, {
            headers: {
               'Content-Type' : 'multipart/form-data'
            }
         }).then(response => {
            if (!response.data.result.error) {
               setModalInfo({
                  open: false,
                  module: '',
                  title: '',
                  content: null
               })

               updateToast(`${data.username} has been added!`, 'success', 3000, 
               () => { 
                  setRefresh(true)
               })
            }
            else {
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
         <Box
         component="form"
         onSubmit={submitForm}
         autoComplete="off"
            >
               {console.log(roleArr)}
            <div>
               <TextField
                  required
                  id="outlined-required"
                  label="New Username"
                  onChange={getNewUsername}
                  sx={{
                     my: 1
                  }}
                  size='small'
               />
            
            </div>

            <div>
               <TextField
                  required
                  id="outlined-required"
                  label="First Name"
                  onChange={getNewFirstName}
                  sx={{
                     my: 1
                  }}
                  size='small'
               />
            
            </div>
            <div>
               <TextField
                  required
                  id="outlined-required"
                  label="Last Name"
                  onChange={getNewLastName}
                  sx={{
                     my: 1
                  }}
                  size='small'
               />
            
            </div>
            <div>
               <TextField
                  type='email'
                  required
                  id="outlined-required"
                  label="Email"
                  onChange={getNewEmail}
                  sx={{
                     my: 1
                  }}
                  size='small'
               />
            
            </div>
               <Form_Item_dropdown 
                  isShow = {true}
                  id={'role_id'}
                  name={'role'}
                  label={'Tech Role'}
                  variant={'outlined'}
                  listOfItems={roleArr}
                  isRequired={true}
                  isDisabled={false}
                  getValueCallback={getSelectedRole}
               />
               <Form_Item_dropdown 
                  isShow = {true}
                  id={'tech_id'}
                  name={'tech'}
                  label={'Tech'}
                  variant={'outlined'}
                  listOfItems={techArr}
                  isRequired={true}
                  isDisabled={false}
                  getValueCallback={getSelectedTech}
               />
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
   const Edit = ({userID}) => {
      const [ selectedUser, setSelectedUser ] = useState({})
      const [ initUsername, setInitUsername ] = useState('')
      const [ initFirstName, setInitFirstName ] = useState('')
      const [ initLastName, setInitLastName ] = useState('')
      const [ initEmail, setInitEmail ] = useState('')
      const [ initRoleID, setInitRoleID ] = useState(0)
      const [ initTechID, setInitTechID ] = useState(0)
      const [ active, setActive ] = useState(true)
      
      useEffect(() => {
         getTicketDetails()
      },[])

      const getTicketDetails = async() => {
         await axios.post(`/api/Users/getData`,
         {
            id: userID
         }, {
            headers: {
               'Content-Type' : 'multipart/form-data'
            }
         }).then((response) => {
            setSelectedUser(response.data.result)
            if(response.data.result.is_active == true){
               setActive(true)
            }else{
               setActive(false)
            }
         })
      }

      const getUsernameCallback = (data) => setInitUsername(data.target.value)
      const getFirstNameCallback = (data) => setInitFirstName(data.target.value)
      const getLastNameCallback = (data) => setInitLastName(data.target.value)
      const getEmailCallback = (data) => setInitEmail(data.target.value)
      const getRoleIDCallback = (data) => setInitRoleID(data.value.id)
      const getTechIDCallback = (data) => setInitTechID(data.value.id)
      const OnSetActive = (event) => setActive(event.target.checked)
      
      const submitForm = (e) => {
         e.preventDefault();

         const data ={
            username: initUsername === '' ? selectedUser.username : initUsername,
            fname: initFirstName === '' ? selectedUser.fname : initFirstName,
            lname: initLastName === '' ? selectedUser.lname : initLastName,
            email_add: initEmail === '' ? selectedUser.email_add : initEmail,
            role_id: initRoleID === 0 ? selectedUser.role_id : initRoleID,
            tech_id: initTechID === 0 ? selectedUser.tech_id : initTechID,
            is_active: active == true? 1: 0,
            id: userID
         }

         // Closing modal window
         setModalInfo({
            open: false,
            module: '',
            title: '',
            content: null
         })

         const url = '/api/Users/updateData'

         axios.post(url, data, {
            headers: {
               'Content-Type' : 'multipart/form-data'
            }
         }).then(response => {

            if (!response.data.result.error){
               updateToast( `${data.username} successfully updated!`, 'success', 3000, 
               () => { 
                  setRefresh(true)
               })
            } else {
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
         Object.keys(selectedUser).length === 0 ? null:
         (
            
            <Box 
               component="form"
               onSubmit={submitForm}
               autoComplete="Off"
               >
               <div>
                  <TextField
                     required
                     id="outlined-required"
                     label="First Name"
                     onChange={getFirstNameCallback}
                     sx={{
                        my: 1
                     }}
                     size='small'
                     defaultValue={selectedUser.fname}
                  />
               
               </div>
               <div>
                  <TextField
                     required
                     id="outlined-required"
                     label="Last Name"
                     onChange={getLastNameCallback}
                     sx={{
                        my: 1
                     }}
                     size='small'
                     defaultValue={selectedUser.lname}
                  />
               
               </div>
               <div>
                  <TextField
                     required
                     id="outlined-required"
                     label="Username"
                     onChange={getUsernameCallback}
                     sx={{
                        my: 1
                     }}
                     size='small'
                     defaultValue={selectedUser.username}
                  />

               </div>   
               <div>
                  <TextField
                     type='Email'
                     required
                     id="outlined-required"
                     label="Email"
                     onChange={getEmailCallback}
                     sx={{
                        my: 1
                     }}
                     size='small'
                     defaultValue={selectedUser.email_add}
                  />

               </div>   
               <Form_Item_dropdown 
                  isShow = {true}
                  id={'role_id'}
                  name={'role'}
                  label={'Role'}
                  variant={'outlined'}
                  listOfItems={roleArr}
                  isRequired={true}
                  isDisabled={false}
                  getValueCallback={getRoleIDCallback}
                  selectedValue={{
                     id: selectedUser.role_id,
                     name: selectedUser.role_name
                  }}
               />
               <Form_Item_dropdown 
                  isShow = {true}
                  id={'tech_id'}
                  name={'tech'}
                  label={'Tech'}
                  variant={'outlined'}
                  listOfItems={techArr}
                  isRequired={true}
                  isDisabled={false}
                  getValueCallback={getTechIDCallback}
                  selectedValue={{
                     id: selectedUser.tech_id,
                     name: selectedUser.tech_name
                  }}
               />
               <FormGroup>
                  <FormControlLabel
                     control={<Switch 
                        checked={active}
                        onChange={OnSetActive}
                     />}
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
         console.log(rowID)
         setModalInfo({
            open: true,
            module: title,
            title: 'Edit ' + title,
            content: roleID == 1 ? <Edit
               userID = {rowID}
            /> : <Invalid typeOfModal={"Edit"} />
            })
      }

      const OpenResetPrompt = (id) => {

         function ResetPassword(){
            
            setModalInfo({
               open: false,
               module: '',
               title: '',
               content: null
            })
   
            const data = {
               password: md5(defaultPassword),
               id: id,
               is_default_pass: 1
            }
            console.log(data)
            
            const url = '/api/Users/changePassword'
   
         axios.post(url, data, {
            headers: {
               'Content-Type' : 'multipart/form-data'
            }
            }).then(response => {
               if (!response.data.result.error)
               {
                  updateToast( `Password Successfully reset`, 'success', 3000, 
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
            module: 'Decision',
            title: 'Reset User password?',
            content: null,
            cancelName: 'Cancel',
            additionalButton: 
            <button
               className="justify-center rounded-md bg-gray-300 px-3 py-2 text-sm text-black shadow-sm hover:bg-gray-600 sm:ml-3 sm:w-auto"
               onClick={ResetPassword}
               >
                  Reset Password
            </button>
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
            
            const url = '/api/Users/disableData'

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
                        switch(item.option_type)
                        {
                           case "Reset":
                              OpenResetPrompt(item.record_id)
                              break;
                           case "Edit":
                              EditDetails(item.record_id, item.record_title)
                              break;
                           case "Disable":
                              DisableItem(item.record_id)
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

   //#region HEADER 

   const Header = () => {
      return (
         <div>
            <Tooltip placement='top' title='Add user'>
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
                     module: 'Users',
                     title: 'New Users',
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
                     data={userArr}
                     filename={`User list as of ${moment().format('MM-DD-YYYY HH-mm')}`}>
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
         userArr.filter((item) => 
            item.username?.toLowerCase().includes(props.itemSearch.toLowerCase()) ||
            item.id?.toString().includes(props.itemSearch) ||
            item.fname?.toLowerCase().includes(props.itemSearch.toLowerCase()) ||
            item.lname?.toLowerCase().includes(props.itemSearch.toLowerCase()) ||
            item.role_name?.toLowerCase().includes(props.itemSearch.toLowerCase()))
         :
         userArr
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
         subHeaderComponent={<Header />}
      />
      <Modal_MaintenanceWindow 
         modalWindowTitle={modalInfo.title}
         formContent={modalInfo.content}
         modalInfo={modalInfo}
         toggleCallback={toggleCallback}
         modalWidth={'720px'}
         cancelName={modalInfo.cancelName}
         additionalButton={modalInfo.additionalButton}
      />
      
      </div>
   )
}

export default User