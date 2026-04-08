import { useEffect, useState, useRef } from 'react';
import { redirect } from 'next/navigation'
import React from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
import WorkNoteTech from '@/Component/UI/Tickets/WorkNoteTech';
import DetailsText from '@/Component/Forms/DetailsText';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography';

import {
  getTechnicians,
  getResolution

} from '@/Collections/DropdownList';

// import Datepicker from 'react-tailwindcss-datepicker';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const Edit = ({ record_id, user_id, role_id, updateCallback }) => {

  const [userId, setUserId] = useState(null)
  const [userRoleId, setUserRoleId] = useState(null)

  const cellStyle = {
    width: '20%',
    backgroundColor: '#9f9fa3',
    color: 'white'
  }

  //#region  Data source list
  const [ticketDetails, setTicketDetails] = useState([])
  const [technicianArr, setTechnicianArr] = useState([])
  const [resoArr, setResoArr] = useState([])

  //#region  Form variables
  const [form, setForm] = useState({});
  const [disableReso, setDisableReso] = useState(false)

  const [updateBtn, setUpdateBtn] = useState({
    label: 'Update',
    disabled: false
  })

  const [openDate, setOpenDate] = useState(moment().format('YYYY-MM-DD HH:mm'))
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

  const [disableForm,setDisableForm] = useState(false)

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

        setDisableReso(response.data.result.reso_id ? true : false)

        setForm({
          ticket_ref_id: response.data.result.ticket_ref_id,
          reso_id: response.data.result.reso_id,
          resolution: response.data.result.resolution,
          active_org_id: response.data.result.active_org_id,
          active_org: response.data.result.active_org
        })

      });

  }

  //#endregion

  useEffect(() => {

    getTicketDetails()

    setUserId(localStorage.getItem('id'))
    setUserRoleId(localStorage.getItem('role_id'))

    getTechnicians().then((response) => {
      setTechnicianArr(response.data.result);
    });

    getResolution().then((response) => {
      setResoArr(response.data.result);
    });

    return (() => {
      setTicketDetails([])
      setTechnicianArr([])
      setResoArr([])
    })

  }, []);

  // useEffect(()=>{

  // },[])

  //#region CALLBACKS

  const getSelectCallback = (data) => {

    switch (data.name) {

      case "technician_name":

        if (data.value.id) {
          setTagDisabled(true)
          setForm(prev => (
            {
              ...prev,
              stage_id: 4
            }
          ))
        }
        else {
          setTagDisabled(false)

          setForm(prev => (
            {
              ...prev
            }
          ))
        }

        break;

      default:
        break;
    }

    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value ? data.value.id : data.value,
        [data.name]: data.value ? data.value.name : data.value
      }
    ));
  }

  const workNoteCallback = (data) => {

    if (data.result.length > 0) {
      var record = data.result[0]

      console.log(user_id)
      console.log(record.user_id)

      setDisableReso(record.user_id == user_id)
    }
  }

  //#endregion


  //#region Submit Data
  const submitForm = (e) => {

    e.preventDefault();

    setUpdateBtn({
      label: 'Updating...',
      disabled: true
    })

    setIsLoadingSubmit(true)

    const data = {
      ...form,
      id: record_id,
      update_by: user_id
    }

    console.log(data)

    const url = '/api/TicketList/updateTechData';

    const notifId = toast.loading("Processing...");

    axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response);

        if (response.status == 200) {

          setTimeout(() => {
            toast.update(notifId, {
              render: `Ticket ${record_id} has been updated!`,
              type: 'success',
              delay: undefined,
              isLoading: false,
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
              style: {
                fontSize: 14
              },
              onClose: () => {
                // redirect('/tickets');
                updateCallback({
                  refresh: true,
                  open: false
                })
              }
            })
          }, 1500);
        }
        else {
          setTimeout(() => {

            setUpdateBtn({
              label: 'Update',
              disabled: false
            })

            setIsLoadingSubmit(false)

            toast.update(notifId, {
              render: response.data.result,
              type: 'error',
              delay: undefined,
              isLoading: false,
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "dark",
              style: {
                fontSize: 14
              },
              onClose: () => {

              }
            })
          }, 1500);
        }

      })
      .catch(error => {
        console.log(error)

        setTimeout(() => {

          setUpdateBtn({
            label: 'Update',
            disabled: false
          })

          setIsLoadingSubmit(false)

          toast.update(notifId, {
            render: error.message,
            type: 'error',
            delay: undefined,
            isLoading: false,
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            style: {
              fontSize: 14
            },
            onClose: () => {

            }
          })
        }, 1500);
      })
  }
  //#endregion

  return (

    Object.keys(ticketDetails).length === 0 ?
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
      :
      (
        <>
          <form onSubmit={submitForm} className="Inter">
            <div className="grid">
              <div className=' bg-white'>
                <div className=" bg-gray-600 text-white w-full p-4 mt-1">
                  <h3>Ticket Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 md:gap-10 mt-4">
                  <TableContainer >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left" sx={cellStyle}>Ticket#</TableCell>
                          <TableCell align="left">{ticketDetails.ticket_id}</TableCell>
                          <TableCell align="left" sx={cellStyle}>Status</TableCell>
                          <TableCell align="left">{ticketDetails.status}</TableCell>
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
                          <TableCell align="left" sx={cellStyle}>{ticketDetails.class_id == 1 ? 'Brand' : 'Department'}</TableCell>
                          <TableCell align="left">{ticketDetails.class_id == 1 ? ticketDetails.shop_name : ticketDetails.department}</TableCell>
                          <TableCell align="left" sx={cellStyle}>{ticketDetails.class_id == 1 ? 'Location' : 'Section'}</TableCell>
                          <TableCell align="left">{ticketDetails.class_id == 1 ? ticketDetails.area_location : ticketDetails.section}</TableCell>
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
                          <TableCell align="left" sx={cellStyle}>Specific Request</TableCell>
                          <TableCell colSpan={3} align="left">{ticketDetails.spec_request}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              <div className=' bg-white'>
                <div className=" bg-gray-600 text-white w-full p-4 mt-1">
                  <h3>Work Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 mt-4">
                  {
                    user_id ? (
                      <WorkNoteTech
                        ticket_ref_id={ticketDetails.ticket_ref_id}
                        user_id={user_id}
                        status_id={ticketDetails.status_id}
                        assigned_tech_id={ticketDetails.assigned_tech_id}
                        tagDisabled={false}
                        listOfItems={resoArr}
                        isRequired={!disableReso}
                        disableForm={ticketDetails.status_id == 1 ? (ticketDetails.tech_tagging_id == null ? true : false) : true}
                        workNoteCallback={workNoteCallback}
                        updateCallback={updateCallback}
                      />
                    )
                      :
                      null
                  }
                </div>
              </div>
            </div >
            {/* <button
              type="Submit"
              className={`${updateBtn.disabled ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'} absolute right-28 bottom-3 justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto`}
              disabled={updateBtn.disabled}
            >
              {updateBtn.label}
            </button> */}
            {/* <button
            type="Button"
            className="absolute right-5 bottom-3 justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:ml-3 sm:w-auto"
            disabled={updateBtn.disabled}
          >
            Cancel
          </button> */}
          </form>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoadingSubmit}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )
  )

  //#endregion
}

export default Edit