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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { CSVLink } from 'react-csv';

import Invalid from '@/Component/Maintenance/Invalid';
import { doesStringExist, doesUpdateStringExist } from 'app/utils/duplicateChecker';
import { updateToast } from 'app/utils/toast';
import Form_Item_dropdown from '../Forms/Form_Item_dropdown';
import Modal_MaintenanceWindow from './Modal_MaintenanceWIndow';

import {
	getCategoryType,
	getPriority,
	getSLA,
	getTicketType
} from '@/Collections/DropdownList';

const SubCategory = (props) => {
	const [ticketTypeArr, setTicketTypeArr] = useState([])
	const [subCatArr, setSubCatArr] = useState([])
	const [catArr, setCatArr] = useState([])
	const [slaArr, setSLAArr] = useState([])
	const [priorityArr, setPriorityArr] = useState([])

	const [loading, setLoading] = useState(false)
	const [totalRows, setTotalRows] = useState(0)
	const [perPage, setPerPage] = useState(10)
	const [refresh, setRefresh] = useState(false)
	const [defaultPage, setDefaultPage] = useState(1)
	const [isReset, setIsReset] = useState(false)

	const [userDataID, setUserDataID] = useState(null)
	const [roleID, setRoleID] = useState(null)

	const [filterValue, setFilterValue] = useState('')

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
			setRoleID(null);
		}

	}, [filterValue, userDataID, roleID, refresh])

	useEffect(() => {

		getTicketType().then((response) => {
			setTicketTypeArr(response.data.result)
		})

		getCategoryType().then((response) => {
			setCatArr(response.data.result);
		})

		getSLA().then((response) => {
			setSLAArr(response.data.result);
		})

		getPriority().then((response) => {
			setPriorityArr(response.data.result);
		})

		if (window.localStorage.length === 0) {
			router.push("/login");
		}
		else {
			setUserDataID(window.localStorage.getItem('id'))
		}
	}, [])

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
			name: 'Sub Category',
			selector: row => row.name,
			wrap: true
		},
		{
			id: 'ticket_type',
			name: 'Ticket Type',
			selector: row => row.ticket_type_dependency,
			wrap: true
		},
		{
			id: 'category',
			name: 'Cat Dependency',
			selector: row => row.cat_dependency,
			wrap: true
		},
		{
			name: 'SLA',
			selector: row => row.sla,
			wrap: true
		},
		{
			name: 'Priority',
			selector: row => row.priority,
			wrap: true
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

	const toggleModalCallback = (data) => {
		setModalInfo({
			open: data.open,
			module: data.module,
			title: data.title,
			content: data.content
		});
	};

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
			const response = await axios.get(`/api/SubCategory/getDetails?page=${page}&per_page=${perPage}`)

			setSubCatArr(filterValue === '' ?
				response.data.result.data :
				response.data.result.data.filter((data) => data.cat_dependency === filterValue))
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

			const response = await axios.get(`/api/SubCategory/getDetails?page=${page}&per_page=${newPerPage}`);
			setSubCatArr(filterValue === '' ?
				response.data.result.data :
				response.data.result.data.filter((data) => data.cat_dependency === filterValue))
			setPerPage(newPerPage)
			setLoading(false)

		} catch (error) {
			setLoading(false)
			updateToast(error.message, 'error', 0)
		}

	};

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
            
            const url = '/api/SubCategory/disableData'

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

		const [ttSelectedId, setTTSelectedID] = useState(0)
		const [catSelectedId, setSelectedCatID] = useState(0)
		const [slaSelectedId, setSelectedSLAID] = useState(0)
		const [prioSelectedId, setSelectedPrioID] = useState(0)
		const [newSubCatName, setNewSubCatName] = useState('')

		const getTicketTypeSelectCallback = (data) => setTTSelectedID(data.value.id)
		const getCatSelectCallback = (data) => setSelectedCatID(data.value.id)
		const getSLASelectCallback = (data) => setSelectedSLAID(data.value.id)
		const getPrioSelectCallback = (data) => setSelectedPrioID(data.value.id)
		const getNewSubCatNameCallback = (data) => setNewSubCatName(data.target.value)

		const submitForm = (e) => {
			e.preventDefault();

			const url = `/api/SubCategory/insertData`

			const data = {
				ticket_type_id: ttSelectedId,
				sub_category: newSubCatName,
				category_id: catSelectedId,
				sla_id: slaSelectedId,
				priority_id: prioSelectedId,
				added_by: userDataID,
				added_date: moment().format('YYYY-MM-DD HH:mm:ss')
			}

			if(doesStringExist(data.sub_category, subCatArr)){
				updateToast('item already exists!', 'error', 1000)
				return
			}

			axios.post(url, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then(response => {
				if (!response.data.result.data.error) {
					setModalInfo({
						open: false,
						module: '',
						title: '',
						content: null
					})
					updateToast(`${data.sub_category} has been added!`, 'success', 3000,
						() => {
							setRefresh(true)
						})
				}
				else {
					updateToast(response.data.result.data.error.code, 'error')
				}

			}).catch(error => {
				updateToast(error.message, 'error')
			})
		}

		return (
			<Box
				component="form"
				onSubmit={submitForm}
				autoComplete="off"
			>

				<Form_Item_dropdown
					isShow={true}
					id={'ticketType_id'}
					name={'ticket_type'}
					label={'Ticket Type'}
					variant={'outlined'}
					listOfItems={ticketTypeArr}
					isRequired={false}
					isDisabled={false}
					getValueCallback={getTicketTypeSelectCallback}
				/>
				<Form_Item_dropdown
					isShow={true}
					id={'category_id'}
					name={'category'}
					label={'Dependent Category'}
					variant={'outlined'}
					listOfItems={catArr}
					isRequired={true}
					isDisabled={false}
					getValueCallback={getCatSelectCallback}
				/>
				<Form_Item_dropdown
					isShow={true}
					id={'sla_id'}
					name={'sla'}
					label={'SLA'}
					variant={'outlined'}
					listOfItems={slaArr}
					isRequired={true}
					isDisabled={false}
					getValueCallback={getSLASelectCallback}
				/>
				<Form_Item_dropdown
					isShow={true}
					id={'priority_id'}
					name={'priority'}
					label={'Priority Level'}
					variant={'outlined'}
					listOfItems={priorityArr}
					isRequired={true}
					isDisabled={false}
					getValueCallback={getPrioSelectCallback}
				/>

				<div>
					<TextField
						required
						id="outlined-required"
						label="New Sub Category Name"
						onChange={getNewSubCatNameCallback}
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
		const [selectedSubCat, setSelectedSubCat] = useState({})
		const [initSubCat, setInitSubCat] = useState('')
		const [initTicketTypeID, setInitTicketTypeID] = useState(0)
		const [initCatID, setInitCatID] = useState(0)
		const [initSLAID, setInitSLAID] = useState(0)
		const [initPrioID, setInitPrioID] = useState(0)
		const [active, setActive] = useState(true)

		useEffect(() => {
			getTicketDetails()

		}, [])

		const getTicketDetails = async () => {

			await axios.post(`/api/SubCategory/getData`,
				{
					id: selectedID
				}, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then((response) => {
				setSelectedSubCat(response.data.result)
				console.log(response.data.result)
				if (response.data.result.is_active == true) {
					setActive(true)
				} else {
					setActive(false)
				}
			})
		}

		const getTicketTypeCallback = (data) => setInitTicketTypeID(data.value.id)
		const getCategoryCallback = (data) => setInitCatID(data.value.id)
		const getSlaCallback = (data) => setInitSLAID(data.value.id)
		const getPriorityCallback = (data) => setInitPrioID(data.value.id)
		const getInputCallback = (data) => setInitSubCat(data.target.value)
		const OnSetActive = (event) => setActive(event.target.checked)

		const submitForm = (e) => {
			e.preventDefault();

			const data = {
				sub_category: initSubCat === '' ? selectedSubCat.sub_cat_name : initSubCat,
				category_id: initCatID === 0 ? selectedSubCat.cat_id : initCatID,
				sla_id: initSLAID === 0 ? selectedSubCat.sla_id : initSLAID,
				priority_id: initPrioID === 0 ? selectedSubCat.prio_id : initPrioID,
				update_by: userDataID,
				update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
				is_active: active == true ? 1 : 0,
				ticket_type_id: initTicketTypeID === 0 ? selectedSubCat.ttype_id : initTicketTypeID,
				id: selectedID
			}

			if(doesUpdateStringExist(data.id, data.sub_category, subCatArr)){
				updateToast('item already exists!', 'error', 1000)
				return
			}

			console.log(data)

			setModalInfo({
				open: false,
				module: '',
				title: '',
				content: null
			})

			const url = '/api/SubCategory/updateData'

			axios.post(url, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}).then(response => {
				if (!response.data.result.data.error) {
					updateToast(`${data.sub_category} successfully updated!`, 'success', 3000, () => {
						setRefresh(true)
					})
				}
				else {
					updateToast(response.data.result.error.code, 'error')
				}
			}).catch(error => {
				updateToast(error.message, 'error', 1500, () => {
					setRefresh(true)
				})
			})
		}

		return (
			Object.keys(selectedSubCat).length === 0 ? null :
				(
					<Box
						component="form"
						onSubmit={submitForm}
						autoComplete="off"
					>

						<Form_Item_dropdown
							isShow={true}
							id={'ttype_id'}
							name={'ticket_type'}
							label={'Ticket Type'}
							variant={'outlined'}
							listOfItems={ticketTypeArr}
							isRequired={false}
							isDisabled={false}
							getValueCallback={getTicketTypeCallback}
							selectedValue={{
								id: selectedSubCat.ttype_id,
								name: selectedSubCat.ticket_type_dependency
							}}
						/>

						<Form_Item_dropdown
							isShow={true}
							id={'cat_id'}
							name={'category'}
							label={'Category'}
							variant={'outlined'}
							listOfItems={catArr}
							isRequired={false}
							getValueCallback={getCategoryCallback}
							selectedValue={{
								id: selectedSubCat.cat_id,
								name: selectedSubCat.cat_dependency
							}}
						/>
						<Form_Item_dropdown
							isShow={true}
							id={'sla_id'}
							name={'sla'}
							label={'SLA'}
							variant={'outlined'}
							listOfItems={slaArr}
							isRequired={false}
							getValueCallback={getSlaCallback}
							selectedValue={{
								id: selectedSubCat.sla_id,
								name: selectedSubCat.sla
							}}
						/>
						<Form_Item_dropdown
							isShow={true}
							id={'prio_id'}
							name={'priority'}
							label={'Priority'}
							variant={'outlined'}
							listOfItems={priorityArr}
							isRequired={false}
							getValueCallback={getPriorityCallback}
							selectedValue={{
								id: selectedSubCat.prio_id,
								name: selectedSubCat.priority
							}}
						/>

						<div>
							<TextField
								required
								id="outlined-required"
								label="Sub Category"
								onChange={getInputCallback}
								defaultValue={selectedSubCat.sub_cat_name}

							/>


						</div>

						<FormGroup>
							<FormControlLabel
								control={<Switch
									checked={active}
									onChange={OnSetActive}
								/>}
								label="Set Sub Category Active"
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
	const SubCatHeader = () => {

		const handleChange = (e) => setFilterValue(e.target.value)

		return (
			<div>
				<Tooltip placement='top' title='Add Sub Category'>

					<button
						type="button"
						className="
						relative 
						rounded-full 
						bg-white-800 
						pt-2
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
								module: 'Sub Category',
								title: 'New Sub Category',
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
								 pt-2
								 mx-2
							 text-blue-700
							 hover:text-blue-900
								 focus:outline-none 
								 focus:ring-2 
							 focus:ring-white 
								 focus:ring-offset-2
							 ">
								<CSVLink 
								data={subCatArr}
								filename={`Sub category list as of ${moment().format('MM-DD-YYYY HH-mm')}`}>
									<DocumentArrowDownIcon className='h-6 w-6' />
								</CSVLink>
						 </button>
					</Tooltip>

					<FormControl sx={{ minWidth: 200, mx: 2}}>
						<InputLabel id="filter-label" size='small'>Filter By Category</InputLabel>
						<Select
							labelId="filter-label"
							value={filterValue}
							label="Filter by Category"
							onChange={handleChange}
							size='small'
						>
							<MenuItem value=''><em>default</em></MenuItem>
							{...catArr.map((category) => (
								<MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

			
		)
	}
	//#endregion

	//#region SEARCH
	const dataToBeRendered = () => {
		return props.itemSearch != '' ?
			subCatArr.filter((item) =>
				item.name?.toLowerCase().includes(props.itemSearch.toLowerCase()) ||
				item.id?.toString().includes(props.itemSearch))
			:
			subCatArr
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
				// paginationServer
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
					<SubCatHeader
						add={Add}
						modalCallback={toggleModalCallback}
						categoriesArr={catArr}
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

export default SubCategory