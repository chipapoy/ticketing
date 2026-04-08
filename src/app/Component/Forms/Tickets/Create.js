"use client"
import { useEffect, useState, useRef } from 'react';
import { redirect } from 'next/navigation'
import React from 'react'
import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
import Form_Item_dropdown2 from '@/Component/Forms/Form_Item_dropdown2';
import Form_Item_inputtext from '@/Component/Forms/Form_Item_inputtext';
import Form_Item_areatext from '@/Component/Forms/Form_Item_areatext';
import Form_datetime from '@/Component/Forms/Form_datetime';
import WorkNote from '@/Component/UI/Tickets/WorkNote';

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
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import md5 from 'js-md5';



const Create = ({ user_id, createCallback }) => {

  const [ticket_ref_id, setTicketRefId] = useState(md5(moment().format('YYYYMMDDHHmmss')));

  // const [userId, setUserId] = useState(0)

  //#region  Data source list
  const [ticketTypeArr, setTicketTypeArr] = useState([])
  const [categoryArr, setCategoryTypeArr] = useState([])
  const [subCategoryArr, setSubCategoryArr] = useState([])
  const [newSubCategoryArr, setNewSubCategoryArr] = useState([])
  const [deparmentArr, setDepartmentArr] = useState([])
  const [newDeptArr, setNewDeptArr] = useState([])
  const [sectionArr, setSectionArr] = useState([])
  const [newSectionArr, setNewSectionArr] = useState([])
  const [shopArr, setShopsArr] = useState([])
  const [newShopArr, setNewShopsArr] = useState([])
  const [shopLocArr, setShopLocsArr] = useState([])
  const [newShopLocArr, setNewShopLocsArr] = useState([])
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

  const [stageDisableList, setStageDisableList] = useState(['FieldTech-L1', 'FieldTech-L2', 'Third Party']);
  const [statusDisableList, setStatusDisableList] = useState(['Closed', 'Resolved']);
  //#endregion

  //#region  Form variables
  const [form, setForm] = useState({
    ticket_ref_id: ticket_ref_id,
    ticket_type_id: null,
    category_id: null,
    sub_category_id: null,
    priority_id: null,
    tele_ts_id: null,
    status_id: 1,
    active_org_id: 1,
    active_org: "Helpdesk-L1",
    assigned_tech_id: null,
    request: null,
    customer_id: null,
    customer_name: null,
    contact_num: null,
    class_id: null,
    dept_id: null,
    dept_sec_id: null,
    shop_id: null,
    shop_loc_id: null,
    reso_id: null,
    resolution: null,
    platform_id: null,
    reso_id: null,
    customer_id: null,
    work_note: null,
    open_date: null,
    closed_date: null,
    added_by: parseInt(user_id),
    added_date: moment().format('YYYY-MM-DD HH:mm')
  })

  const [customerDetails, setCustomerDetails] = useState([])

  const [closedDateDisabled, setClosedDateDisabled] = useState(true)
  const [techDisabled, setTechDisabled] = useState(true)

  const [disableReso, setDisableReso] = useState(true)
  const [disableForShop, setDisableForShop] = useState(true)
  const [disableForDept, setDisableForDept] = useState(true)

  //#endregion

  useEffect(() => {

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

    getActiveOrg().then((response) => {
      setActiveOrgArr(response.data.result);
    });

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

    return () => {
      setTicketTypeArr([])
      setCategoryTypeArr([])
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
      setResoArr([])
      setCustomerArr([])
      setStatusArr([])
    }

  }, []);

  // useEffect(() => {
  //   console.log(form.active_org_id)
  // }, [form.active_org_id])

  // useEffect(() => {
  //   // setUserId(parseInt(localStorage.getItem('id')))

  //   const user_id = localStorage.getItem('id')
  //   if (user_id) {
  //     setUserId(user_id);
  //   }
  // }, [userId])

  //#region CALLBACKS

  const getInputCallback = (data) => {

    console.log(data)

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
        setNewShopsArr(newShop);
        setNewShopLocsArr(newLoc);

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

        if (data.value.id) {
          setStageDisableList(['Assigned to Third Party'])
        }
        else {
          setStageDisableList(['Assigned to Technician', 'Assigned to Third Party', 'Closed'])
        }

        break;

      case "tele_ts":

        if (data.value.id) {
          if (data.value.id == 1) {
            // setStageDisableList([])
            setStatusDisableList([])
            setDisableReso(false)
            setTechDisabled(true)
          }
          else if (data.value.id == 2) {
            // setStageDisableList(['Closed'])
            setStatusDisableList(['Closed', 'Resolved'])
            setDisableReso(true)
            setTechDisabled(false)
            setForm(prev => (
              {
                ...prev,
                active_org_id: 2,
                active_org: "FieldTech-Lead"
              }
            ))
          }
        }
        else {
          // setStageDisableList(['Assigned to Technician', 'Assigned to Third Party', 'Closed'])
          setStatusDisableList(['Closed', 'Resolved'])
          setDisableReso(true)
          setTechDisabled(false)
        }

        break;

      case "status":

        data.value.name === "Closed" ? setClosedDateDisabled(false) : setClosedDateDisabled(true)

        if (data.value.name === "Closed") {

          setClosedDateDisabled(false)
        }
        else {

          setClosedDateDisabled(true)

          setForm(prev => (
            {
              ...prev,
              closed_date: null
            }
          ))
        }

        break;

      case "active_org":

        // data.value.name === "Closed" ? setClosedDateDisabled(false) : setClosedDateDisabled(true)

        break;

      case "customer_name":

        setCustomerDetails(data.value)
        console.log(data.value)

        setForm(prev => (
          {
            ...prev,
            contact_num: data.value.contact_num
          }
        ))

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

    if (data.value.id) {
      const newArr = [];
      subCategoryArr.filter(subCat => subCat.dependency_id == data.value.id).map(res => {
        newArr.push(res);
      });

      setNewSubCategoryArr(newArr)
    }
    else {
      setNewSubCategoryArr([])
      setNewPriorityArr([])

      setForm(prev => (
        {
          ...prev,
          [data.id]: data.value.id,
          [data.name]: data.value.name,
          sub_category_id: null,
          sub_category: null
        }
      ));
    }

    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value.id,
        [data.name]: data.value.name
      }
    ));
  }

  const getSubCategoryCallback = (data) => {

    if (data.value.id) {
      const newArr = [];
      priorityArr.filter(prio => prio.id == data.value.priority_id).map(res => {
        newArr.push(res);
      });

      setNewPriorityArr(newArr)
    }
    else {
      setNewPriorityArr([])
    }


    setForm(prev => (
      {
        ...prev,
        [data.id]: data.value.id,
        [data.name]: data.value.name
      }
    ));
  }

  const getDepartmentCallback = (data) => {

    if (data.value.id) {
      const newArr = [];
      sectionArr.filter(section => section.dependency_id == data.value.id).map(res => {
        newArr.push(res);
      });

      setNewSectionArr(newArr);
    }
    else {

      setNewSectionArr([])

      setForm(prev => (
        {
          ...prev,
          [data.id]: data.value.id,
          [data.name]: data.value.name,
          dept_sec_id: null,
          section: null
        }
      ));
    }

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

    console.log(form);

    const url = '/api/TicketList/insertData';

    const notifId = toast.loading("Processing...");

    axios.post(url, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response);

        if (response.status == 200) {

          setTimeout(() => {
            toast.update(notifId, {
              render: `New Ticket ${response.data.result.result.insertId} has been created!`,
              type: 'success',
              delay: undefined,
              isLoading: false,
              position: "top-right",
              autoClose: 3000,
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
                createCallback({
                  refresh: true,
                  open: false
                })
              }
            })
          }, 2500);
        }
        else {
          setTimeout(() => {
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
    <form onSubmit={submitForm} >
      <div className="grid">
        <div className=' bg-white'>
          <div className=" bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Customer Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-10">
              {/* <Form_Item_inputtext
                name={'customer_name'}
                label={'Customer Name'}
                inputType={'text'}
                variant={'outlined'}
                isRequired={true}
                getValueCallback={getInputCallback}
              /> */}
              <Form_Item_dropdown
                id={'customer_id'}
                name={'customer_name'}
                label={'Customer Name'}
                variant={'outlined'}
                listOfItems={customerArr}
                isRequired={true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_inputtext
                name={'contact_num'}
                label={'Contact #'}
                inputType={'number'}
                variant={'outlined'}
                isRequired={false}
                isReadOnly={true}
                isShrink={form.customer_id != null ? true : false}
                getValueCallback={getInputCallback}
                defaultValue={customerDetails.contact_num}
              />
              <Form_Item_dropdown
                id={'class_id'}
                name={'classification'}
                label={'Class'}
                variant={'outlined'}
                listOfItems={classificationArr}
                isRequired={true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'platform_id'}
                name={'platform'}
                label={'Platform'}
                variant={'outlined'}
                listOfItems={platformArr}
                isRequired={true}
                getValueCallback={getSelectCallback}
              />
            </div>
            <div className="mx-10">
              <Form_Item_dropdown
                id={'dept_id'}
                name={'department'}
                label={'Department'}
                variant={'outlined'}
                listOfItems={newDeptArr}
                isRequired={!disableForDept}
                isDisabled={disableForDept}
                defaultSelection={newDeptArr.length > 0 ? false : true}
                getValueCallback={getDepartmentCallback}
              />
              <Form_Item_dropdown
                id={'dept_sec_id'}
                name={'section'}
                label={'Section'}
                variant={'outlined'}
                listOfItems={newSectionArr}
                isRequired={!disableForDept}
                isDisabled={disableForDept}
                defaultSelection={newSectionArr.length > 0 ? false : true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'shop_id'}
                name={'shop_name'}
                label={'Brand'}
                variant={'outlined'}
                listOfItems={newShopArr}
                isRequired={!disableForShop}
                isDisabled={disableForShop}
                defaultSelection={newShopArr.length > 0 ? false : true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'shop_loc_id'}
                name={'area_location'}
                label={'Location'}
                variant={'outlined'}
                listOfItems={newShopLocArr}
                isRequired={!disableForShop}
                isDisabled={disableForShop}
                defaultSelection={newShopLocArr.length > 0 ? false : true}
                getValueCallback={getSelectCallback}
              />
            </div>
          </div>
        </div>

        <div className=' bg-white'>
          <div className=" bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Concern Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-10">
              <Form_datetime
                name={'open_date'}
                label={'Open Date'}
                variant={'outlined'}
                isRequired={true}
                isDisabled={false}
                isReadOnly={true}
                getValueCallback={getDatetimeCallback}
              />
              <Form_Item_dropdown
                id={'ticket_type_id'}
                name={'ticket_type'}
                label={'Ticket Type'}
                variant={'outlined'}
                listOfItems={ticketTypeArr}
                isRequired={true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'category_id'}
                name={'category'}
                label={'Category'}
                variant={'outlined'}
                listOfItems={categoryArr}
                isRequired={true}
                getValueCallback={getCategoryCallback}
              />
              <Form_Item_dropdown
                id={'sub_category_id'}
                name={'sub_category'}
                label={'Sub Category'}
                variant={'outlined'}
                listOfItems={newSubCategoryArr}
                isRequired={true}
                defaultSelection={newSubCategoryArr.length > 0 ? false : true}
                getValueCallback={getSubCategoryCallback}
              />
              <Form_Item_dropdown
                id={'priority_id'}
                name={'priority'}
                label={'Priority'}
                variant={'outlined'}
                listOfItems={newPriorityArr}
                isRequired={true}
                defaultSelection={true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'tele_ts_id'}
                name={'tele_ts'}
                label={'Tele-Troubleshoot'}
                variant={'outlined'}
                listOfItems={teleTsArr}
                isRequired={true}
                getValueCallback={getSelectCallback}
              />
            </div>
            <div className="mx-10">
              {/* <Form_datetime
                name={'closed_date'}
                label={'Closed Date'}
                variant={'outlined'}
                isRequired={!closedDateDisabled}
                isDisabled={closedDateDisabled}
                defaultValue={""}
                getValueCallback={getInputCallback}
              /> */}
              <Form_Item_dropdown
                id={'status_id'}
                name={'status'}
                label={'Status'}
                variant={'outlined'}
                listOfItems={statusArr}
                isRequired={true}
                disableClear={true}
                getValueCallback={getSelectCallback}
                selectedValue={{
                  id: 1,
                  name: 'Open'
                }}
                optionDisabled={statusDisableList}
              />
              <Form_Item_dropdown
                id={'active_org_id'}
                name={'active_org'}
                label={'Active Org'}
                variant={'outlined'}
                listOfItems={activeOrgArr}
                isRequired={true}
                disableClear={true}
                getValueCallback={getSelectCallback}
                selectedValue={{
                  id: 1,
                  name: 'Helpdesk-L1'
                }}
                optionDisabled={stageDisableList}
              />
              <Form_Item_areatext
                name={'spec_request'}
                label={'Specific Request'}
                variant={'outlined'}
                isRequired={false}
                getValueCallback={getInputCallback}
              />
            </div>
          </div>
        </div>

        <div className=' bg-white'>
          <div className=" bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Work Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-10 mt-4">
            <div className="mx-10">
              <Form_Item_dropdown
                id={'reso_id'}
                name={'resolution'}
                label={'Resolution'}
                variant={'outlined'}
                listOfItems={resoArr}
                isRequired={!disableReso}
                isDisabled={disableReso}
                getValueCallback={getSelectCallback}
              />
            </div>
            {
              user_id ? <WorkNote ticket_ref_id={ticket_ref_id} user_id={user_id} /> : 'Loading'
            }

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

  //#endregion
}

export default Create