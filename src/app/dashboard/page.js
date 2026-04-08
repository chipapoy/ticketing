"use client";

import {
   useEffect,
   useState
} from 'react';

import {
   Disclosure
} from '@headlessui/react';

import Top_nav from '@/Component/UI/Top_nav';

import {
   user,
   userNavigation
} from '../Collections/collections';

import Dashboard_content from '../Component/Dashboard/Dashboard_content';

import {
   DateRangePicker,
   DateRangePickerItem
} from '@tremor/react';

import moment from 'moment';

import {
   IsOverDue,
} from '../helper/myHelper';

import {
   getCategoryType,
   getStatus
} from '@/Collections/DropdownList';

import {
   getActiveOrgTicketCount,
   getClusterTicketCount,
   getFilteredData,
   getOverdueTickets,
   getPlatformCount,
   getPriorityTicketCount,
   getShopLocationTickets,
   getTechPerformanceList,
   getTeleTsPerc,
   getTicketCreatorList,
   getTicketTypesCount,
   getTicketsByStatus,
   getUnfilteredData,
   getAllbranchesCount,
   getUnassignedTicketList
} from '@/Collections/dashboardCollections';



const Dashboard = () => {

   const [dateValue, setDateValue] = useState({
      from: new Date(moment().startOf('week')),
      to: new Date(moment()),
   })

   
   //#region DATA useStates
   const [unfilteredDataArr, setUnfilteredDataArr] = useState([]) // Needed for fetching data from axios & used in useEffect everytime it changes
   const [filteredDataArr, setFilteredDataArr] = useState([])
   const [totalFilteredData, setTotalFilteredData] = useState(0)
   
   const [openTicketsArr, setOpenTicketsArr] = useState([])
   const [openTicketsCount, setOpenTicketsCount] = useState(0)
   const [overdueTicketsArr, setOverdueTicketArr] = useState([])
   const [overdueTicketCount, setOverdueTicketCount] = useState(0)
   const [closedTicketsArr, setClosedTicketsArr] = useState([])
   const [closedTicketsCount, setClosedTicketsCount] = useState(0)
   const [resolvedTicketsArr, setResolvedTicketsArr] = useState([])
   const [resolvedTicketsCount, setResolvedTicketsCount] = useState(0)
   const [unassignedTicketArr, setUnassignedTicketArr] = useState([])
   const [unassignedTicketCount, setUnassignedTicketCount] = useState(0)
   
   const [priorityArr, setPriorityArr] = useState(null)
   const [openPriorityArr, setOpenPriorityArr] = useState(null)
   const [teleTsArr, setTeleTsArr] = useState(null)  
   const [categoryArr, setCategoryTypeArr] = useState(null)
   
   const [ticketTypeArr, setTicketTypeArr] = useState(null)
   const [activeOrgArr, setActiveOrgArr] = useState(null)
   
   const [clusterArr, setClusterArr] = useState([])
   const [allBranchesCount, setAllBranchesCount] = useState(null)
   const [platformArr, setPlatformArr] = useState(null)
   const [statusArr, setStatusArr] = useState([]) // For monthly table tickets
   
   const [techPerformanceArr, setTechPerformanceList] = useState([])
   const [shopsLocationArr, setShopLocationArr] = useState([])
   const [shopsArr, setShopsArr] = useState([])
   
   const [ticketCreatorArr, setTicketCreatorArr] = useState([])
   

   //#endregion
   
   useEffect(() => {

      const fromDate = moment(dateValue.from === undefined ? moment() : dateValue.from).format('YYYY-MM-DD')
      const toDate = moment(dateValue.to === undefined ? moment() : dateValue.to).format('YYYY-MM-DD')

      console.log(`from date: ${fromDate} to date: ${toDate}`)

      getFilteredData(fromDate, toDate).then((response) => {
         setFilteredDataArr(response.data.result.data)
         setTotalFilteredData(response.data.result.total)
      })

      getClusterTicketCount(fromDate, toDate).then((response) => {
         setClusterArr(response.data.result.data)
      })

      getAllbranchesCount(fromDate, toDate).then((response) => {
         setAllBranchesCount((response.data.result.data))
      })

      getPriorityTicketCount(fromDate,toDate).then((response) => {
         setPriorityArr(response.data.result.data)
         setOpenPriorityArr(response.data.result.openData)
      })

      getTicketTypesCount(fromDate, toDate).then((response) => {
         setTicketTypeArr(response.data.result.data)
      })

      getPlatformCount(fromDate, toDate).then((response) => {
         setPlatformArr(response.data.result.data)
      })

      getTechPerformanceList(fromDate, toDate).then((response) => {
         setTechPerformanceList(response.data.result.data)
      })

      getOverdueTickets(fromDate, toDate).then((response) => {
         setOverdueTicketArr(response.data.result.data)
         setOverdueTicketCount(response.data.result.total)
      })

      getTicketsByStatus(fromDate,toDate,1).then((response) => {
         setOpenTicketsArr(response.data.result.data)
         setOpenTicketsCount(response.data.result.total)
      })

      getTicketsByStatus(fromDate,toDate,2).then((response) => {
         setClosedTicketsArr(response.data.result.data)
         setClosedTicketsCount(response.data.result.total)
      })

      getTicketsByStatus(fromDate,toDate,3).then((response) => {
         setResolvedTicketsArr(response.data.result.data)
         setResolvedTicketsCount(response.data.result.total)
      })

      getTeleTsPerc(fromDate, toDate).then((response) => {
         setTeleTsArr(response.data.result.data)
      })

      getShopLocationTickets(fromDate, toDate).then((response) => {
         setShopLocationArr(response.data.result.loc)
         setShopsArr(response.data.result.shop)
      })

      getActiveOrgTicketCount(fromDate, toDate).then((response) => {
         setActiveOrgArr(response.data.result.data)
      })

      getUnassignedTicketList(fromDate, toDate).then((response) => {
         setUnassignedTicketArr(response.data.result.data)
         setUnassignedTicketCount(response.data.result.total)
      })

   }, [dateValue])

   useEffect(() => {

      getUnfilteredData().then((response) => {
         setUnfilteredDataArr(response.data.result.data)
      })

      getCategoryType().then((response) => {
         setCategoryTypeArr(response.data.result);
      })

      getStatus().then((response) => {
         setStatusArr(response.data.result)
      })

      getTicketCreatorList().then((response) => {
         setTicketCreatorArr(response.data.result.data)
      })
      

      
   }, [])

   const updateDateValue = (selectedRange) => {
      if (selectedRange.selectValue === undefined){  
         const newToDate = moment(selectedRange.to)
         newToDate.set('hour', 23)
         newToDate.set('minute', 59)
         newToDate.set('second', 59)
         newToDate.set('millisecond', 999)

         setDateValue({from: selectedRange.from, to: new Date(newToDate)})
      }

      if (selectedRange.to === undefined && selectedRange.from !== undefined){
         selectedRange.to = selectedRange.from
      }

      setDateValue(selectedRange)
  }

   function IsBeyondSLA(ticket) {
      const inputString = ticket.sla;
   
      // Use a regular expression to extract the hours value
      const hoursMatch = inputString?.match(/\d+/);
      let currentDate;
      let addedDate;
      if (hoursMatch) 
      {
         const hours = parseInt(hoursMatch[0], 10); // Convert the matched value to an integer
   
         currentDate = moment(ticket.open_date);
         addedDate = moment(currentDate).add(hours, 'hours').format('YYYY-MM-DD HH:mm:ss');
      } 
      else 
      {
         console.log("No hours value found in the input string.");
      }
   
      if (ticket.closed_date != null) 
      {
         if (moment(ticket.closed_date).isAfter(addedDate))
            return ticket;
      } 
      else 
      {
         if(moment().isAfter(addedDate))
            return ticket;
      }
   }
  
   //#region GROUPED ARRAYS

   // CATEGORY 
   const groupedByCategories = categoryArr?.map((category) => {
      return {
         'category': category.name,
         Total: filteredDataArr.filter(ticket => ticket.category === category.name).length,
         within_SLA: filteredDataArr.filter(ticket => ticket.category === category.name && !IsBeyondSLA(ticket)).length,
         beyond_SLA: filteredDataArr.filter(ticket => ticket.category === category.name && IsBeyondSLA(ticket)).length,
      }
   })

   const beyondSLATicketArr = filteredDataArr.filter(ticket => IsBeyondSLA(ticket))
   const withinSLATicketArr = filteredDataArr.filter(ticket => !IsBeyondSLA(ticket))

   const groupedByDueTicketsPercentage = [
      { typeName: "Beyond SLA", length: (((filteredDataArr.filter(ticket => IsOverDue(ticket)).length) / filteredDataArr.length) * 100) },
      { typeName: "Within SLA", length: (((filteredDataArr.filter(ticket => !IsOverDue(ticket)).length) / filteredDataArr.length) * 100) }
   ]

   const getMonthlyTickets = () => {
      const monthlyArr = [];
      let currentMonth = moment(dateValue.from).month();

      for (let i = 0 ; i < 4; i++){
         const monthObject = 
         {
               month: moment().month(currentMonth).format('MMM'),
               monthlyTotal: filteredDataArr.filter(ticket => moment(ticket.open_date).month() === currentMonth 
               && moment(ticket.open_date).isAfter(moment(dateValue.from))).length,
               ...Object.fromEntries(
               statusArr.map((status) => [
                  status.name, 
                  filteredDataArr.filter(
                     ticket => ticket.status === status.name && moment(ticket.open_date).month() === currentMonth
                     && moment(ticket.open_date).isAfter(moment(dateValue.from))).length     
                  ])
               ),
               
         };
         monthlyArr.push(monthObject);

         currentMonth+=1;
      }

      return monthlyArr;
   }

   const monthlyTickets = getMonthlyTickets()

   //#endregion

   return (
      <>
         <div className="min-h-full">
            <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                  <>
                  <Top_nav
                     user={user}
                     userNavigation={userNavigation}
                     pageName={"Dashboard"}
                  />
                  </>
            )}
            </Disclosure>

            <header className="bg-white shadow">
               <div className="mx-auto flex max-w-full px-4 py-6 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                  <DateRangePicker
                  className="max-w-sm ml-auto"
                  value={dateValue}
                  onValueChange={ updateDateValue }
                  // locale={es}
                  selectPlaceholder={
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     className="w-5 h-5 mx-auto">
                     <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                     </svg>
                  }
                  color="rose"
                  >
                  <DateRangePickerItem key="YTD" value="YTD" from={new Date(2023, 0, 1)} to={new Date(moment())}>
                     Year to Date
                  </DateRangePickerItem>

                  <DateRangePickerItem
                     key="WTD"
                     value="WTD"
                     from={new Date(moment().startOf('week'))}
                     to={new Date(moment())}
                  >
                     Week to Date
                  </DateRangePickerItem>

                  <DateRangePickerItem
                     key="MTD"
                     value="MTD"
                     from={new Date(moment().startOf('month'))}
                     to={new Date(moment())}
                  >
                     Month to Date
                  </DateRangePickerItem>

                  <DateRangePickerItem
                     key="DTD"
                     value="DTD"
                     from={new Date(moment())}
                     to={new Date(moment())}
                  >
                     Today
                  </DateRangePickerItem>

                  </DateRangePicker>
               </div>
            </header>
            <main>
            <Dashboard_content
               filterDate={dateValue}
               unfilteredDataArr={unfilteredDataArr}
               filteredDataArr={filteredDataArr}
               totalFiltered={totalFilteredData}
               data={filteredDataArr}

               // TICKET STATUS
               monthlyTableTickets={monthlyTickets} // contains filtered tickets count by month and grouped by ticket status (OPEN, RESOLVED, CLOSED)
               openTicketsArr={openTicketsArr}
               openTicketsCount={openTicketsCount}
               closedTicketsArr={closedTicketsArr}
               closedTicketsCount={closedTicketsCount}
               resolvedTicketsArr={resolvedTicketsArr}
               resolvedTicketsCount={resolvedTicketsCount}
               unassignedTicketArr={unassignedTicketArr}
               unassignedTicketCount={unassignedTicketCount}

               // OVERDUE TICKETS
               overdueTicketsArr={overdueTicketsArr}
               overdueTicketCount={overdueTicketCount}

               // ACTIVE ORGS
               activeOrgArr={activeOrgArr}

               // CLUSTER
               clusterArr={clusterArr} // Ticket Count filtered by date grouped by cluster 
               allBranchesCount={allBranchesCount}

               // TECHNICIANS
               techPerformanceArr={techPerformanceArr} // List of Technician names and their assigned ticket status(count)

               // TICKET TYPE
               transactionTypeArr={ticketTypeArr}

               // CATEGORIES
               categoryArr={groupedByCategories}
               beyondSLATicketArr={beyondSLATicketArr}
               withinSLATicketArr={withinSLATicketArr}

               // PRIORITIES
               prioArr={priorityArr}
               openPrioArr={openPriorityArr}

               // SLA
               dueTicketsPerc={groupedByDueTicketsPercentage}

               // Platform
               platformArr={platformArr}

               //TELE TROUBLESHOOT
               troubleShootArr={teleTsArr}

               // SHOPS
               shopsLocArr={shopsLocationArr}
               shopsArr={shopsArr}

               // USERNAMES
               ticketCreatorArr={ticketCreatorArr}
            />

            </main>
         </div>
      </>
   )
}

export default Dashboard