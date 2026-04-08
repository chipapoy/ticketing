import moment from 'moment';


export const DATATABLE_COLUMNS = [
   {
      id: 'creation_date',
      name: 'Creation Date',
      selector: row => {
            const currentDate = moment().diff(row.open_date)
            const addedCurrentDate = moment(row.open_date).add(currentDate, 'milliseconds').format('MM/DD/YYYY HH:mm')
            const closedDate = moment(row.closed_date).diff(row.open_date)
            console.log(addedCurrentDate)
            return (
               row.closed_date === null ? addedCurrentDate : 
                                          moment(row.open_date).add(row.durationHour, 'hours').format('MM/DD/YYYY HH:mm')
            )
         },
      wrap:true,
      minWidth: '15rem',
      center: true,
   },
   {
      id: 'open_date',
      name: 'Open Date',
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Ticket Creator',
      sortable: true,
      selector: row => row.username,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Requestor Name',
      sortable: true,
      selector: row => row.customer_name,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Contact Number',
      selector: row => row.contact_num,
      minWidth: '15rem'
   },
   {
      id: 'ticket_ID',
      name: 'Ticket ID',
      sortable: true,
      selector: row => row.id,
      minWidth:'15rem',
      style: {
         fontWeight: 800
      }
      
   },
   {
      id: 'classification',
      name: 'Class',
      sortable: true,
      selector: row => row.classification,
      minWidth: '15rem'
   },
   {
      name: 'Platform',
      selector: row => row.platform,
      minWidth: '15rem'
   },
   {
      name: 'Department',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.department : 'n/a',
      minWidth:'15rem'
   },
   {
      name: 'Dept. Section',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.section : 'n/a',
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'brand',
      name: 'Brand',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? 'Moplex' : row.shop_name,
      minWidth: '15rem'
   },
   {
      name: 'Location',
      selector: row => row.classification === 'Moplex' ? 'Karrivin Plaza': row.area_location,
      wrap: true,
      minWidth: '15rem'
   },
   {
      id: 'ticket type',
      name: 'Ticket Type',
      sortable: true,
      selector: row => row.ticket_type,
      wrap: true,
      minWidth: '20rem'
   },
   {
      id: 'category',
      name: 'Category',
      sortable: true,
      selector: row => row.category,
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'sub_category',
      name: 'Sub Category',
      sortable: true,
      selector: row => row.sub_category,
      wrap:true,
      minWidth: '25rem'
   },
   {
      id: 'priority',
      name: 'Priority Level',
      sortable: true,
      selector: row => row.priority,
      minWidth: '15rem'
   },
   {
      name: 'Tele Troubleshoot',
      selector: row => row.tele_ts,
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'status',
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      format: row => {
      const statusColor = {
         "Open": "text-red-500",
         "Closed": "text-green-500",
         "Resolved": "text-[#FFA500]"
      }

         return (
            <span className={`${statusColor[row.status]} font-semibold`}>{row.status}</span>
         )
      },
      minWidth: '15rem'

   },
   {
      name: "Assigned Tech",
      selector: row=> row.technician_name ? row.technician_name : 'Unassigned Technician',
      minWidth: '15rem',
      wrap:true
   },
   {
      name: "Active Org",
      sortable: true,
      selector: row => row.active_org,
      minWidth: '15rem'
   },
   {
      name: "Spec Req",
      selector: row => row.spec_request,
      minWidth: '15rem'
   },
   {
      name: 'Resolution',
      selector: row => row.resolution,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Work Note',
      selector: row => row.work_notes,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Tagging',
      selector: row => row.tagging === null ? 'untagged' : row.tagging,
      minWidth:'20rem'
   },
   {
      name: 'Assigned Tech Date',
      selector: row => row.assigned_date === null ? '' : moment(row.assigned_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem'
   },
   {
      name: 'Activity Start',
      selector: row => row.tech_start === null ? '': moment(row.tech_start).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Activity End',
      selector: row => row.tech_end === null ? '': moment(row.tech_end).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Date & Time Resolved', // D&T of resolved in TTS
      selector: row => row.tele_ts === 'Resolved - TTS' ?
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'',
         
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Unresolved', // D&T of unresolved in TTS
      selector: row => row.tele_ts === 'Unresolved - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time For Callback', // D&T for callback in TTS
      selector: row => row.tele_ts === 'For Callback - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time Open', // Timestamp of when it was put to Open
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Closed', //D&T 
      selector: row => row.closed_date === null ? '' : moment(row.closed_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Resolved',
      selector: row => row.status === 'Resolved' ? row.update_date === null ? 
      moment(row.added_date).format('MM/DD/YYYY HH:mm') 
      : 
      moment(row.update_date).format('MM/DD/YYYY HH:mm')
        : '', //? TO CHECK 
      wrap:true,
      minWidth: '17rem',
      center: true
   },
   {
      name: 'Date & Time incomplete',
      selector: row => row.tagging === 'Incomplete' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm'): '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time complete', // Timestamp of when it is complete
      selector: row => row.tagging === 'Completed' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time third party', // Timestamp of when it was processed to 3rd party
      selector: row => row.tagging === 'Assigned to Third Party' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Submit Date and Time', // D&T of when the new ticket has been submitted and sent to db
      selector: row => moment(row.added_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 1', 
      selector: row => row.active_org === 'Helpdesk-L1' ? moment(row.update_date === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 2', 
      selector: row => row.active_org === 'Helpdesk-L2' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT Lead ', 
      selector: row => row.active_org === 'FieldTech-Lead' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT L1', 
      selector: row => row.active_org === 'FieldTech-L1' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time FT L2', 
      selector: row => row.active_org === 'FieldTech-L2' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time third party ',
      selector: row => row.active_org === 'Third Party' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },

]

export const DATATABLE_CUSTOMSTYLES = {
   head: {
      style: {
         fontSize: '.9rem',
         fontWeight: 600,
      },
   },
   headCells: {
      style: {
         background: '#9B9B9B',
         color: '#FBFBFB',    
      }
   },
   expanderCell: {
      style: {
      flex: '0 0 20rem',
      },
   },
   cells: {
      style: {
      wordBreak: 'break-word',
      
      },
   },
}

export const DATATABLE_TRANSACTION_TYPE_COLUMNS = [
   {
      id: 'creation_date',
      name: 'Creation Date',
      selector: row => {
            const currentDate = moment().diff(row.open_date)
            const addedCurrentDate = moment(row.open_date).add(currentDate, 'milliseconds').format('MM/DD/YYYY HH:mm')
            const closedDate = moment(row.closed_date).diff(row.open_date)
            console.log(addedCurrentDate)
            return (
               row.closed_date === null ? addedCurrentDate : 
                                          moment(row.open_date).add(row.durationHour, 'hours').format('MM/DD/YYYY HH:mm')
            )
         },
      wrap:true,
      minWidth: '15rem',
      center: true,
   },
   {
      id: 'open_date',
      name: 'Open Date',
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'ticket_ID',
      name: 'Ticket ID',
      sortable: true,
      selector: row => row.id,
      minWidth:'15rem',
      style: {
         fontWeight: 800
      }
      
   },
   {
      id: 'ticket type',
      name: 'Ticket Type',
      sortable: true,
      selector: row => row.ticket_type,
      wrap: true,
      minWidth: '20rem'
   },
   {
      id: 'category',
      name: 'Category',
      sortable: true,
      selector: row => row.category,
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'sub_category',
      name: 'Sub Category',
      sortable: true,
      selector: row => row.sub_category,
      wrap:true,
      minWidth: '25rem'
   },
   {
      name: 'Ticket Creator',
      sortable: true,
      selector: row => row.username,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Requestor Name',
      sortable: true,
      selector: row => row.customer_name,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Contact Number',
      selector: row => row.contact_num,
      minWidth: '15rem'
   },
   {
      id: 'classification',
      name: 'Class',
      sortable: true,
      selector: row => row.classification,
      minWidth: '15rem'
   },
   {
      name: 'Platform',
      selector: row => row.platform,
      minWidth: '15rem'
   },
   {
      name: 'Department',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.department : 'n/a',
      minWidth:'15rem'
   },
   {
      name: 'Dept. Section',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.section : 'n/a',
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'brand',
      name: 'Brand',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? 'Moplex' : row.shop_name,
      minWidth: '15rem'
   },
   {
      name: 'Location',
      selector: row => row.classification === 'Moplex' ? 'Karrivin Plaza': row.area_location,
      wrap: true,
      minWidth: '15rem'
   },
   {
      id: 'priority',
      name: 'Priority Level',
      sortable: true,
      selector: row => row.priority,
      minWidth: '15rem'
   },
   {
      name: 'Tele Troubleshoot',
      selector: row => row.tele_ts,
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'status',
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      format: row => {
      const statusColor = {
         "Open": "text-red-500",
         "Closed": "text-blue-500",
         "Resolved": "text-green-500"
      }

         return (
            <span className={statusColor[row.status]}>{row.status}</span>
         )
      },
      minWidth: '15rem'

   },
   {
      name: "Assigned Tech",
      selector: row=> row.technician_name,
      minWidth: '15rem',
      wrap:true
   },
   {
      name: "Active Org",
      sortable: true,
      selector: row => row.active_org,
      minWidth: '15rem'
   },
   {
      name: "Spec Req",
      selector: row => row.spec_request,
      minWidth: '15rem'
   },
   {
      name: 'Resolution',
      selector: row => row.resolution,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Work Note',
      selector: row => row.work_notes,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Tagging',
      selector: row => row.tagging === null ? 'untagged' : row.tagging,
      minWidth:'20rem'
   },
   {
      name: 'Assigned Tech Date',
      selector: row => row.assigned_date === null ? '' : moment(row.assigned_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem'
   },
   {
      name: 'Activity Start',
      selector: row => row.tech_start === null ? '': moment(row.tech_start).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Activity End',
      selector: row => row.tech_end === null ? '': moment(row.tech_end).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Date & Time Resolved', // D&T of resolved in TTS
      selector: row => row.tele_ts === 'Resolved - TTS' ?
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'',
         
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Unresolved', // D&T of unresolved in TTS
      selector: row => row.tele_ts === 'Unresolved - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time For Callback', // D&T for callback in TTS
      selector: row => row.tele_ts === 'For Callback - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time Open', // Timestamp of when it was put to Open
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Closed', //D&T 
      selector: row => row.closed_date === null ? '' : moment(row.closed_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Resolved',
      selector: row => row.status === 'Resolved' ? row.update_date === null ? 
      moment(row.added_date).format('MM/DD/YYYY HH:mm') 
      : 
      moment(row.update_date).format('MM/DD/YYYY HH:mm')
        : '', //? TO CHECK 
      wrap:true,
      minWidth: '17rem',
      center: true
   },
   {
      name: 'Date & Time incomplete',
      selector: row => row.tagging === 'Incomplete' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm'): '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time complete', // Timestamp of when it is complete
      selector: row => row.tagging === 'Completed' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time third party', // Timestamp of when it was processed to 3rd party
      selector: row => row.tagging === 'Assigned to Third Party' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Submit Date and Time', // D&T of when the new ticket has been submitted and sent to db
      selector: row => moment(row.added_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 1', 
      selector: row => row.active_org === 'Helpdesk-L1' ? moment(row.update_date === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 2', 
      selector: row => row.active_org === 'Helpdesk-L2' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT Lead ', 
      selector: row => row.active_org === 'FieldTech-Lead' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT L1', 
      selector: row => row.active_org === 'FieldTech-L1' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time FT L2', 
      selector: row => row.active_org === 'FieldTech-L2' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time third party ',
      selector: row => row.active_org === 'Third Party' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },

]
export const DATATABLE_CATEGORY_COLUMNS = [
   {
      id: 'creation_date',
      name: 'Creation Date',
      selector: row => {
            const currentDate = moment().diff(row.open_date)
            const addedCurrentDate = moment(row.open_date).add(currentDate, 'milliseconds').format('MM/DD/YYYY HH:mm')
            const closedDate = moment(row.closed_date).diff(row.open_date)
            console.log(addedCurrentDate)
            return (
               row.closed_date === null ? addedCurrentDate : 
                                          moment(row.open_date).add(row.durationHour, 'hours').format('MM/DD/YYYY HH:mm')
            )
         },
      wrap:true,
      minWidth: '15rem',
      center: true,
   },
   {
      id: 'open_date',
      name: 'Open Date',
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'ticket_ID',
      name: 'Ticket ID',
      sortable: true,
      selector: row => row.id,
      minWidth:'15rem',
      style: {
         fontWeight: 800
      }
      
   },
   {
      id: 'ticket type',
      name: 'Ticket Type',
      sortable: true,
      selector: row => row.ticket_type,
      wrap: true,
      minWidth: '20rem'
   },
   {
      id: 'category',
      name: 'Category',
      sortable: true,
      selector: row => row.category,
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'sub_category',
      name: 'Sub Category',
      sortable: true,
      selector: row => row.sub_category,
      wrap:true,
      minWidth: '25rem'
   },
   {
      name: 'Ticket Creator',
      sortable: true,
      selector: row => row.username,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Requestor Name',
      sortable: true,
      selector: row => row.customer_name,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Contact Number',
      selector: row => row.contact_num,
      minWidth: '15rem'
   },
   {
      id: 'classification',
      name: 'Class',
      sortable: true,
      selector: row => row.classification,
      minWidth: '15rem'
   },
   {
      name: 'Platform',
      selector: row => row.platform,
      minWidth: '15rem'
   },
   {
      name: 'Department',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.department : 'n/a',
      minWidth:'15rem'
   },
   {
      name: 'Dept. Section',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.section : 'n/a',
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'brand',
      name: 'Brand',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? 'Moplex' : row.shop_name,
      minWidth: '15rem'
   },
   {
      name: 'Location',
      selector: row => row.classification === 'Moplex' ? 'Karrivin Plaza': row.area_location,
      wrap: true,
      minWidth: '15rem'
   },
   {
      id: 'priority',
      name: 'Priority Level',
      sortable: true,
      selector: row => row.priority,
      minWidth: '15rem'
   },
   {
      name: 'Tele Troubleshoot',
      selector: row => row.tele_ts,
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'status',
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      format: row => {
      const statusColor = {
         "Open": "text-red-500",
         "Closed": "text-blue-500",
         "Resolved": "text-green-500"
      }

         return (
            <span className={statusColor[row.status]}>{row.status}</span>
         )
      },
      minWidth: '15rem'

   },
   {
      name: "Assigned Tech",
      selector: row=> row.technician_name,
      minWidth: '15rem',
      wrap:true
   },
   {
      name: "Active Org",
      sortable: true,
      selector: row => row.active_org,
      minWidth: '15rem'
   },
   {
      name: "Spec Req",
      selector: row => row.spec_request,
      minWidth: '15rem'
   },
   {
      name: 'Resolution',
      selector: row => row.resolution,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Work Note',
      selector: row => row.work_notes,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Tagging',
      selector: row => row.tagging === null ? 'untagged' : row.tagging,
      minWidth:'20rem'
   },
   {
      name: 'Assigned Tech Date',
      selector: row => row.assigned_date === null ? '' : moment(row.assigned_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem'
   },
   {
      name: 'Activity Start',
      selector: row => row.tech_start === null ? '': moment(row.tech_start).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Activity End',
      selector: row => row.tech_end === null ? '': moment(row.tech_end).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Date & Time Resolved', // D&T of resolved in TTS
      selector: row => row.tele_ts === 'Resolved - TTS' ?
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'',
         
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Unresolved', // D&T of unresolved in TTS
      selector: row => row.tele_ts === 'Unresolved - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time For Callback', // D&T for callback in TTS
      selector: row => row.tele_ts === 'For Callback - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time Open', // Timestamp of when it was put to Open
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Closed', //D&T 
      selector: row => row.closed_date === null ? '' : moment(row.closed_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Resolved',
      selector: row => row.status === 'Resolved' ? row.update_date === null ? 
      moment(row.added_date).format('MM/DD/YYYY HH:mm') 
      : 
      moment(row.update_date).format('MM/DD/YYYY HH:mm')
        : '', //? TO CHECK 
      wrap:true,
      minWidth: '17rem',
      center: true
   },
   {
      name: 'Date & Time incomplete',
      selector: row => row.tagging === 'Incomplete' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm'): '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time complete', // Timestamp of when it is complete
      selector: row => row.tagging === 'Completed' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time third party', // Timestamp of when it was processed to 3rd party
      selector: row => row.tagging === 'Assigned to Third Party' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Submit Date and Time', // D&T of when the new ticket has been submitted and sent to db
      selector: row => moment(row.added_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 1', 
      selector: row => row.active_org === 'Helpdesk-L1' ? moment(row.update_date === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 2', 
      selector: row => row.active_org === 'Helpdesk-L2' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT Lead ', 
      selector: row => row.active_org === 'FieldTech-Lead' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT L1', 
      selector: row => row.active_org === 'FieldTech-L1' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time FT L2', 
      selector: row => row.active_org === 'FieldTech-L2' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time third party ',
      selector: row => row.active_org === 'Third Party' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },

]

export const DATATABLE_ACTIVE_ORG_COLUMNS = [
   {
      id: 'creation_date',
      name: 'Creation Date',
      selector: row => {
            const currentDate = moment().diff(row.open_date)
            const addedCurrentDate = moment(row.open_date).add(currentDate, 'milliseconds').format('MM/DD/YYYY HH:mm')
            const closedDate = moment(row.closed_date).diff(row.open_date)
            console.log(addedCurrentDate)
            return (
               row.closed_date === null ? addedCurrentDate : 
                                          moment(row.open_date).add(row.durationHour, 'hours').format('MM/DD/YYYY HH:mm')
            )
         },
      wrap:true,
      minWidth: '15rem',
      center: true,
   },
   {
      id: 'open_date',
      name: 'Open Date',
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'ticket_ID',
      name: 'Ticket ID',
      sortable: true,
      selector: row => row.id,
      minWidth:'15rem',
      style: {
         fontWeight: 800
      }
      
   },
   {
      name: "Active Org",
      sortable: true,
      selector: row => row.active_org,
      minWidth: '15rem'
   },
   {
      name: "Assigned Tech",
      selector: row=> row.technician_name,
      minWidth: '15rem',
      wrap:true
   },
   {
      id: 'ticket type',
      name: 'Ticket Type',
      sortable: true,
      selector: row => row.ticket_type,
      wrap: true,
      minWidth: '20rem'
   },
   {
      id: 'category',
      name: 'Category',
      sortable: true,
      selector: row => row.category,
      wrap:true,
      minWidth: '15rem'
   },
   {
      id: 'sub_category',
      name: 'Sub Category',
      sortable: true,
      selector: row => row.sub_category,
      wrap:true,
      minWidth: '25rem'
   },
   {
      name: 'Ticket Creator',
      sortable: true,
      selector: row => row.username,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Requestor Name',
      sortable: true,
      selector: row => row.customer_name,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Contact Number',
      selector: row => row.contact_num,
      minWidth: '15rem'
   },
   {
      id: 'classification',
      name: 'Class',
      sortable: true,
      selector: row => row.classification,
      minWidth: '15rem'
   },
   {
      name: 'Platform',
      selector: row => row.platform,
      minWidth: '15rem'
   },
   {
      name: 'Department',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.department : 'n/a',
      minWidth:'15rem'
   },
   {
      name: 'Dept. Section',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? row.section : 'n/a',
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'brand',
      name: 'Brand',
      sortable: true,
      selector: row => row.classification === 'Moplex' ? 'Moplex' : row.shop_name,
      minWidth: '15rem'
   },
   {
      name: 'Location',
      selector: row => row.classification === 'Moplex' ? 'Karrivin Plaza': row.area_location,
      wrap: true,
      minWidth: '15rem'
   },
   {
      id: 'priority',
      name: 'Priority Level',
      sortable: true,
      selector: row => row.priority,
      minWidth: '15rem'
   },
   {
      name: 'Tele Troubleshoot',
      selector: row => row.tele_ts,
      wrap: true,
      minWidth:'15rem'
   },
   {
      id: 'status',
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      format: row => {
      const statusColor = {
         "Open": "text-red-500",
         "Closed": "text-blue-500",
         "Resolved": "text-green-500"
      }

         return (
            <span className={statusColor[row.status]}>{row.status}</span>
         )
      },
      minWidth: '15rem'

   },
   {
      name: "Spec Req",
      selector: row => row.spec_request,
      minWidth: '15rem'
   },
   {
      name: 'Resolution',
      selector: row => row.resolution,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Work Note',
      selector: row => row.work_notes,
      wrap:true,
      minWidth: '15rem'
   },
   {
      name: 'Tagging',
      selector: row => row.tagging === null ? 'untagged' : row.tagging,
      minWidth:'20rem'
   },
   {
      name: 'Assigned Tech Date',
      selector: row => row.assigned_date === null ? '' : moment(row.assigned_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem'
   },
   {
      name: 'Activity Start',
      selector: row => row.tech_start === null ? '': moment(row.tech_start).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Activity End',
      selector: row => row.tech_end === null ? '': moment(row.tech_end).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth:'15rem'
   },
   {
      name: 'Date & Time Resolved', // D&T of resolved in TTS
      selector: row => row.tele_ts === 'Resolved - TTS' ?
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'',
         
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Unresolved', // D&T of unresolved in TTS
      selector: row => row.tele_ts === 'Unresolved - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time For Callback', // D&T for callback in TTS
      selector: row => row.tele_ts === 'For Callback - TTS' ? 
         moment(row.open_date).format('MM/DD/YYYY HH:mm'):'' ,
      wrap:true,
      minWidth: '16rem',
      center: true
   },
   {
      name: 'Date & Time Open', // Timestamp of when it was put to Open
      selector: row => moment(row.open_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Closed', //D&T 
      selector: row => row.closed_date === null ? '' : moment(row.closed_date).format('MM/DD/YYYY HH:mm'),
      wrap:true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time Resolved',
      selector: row => row.status === 'Resolved' ? row.update_date === null ? 
      moment(row.added_date).format('MM/DD/YYYY HH:mm') 
      : 
      moment(row.update_date).format('MM/DD/YYYY HH:mm')
        : '', //? TO CHECK 
      wrap:true,
      minWidth: '17rem',
      center: true
   },
   {
      name: 'Date & Time incomplete',
      selector: row => row.tagging === 'Incomplete' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm'): '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time complete', // Timestamp of when it is complete
      selector: row => row.tagging === 'Completed' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date & Time third party', // Timestamp of when it was processed to 3rd party
      selector: row => row.tagging === 'Assigned to Third Party' ? moment(row.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Submit Date and Time', // D&T of when the new ticket has been submitted and sent to db
      selector: row => moment(row.added_date).format('MM/DD/YYYY HH:mm'),
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 1', 
      selector: row => row.active_org === 'Helpdesk-L1' ? moment(row.update_date === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date & Time Helpdesk 2', 
      selector: row => row.active_org === 'Helpdesk-L2' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT Lead ', 
      selector: row => row.active_org === 'FieldTech-Lead' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      
      name: 'Date and time FT L1', 
      selector: row => row.active_org === 'FieldTech-L1' ? moment(row.update_date === null ? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time FT L2', 
      selector: row => row.active_org === 'FieldTech-L2' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },
   {
      name: 'Date and time third party ',
      selector: row => row.active_org === 'Third Party' ? moment(row.update_date  === null? row.added_date : row.update_date).format('MM/DD/YYYY HH:mm') : '',
      wrap: true,
      minWidth: '15rem',
      center: true
   },

]

