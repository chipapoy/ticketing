"use client"
import { useEffect, useState, useRef } from 'react';
import { redirect } from 'next/navigation'
import React from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
import Form_Item_dropdown2 from '@/Component/Forms/Form_Item_dropdown2';
import Form_Item_inputtext from '@/Component/Forms/Form_Item_inputtext';
import Form_Item_areatext from '@/Component/Forms/Form_Item_areatext';
import Form_Item_fileinput from '@/Component/Forms/Form_Item_fileinput';
import Form_datetime from '@/Component/Forms/Form_datetime';
import WorkNote from '@/Component/UI/Tickets/WorkNote'

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
  getStage,
  getTeleTs

} from '@/Collections/DropdownList';
// import Datepicker from 'react-tailwindcss-datepicker';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import md5 from 'js-md5';

const Create = () => {

  var ticket_ref_id = md5(moment().format('YYYYMMDDHHmm'))

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
  const [stageArr, setStageArr] = useState([])
  const [teleTsArr, setTeleTsArr] = useState([])

  const [userId, setUserId] = useState(null)

  const [stageDisableList, setStageDisableList] = useState(['Assigned to Third Party', 'Assigned to Technician', 'Closed']);
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
    assigned_tech_id: null,
    request: null,
    customer_name: null,
    contact_num: null,
    class_id: null,
    dept_id: null,
    dept_sec_id: null,
    shop_id: null,
    shop_loc_id: null,
    stage_id: 1,
    resolution: null,
    platform_id: null,
    work_note: null,
    open_date: null,
    added_by: userId,
    added_date: moment().format('YYYY-MM-DD HH:mm')
  });

  const [disableForShop, setDisableForShop] = useState(true);
  const [disableForDept, setDisableForDept] = useState(true);

  //#endregion

  useEffect(() => {

    setUserId(localStorage.getItem('id'))

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

    getStage().then((response) => {
      setStageArr(response.data.result);
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
      setStageArr([])
      setSectionArr([])
      setSubCategoryArr([])
      setTeleTsArr([])
    }

  }, []);


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
          if (data.value.name == "Resolved") {
            setStageDisableList([])
          }
          else if (data.value.name == "Unresolved") {
            setStageDisableList(['Closed'])
          }
        }
        else {
          setStageDisableList(['Assigned to Technician', 'Assigned to Third Party', 'Closed'])
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

        if (!response.data.result.error) {
          setTimeout(() => {
            toast.update(notifId, {
              render: `New Ticket ${response.data.result.insertId} has been created!`,
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
              }
            })
          }, 1500);
        }
        else {
          setTimeout(() => {
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
        <div>
          <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Customer Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-10">
              <Form_Item_inputtext
                name={'customer_name'}
                label={'Customer Name'}
                inputType={'text'}
                variant={'outlined'}
                isRequired={false}
                getValueCallback={getInputCallback}
              />
              <Form_Item_inputtext
                name={'contact_num'}
                label={'Contact #'}
                inputType={'number'}
                variant={'outlined'}
                isRequired={false}
                getValueCallback={getInputCallback}
              />
              <Form_Item_dropdown
                id={'class_id'}
                name={'classification'}
                label={'Class'}
                variant={'outlined'}
                listOfItems={classificationArr}
                isRequired={false}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'platform_id'}
                name={'platform'}
                label={'Platform'}
                variant={'outlined'}
                listOfItems={platformArr}
                isRequired={false}
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

        <div>
          <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Concern Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-10">
              <Form_datetime
                name={'open_date'}
                label={'Open Date'}
                variant={'outlined'}
                isRequired={false}
                isDisabled={false}
                getValueCallback={getDatetimeCallback}
              />
              <Form_Item_dropdown
                id={'ticket_type_id'}
                name={'ticket_type'}
                label={'Ticket Type'}
                variant={'outlined'}
                listOfItems={ticketTypeArr}
                isRequired={false}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'category_id'}
                name={'category'}
                label={'Category'}
                variant={'outlined'}
                listOfItems={categoryArr}
                isRequired={false}
                getValueCallback={getCategoryCallback}
              />
              <Form_Item_dropdown
                id={'sub_category_id'}
                name={'sub_category'}
                label={'Sub Category'}
                variant={'outlined'}
                listOfItems={newSubCategoryArr}
                isRequired={false}
                defaultSelection={newSubCategoryArr.length > 0 ? false : true}
                getValueCallback={getSubCategoryCallback}
              />
              <Form_Item_dropdown
                id={'priority_id'}
                name={'priority'}
                label={'Priority'}
                variant={'outlined'}
                listOfItems={newPriorityArr}
                isRequired={false}
                defaultSelection={true}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_dropdown
                id={'stage_id'}
                name={'stage'}
                label={'Stage'}
                variant={'outlined'}
                listOfItems={stageArr}
                isRequired={false}
                getValueCallback={getSelectCallback}
                selectedValue={{
                  id: 1,
                  name: 'Open'
                }}
                optionDisabled={stageDisableList}
              />
            </div>
            <div className="mx-10">
              <Form_datetime
                name={'closed_date'}
                label={'Closed Date'}
                variant={'outlined'}
                isRequired={false}
                isDisabled={true}
                defaultValue={""}
              // getValueCallback={getInputCallback}
              />
              <Form_Item_dropdown
                id={'tele_ts_id'}
                name={'tele_ts'}
                label={'Tele-Troubleshoot'}
                variant={'outlined'}
                listOfItems={teleTsArr}
                isRequired={false}
                getValueCallback={getSelectCallback}
              // selectedValue={{
              //   id: ticketDetails.priority_id,
              //   name: ticketDetails.priority
              // }}
              />
              <Form_Item_dropdown
                id={'assigned_tech_id'}
                name={'technician_name'}
                label={'Assigned Tech'}
                variant={'outlined'}
                listOfItems={technicianArr}
                isRequired={false}
                getValueCallback={getSelectCallback}
              />
              <Form_Item_inputtext
                name={'resolution'}
                label={'Resolution'}
                inputType={'text'}
                variant={'outlined'}
                isRequired={false}
                getValueCallback={getInputCallback}
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

        <div>
          <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Work Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-10 mt-4">
            {
              userId ? (
                <WorkNote ticket_ref_id={ticket_ref_id} user_id={userId} />
              ) : (
                'Loading'
              )
            }
            
          </div>
        </div>
      </div>
      <button
        type="Submit"
        className="absolute right-28 justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
      // onClick={}
      >
        Submit
      </button>
      {/* <Button
        type='submit'
        size='sm'
        color='green'
        variant={'gradient'}
        className="absolute right-28"
      >
        Submit
      </Button> */}
    </form>
  )

  //#endregion
}

export default Create