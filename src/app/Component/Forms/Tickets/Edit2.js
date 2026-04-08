'use client';

import { useEffect, useState, useRef } from 'react';
import { redirect } from 'next/navigation'
import React from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
import Form_Item_inputtext from '@/Component/Forms/Form_Item_inputtext';
import Form_Item_areatext from '@/Component/Forms/Form_Item_areatext';
import Form_Item_telinput from '@/Component/Forms/Form_Item_telinput';
import Form_Item_fileinput from '@/Component/Forms/Form_Item_fileinput';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import {
  getTicketType,
  getCategoryType,
  getSubCategory,
  getClassification,
  getDepartment,
  getSection,
  getShop,
  getShopLoc,
  getTechnicians,
  getPriority,
  getPlatform

} from '@/Collections/DropdownList';

// import Datepicker from 'react-tailwindcss-datepicker';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Edit = ({ record_id }) => {

  //#region  Data source list
  const [ticketDetails, setTicketDetails] = useState([])

  const [ticketTypeArr, setTicketTypeArr] = useState([])
  const [categoryArr, setCategoryTypeArr] = useState([])
  const [subCategoryArr, setSubCategoryArr] = useState([])
  const [newSubCategoryArr, setNewSubCategoryArr] = useState([])
  const [deparmentArr, setDepartmentArr] = useState([])
  const [sectionArr, setSectionArr] = useState([])
  const [newSectionArr, setNewSectionArr] = useState([])
  const [shopArr, setShopsArr] = useState([])
  const [shopLocArr, setShopLocsArr] = useState([])
  const [classificationArr, setClassificationArr] = useState([])
  const [technicianArr, setTechnicianArr] = useState([])
  const [priorityArr, setPriorityArr] = useState([])
  const [newPriorityArr, setNewPriorityArr] = useState([])
  const [platformArr, setPlatformArr] = useState([])
  //#endregion

  //#region  Form variables
  const [form, setForm] = useState({});

  const [openDate, setOpenDate] = useState(moment().format('YYYY-MM-DD HH:mm'))
  //#endregion

  //#region APIs

  const getTicketDetails = async (id) => {
    await axios.post(`/api/TicketList/getData`,
      {
        id: id
      }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {

        setTicketDetails(response.data.result)

        setForm(response.data.result)

        getSubCategory().then((res) => {

          setSubCategoryArr(res.data.result);

          const newSubCatArr = [];
          res.data.result.filter(subCat => subCat.dependency_id == response.data.result.category_id).map(res => {
            newSubCatArr.push(res);
          });

          setNewSubCategoryArr(newSubCatArr);
        });

        getPriority().then((res) => {

          setPriorityArr(res.data.result);

          const newPrioArr = [];
          res.data.result.filter(prio => prio.id == response.data.result.priority_id).map(res => {
            newPrioArr.push(res);
          });

          setNewPriorityArr(newPrioArr);

          console.log(newPrioArr);
        });


      });
  }

  //#endregion

  useEffect(() => {

    getTicketDetails(25009)

    console.log(ticketDetails)


    getTicketType().then((response) => {
      setTicketTypeArr(response.data.result);
    });

    getCategoryType().then((response) => {
      setCategoryTypeArr(response.data.result);
    });

    getClassification().then((response) => {
      setClassificationArr(response.data.result);
    });

    getDepartment().then((response) => {
      setDepartmentArr(response.data.result);
    });

    getShop().then((response) => {
      setShopsArr(response.data.result);
    });

    getShopLoc().then((response) => {
      setShopLocsArr(response.data.result);
    });

    getTechnicians().then((response) => {
      setTechnicianArr(response.data.result);
    });



    getPlatform().then((response) => {
      setPlatformArr(response.data.result);
    });

    getSection().then((response) => {
      setSectionArr(response.data.result);
    });

    // getSubCategory().then((response) => {

    //   // setSubCategoryArr(response.data.result);
    //   const newSubCatArr = [];
    //   response.data.result.filter(subCat => subCat.dependency_id == ticketDetails.category_id).map(res => {
    //     newSubCatArr.push(res);
    //   });

    //   console.log(newSubCatArr)

    //   setNewSubCategoryArr(newSubCatArr);
    // });



    return (() => {
      setTicketDetails([])
      setClassificationArr([])
    })

  }, []);


  //#region CALLBACKS

  const getInputCallback = (data) => {
    setForm(prev => (
      {
        ...prev,
        [data.id]: data.id,
        [data.name]: data.name
      }
    ));
  }

  const getSelectCallback = (data) => {
    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value.id,
        [data.name]: data.value.name
      }
    ));
  }

  const getCategoryCallback = (data) => {

    const newArr = [];
    subCategoryArr.filter(subCat => subCat.dependency_id == data.value.id).map(res => {
      newArr.push(res);
    });

    setNewSubCategoryArr(newArr);

    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value.id,
        [data.name]: data.value.name
      }
    ));
  }

  const getSubCategoryCallback = (data) => {

    const newArr = [];
    priorityArr.filter(prio => prio.id == data.value.priority_id).map(res => {
      newArr.push(res);
    });

    setNewPriorityArr(newArr);

    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value.id,
        [data.name]: data.value.name
      }
    ));
  }

  //#endregion

  //#region Submit Data
  const submitForm = (e) => {

    e.preventDefault();

    const url = '/api/TicketList/insertData';

    // const data = {
    //   ticket_type_id: ticketTypeId,
    //   cat_id: catId,
    //   sub_cat_id: subCatId,
    //   priority_id: prioId,
    //   tele_ts: teleTsId,
    //   status_id: 1,
    //   tech_id: techId,
    //   request: request,
    //   customer_name: customer,
    //   contact_num: contactNum,
    //   class_id: classId,
    //   dept_id: deptId,
    //   dept_sec_id: sectionId,
    //   shop_id: shopId,
    //   shop_loc_id: locId,
    //   stage_id: stageId,
    //   resolution: resolution,
    //   platform_id: platformId,
    //   work_note: workNote,
    //   open_date: openDate,
    //   added_by: 1,
    //   added_date: moment().format('YYYY-MM-DD HH:mm')
    // };

    console.log(form);

    // const notifId = toast.loading("Processing...");

    // axios.post(url, data, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    //   .then(response => {
    //     console.log(response);

    //     setTimeout(() => {
    //       toast.update(notifId, {
    //         render: 'New Ticket has been created!',
    //         type: 'success',
    //         delay: undefined,
    //         isLoading: false,
    //         position: "top-right",
    //         autoClose: 1500,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "dark",
    //         onClose: () => {
    //           redirect('/tickets');
    //         }
    //       })
    //     }, 1500);


    //   })
    //   .catch(error => {
    //     console.log(error.message)

    //     setTimeout(() => {
    //       toast.update(notifId, {
    //         render: error.message,
    //         type: 'error',
    //         delay: undefined,
    //         isLoading: false,
    //         position: "top-right",
    //         autoClose: 1500,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "dark",
    //         onClose: () => {

    //         }
    //       })
    //     }, 1500);
    //   })
  }
  //#endregion

  return (
    Object.keys(ticketDetails).length !== 0 ?
      (
        <form onSubmit={submitForm} className="Inter">
          <div className="grid md:grid-rows-3">
            <div>
              <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
                <h3>Customer Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
                <div className="mx-10">
                  <div className="w-auto mb-4">
                    <ListItemText
                      primary="Customer Name"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                          {ticketDetails.customer_name}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </div>
                  <div className="w-auto mb-4">
                    <Typography variant="h6" gutterBottom>Contact #</Typography>
                    <Typography variant="body1" gutterBottom>{ticketDetails.contact_num}</Typography>
                  </div>
                  <div className="w-auto mb-4">
                    <Typography variant="h6" gutterBottom>Class</Typography>
                    <Typography variant="body1" gutterBottom>{ticketDetails.classification}</Typography>
                  </div>
                  <div className="w-auto mb-4">
                    <Typography variant="h6" gutterBottom>Platform</Typography>
                    <Typography variant="body1" gutterBottom>{ticketDetails.platform}</Typography>
                  </div>
                </div>
                <div className="mx-10">
                  {/* <Form_Item_dropdown
                name={'department'}
                label={'Department'}
                variant={'outlined'}
                listOfItems={deparmentArr}
                isRequired={true}
                getValueCallback={getDeptCallback}
              />
              <Form_Item_dropdown
                name={'section'}
                label={'Section'}
                variant={'outlined'}
                listOfItems={newSectionArr}
                isRequired={true}
                getValueCallback={getSectionCallback}
              />
              <Form_Item_dropdown
                name={'brand'}
                label={'Brand'}
                variant={'outlined'}
                listOfItems={shopArr}
                isRequired={true}
                getValueCallback={getShopCallback}
              />
              <Form_Item_dropdown
                name={'location'}
                label={'Location'}
                variant={'outlined'}
                listOfItems={shopLocArr}
                isRequired={true}
                getValueCallback={getShopLocationCallback}
              /> */}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
                <h3>Concern Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
                <div className="mx-10">
                  <Form_Item_dropdown
                    id={'ticket_type_id'}
                    name={'ticket_type'}
                    label={'Ticket Type'}
                    variant={'outlined'}
                    listOfItems={ticketTypeArr}
                    isRequired={true}
                    getValueCallback={getSelectCallback}
                    selectedValue={{
                      id: ticketDetails.ticket_type_id,
                      name: ticketDetails.ticket_type
                    }}
                  />
                  <Form_Item_dropdown
                    id={'category_id'}
                    name={'category'}
                    label={'Category'}
                    variant={'outlined'}
                    listOfItems={categoryArr}
                    isRequired={true}
                    getValueCallback={getCategoryCallback}
                    selectedValue={{
                      id: ticketDetails.category_id,
                      name: ticketDetails.category
                    }}
                  />
                  <Form_Item_dropdown
                    id={'sub_category_id'}
                    name={'sub_category'}
                    label={'Sub Category'}
                    variant={'outlined'}
                    listOfItems={newSubCategoryArr}
                    isRequired={true}
                    getValueCallback={getSubCategoryCallback}
                    selectedValue={{
                      id: ticketDetails.sub_category_id,
                      name: ticketDetails.sub_category
                    }}
                  />
                  <Form_Item_dropdown
                    name={'priority_id'}
                    label={'Priority'}
                    variant={'outlined'}
                    listOfItems={newPriorityArr}
                    isRequired={true}
                    defaultSelection={true}
                    getValueCallback={getSelectCallback}
                    selectedValue={{
                      id: ticketDetails.priority_id,
                      name: ticketDetails.priority
                    }}
                  />
                </div>
                <div className="mx-10">
                  {/* <Form_Item_dropdown
                name={'tele_ts'}
                label={'Tele-Troubleshoot'}
                variant={'outlined'}
                listOfItems={[
                  { id: 1, name: "Resolved" },
                  { id: 2, name: "Unresolved" }
                ]}
                isRequired={true}
                getValueCallback={getTeleTsCallback}
              />
              <Form_Item_dropdown
                name={'assigned_tech'}
                label={'Assigned Tech'}
                variant={'outlined'}
                listOfItems={technicianArr}
                isRequired={true}
                getValueCallback={getTechCallback}
              />
              <Form_Item_areatext
                label={'Specific Request'}
                variant={'outlined'}
                isRequired={true}
                getValueCallback={getRequestCallback}
              /> */}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
                <h3>Additional Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
                <div className="mx-10">
                  {/* <Form_Item_dropdown
                name={'stage'}
                label={'Stage'}
                variant={'outlined'}
                listOfItems={[
                  { id: 1, name: "Open" },
                  { id: 2, name: "In Progress" },
                  { id: 3, name: "On Hold" },
                  { id: 4, name: "Closed" }
                ]}
                isRequired={true}
                getValueCallback={getStageCallback}
              />
              <Form_Item_inputtext
                label={'Resolution'}
                inputType={'text'}
                variant={'outlined'}
                isRequired={true}
                getValueCallback={getResolutionCallback}
              /> */}
                </div>
                <div className="mx-10">
                  {/* <Form_Item_areatext
                label={'Work-Note'}
                variant={'outlined'}
                isRequired={true}
                getValueCallback={getNotesCallback}
              /> */}
                </div>
              </div>
            </div>
          </div>
          <button
            type="Submit"
            className="absolute right-28 bottom-3 justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
          // onClick={}
          >
            Submit
          </button>
        </form>
      )
      :
      null
  )

  //#endregion
}

export default Edit