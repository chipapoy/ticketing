'use client'

import Top_nav from '@/Component/UI/Top_nav';
import { Disclosure } from '@headlessui/react';
import { useState } from 'react';
import { user, userNavigation } from '../Collections/collections';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import DataTable from 'react-data-table-component';

import ActiveOrg from '@/Component/Maintenance/ActiveOrg';
import Category from '@/Component/Maintenance/Category';
import Class from '@/Component/Maintenance/Class';
import Cluster from '@/Component/Maintenance/Cluster';
import Customer from '@/Component/Maintenance/Customer';
import Department from '@/Component/Maintenance/Department';
import DeptSection from '@/Component/Maintenance/DeptSection';
import Platform from '@/Component/Maintenance/Platform';
import Priority from '@/Component/Maintenance/Priority';
import Resolution from '@/Component/Maintenance/Resolution';
import Role from '@/Component/Maintenance/Role';
import SLA from '@/Component/Maintenance/SLA';
import Shop from '@/Component/Maintenance/Shop';
import ShopLocation from '@/Component/Maintenance/ShopLocation';
import SubCategory from '@/Component/Maintenance/SubCategory';
import Tagging from '@/Component/Maintenance/Tagging';
import TechStage from '@/Component/Maintenance/TechStage';
import Technician from '@/Component/Maintenance/Technician';
import TeleTs from '@/Component/Maintenance/TeleTs';
import TicketStatus from '@/Component/Maintenance/TicketStatus';
import TicketType from '@/Component/Maintenance/TicketType';
import User from '@/Component/Maintenance/User';

const Maintenance = () => {

   const [currentValue, setCurrentValue] = useState('ActiveOrg')
   const [itemSearch, setItemSearch] = useState('')
   const [dataContent, setDataContent] = useState({
      key: '',
      columnsArr: [],
      headerContent: null
   })

   const selectTable = (item) => {
      setCurrentValue(item.target.value)
   }

   const inputSearch = (item) => {
      setItemSearch(item.target.value)
   }


   return (
      <div>
         <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
               <>
                  <Top_nav
                     user={user}
                     userNavigation={userNavigation}
                     pageName={"Maintenance"}
                  />
               </>
            )}
         </Disclosure>
         <div>
            <header className="bg-white shadow">
               <div className="mx-screen  px-4 py-6 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Maintenance</h1>
               </div>
            </header>
         </div>
         <div className='grid lg:grid-cols-5 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 '>
            <div className='col-span-1 m-4 p-4 bg-white'>
               <div className="w-auto mb-4">
                  <FormControl fullWidth >
                     <TextField
                        id="search-item"
                        label="Search Item"
                        size="small"
                        variant="outlined"
                        className='mb-4'
                        onChange={inputSearch}
                        
                     />
                  </FormControl>
               </div>
               <div className="w-auto mb-4">
                  <FormControl fullWidth >
                     <InputLabel id="maintenance_label">Maintenance Type</InputLabel>
                     <Select
                        // labelId='maintenance_label'
                        defaultValue={currentValue}
                        label="Maintenance Type"
                        value={currentValue}
                        onChange={selectTable}
                        size='small'
                        
                     >
                        <MenuItem value="ActiveOrg">Active org</MenuItem>
                        <MenuItem value="Category">Category</MenuItem>
                        <MenuItem value="Classification">Class</MenuItem>
                        <MenuItem value="Cluster">Cluster</MenuItem>
                        <MenuItem value="Customer">Customer</MenuItem>
                        <MenuItem value="Department">Department</MenuItem>
                        <MenuItem value="DepartmentSection">Department Section</MenuItem>
                        <MenuItem value="Location">Location</MenuItem>
                        <MenuItem value="Platform">Platform</MenuItem>
                        <MenuItem value="Priority">Priority</MenuItem>
                        <MenuItem value="Resolution">Resolution</MenuItem>
                        <MenuItem value="Role">Role</MenuItem>
                        <MenuItem value="Shop" >Shop</MenuItem>
                        <MenuItem value="Sla" >SLA</MenuItem>
                        <MenuItem value="SubCategory">Sub Category</MenuItem>
                        <MenuItem value="Tagging">Tagging</MenuItem>
                        <MenuItem value="Technician">Technician</MenuItem>
                        <MenuItem value="TechStage">Tech Stage</MenuItem>
                        <MenuItem value="TeleTs">Tele Troubleshoot</MenuItem>
                        <MenuItem value="TicketStatus" >Ticket Status</MenuItem>
                        <MenuItem value="TicketType">Ticket Type</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                     </Select>

                  </FormControl>
               </div>
            </div>
         </div>
         <div className='grow p-8'>
         {(() => {
            switch(currentValue)
            {
               case 'ActiveOrg':
                  return <ActiveOrg itemSearch={itemSearch}/>
               case 'Category':
                  return <Category itemSearch={itemSearch}/>
               case 'Classification':
                  return <Class itemSearch={itemSearch}/>
               case 'Cluster':
                  return <Cluster itemSearch={itemSearch}/>
               case 'Customer':
                  return <Customer itemSearch={itemSearch}/>
               case 'Department':
                  return <Department itemSearch={itemSearch}/>
               case 'DepartmentSection':
                  return <DeptSection itemSearch={itemSearch}/>
               case 'Platform':
                  return <Platform itemSearch={itemSearch}/>
               case 'Priority':
                  return <Priority itemSearch={itemSearch}/>
               case 'Resolution':
                  return <Resolution itemSearch={itemSearch}/>
               case 'Role':
                  return <Role itemSearch={itemSearch}/>
               case 'Location':
                  return <ShopLocation itemSearch={itemSearch}/>
               case 'Shop':
                  return <Shop itemSearch={itemSearch}/>
               case 'Sla':
                  return <SLA itemSearch={itemSearch}/>
               case 'SubCategory':
                  return <SubCategory itemSearch={itemSearch}/>
               case 'Tagging':
                  return <Tagging itemSearch={itemSearch}/>
               case 'Technician':
                  return <Technician itemSearch={itemSearch}/>
               case 'TechStage':
                  return <TechStage itemSearch={itemSearch}/>
               case 'TicketStatus':
                  return <TicketStatus itemSearch={itemSearch}/>
               case 'TeleTs':
                  return <TeleTs itemSearch={itemSearch}/>
               case 'TicketType':
                  return <TicketType itemSearch={itemSearch}/>
               case 'User':
                  return <User itemSearch={itemSearch}/>
               default:
                  return <DataTable 
                           noDataComponent={'No Data To be rendered'}
                           columns={[]}
                           data={[]}
                        />

                  }
               })()}
            </div>
         

         <ToastContainer />
      </div>
   )
}

export default Maintenance