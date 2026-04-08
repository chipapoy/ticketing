import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

import { ArrowPathIcon, DocumentArrowDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

import { 
   ButtonGroup, 
   Button, 
   TextField
 } from '@mui/material';

import moment from 'moment';

import Filter_Content from '@/Component/UI/Report/Filter_Content';
import { setDataToDownload } from 'app/utils/extractData';

import {
   getActiveOrg,
   getCategoryType,
   getPriority,
   getShop,
   getTagging,
   getTechnicians
} from '@/Collections/DropdownList';



const ReportMenu = ( props ) => {
   const [anchorEl, setAnchorEl] = useState(null);

   const [filterToggle, SetFilterToggle] = useState(false);

   const [search, setSearch] = useState('')
   const [shopArr, setShopArr] = useState([])
   const [techArr, setTechArr] = useState([])
   const [taggingArr, setTaggingArr] = useState([])
   const [prioArr, setPriorityArr] = useState([])
   const [catArr, setCatArr] = useState([])
   const [activeOrgArr, setActiveOrgArr] = useState([])
   
   useEffect(() => {

      getShop().then((response) => {
         setShopArr(response.data.result)
      }) 

      getTechnicians().then((response) => {
         setTechArr(response.data.result)
      })

      getTagging().then((response) => {
         setTaggingArr(response.data.result)
      })

      getPriority().then((response) => {
         setPriorityArr(response.data.result)
      })

      getCategoryType().then((response) => {
         setCatArr(response.data.result)
      })

      getActiveOrg().then((response) => {
         setActiveOrgArr(response.data.result)
      })

   }, [])
   
   const locationSet = new Set()
   const getTechLocations = techArr.map((technician) => {
      locationSet.add(technician.location)
   })
   const techLocations = [...locationSet]


   const onFilter = (e) => {
      SetFilterToggle(!filterToggle)
      setAnchorEl(e.currentTarget)
   }

   const getFilterAnchorCallback = (anchor) => {
      setAnchorEl(anchor)
   }

   return (
   
   <ButtonGroup 
      variant='outlined'
      aria-label="outlined button group"
      size='small'
   >
      {/* REFRESH BUTTON */}
         <Button
            onClick={props.refreshCallback}>
            <ArrowPathIcon  /> 
         </Button>

      {/* FILTER BUTTON */}
         <Button 
            onClick={onFilter}>
            <FunnelIcon className="h-6 w-6" aria-hidden={true}/>
            {filterToggle ? <Filter_Content 
               filterToggleCallback = {getFilterAnchorCallback}
               anchorTarget = {anchorEl}
               brands = {shopArr}
               technicians = {techLocations}
               tagging = {taggingArr}
               priority = {prioArr}
               techNames = {techArr}
               categories = {catArr}
               activeOrgs = {activeOrgArr}
               filterCallback = {props.filterCallback}
            /> : null}
         </Button>
      {/* DOWNLOAD DATA */}
         <Button disabled={props.downloadData.length <= 0}>
            <CSVLink 
                  data={setDataToDownload(props.downloadData)}
                  filename={`tmg-ticketingsystem-reports ${moment().format('YYYY-MM-DD HH:mm')}`}
            >
                  <DocumentArrowDownIcon className="h-6 w-6" />
            </CSVLink>
         </Button>
      <TextField 
         type='number'
         label="Search by Ticket ID" 
         size='small'
         onChange={(e) => props.searchCallback({search: e.target.value})}
      />

   </ButtonGroup>
   
   )
}

export default ReportMenu