import { useEffect, useState, useRef } from 'react';
import { redirect } from 'next/navigation'
import React from 'react'
import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
import Form_Item_dropdown2 from '@/Component/Forms/Form_Item_dropdown2';
import Form_Item_inputtext from '@/Component/Forms/Form_Item_inputtext';
import Form_Item_areatext from '@/Component/Forms/Form_Item_areatext';
import Form_datetime from '@/Component/Forms/Form_datetime';
import WorkNoteAdmin from '@/Component/UI/Tickets/WorkNoteAdmin';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

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
  getPlatform,
  getActiveOrg,
  getTeleTs,
  getResolution,
  getCustomer,
  getStatus

} from '@/Collections/DropdownList';

// import Datepicker from 'react-tailwindcss-datepicker';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const Edit = ({ record_id, user_id, role_id, updateCallback }) => {

  const [userId, setUserId] = useState(null)
  const [userRoleId, setUserRoleId] = useState(null)

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
  const [activeOrgArr, setActiveOrgArr] = useState([])
  const [teleTsArr, setTeleTsArr] = useState([])
  const [resoArr, setResoArr] = useState([])
  const [customerArr, setCustomerArr] = useState([])
  const [statusArr, setStatusArr] = useState([])

  const [statusDisableList, setStatusDisableList] = useState([]);
  const [stageDisableList, setStageDisableList] = useState(['FieldTech-L1', 'FieldTech-L2']);
  //#endregion

  //#region  Form variables
  const [form, setForm] = useState({});
  const [disableForShop, setDisableForShop] = useState(true);
  const [disableForDept, setDisableForDept] = useState(true);
  const [disableReso, setDisableReso] = useState(true)
  const [disableAssignTech, setDisableAssignTech] = useState(role_id == 6 ? false : true)
  const [techDisabled, setTechDisabled] = useState(true)
  const [tagDisabled, setTagDisabled] = useState(false)
  const [restoreRequired, setRestoreRequired] = useState(false)

  const [updateBtn, setUpdateBtn] = useState({
    label: 'Update',
    disabled: false
  })

  const [openDate, setOpenDate] = useState(moment().format('YYYY-MM-DD HH:mm'))
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [tagId, setTagId] = useState(0);

  const [status, setStatus] = useState({
    id: null,
    name: null
  })

  const [activeOrg, setActiveOrg] = useState({
    id: null,
    name: null
  })
  const [isOpen, setIsOpen] = useState(false)

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
        setForm(response.data.result)

        response.data.result.active_org_id === 3 ? setTagDisabled(true) : setTagDisabled(false)

        setStatus({
          id: response.data.result.tagging == 2 ? 1 : response.data.result.status_id,
          name: response.data.result.tagging == 2 ? "Open" : response.data.result.status
        })

        // setActiveOrg({
        //   id: response.data.result.tagging == 2 ? 3 : response.data.result.active_org_id,
        //   name: response.data.result.tagging == 2 ? "FieldTech-Lead" : response.data.result.active_org
        // })
        setActiveOrgArr([{
          id: response.data.result.active_org_id,
          name: response.data.result.active_org
        }])

        if (response.data.result.status === "Closed" || response.data.result.status === "Resolved") {
          setStatusDisableList(['Open'])
          // setClosedDateDisabled(false)

          if (response.data.result.status === "Closed") {
            setUpdateBtn({
              label: 'Update',
              disabled: true
            })
          }
          else {
            setUpdateBtn({
              label: 'Update',
              disabled: false
            })
          }
        }
        else {
          // setClosedDateDisabled(true)
        }

        if (response.data.result.class_id == 1) {
          setDisableForShop(false);
          setDisableForDept(true);
        }
        else {
          setDisableForShop(true);
          setDisableForDept(false);
        }

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

          // console.log(newPrioArr);
        });

        getSection().then((res) => {

          setSectionArr(res.data.result);

          const newArr = [];
          res.data.result.filter(subCat => subCat.dependency_id == response.data.result.dept_id).map(res => {
            newArr.push(res);
          });

          setNewSectionArr(newArr);
        });

      });

  }

  //#endregion

  useEffect(() => {

    getTicketDetails()

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

    getPriority().then((response) => {
      setPriorityArr(response.data.result);
    });

    getPlatform().then((response) => {
      setPlatformArr(response.data.result);
    });

    // getActiveOrg().then((response) => {
    //   setActiveOrgArr(response.data.result);
    // });

    getSection().then((response) => {
      setSectionArr(response.data.result);
    });

    getSubCategory().then((response) => {
      setSubCategoryArr(response.data.result);
    });

    getTeleTs().then((response) => {
      setTeleTsArr(response.data.result);
    });

    getResolution().then((response) => {
      setResoArr(response.data.result);
    });

    getCustomer().then((response) => {
      setCustomerArr(response.data.result);
    });

    getStatus().then((response) => {
      setStatusArr(response.data.result);
    });

    return (() => {
      setTicketDetails([])
      setClassificationArr([])
      setClassificationArr([])
      setDepartmentArr([])
      setShopsArr([])
      setShopLocsArr([])
      setTechnicianArr([])
      setPriorityArr([])
      setPlatformArr([])
      setActiveOrgArr([])
      setSectionArr([])
      setSubCategoryArr([])
      setTeleTsArr([])
      setStatusArr([])
    })

  }, [])

  //#endregion

  // useEffect(() => {
  //   console.log(status)
  // },[status])

  //#region CALLBACKS

  const getInputCallback = (data) => {

    setForm(prev => (
      {
        ...prev,
        [data.name]: data.value
      }
    ));
  }

  const getDatetimeCallback = (data) => {
    setForm(prev => (
      {
        ...prev,
        [data.name]: data.value
      }
    ));
  }

  const getSelectCallback = (data) => {

    console.log(data)
    
    switch (data.name) {

      case "classification":

        const newDept = [];
        const newShop = [];
        const newLoc = [];

        deparmentArr.map(res => {
          newDept.push(res);
        });

        shopArr.map(res => {
          newShop.push(res);
        });

        shopLocArr.map(res => {
          newLoc.push(res);
        });

        setNewDeptArr(newDept);

        if (data.value.id == 1) { // SHOP
          setDisableForShop(false);
          setDisableForDept(true);

          setNewDeptArr([])
          getDepartmentCallback({
            value: { id: null, name: null },
            id: 'dept_id',
            name: 'department'
          })
        }
        else if (data.value.id == 2) { // MOPLEX
          setDisableForShop(true);
          setDisableForDept(false);


          setForm(prev => (
            {
              ...prev,
              shop_id: null,
              shop_name: null,
              shop_loc_id: null,
              area_location: null
            }
          ))
        }
        else {
          setDisableForShop(true);
          setDisableForDept(true);

          setNewDeptArr([])
          getDepartmentCallback({
            value: { id: null, name: null },
            id: 'dept_id',
            name: 'department'
          })

          setNewShopsArr([])
          setNewShopLocsArr([])

          setForm(prev => (
            {
              ...prev,
              shop_id: null,
              shop_name: null,
              shop_loc_id: null,
              area_location: null
            }
          ))
        }

        break;

      case "technician_name":

        // data.value.id ? setTagDisabled(true) : setTagDisabled(false)

        if (data.value.id) {
          setTagDisabled(true)
          setForm(prev => (
            {
              ...prev,
              active_org_id: 4
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

      case "resolution":

        // data.value.id ? setTagDisabled(true) : setTagDisabled(false)

        if (data.value.id) {
          setDisableAssignTech(true)
          
          // setForm(prev => (
          //   {
          //     ...prev,
          //     active_org_id: 4
          //   }
          // ))
        }
        else {
          setDisableAssignTech(false)
          // setForm(prev => (
          //   {
          //     ...prev
          //   }
          // ))
        }

        break;

      case "tele_ts":

        if (data.value.id) {
          if (data.value.name == "Resolved") {
            // setStageDisableList([])
            setStatusDisableList([])
            // setDisableReso(false)
            setTechDisabled(true)
          }
          else if (data.value.name == "Unresolved") {
            // setStageDisableList(['Closed'])
            setStatusDisableList(['Closed'])
            // setDisableReso(true)
            setTechDisabled(false)
          }
        }
        else {
          // setStageDisableList(['Assigned to Technician', 'Assigned to Third Party', 'Closed'])
          setStatusDisableList(['Closed'])
          // setDisableReso(true)
          setTechDisabled(false)
        }

        break;

      case "status":

      console.log("STATUS")

        if (data.value.name === "Closed") {

          setRestoreRequired(true)

          setActiveOrgArr([{
            id: 1,
            name: "Helpdesk-L1"
          }])

          setForm(prev => (
            {
              ...prev,
              active_org_id: 1,
              closed_date: moment().format('YYYY-MM-DD HH:mm')
            }
          ))
        }
        else {

          setRestoreRequired(false)

          setActiveOrgArr([{
            id: ticketDetails.active_org_id,
            name: ticketDetails.active_org
          }])

          setForm(prev => (
            {
              ...prev,
              closed_date: null
            }
          ))
        }

        break;

      case "customer_name":

        setCustomerDetails(data.value)
        // console.log(data.value)

        setForm(prev => (
          {
            ...prev,
            contact_num: customerDetails.contact_num
          }
        ))

        break;

      case "active_org":

        if (data.value.id == 3 || data.value.id == 4) {
          setTagDisabled(true)
        }
        else {
          setTagDisabled(false)
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

  const getDepartmentCallback = (data) => {

    // console.log(data);

    const newArr = [];
    sectionArr.filter(section => section.dependency_id == data.value.id).map(res => {
      newArr.push(res);
    });

    setNewSectionArr(newArr);

    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value.id,
        [data.name]: data.value.name
      }
    ));
  }

  const workNoteCallback = (data) => {
    // console.log(data)

    if (data.result.length > 0) {

      var record = data.result[0]

      console.log(record)

      // setTagId(record.tag_id)

      // if (record.tag_id === 1) {
      //   setActiveOrg({
      //     id: 1,
      //     name: "Helpdesk-L1"
      //   })

      //   setForm(prev => (
      //     {
      //       ...prev,
      //       active_org_id: 1,
      //       active_org: "Helpdesk-L1"
      //     }
      //   ));
        
      // }
      // else if (record.tag_id === 2) {
      //   setIsOpen(true)
      //   setStatus({
      //     id: 1,
      //     name: "Open"
      //   })
      //   setActiveOrg({
      //     id: 3,
      //     name: "FieldTech-Lead"
      //   })

      //   setForm(prev => (
      //     {
      //       ...prev,
      //       tech_tagging_id: null,
      //       assigned_tech_id: null,
      //       tech_start: null,
      //       tech_end: null,
      //       status_id: 1,
      //       status: "Open",
      //       active_org_id: 3,
      //       active_org: "FieldTech-Lead"
      //     }
      //   ));

      //   setStatusDisableList(['Resolved', 'Closed'])
        
      // }
      // else {
      //   setStatusDisableList(['Open'])
      // }
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
      closed_date: form.status_id == 2 ? moment().format('YYYY-MM-DD HH:mm') : null,
      update_by: user_id,
      update_date: moment().format('YYYY-MM-DD HH:mm')
    }

    const url = '/api/TicketList/updateData';

    console.log(data);

    const notifId = toast.loading("Processing...");

    axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response);

      if (!response.data.result.error) {

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
            render: response.data.result.error.code,
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
      console.log(error.message)

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
          <form onSubmit={submitForm} className="Inter" >
            <div className="grid">
              <div className=' bg-white'>
                <div className=" bg-gray-600 text-white w-full p-4 mt-1">
                  <h3>Customer Details </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
                  <div className="mx-5">
                    <Form_Item_inputtext
                      name={'customer_name'}
                      label={'Customer Name'}
                      inputType={'text'}
                      variant={'outlined'}
                      isRequired={true}
                      isReadOnly={true}
                      getValueCallback={getInputCallback}
                      defaultValue={ticketDetails.customer_name}
                    />
                    <Form_Item_inputtext
                      name={'contact_num'}
                      label={'Contact #'}
                      inputType={'number'}
                      variant={'outlined'}
                      isRequired={false}
                      isReadOnly={false}
                      getValueCallback={getInputCallback}
                      defaultValue={ticketDetails.contact_num}
                    />

                    <Form_Item_dropdown
                      id={'platform_id'}
                      name={'platform'}
                      label={'Platform'}
                      variant={'outlined'}
                      listOfItems={platformArr}
                      isRequired={true}
                      isReadOnly={false}
                      isShow={true}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.platform_id,
                        name: ticketDetails.platform
                      }}
                    />
                  </div>
                  <div className="mx-5">
                    <Form_Item_dropdown
                      id={'class_id'}
                      name={'classification'}
                      label={'Class'}
                      variant={'outlined'}
                      listOfItems={classificationArr}
                      isRequired={true}
                      isReadOnly={true}
                      isShow={true}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.class_id,
                        name: ticketDetails.classification
                      }}
                    />
                    <Form_Item_dropdown
                      id={'dept_id'}
                      name={'department'}
                      label={'Department'}
                      variant={'outlined'}
                      listOfItems={deparmentArr}
                      isRequired={!disableForDept}
                      isDisabled={disableForDept}
                      isReadOnly={true}
                      isShow={!disableForDept}
                      getValueCallback={getDepartmentCallback}
                      selectedValue={{
                        id: ticketDetails.dept_id,
                        name: ticketDetails.department
                      }}
                    />
                    <Form_Item_dropdown
                      id={'dept_sec_id'}
                      name={'section'}
                      label={'Section'}
                      variant={'outlined'}
                      listOfItems={newSectionArr}
                      isRequired={!disableForDept}
                      isDisabled={disableForDept}
                      isReadOnly={true}
                      isShow={!disableForDept}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.dept_sec_id,
                        name: ticketDetails.section
                      }}
                    />
                    <Form_Item_dropdown
                      id={'shop_id'}
                      name={'shop_name'}
                      label={'Brand'}
                      variant={'outlined'}
                      listOfItems={shopArr}
                      isRequired={!disableForShop}
                      isDisabled={disableForShop}
                      isReadOnly={true}
                      isShow={!disableForShop}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.shop_id,
                        name: ticketDetails.shop_name
                      }}
                    />
                    <Form_Item_dropdown
                      id={'shop_loc_id'}
                      name={'area_location'}
                      label={'Location'}
                      variant={'outlined'}
                      listOfItems={shopLocArr}
                      isRequired={!disableForShop}
                      isDisabled={disableForShop}
                      isReadOnly={false}
                      isShow={!disableForShop}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.shop_loc_id,
                        name: ticketDetails.area_location
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className=' bg-white'>
                <div className=" bg-gray-600 text-white w-full p-4 mt-1">
                  <h3>Concern Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
                  <div className="mx-5">
                    <Form_datetime
                      name={'open_date'}
                      label={'Open Date'}
                      variant={'outlined'}
                      isRequired={true}
                      isDisabled={false}
                      isReadOnly={true}
                      defaultValue={ticketDetails.open_date}
                      getValueCallback={getDatetimeCallback}
                    />
                    <Form_Item_dropdown
                      id={'ticket_type_id'}
                      name={'ticket_type'}
                      label={'Ticket Type'}
                      variant={'outlined'}
                      listOfItems={ticketTypeArr}
                      isRequired={true}
                      isReadOnly={false}
                      isShow={true}
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
                      isReadOnly={true}
                      isShow={true}
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
                      isReadOnly={true}
                      isShow={true}
                      getValueCallback={getSubCategoryCallback}
                      selectedValue={{
                        id: ticketDetails.sub_category_id,
                        name: ticketDetails.sub_category
                      }}
                    />
                    <Form_Item_dropdown
                      id={'priority_id'}
                      name={'priority'}
                      label={'Priority'}
                      variant={'outlined'}
                      listOfItems={newPriorityArr}
                      isRequired={true}
                      isReadOnly={true}
                      defaultSelection={true}
                      isShow={true}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.priority_id,
                        name: ticketDetails.priority
                      }}
                    />
                    <Form_Item_dropdown
                      id={'tele_ts_id'}
                      name={'tele_ts'}
                      label={'Tele-Troubleshoot'}
                      variant={'outlined'}
                      listOfItems={teleTsArr}
                      isRequired={true}
                      isReadOnly={true}
                      isShow={true}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.tele_ts_id,
                        name: ticketDetails.tele_ts
                      }}
                    />
                    {/* <Form_Item_dropdown
                    id={'stage_id'}
                    name={'stage'}
                    label={'Stage'}
                    variant={'outlined'}
                    listOfItems={activeOrgArr}
                    isRequired={true}
                    getValueCallback={getSelectCallback}
                    selectedValue={{
                      id: ticketDetails.stage_id,
                      name: ticketDetails.stage
                    }}
                  /> */}
                  </div>
                  <div className="mx-5">
                    <Form_Item_dropdown2
                      id={'status_id'}
                      name={'status'}
                      label={'Status'}
                      variant={'outlined'}
                      // listOfItems={isOpen ? [status] : statusArr}
                      listOfItems={isOpen ? [status] : statusArr}
                      isRequired={true}
                      disableClear={true}
                      isReadOnly={ticketDetails.status == "Closed" ? true : false}
                      defaultSelection={isOpen}
                      getValueCallback={getSelectCallback}
                      selectedValue={status}
                      optionDisabled={statusDisableList}
                      
                    />
                    <Form_Item_dropdown2
                      id={'active_org_id'}
                      name={'active_org'}
                      label={'Active Org'}
                      variant={'outlined'}
                      listOfItems={activeOrgArr}
                      isRequired={true}
                      disableClear={true}
                      isReadOnly={ticketDetails.status == "Closed" ? true : false}
                      defaultSelection={true}
                      getValueCallback={getSelectCallback}
                      selectedValue={activeOrgArr[0]}
                      optionDisabled={stageDisableList}
                    />

                    <Form_Item_areatext
                      name={'spec_request'}
                      label={'Specific Request'}
                      variant={'outlined'}
                      isRequired={false}
                      getValueCallback={getInputCallback}
                      defaultValue={ticketDetails.spec_request}
                    />
                  </div>
                </div>
              </div>

              <div className=' bg-white'>
                <div className=" bg-gray-600 text-white w-full p-4 mt-1">
                  <h3>Work Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
                  <div className="mx-5">
                    <Form_Item_dropdown
                      id={'assigned_tech_id'}
                      name={'technician_name'}
                      label={'Assigned Tech'}
                      variant={'outlined'}
                      listOfItems={technicianArr}
                      isRequired={false}
                      isDisabled={disableAssignTech}
                      isShow={true}
                      getValueCallback={getSelectCallback}
                      selectedValue={ticketDetails.assigned_tech_id == null ? null : {
                        id: ticketDetails.assigned_tech_id,
                        name: ticketDetails.technician_name
                      }}
                    />
                  </div>
                  <div className="mx-5">
                    <Form_Item_dropdown
                      id={'reso_id'}
                      name={'resolution'}
                      label={'Resolution'}
                      variant={'outlined'}
                      listOfItems={resoArr}
                      isRequired={restoreRequired}
                      // isDisabled={tagDisabled ? tagDisabled : ticketDetails.assigned_tech_id == null ? false : true}
                      isShow={true}
                      isReadOnly={ticketDetails.status == "Closed" ? true : false}
                      getValueCallback={getSelectCallback}
                      selectedValue={{
                        id: ticketDetails.reso_id,
                        name: ticketDetails.resolution
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 md:gap-10 mt-4">
                  {
                    user_id ? (
                        <WorkNoteAdmin
                          ticket_ref_id={ticketDetails.ticket_ref_id}
                          user_id={user_id}
                          tagDisabled={false}
                          workNoteCallback={workNoteCallback}
                        />
                      )
                      :
                      null
                  }
                </div>
              </div>
            </div>
            <button
              type="Submit"
              className={`${updateBtn.disabled ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'} absolute right-28 bottom-3 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
              disabled={updateBtn.disabled}
            >
              {updateBtn.label}
            </button>
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