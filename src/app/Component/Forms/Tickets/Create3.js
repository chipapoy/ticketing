import { useEffect, useState, useRef } from 'react';
import { redirect } from 'next/navigation'
import React from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
// import Form_Item_dropdown from '@/Component/Forms/Form_Item_dropdown';
import Form_Item_inputtext from '@/Component/Forms/Form_Item_inputtext';
import Form_Item_areatext from '@/Component/Forms/Form_Item_areatext';
import Form_Item_telinput from '@/Component/Forms/Form_Item_telinput';
import Form_Item_fileinput from '@/Component/Forms/Form_Item_fileinput';

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

const Create = () => {

  //#region  Data source list
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
  const [platformArr, setPlatformArr] = useState([])
  //#endregion

  //#region  Form variables
  const [ticketTypeId, setTicketTypeId] = useState(0)
  const [catId, setCatId] = useState(0)
  const [subCatId, setSubCatId] = useState(0)
  const [prioId, setPrioId] = useState(0)
  const [teleTsId, setTeleTsId] = useState(0)
  const [techId, setTechId] = useState(0)
  const [request, setRequest] = useState('')

  const [customer, setCustomer] = useState('')
  const [contactNum, setContactNum] = useState(0)
  const [classId, setClassId] = useState(0)
  const [deptId, setDeptId] = useState(0)
  const [sectionId, setSectionId] = useState(0)
  const [shopId, setShopId] = useState(0)
  const [locId, setLocId] = useState(0)
  const [platformId, setPlatformId] = useState(0);

  const [stageId, setStageId] = useState(0)
  const [resolution, setResolution] = useState('')
  const [workNote, setWorkNote] = useState('')

  const [openDate, setOpenDate] = useState(moment().format('YYYY-MM-DD HH:mm'))
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

    getSection().then((response) => {
      setSectionArr(response.data.result);
    });

    getSubCategory().then((response) => {
      setSubCategoryArr(response.data.result);
    });

  }, []);


  //#region CALLBACKS

  const getTicketTypeCallback = (data) => {
    setTicketTypeId(data.id);
  }

  const getCategoryCallback = (data) => {

    const newSubCatArr = [];
    subCategoryArr.filter(subCat => subCat.cat_id == data.id).map(res => {
      newSubCatArr.push(res);
    });

    setNewSubCategoryArr(newSubCatArr);

    setCatId(data.id);
  }

  const getSubCategoryCallback = (data) => {
    setSubCatId(data.id);
  }

  const getPriorityCallback = (data) => {
    setPrioId(data.id);
  }

  const getTeleTsCallback = (data) => {
    setTeleTsId(data.id);
  }

  const getTechCallback = (data) => {
    setTechId(data.id);
  }

  const getRequestCallback = (data) => {
    setRequest(data);
  }

  const getCustomerCallback = (data) => {
    setCustomer(data);
  }

  const getContactNumCallback = (data) => {
    setContactNum(data);
  }

  const getClassCallback = (data) => {
    setClassId(data.id);
  }

  const getDeptCallback = (data) => {
    setDeptId(data.id);

    const newSectionArr = [];

    sectionArr.filter(section => section.dept_id == data.id).map(res => {
      newSectionArr.push(res);
    });

    setNewSectionArr(newSectionArr);

    setCatId(data.id);
  }

  const getSectionCallback = (data) => {
    setSectionId(data.id);
  }

  const getShopCallback = (data) => {
    setShopId(data.id);
  }

  const getShopLocationCallback = (data) => {
    setLocId(data.id);
  }

  const getStageCallback = (data) => {
    setStageId(data.id);
  }

  const getResolutionCallback = (data) => {
    setResolution(data);
  }

  const getNotesCallback = (data) => {
    setWorkNote(data);
  }

  const getPlatformCallback = (data) => {
    setPlatformId(data.id);
  }

  //#endregion


  //#region Submit Data
  const submitForm = (e) => {

    e.preventDefault();

    const url = '/api/TicketList/insertData';

    const data = {
      ticket_type_id: ticketTypeId,
      cat_id: catId,
      sub_cat_id: subCatId,
      priority_id: prioId,
      tele_ts: teleTsId,
      status_id: 1,
      tech_id: techId,
      request: request,
      customer: customer,
      contact_num: contactNum,
      class_id: classId,
      dept_id: deptId,
      dept_sec_id: sectionId,
      shop_id: shopId,
      shop_loc_id: locId,
      stage_id: stageId,
      resolution: resolution,
      platform_id: platformId,
      work_note: workNote,
      open_date: openDate,
      added_by: 1,
      added_date: moment().format('YYYY-MM-DD HH:mm')
    };

    const notifId = toast.loading("Processing...");

    axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log(response);

        setTimeout(() => {
          toast.update(notifId, {
            render: 'New Ticket has been created!',
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
            onClose: () => {
              redirect('/tickets');
            }
          })
        }, 1500);


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
            onClose: () => {

            }
          })
        }, 1500);
      })
  }
  //#endregion

  return (
    <form onSubmit={submitForm} className="Inter">
      <div className="grid md:grid-rows-3">
        <div>
          <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-8">
            <h3>Customer Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-auto">
              <Form_Item_inputtext
                inputType={"text"}
                labelName={"Customer Name"}
                placeHolder={"Enter Customer Name"}
                maxCharLength={50}
                isInputRequired={false}
                getValueCallback={getCustomerCallback}
              />
              <Form_Item_telinput
                inputType={"number"}
                labelName={"Contact Number"}
                placeHolder={"9991234567"}
                isInputRequired={false}
                getValueCallback={getContactNumCallback}
              />
              <Form_Item_dropdown
                labelName={"Class"}
                listOfItems={classificationArr}
                isInputRequired={false}
                getValueCallback={getClassCallback}
              />
              <Form_Item_dropdown
                labelName={"Platform"}
                listOfItems={platformArr}
                isInputRequired={false}
                getValueCallback={getPlatformCallback}
              />

            </div>
            <div className="mx-auto">
              <Form_Item_dropdown
                labelName={"Department"}
                listOfItems={deparmentArr}
                isInputRequired={false}
                hasDependency={true}
                getValueCallback={getDeptCallback}
              />
              <Form_Item_dropdown
                labelName={"Section"}
                listOfItems={newSectionArr}
                isInputRequired={false}

                getValueCallback={getSectionCallback}
              />

              <Form_Item_dropdown
                labelName={"Brand"}
                listOfItems={shopArr}
                isInputRequired={false}
                getValueCallback={getShopCallback}
              />

              <Form_Item_dropdown
                labelName={"Location"}
                listOfItems={shopLocArr}
                isInputRequired={false}
                getValueCallback={getShopLocationCallback}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Concern Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-auto">
              <Form_Item_dropdown
                labelName={"Ticket Type"}
                listOfItems={ticketTypeArr}
                isInputRequired={false}
                getValueCallback={getTicketTypeCallback}
              />
              <Form_Item_dropdown
                labelName={"Category"}
                listOfItems={categoryArr}
                isInputRequired={false}
                hasDependency={true}
                getValueCallback={getCategoryCallback}
              />
              <Form_Item_dropdown
                labelName={"Sub Category"}
                listOfItems={newSubCategoryArr}
                isInputRequired={false}
                getValueCallback={getSubCategoryCallback}
              />
              <Form_Item_dropdown
                labelName={"Priority"}
                listOfItems={priorityArr}
                isInputRequired={false}
                getValueCallback={getPriorityCallback}
              // dependentArr={categoryArr}
              />
            </div>
            <div className="mx-auto">
              <Form_Item_dropdown
                labelName={"Tele-Troubleshoot"}
                listOfItems={[
                  { id: 1, name: "Resolved" },
                  { id: 2, name: "Unresolved" }]}
                isInputRequired={false}

                getValueCallback={getTeleTsCallback}
              />
              <Form_Item_dropdown
                labelName={"Assigned Tech"}
                listOfItems={technicianArr}
                isInputRequired={false}
                getValueCallback={getTechCallback}
              />
              <Form_Item_areatext
                labelName={"Specific Request"}
                placeHolder={"Enter specifications"}
                rows={5}
                maxCharLength={10}
                isInputRequired={false}
                getValueCallback={getRequestCallback}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg bg-gray-600 text-white w-full p-4 mt-1">
            <h3>Additional Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-4">
            <div className="mx-auto">
              <Form_Item_dropdown
                labelName={"Stage"}
                listOfItems={[
                  { id: 1, name: "Open" },
                  { id: 2, name: "In Progress" },
                  { id: 3, name: "On Hold" },
                  { id: 4, name: "Closed" }]}
                isInputRequired={false}
                getValueCallback={getStageCallback}
              />
              <Form_Item_inputtext
                inputType={"text"}
                labelName={"Resolution"}
                placeHolder={"Enter Resolution"}
                maxCharLength={50}
                isInputRequired={false}
                getValueCallback={getResolutionCallback}
              />
              <div className='mt-4 w-full justify-between gap-5'>
                <label htmlFor="date-created" >
                  <h6 className="text-sm font-medium leading-tight">
                    Date & Time Created:
                  </h6>
                </label>
                <output id='date-created' className="font-medium">
                  {moment().format('DD-MMM-YYYY H:m')}
                </output>
              </div>
            </div>
            <div className="mx-auto">
              <Form_Item_areatext
                labelName={"Work-Note"}
                placeHolder={"specify actions here"}
                rows={5}
                maxCharLength={1000}
                isInputRequired={false}
                getValueCallback={getNotesCallback}
              />
              <Form_Item_fileinput
                isInputRequired={false}
              />
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

  //#endregion
}

export default Create