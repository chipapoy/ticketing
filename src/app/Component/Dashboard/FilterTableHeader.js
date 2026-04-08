import { useEffect, useState } from 'react'

import {
   getActiveOrg,
   getCategoryType,
   getTicketType
} from '@/Collections/DropdownList';

import {
   FormControl, 
   InputLabel, 
   MenuItem, 
   Select
} from '@mui/material';

import DownloadCSV_Button from './DownloadCSV_Button';

const FilterTableHeader = (props) => {

   const [filterArr, setFilterArr] = useState([])
   const [filterValue, setFilterValue] = useState('')

   useEffect(()=>{
      console.log(props.typeKey)
      ChangeFilterItems()
   },[props.typeKey])

   function ChangeFilterItems(){
      switch(props.typeKey){
         case 'transaction-type':
            getTicketType().then((response) => {
               setFilterArr(response.data.result)
            })
            break

         case 'category':
            getCategoryType().then((response) => {
               setFilterArr(response.data.result)
            })
            break

         case 'active-org':
            getActiveOrg().then((response) => {
               setFilterArr(response.data.result)
            })
            break
      }
   }


   const handleChange = (event) => {
      setFilterValue(event.target.value)
      props.filterCallback(event.target.value)
   }

   return (
      <div className='w-full px-0'>
         <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="filter-label" size='small' >Filter Item</InputLabel>
            <Select
               labelId="filter-label"
               value={filterValue}
               label="Filter Item"
               onChange={handleChange}
               size='small'
               className='rounded-none'
            >
               <MenuItem value=''><em>default</em></MenuItem>
               {...filterArr.map((item, index) => (
                  <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
               ))}
            </Select>
         </FormControl>
         <DownloadCSV_Button 
            extractData={props.extractData}
            title={props.typeKey}
         />
      </div>
   )
}

export default FilterTableHeader