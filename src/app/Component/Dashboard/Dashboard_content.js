'use client'

import { useEffect, useState } from 'react';

import Dashboard_TicketList from '../Dashboard/Dashboard_TicketList';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import {
   Card,
   IconButton,
   Menu,
   MenuItem,
   Skeleton,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Tooltip,
   Typography,
   styled
} from '@mui/material';

import {
   BarChart,
   LineChart,
   PieChart,
   useDrawingArea
} from '@mui/x-charts';


import Link from 'next/link';


import {
   List,
   ListItem
} from '@tremor/react';


import moment from 'moment';


import {
   DATATABLE_ACTIVE_ORG_COLUMNS,
   DATATABLE_CATEGORY_COLUMNS,
   DATATABLE_TRANSACTION_TYPE_COLUMNS
} from 'app/utils/constantVariables';
import { setDataToDownload } from '../../utils/extractData';
import Dashboard_Modal from './Dashboard_Modal';
import FilterTable from './Filtertable';
import Shops_content from './Shops_content';
import TechPerformance_TicketList from './TechPerformance_TicketList';


function previewArr(arr, limit){
   let tempArr = [];
   for (let i = 0; i < limit; i++){
      if (arr[i]  != null)
            tempArr.push(arr[i]);
   }

   return tempArr;
}

const Dashboard_content = (props) => {

   const [graphWidth, setGraphWidth] = useState(300)
   const [graphHeight, setGraphHeight] = useState(300)

   const [prioData, setPrioData] = useState(null)

   const [anchorEl, setAnchorEl] = useState(null)

   const [menuID, setMenuID] = useState('')
   const [centerPrioLabel, setCenterPrioLabel] = useState('')
   const [prioDataArr, setPrioDataArr] = useState([])
   const open = Boolean(anchorEl)

   const donutCenterLabelText = props.totalFiltered.toString() + "\n Tickets"
   const openTicketsCenterLabelText = props.openTicketsCount.toString() + "\n Tickets"

   useEffect(()=> {
      setCenterPrioLabel(donutCenterLabelText)
      setNewPrioData('summary')
   },[donutCenterLabelText, props.filterDate])

   //#region MORE OPTION MENU
   const handleClick = (event) => {
      setMenuID(event.currentTarget.id)
      setAnchorEl(event.currentTarget)
   }

   const handleClose = () => {
     setAnchorEl(null)
   }
   //#endregion

   //#region PRIORITY 
   const setNewPrioData = (value) => {
      
      switch(value)
      {
         case 'open-ticket':
            setCenterPrioLabel(openTicketsCenterLabelText)
            setPrioData(props.openPrioArr)
            setPrioDataArr(props.filteredDataArr.filter(ticket => ticket.status === 'Open'))
         break
         case 'summary':
            setCenterPrioLabel(donutCenterLabelText)
            setPrioData(props.prioArr)
            setPrioDataArr(props.filteredDataArr)
         break
         default:
            setCenterPrioLabel(props.totalFiltered.toString() + "\n Tickets")
            setPrioData(props.prioArr)
            setPrioDataArr(props.filteredDataArr)
      }
      handleClose()
   }

   //#endregion

   //#region MODAL
   const [modalInfo, setModalInfo] = useState({
      open: false,
      module: '',
      title: '',
      content: null,
      extractData: null,
      hasExtraction: false
   });
   
   const toggleModal = (data) => {
      setModalInfo({
            open: data.open,
            module: data.module,
            title: data.title,
            content: data.content,
            extractData: data.data,
            hasExtraction: data.hasExtraction
      });
   };


   const toggleCallback = (data) => {
      setModalInfo({
            open: data.open,
            module: data.module,
            title: data.title,
            content: data.content,
            extractData: data.data,
            hasExtraction: data.hasExtraction
      });
   };

   //#region CONTENT MODAL
   const TechModal = (props) => {
      return(
         <div>
            <List>
               {props.techList.map((tech, index) => (
                  <ListItem key={index}>
                     <span className='text-center'>{tech.name}</span>
                  </ListItem>
               ))}
            </List>
         </div>
      )
   }

   const TicketListModal = (props) => {
      return(
         <div>
            <Dashboard_TicketList
               filteredData = {props.data}
            />
         </div>
      )
   }
   //#endregion

   //#endregion

   const previewTechPerformanceTask = previewArr(props.techPerformanceArr, 5)

   const previewShopsArr = previewArr(props.shopsArr, 5)

   //#region TTS DONUT PROPERTIES
   const ttsColors = [
      '#F38203', // RESOLVED - TTS
      '#F3E10E', // UNRESOLVED - TTS
      '#DF0000' // FOR CALLBACK - TTS
   ]
   //#endregion

   //#region DONUT PROPS
   const StyledText = styled('text')(({ theme }) => ({
      fill: theme.palette.text.primary,
      textAnchor: 'middle',
      dominantBaseline: 'central',
      fontWeight: 500,
      fontSize: 14,
      
   }));
    
   function DonutCenterLabel({ children }) {
      const { width, height, left, top } = useDrawingArea();
      
      const lines = children.split('\n')
      return (
         <g>
            {lines.map((line, index) => (
               <StyledText className='text-xs'key={index} x={(left + width) *.51 } y={(top + height) / 2.1 + index * 15}>
                  {line}
               </StyledText>
            ))}
         </g>
      )
   }

   const valueFormat = (data) => `${(data.value).toFixed(2).toString()}%`

   //#endregion

   //#region PRIORITY DONUT PROPERTIES
   const priorityColorCodes = [
      '#681CB9', // PRIORITY 1
      '#F3E10E', // PRIORITY 2
      '#F3730E', // PRIORITY 3
      '#F30E0E'  // PRIORITY 4
   ]
   //#endregion

   //#region TRENDLINE

   const keyToLabel = {
      'FieldTech-L1': 'FieldTech-L1',
      'FieldTech-L2': 'FieldTech-L2',
      'FieldTech-Lead': 'FieldTech-Lead',
      'Helpdesk-L1': 'Helpdesk-L1',
      'Helpdesk-L2': 'Helpdesk-L2',
      'Third Party': '3rd Party'
    }
    
    const colors = {
      'FieldTech-L1': 'red',
      'FieldTech-L2': 'orange',
      'FieldTech-Lead': 'lightgreen',
      'Helpdesk-L1': 'yellow',
      'Helpdesk-L2': 'lightblue',
      'Third Party': 'blue',
    };
    
    const stackStrategy = {
      stack: 'total',
      area: true,
      stackOffset: 'none', // To stack 0 on top of others
    };
    
    const customize = {
      height: graphHeight - 50,
      legend: { hidden: true },
      margin: { top: 20, bottom: 20 },
      stackingOrder: 'descending',
    };

   //#endregion


   return (
      <>
      {console.log(props.unassignedTicketCount)}
         <div className='m-auto md:p6 grid grid-cols-12 gap-4 px-6 lg:px-20 pt-5 '>

            {/* OPEN TICKETS */}
            <div className='col-span-6 sm:col-span-4 lg:col-span-2 row-span-1 mt-4'>
               <Card className={`justify-center h-full ${props.openTicketsCount > 0 ? 'hover:bg-gray-200 hover:cursor-pointer' : ''}`} onClick={() => 
                     {                     
                        if(props.openTicketsCount  > 0)
                        {
                           toggleModal({
                              open: true,
                              module: 'open_tickets_window',
                              title: 'Open Tickets' ,
                              content: <TicketListModal 
                                 data = {props.filteredDataArr.filter(ticket => ticket.status === 'Open')}
                              />,
                              data:setDataToDownload(props.filteredDataArr.filter(ticket => ticket.status === 'Open')),
                              hasExtraction: true
                           })
                        }
                     }
                  }>
                     <Typography variant='subtitle2' className='pt-4 pl-4'>Open Tickets</Typography>
                     <Typography variant='h5' className='mt-3 pb-4 pl-4 font-semibold font-sans'>
                        {props.openTicketsCount !== null ? props.openTicketsCount  : 'no data'}
                     </Typography>
               </Card>
            </div>

            {/* OVERDUE TICKETS */}
            <div className='col-span-6 sm:col-span-4 lg:col-span-2 row-span-1 mt-4'>
               <Card className={`justify-center h-full  ${props.overdueTicketCount > 0 ? ' bg-red-100 hover:bg-red-500 hover:text-gray-200 hover:cursor-pointer' : ''}`} 
               onClick={() => 
                     {
                        if(props.overdueTicketCount > 0)
                        {
                           toggleModal({
                              open: true,
                              module: 'overdue_tickets_window',
                              title: 'Tickets Beyond SLA' ,
                              content: <TicketListModal 
                                 data = {props.overdueTicketsArr}
                              />,
                              data:setDataToDownload(props.overdueTicketsArr),
                              hasExtraction: true
                           })
                        }
                     }
                  }>
                  <div className='relative flex justify-between' >
                     <Typography variant='subtitle2' className='pt-4 pl-4'>Overdue Tickets</Typography>
                     <PriorityHighIcon className={`${props.overdueTicketCount > 0 ? '' : 'hidden'} text-red-800 mt-4 mr-4`}/>
                  </div>
                  <Typography variant='h5' className=' mt-3 pb-4 pl-4 font-semibold font-sans'>
                     {props.overdueTicketCount !== null ? props.overdueTicketCount : 'no data'}
                  </Typography>
               </Card>
            </div>

            {/* RESOLVED TICKETS */}
            <div className='col-span-6 sm:col-span-4 lg:col-span-2 row-span-1 mt-4'>
               <Card className={`justify-center h-full ${props.resolvedTicketsCount > 0 ? 'hover:bg-gray-200 hover:cursor-pointer' : ''}`} onClick={() => 
                  {                     
                     if(props.resolvedTicketsCount  > 0)
                     {
                        toggleModal({
                           open: true,
                           module: 'resolved_tickets_window',
                           title: 'Resolved Tickets' ,
                           content: <TicketListModal 
                              data = {props.resolvedTicketsArr}
                           />,
                           data:setDataToDownload(props.resolvedTicketsArr),
                           hasExtraction: true
                        })
                     }
                  }
               }>           
                  <Typography variant='subtitle2' className='pt-4 pl-4'>Resolved Tickets</Typography>
                  <Typography variant='h5' className='mt-3 pb-4 pl-4 font-semibold font-sans'>
                     {props.resolvedTicketsCount !== null ? props.resolvedTicketsCount : 'no data'}
                  </Typography> 
               </Card>
            </div>

            {/* CLOSED TICKETS */}
            <div className='col-span-6 sm:col-span-4 lg:col-span-2 row-span-1 mt-4'>
               <Card className={`justify-center h-full ${props.closedTicketsCount > 0 ? 'hover:bg-gray-200 hover:cursor-pointer' : ''}`} onClick={() => 
                  {                     
                     if(props.closedTicketsCount  > 0)
                     {
                        toggleModal({
                           open: true,
                           module: 'closed_tickets_window',
                           title: 'Closed Tickets' ,
                           content: <TicketListModal 
                              data = {props.closedTicketsArr}
                           />,
                           data:setDataToDownload(props.closedTicketsArr),
                           hasExtraction: true
                        })
                     }
                  }
               }>
                  <Typography variant='subtitle2' className='pt-4 pl-4'>Closed Tickets</Typography>
                  <Typography variant='h5' className='mt-3 pb-4 pl-4 font-semibold font-sans'>
                     {props.closedTicketsCount !== null ? props.closedTicketsCount : 'no data'}
                  </Typography>
               </Card>
            </div>

            {/* UNASSIGNED TICKETS */}
            <div className='col-span-6 sm:col-span-4 lg:col-span-2 row-span-1 mt-4'>
               <Card className={`justify-center h-full ${props.unassignedTicketCount > 0 ? 'hover:bg-gray-200 hover:cursor-pointer' : ''}`} onClick={() => 
                  {                     
                     if(props.unassignedTicketCount > 0)
                     {
                        toggleModal({
                           open: true,
                           module: 'unassigned_tickets_window',
                           title: 'Unassigned Tickets' ,
                           content: <TicketListModal 
                              data = {props.unassignedTicketArr}
                           />,
                           data:setDataToDownload(props.unassignedTicketArr),
                           hasExtraction: true
                        })
                     }
                  }
               }>
                  <Typography variant='subtitle2' className='pt-4 pl-4'>Unassigned Tickets</Typography>
                  <Typography variant='h5' className='mt-3 pb-4 pl-4 font-semibold font-sans'>
                     {props.unassignedTicketCount !== null ? props.unassignedTicketCount : 'no data'}
                  </Typography>
               </Card>
            </div>

            {/* Ticket Count */}
            <div className='col-span-6 sm:col-span-4 lg:col-span-2 row-span-1 mt-4'>
               <Card className={`justify-center h-full ${props.totalFiltered > 0 ? 'hover:bg-gray-200 hover:cursor-pointer' : ''}`} 
                  onClick={() => 
                     {                     
                        if(props.totalFiltered  > 0)
                        {
                           toggleModal({
                              open: true,
                              module: 'filtereddata_TicketWindow',
                              title: 'Ticket Count' ,
                              content: <TicketListModal 
                                 data = {props.filteredDataArr}
                              />,
                              data:setDataToDownload(props.filteredDataArr),
                              hasExtraction: true
                           })
                        }
                     }
                  }>
                  <Typography variant='subtitle2' className='pt-4 pl-4'>Total Tickets</Typography>
                  <Typography variant='h5' className='mt-3 pb-4 pl-4 font-semibold font-sans'>
                     {props.totalFiltered !== null ? props.totalFiltered : 'no data'}
                  </Typography>
               </Card>
            </div>


            {/* PRIOLEVEL [donutchart]*/}
            <div className='  col-span-12 sm:col-span-6 xl:col-span-3 sm:row-span-1 h-full'>
               <Card className='justify-center h-full w-full p-4' >
                  <div className='relative flex justify-between '>
                     <Typography variant='subtitle2' className='pl-2 pt-2'>Priority</Typography>
                     <Tooltip placement='top' title='more options'>
                        <IconButton 
                           id="prio-button"
                           onClick={handleClick}>
                           <MoreVertIcon fontSize='small'/>
                        </IconButton>
                     </Tooltip>
                     <Menu
                           id='prio-more-menu'
                           anchorEl={anchorEl}
                           open={open && menuID === 'prio-button'}
                           onClose={handleClose}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                           }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                           }}
                        >
                        <MenuItem className='text-sm' value='open_date' onClick={() => {setNewPrioData('open-ticket')}}>view by open tickets</MenuItem>
                        <MenuItem className='text-sm' value='summary' onClick={() => {setNewPrioData('summary')}}>view by summary</MenuItem>
                     </Menu>
                  </div>
                  {props.prioArr ? ( props.filteredDataArr.length > 0 ? 
                  <PieChart 
                     series={
                        [{
                           
                           data:prioData ? prioData : props.prioArr,
                           innerRadius: 50,
                           outerRadius: 85,
                        }]
                     }
                     colors = {priorityColorCodes}
                     height={graphHeight}
                     margin={{ bottom: 100, left: 5, right: 5, top: 0 }}
                     onClick={(v,e,i) => {
                        toggleModal({
                           open: true,
                           module: 'open_PrioWindow',
                           title: i.label,
                           content: <TicketListModal
                              data = {prioDataArr.filter(ticket => ticket.priority === i.label)}
                           />,
                           data: setDataToDownload(prioDataArr.filter(ticket => ticket.priority === i.label)),
                           hasExtraction: true
                        })
                        
                     }} 
                     skipAnimation={false}
                     slotProps={{
                        legend: {
                           direction: 'row',
                           position: {
                              vertical: 'bottom', 
                              horizonatl: 'middle'
                           },
                           padding: 2,
                           itemMarkWidth: 8,
                           itemMarkHeight: 8,
                           labelStyle: {
                              fontSize: 14,
                           },
                           
                        },
                        
                        
                     }}
                  >
                     <DonutCenterLabel>{props.totalFiltered > 0 ? centerPrioLabel : donutCenterLabelText}</DonutCenterLabel>
                  </PieChart> 
                  : 
                  <div className='justify-center text-center items-center w-full h-full'>
                     no data available
                  </div>
                  )
                  :
                  <div className='flex flex-col gap-18 justify-center text-center items-center w-full h-full'>
                     <Skeleton variant="circular" width={130} height={130}/>
                     <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }}/>
                     <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }}/>
                  </div>
                  }
               </Card>
            </div>
            
            {/* TELE TROUBLESHOOT [donutchart]*/}
            <div className=' col-span-12 sm:col-span-6 xl:col-span-3 sm:row-span-1 h-full'>
               <Card className='justify-center h-full w-full p-4'  >
                  <Typography variant='subtitle2' className='pl-2 pt-2'>Tele Troubleshoot</Typography>
                  { props.troubleShootArr ? 
                     (props.filteredDataArr.length > 0 ? 
                     <PieChart 
                        series={
                           [{
                              
                              data: props.troubleShootArr,
                              innerRadius: 50,
                              outerRadius: 85,
                              valueFormatter: valueFormat
                           }]
                        }
                        colors = {ttsColors}
                        height={graphHeight}
                        margin={{ bottom: 80, left: 5, right: 5, top: 0 }}
                        onClick={(v,e,i) => {
                           toggleModal({
                              open: true,
                              module: 'open_TeletsWindow',
                              title: i.label,
                              content: <TicketListModal
                                 data = {props.filteredDataArr.filter(ticket => ticket.tele_ts === i.label)}
                              />,
                              data: setDataToDownload(props.filteredDataArr.filter(ticket => ticket.tele_ts === i.label)),
                              hasExtraction: true
                           })
                           
                        }} 
                        slotProps={{
                           legend: {
                              direction: 'row',
                              position: {
                                 vertical: 'bottom', 
                                 horizonatl: 'middle'
                              },
                              padding: 2,
                              itemMarkWidth: 8,
                              itemMarkHeight: 8,
                              labelStyle: {
                                 fontSize: 14,
                              },
                              
                           },
                        }}

                     >
                        <DonutCenterLabel>{donutCenterLabelText}</DonutCenterLabel>
                     </PieChart>
                  :
                  <div className='flex justify-center text-center items-center w-full h-full'>
                     No Data available
                  </div>)
                  :
                  <div className='flex flex-col gap-18 justify-center text-center items-center w-full h-full'>
                     <Skeleton variant="circular" width={130} height={130}/>
                     <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }}/>
                     <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }}/>
                  </div>
                  }
                  
               </Card>
            </div> 

            {/* CATEGORY [stacked barchart]*/}
            <div className='col-span-12  sm:col-span-6 md:col-span-6 sm:row-span-1 h-full'>
               <Card className='justify-center flex flex-col h-full p-4'  >
               <div className='relative flex justify-between '>
                  <Typography variant='subtitle2' className='pt-2 pl-2'>Category</Typography>
                  <Tooltip placement='top' title='more options'>
                     <IconButton 
                        className=''
                        aria-label="more"
                        id="category-button"
                        onClick={handleClick}>
                        <MoreVertIcon fontSize='small'/>
                     </IconButton>
                  </Tooltip>
                  <Menu
                     id='category-more-menu'
                     anchorEl={anchorEl}
                     open={open && menuID === 'category-button'}
                     onClose={handleClose}
                     anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                     // MenuListProps={{
                     //    'aria-labelledby': 'basic-button',
                     //    }}
                     >
                     <MenuItem className='text-sm' value='within_SLA' onClick={() => {
                        handleClose()
                        toggleModal({
                           open: true,
                           module: 'beyond_sla_window',
                           title: 'Beyond SLA' ,
                           content: <FilterTable 
                              tableColumns={DATATABLE_CATEGORY_COLUMNS}
                              data={props.beyondSLATicketArr}
                              typeKey={'category'}
                           />
                        })                          
                     }}>view beyond SLA</MenuItem>
                     <MenuItem className='text-sm' value='within_SLA' onClick={() => {
                        handleClose()
                        toggleModal({
                           open: true,
                           module: 'within_sla_window',
                           title: 'Within SLA' ,
                           content: <FilterTable 
                              tableColumns={DATATABLE_CATEGORY_COLUMNS}
                              data={props.withinSLATicketArr}
                              typeKey={'category'}
                           />
                        })
                     }}>view within SLA</MenuItem>
                     <MenuItem className='text-sm' value='view_more' onClick={() => {
                        handleClose()
                        toggleModal({
                           open: true,
                           module: 'category_window',
                           title: 'Category' ,
                           content: <FilterTable 
                              tableColumns={DATATABLE_CATEGORY_COLUMNS}
                              data={props.filteredDataArr}
                              typeKey={'category'}
                           />
                        })
                     }}>view more</MenuItem>
                     </Menu>
               </div>
               {
                  props.categoryArr ? 
                  (props.filteredDataArr.length > 0 ? 
                  <BarChart 
                     dataset={props.categoryArr}
                     series={[
                        {
                           dataKey: 'within_SLA',
                           label: 'Within SLA',
                           stack: 'Total',
                           color: '#3177CB'
                        },
                        {
                           dataKey: 'beyond_SLA',
                           label: 'Beyond SLA',
                           stack: 'Total',
                           color: '#E22323'
                        },
                     ]}
                     layout='horizontal'
                     height={graphHeight}
                     margin={{ bottom: 60, left: 100, right: 50, top: 60 }}
                     yAxis={[
                        {
                           id: 'leftAxisLabel',
                           dataKey: 'category',
                           scaleType: 'band'
                        },
                        
                     ]}
                     slotProps={{
                        legend: {
                           direction: 'row',
                           position: {
                              vertical: 'top', 
                              horizonatl: 'middle'
                           },
                           padding: 2,
                           itemMarkWidth: 8,
                           itemMarkHeight: 8,
                           labelStyle: {
                              fontSize: 14,
                           },
                           
                        },
                     }}

                  />
                  : 
                  <div className='justify-center text-center items-center w-full h-full'>
                     no data available
                  </div>
                  )
                  :
                  <div className='justify-center text-center items-center w-full h-full p-4'>
                     <Skeleton className='m-4 w-full' variant="rounded" width={500} height={250}/>
                  </div>
               }
               </Card>
            </div>

            {/* SHOPS [Table]*/}
            <div className='col-span-12 sm:col-span-6 md:col-span-6 xl:col-span-3 sm:row-span-1 h-full'>
               <Card className="h-full flex flex-col p-4"  >
                  <div className='relative flex justify-between'>
                     <Typography variant='subtitle2' className='pt-2 pl-2'>Shops</Typography>
                     <Tooltip placement='top' title='more options'>
                        <IconButton 
                           className='m-0'
                           aria-label="more"
                           id="shops-button"
                           // aria-controls={open ? 'long-menu' : undefined}
                           // aria-expanded={open ? 'true' : undefined}
                           // aria-haspopup="true"
                           onClick={handleClick}>
                           <MoreVertIcon fontSize='small'/>
                        </IconButton>
                     </Tooltip>
                     <Menu
                           id='shops-more-menu'
                           anchorEl={anchorEl}
                           open={open && menuID === 'shops-button'}
                           onClose={handleClose}
                           // MenuListProps={{
                           //    'aria-labelledby': 'basic-button',
                           //  }}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                        >
                        <MenuItem className='text-sm' value='view_more' onClick={() => {
                           handleClose()
                           toggleModal({
                              open: true,
                              module: 'shops_ticket_window',
                              title: 'Shops Ticket Count' ,
                              content: <Shops_content 
                                 shopsArr = {props.shopsArr}
                                 shopsLocArr = {props.shopsLocArr}
                              />,
                              data:props.shopsLocArr,
                              hasExtraction: true 
                           })
                        }}>view more</MenuItem>
                     </Menu>
                  </div>
                  <TableContainer sx={{ width: 'auto', margin: 2 }}>
                     <Table className='p-4'>
                        <TableHead>
                           <TableRow>
                              <TableCell className='font-semibold'>Shop Name</TableCell>
                              <TableCell align='center' className='font-semibold'>Total Tickets</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                        {previewShopsArr.map((item, index) => (
                           <TableRow key={index}>
                              <TableCell className='text-xs'>{item.shop_name}</TableCell>
                              <TableCell align='center' className='text-xs'>{item.total_shop}</TableCell>
                           </TableRow>
                        ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Card>                               
            </div>

            {/* TRANSACTION TYPE [barchart]*/}
            <div className='col-span-12 sm:col-span-6 md:col-span-6 xl:col-span-3 sm:row-span-1 h-full'>
               <Card className='justify-center items-start h-full p-4'  >
               <div className='relative flex justify-between '>
                  <Typography variant='subtitle2' className='pl-2 pt-2'>Transaction Type</Typography>
                  <Tooltip placement='top' title='more options'>
                     <IconButton 
                        className=''
                        aria-label="more"
                        id="ticket-type-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}>
                        <MoreVertIcon fontSize='small'/>
                     </IconButton>
                  </Tooltip>
                  <Menu
                        id='prio-more-menu'
                        anchorEl={anchorEl}
                        open={open && menuID === 'ticket-type-button'}
                        onClose={handleClose}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'left',
                           }}
                           transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                           }}
                        >
                     <MenuItem className='text-sm' value='view_more' onClick={() => {
                        handleClose()
                        toggleModal({
                           open: true,
                           module: 'shops_ticket_window',
                           title: 'Transaction Type' ,
                           content: <FilterTable 
                              tableColumns={DATATABLE_TRANSACTION_TYPE_COLUMNS}
                              data={props.filteredDataArr}
                              typeKey={'transaction-type'}
                           />
                        })
                     }}>view more</MenuItem>
                  </Menu>
               </div>
                  {props.transactionTypeArr ? 
                     (props.filteredDataArr.length > 0?
                     <BarChart 
                        className='justify-center'
                        dataset={props.transactionTypeArr}
                        series={[
                           {
                              dataKey: 'value',
                              label: 'total',
                              color: '#3177CB',
                           },
                        ]}
                        height={graphHeight}
                        xAxis={[
                           {
                              id: 'bottomAxisLabel',
                              dataKey: 'label',
                              scaleType: 'band',
                           }
                        ]}
                        
                        bottomAxis={{
                           axisId: 'bottomAxisLabel',
                           disableTicks: true,
                        }}
                        slotProps={{ 
                           legend: 
                           { 
                              hidden: true 
                           },
                        }}
                        sx={{
                           '& .MuiChartsAxis-directionX': {
                              '& .MuiChartsAxis-tickLabel': {
                                 rotate: '15deg',
                                 textAnchor: 'start',
                              }
                           },
                           fontSize: .5
                        }}
                     /> 
                     :
                     <div className='flex justify-center items-center h-full'>
                        Loading...
                     </div>)
                     :
                     <div className='flex flex-col gap-18 p-4 justify-center text-center items-center w-full h-full'>
                        <Skeleton variant="rounded" width={200} height={300}/>
                     </div>
                  }
               </Card>
            </div>

            {/* ACTIVE ORG [barchart]*/}
            <div className='col-span-12 sm:col-span-6 md:col-span-6 sm:row-span-1 h-full'>
               <Card className='justify-center items-center h-full p-4'  >
                  <div className='relative flex justify-between '>
                     <Typography variant='subtitle2' className='pt-2 pl-2'>Active Org</Typography>
                     <Tooltip placement='top' title='more options'>
                        <IconButton 
                           id="active-org-button"
                           // aria-controls={open ? 'active-org-more-menu' : undefined}
                           // aria-expanded={open ? 'true' : undefined}
                           //aria-haspopup="true"
                           onClick={handleClick}>
                           <MoreVertIcon fontSize='small'/>
                        </IconButton>
                     </Tooltip>
                     <Menu
                           id='active-org-more-menu'
                           anchorEl={anchorEl}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                           open={open && menuID === 'active-org-button'}
                           onClose={handleClose}
                           // MenuListProps={{
                           //    'aria-labelledby': 'active-org-button',
                           //  }}
                        >
                        <MenuItem className='text-sm' value='test' onClick={() => {
                           handleClose()
                           toggleModal({
                              open: true,
                              module: 'active_org_window',
                              title: 'Active Org' ,
                              content: <FilterTable 
                                 tableColumns={DATATABLE_ACTIVE_ORG_COLUMNS}
                                 data={props.filteredDataArr}
                                 typeKey={'active-org'}
                              />
                           })
                        }}>View More</MenuItem>
                     </Menu>
                  </div>
                  {props.activeOrgArr ? (              
                     props.filteredDataArr.length > 0 ? 
                     <BarChart 
                        className='justify-center'
                        dataset={props.activeOrgArr}
                        series={[
                           {
                              dataKey: 'count',
                              label: 'Ticket Count',
                              color: '#3177CB'
                           }
                        ]}
                        layout='horizontal'
                        height={graphHeight}
                        margin={{ bottom: 60, left: 100, right: 50, top: 60 }}
                        yAxis={[
                           {
                              id: 'leftAxisLabel',
                              dataKey: 'active_org',
                              scaleType: 'band'
                           },
                           
                        ]}
                        slotProps={{
                           legend: {
                              direction: 'row',
                              position: {
                                 vertical: 'top', 
                                 horizonatl: 'middle'
                              },
                              padding: 2,
                              itemMarkWidth: 8,
                              itemMarkHeight: 8,
                              labelStyle: {
                                 fontSize: 14,
                              },
                              
                           },
                        }}

                     />
                     :
                     <div className='justify-center text-center items-center w-full h-full'>
                        no data available
                     </div>
                  ) 
                  : 
                  
                  <div className='flex flex-col gap-20 p-4 justify-center text-center items-center w-full h-full'>
                     <Skeleton variant="rounded" width={600} height={200}/>
                  </div>
                  }
               </Card>
            </div>

            {/* CLUSTER */}
            <div className='col-span-12 sm:col-span-6 xl:col-span-3 sm:row-span-1 h-full'>
               <Card className='relative h-full p-4 '>
                  <Typography variant='subtitle2'>Cluster</Typography>
                  <div className='h-full mt-10'>
                     <div className='grid grid-cols-2'>
                        <div className=' border-b-[1px] border-r-[1px] p-2 grid grid-cols-1'>
                           <span className='text-center text-sm text-gray-700'>Central</span>
                           <span className='text-center text-md font-bold text-gray-900'>
                              <Link href={"#"} className={`${props.clusterArr[1]?.Total > 0 ? 'hover:text-blue-600' : ''}`}
                                 onClick={(v) => {
                                    if(props.clusterArr[1].Total  > 0)
                                    {
                                       toggleModal({
                                          open: true,
                                          module: 'open_CentralTicketWindow',
                                          title: props.clusterArr[1].cluster ,
                                          content: <TicketListModal 
                                             data = {props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[1].cluster)}
                                          />,
                                          data:setDataToDownload(props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[1].cluster)),
                                          hasExtraction: true
                                       })
                                    }
                                 }}>
                                 {props.clusterArr.length > 0 ? props.clusterArr[1].Total : '-'}
                              </Link>
                           </span>
                        </div>
                        <div className='border-b-[1px] border-l-[1px] p-2 grid grid-cols-1'>
                           <span className='text-center text-sm text-gray-700'>All Branches</span>
                           <span className='text-center text-md font-bold  text-gray-900'>
                              <Link href={"#"} className={`${ props.allBranchesCount ? 'hover:text-blue-600' : ''}`}
                                 onClick={(v) => {
                                    if(props.clusterArr[2].Total > 0)
                                    {
                                       toggleModal({
                                          open: true,
                                          module: 'open_SouthTicketWindow',
                                          title: 'All Branches',
                                          content: <TicketListModal 
                                             data = {props.filteredDataArr.filter(ticket => ticket.area_location === 'All Branches')}
                                          />,
                                          data:setDataToDownload(props.filteredDataArr.filter(ticket => ticket.area_location === 'All Branches')),
                                          hasExtraction: true
                                       })
                                    }
                                 }}>
                              {props.allBranchesCount ? props.allBranchesCount.all_branches : '-'}
                              </Link>
                           </span>
                        </div>
                     </div>
                     <div className='grid grid-cols-2'>
                        <div className='border-b-[1px] border-r-[1px] p-2 grid grid-cols-1'>
                           <span className='text-center text-sm text-gray-700'>South</span>
                           <span className='text-center text-md font-bold  text-gray-900'>
                              <Link href={"#"} className={`${ props.clusterArr[2]?.Total > 0 ? 'hover:text-blue-600' : ''}`}
                                 onClick={(v) => {
                                    if(props.clusterArr[2].Total > 0)
                                    {
                                       toggleModal({
                                          open: true,
                                          module: 'open_SouthTicketWindow',
                                          title: props.clusterArr[2].cluster,
                                          content: <TicketListModal 
                                             data = {props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[2].cluster || ticket.cluster === null)}
                                          />,
                                          data:setDataToDownload(props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[2].cluster || ticket.cluster === null)),
                                          hasExtraction: true
                                       })
                                    }
                                 }}>
                              {props.clusterArr.length > 0 ? props.clusterArr[2].Total : '-'}
                              </Link>
                           </span>
                        </div>
                        <div className='border-b-[1px] border-l-[1px] p-2 grid grid-cols-1'>
                           <span className='text-center text-sm text-gray-700'>North</span>
                           <span className='text-center text-md font-bold  text-gray-900'>
                              <Link href={"#"} className={`${ props.clusterArr[0]?.Total > 0 ? 'hover:text-blue-600' : ''}`} 
                                 onClick={(v) => {
                                 if(props.clusterArr[0].Total > 0)
                                    {
                                       toggleModal({
                                          open: true,
                                          module: 'open_NorthTicketWindow',
                                          title: props.clusterArr[0].cluster,
                                          content: <TicketListModal 
                                             data = {props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[0].cluster)}
                                          />,
                                          data:setDataToDownload(props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[0].cluster)),
                                          hasExtraction: true
                                       })
                                    }
                                 }}>
                              { props.clusterArr.length > 0 ? props.clusterArr[0].Total : '-'}
                              </Link>
                           </span>
                        </div>
                     </div>
                     <div className='grid grid-cols-2'>
                        <div className='border-t-[1px] border-r-[1px] p-2 grid grid-cols-1'>
                           <span className='text-center text-sm text-gray-700'>Baguio</span>
                           <span className='text-center text-md font-bold  text-gray-900'>
                              <Link href={"#"} className={`${props.clusterArr[4]?.Total > 0 ? 'hover:text-blue-600' : ''}`}
                                 onClick={(v) => {
                                    if(props.clusterArr[4].Total > 0)
                                    {
                                       toggleModal({
                                          open: true,
                                          module: 'open_BaguioTicketWindow',
                                          title: props.clusterArr[4].cluster ,
                                          content: <TicketListModal 
                                             data = {props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[4].cluster)}
                                          />,
                                          data:setDataToDownload(props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[4].cluster )),
                                          hasExtraction: true
                                          
                                       })
                                    }
                                 }}>
                                 {props.clusterArr.length > 0 ? props.clusterArr[4].Total : '-'}
                              </Link>
                           </span>
                        </div>
                        <div className='relative border-t-[1px] border-l-[1px] p-2 grid grid-cols-1'>
                           <span className='text-center text-sm text-gray-700'>Rizal</span>
                           <span className={`text-center text-md font-bold  text-gray-900`}>
                              <Link href={"#"} className={`${props.clusterArr[3]?.Total > 0 ? 'hover:text-blue-600': ''}`}
                                 onClick={(v) => {
                                    if(props.clusterArr[3].Total > 0)
                                    {
                                       toggleModal({
                                          open: true,
                                          module: 'open_RizalTicketWindow',
                                          title: props.clusterArr[3].cluster ,
                                          content: <TicketListModal 
                                             data = {props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[3].cluster )}
                                          />,
                                          data: setDataToDownload(props.filteredDataArr.filter(ticket => ticket.cluster === props.clusterArr[3].cluster )),
                                          hasExtraction: true
                                       })
                                    }
                                 }}>
                                 { props.clusterArr.length > 0 ? props.clusterArr[3].Total : '-'}
                              </Link>
                           </span>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>

            {/* PLATFORM [piemaypie]*/}
            <div className=' col-span-12 sm:col-span-6 xl:col-span-3 sm:row-span-1 h-full'>
               <Card className='justify-center h-full w-full p-4'  >
                  <Typography variant='subtitle2' className='pl-2 pt-2'>Platform</Typography>
                  { props.platformArr ?
                  (props.filteredDataArr.length > 0 ?  
                  <PieChart 
                     series= {[
                        {
                           outerRadius: 90,
                           startAngle: -90,
                           endAngle: 90,
                           data: props.platformArr,
                           cornerRadius: 6
                        },
                     ]}
                     height={graphHeight}
                     margin={{ bottom: 0, left: 5, right: 5, top: 0 }}
                     onClick={ (v, e, i) => 
                     {
                        if (i !== null)
                        {
                           toggleModal({
                              open: true,
                              module: 'open_PlatformsWindow',
                              title: i.label,
                              content: <TicketListModal
                                 data = {props.filteredDataArr.filter(ticket => ticket.platform === i.label)}
                              />,
                              data: setDataToDownload(props.filteredDataArr.filter(ticket => ticket.platform === i.label)),
                              hasExtraction: true
                           })
                        }
                     }}
                     slotProps={{
                        legend: {
                           direction: 'row',
                           position: {
                              vertical: 'bottom', 
                              horizonatl: 'middle'},
                           padding: 2,
                           itemMarkWidth: 8,
                           itemMarkHeight: 8,
                           labelStyle: {
                              fontSize: 14,
                              },
                        },                           
                     }}
                  > 
                     
                  </PieChart>
                  :
                  <div className='flex justify-center items-center h-full'>
                     Loading...
                  </div>)
                  :
                  <div className='flex flex-col gap-18 justify-center text-center items-center w-full h-full'>
                     <Skeleton variant="circular" width={130} height={130}/>
                     <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }}/>
                     <Skeleton variant="text" width={200} sx={{ fontSize: '1rem' }}/>
                  </div>
                  }
               </Card>
            
            </div>

            {/* Monthly Tickets [table]*/}
            <div className=' col-span-12 md:col-span-6 sm:row-span-1 h-full'>
               <Card className='flex flex-col p-4 h-full'  >
                  <Typography variant='subtitle2' className='pl-2 pt-2'>Monthly Tickets</Typography>
                  <div>
                     <TableContainer sx={{ width: 'auto', margin: 2 }}> 
                        <Table className='p-4'>
                           <TableHead>
                              <TableRow>
                                 <TableCell></TableCell>
                                 {props.monthlyTableTickets.map((item, index) => (
                                    <TableCell key={index} align="center" className='text-center'>{item.month}</TableCell>
                                 ))}
                              </TableRow>
                           </TableHead>
                           <TableBody className='mt-8'>
                                 <TableRow>
                                    <TableCell className='text-left text-sm'>Total:</TableCell>
                                    {props.monthlyTableTickets.map((item, index) => (
                                       <TableCell key={index} className='text-center text-xs'>{item.monthlyTotal}</TableCell>
                                    ))}
                                 </TableRow>
                                 <TableRow>
                                 <TableCell className='text-left text-sm'>Open:</TableCell>
                                 {props.monthlyTableTickets.map((item, index) => (
                                    <TableCell key={index} className='text-center text-xs'>{item.Open}</TableCell>
                                 ))}
                                 </TableRow>
                                 <TableRow>
                                 <TableCell className='text-left text-sm'>Resolved:</TableCell>
                                 {props.monthlyTableTickets.map((item, index) => (
                                    <TableCell key={index} className='text-center text-xs'>{item.Resolved}</TableCell>
                                 ))}
                                 </TableRow>
                                 <TableRow>
                                 <TableCell className='text-left text-sm'>Closed:</TableCell>
                                 {props.monthlyTableTickets.map((item, index) => (
                                    <TableCell key={index} className='text-center text-xs'>{item.Closed}</TableCell>
                                 ))}
                                 </TableRow>
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </div>
               </Card>
            </div>

            {/* TECHNICIAN PERFORMANCE [table] */}
            <div className='md:col-span-6 col-span-12 sm:row-span-1 h-full'>
               <Card className="h-full flex flex-col p-4">
                  <div className='relative flex justify-between'>
                     <Typography variant='subtitle2' className='pl-4 pt-4'>Technician</Typography>
                     <Tooltip placement='top' title='more options'>
                        <IconButton 
                           className=''
                           aria-label="more"
                           id="tech-button"
                           aria-controls={open ? 'long-menu' : undefined}
                           aria-expanded={open ? 'true' : undefined}
                           aria-haspopup="true"
                           onClick={handleClick}>
                           <MoreVertIcon fontSize='small'/>
                        </IconButton>
                     </Tooltip>
                     <Menu
                           id='tech-more-menu'
                           anchorEl={anchorEl}
                           open={open && menuID === 'tech-button'}
                           onClose={handleClose}
                           // MenuListProps={{
                           //    'aria-labelledby': 'basic-button',
                           //  }}
                           anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                        >
                        <MenuItem className='text-sm' value='view_more' onClick={() => {
                           console.log('test')
                           handleClose()
                           toggleModal({
                              open: true,
                              module: 'techPerformance_window',
                              title: 'Tech Performance' ,
                              content: <TechPerformance_TicketList 
                                 data = {props.techPerformanceArr}
                              />,
                              data:props.techPerformanceArr,
                              hasExtraction: true
                           })
                        }}>view more</MenuItem>
                     </Menu>
                  </div>
                  {props.techPerformanceArr.length > 0 ?
                  <TableContainer sx={{ width: 'auto', margin: 2 }}>
                     <Table className='p-4'>
                        <TableHead>
                           <TableRow>
                              <TableCell align='left' className='font-semibold'>Name</TableCell>
                              <TableCell align='center' className='font-semibold'>Open</TableCell>
                              <TableCell align='center' className='font-semibold'>Closed</TableCell>
                              <TableCell align='center' className='font-semibold'>Resolved</TableCell>
                              <TableCell align='center' className='font-semibold'>Total</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {previewTechPerformanceTask.map((item, index) => (
                              <TableRow key={index}>
                                 <TableCell align='left' className='text-left text-xs'>{item.technician_name}</TableCell>
                                 <TableCell align='center' className='text-center text-xs'>{item.open_total}</TableCell>
                                 <TableCell align='center' className='text-center text-xs'>{item.closed_total}</TableCell>
                                 <TableCell align='center' className='text-center text-xs'>{item.resolved_total}</TableCell>
                                 <TableCell align='center' className='text-center text-xs'>{item.total}</TableCell>
                              </TableRow>
                              )) 
                           }               
                        </TableBody>
                     </Table> 
                  </TableContainer>          
                  :
                  <div className='flex justify-center items-center h-full'>
                     Loading...
                  </div>}                
               </Card>
            </div>

            {/* TICKET CREATOR [Table] */}
            <div className='col-span-12 sm:col-span-6 xl:col-span-4 sm:row-span-1 h-full'>
               <Card className="h-full flex flex-col p-4"  >
                  <Typography variant='subtitle2' className='pl-2 pt-2'>Recent Ticket Creator</Typography>
                  <TableContainer sx={{ width: 'auto', margin: 2 }}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell className='text-center font-semibold'>Ticket #</TableCell>
                              <TableCell className='font-semibold'>Name</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {props.ticketCreatorArr.map((user, index) => (
                              <TableRow key={index}>
                                 <TableCell className='text-center text-xs'>{user.ticket_id}</TableCell>
                                 <TableCell className=' text-xs'>{user.name}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Card>
            </div>
         </div>
         <div>
            <Dashboard_Modal
               modawlWindowTitle={modalInfo.title}
               closeButtonName={"Close"}
               formContent={modalInfo.content}
               modalInfo={modalInfo}
               toggleCallback={toggleCallback}

            />
         </div>
      </>
   )
}

export default Dashboard_content