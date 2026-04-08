import moment from "moment"
import { CSVLink } from 'react-csv';
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Tooltip from "@mui/material/Tooltip";

export function setDataToDownload(dataToBeExtracted)
{
   const dataArr = dataToBeExtracted.map(data => 
   {
      return (
         {
            creation_date: moment(data.open_date).add(data.addedDurationHour, 'hours').format('MM/DD/YYYY HH:mm'),
            open_date: moment(data.open_date).format('MM/DD/YYYY HH:mm'),
            ticket_creator: data.username,
            requestor_name: data.customer_name,
            contact_number: data.contact_num,
            ticket_ID: data.id,
            classification: data.classification,
            platform: data.platform,
            'brand/department': data.classification === 'Moplex' ? data.department : data.shop_name,
            'location/section': data.classification === 'Moplex' ? data.section : data.area_location,
            ticket_type: data.ticket_type,
            category: data.category,
            sub_category: data.sub_category,
            priority_level: data.priority,
            tele_Troubleshoot: data.tele_ts,
            status:data.status,
            assignedTechName:data.technician_name === null ? 'Unassigned Tech' : data.technician_name,
            active_org:data.active_org,
            spec_req: data.spec_request,
            resolution: data.resolution,
            work_notes: data.work_notes,
            tagging: data.tagging,
            assigned_date: data.assigned_date === null? '' : moment(data.assigned_date).format('MM/DD/YYYY HH:mm'),
            activity_start: data.tech_start === null ? '' : moment(data.tech_start).format('MM/DD/YYYY HH:mm'),
            activity_end: data.tech_end === null ? '' : moment(data.tech_end).format('MM/DD/YYYY HH:mm'),
            date_and_time_resolved_TTS: data.tele_ts === 'Resolved - TTS' ? moment(data.open_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_unresolved: data.tele_ts === 'Unresolved - TTS' ? moment(data.open_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_callback: data.tele_ts === 'For Callback - TTS' ? moment(data.open_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_open: data.open_date === null ? '' : moment(data.open_date).format('MM/DD/YYYY HH:mm'),
            date_and_time_closed: data.closed_date === null ? '' : moment(data.closed_date).format('MM/DD/YYYY HH:mm'),
            date_and_time_resolved_status: data.status === 'Resolved' ?   
               data.update_date === null ? 
                     moment(data.added_date).format('MM/DD/YYYY HH:mm') 
                     : 
                     moment(data.update_date).format('MM/DD/YYYY HH:mm')
                : '',

            date_and_time_incomplete: data.tagging === 'Incomplete' ? moment(data.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
            date_and_time_complete: data.tagging === 'Completed' ? moment(data.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
            date_and_time_third_party: data.tagging === 'Assigned to Third Party' ? moment(data.wn_update_date).format('MM/DD/YYYY HH:mm') : '',
            submit_date_and_time: moment(data.added_date).format('MM/DD/YYYY HH:mm'),
            date_and_time_helpdesk1: data.active_org === 'Helpdesk-L1' ?
               data.update_date === null ? moment(data.added_date).format('MM/DD/YYYY HH:mm') : moment(data.update_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_helpdesk2: data.active_org === 'Helpdesk-L2' ?
               data.update_date === null ? moment(data.added_date).format('MM/DD/YYYY HH:mm') : moment(data.update_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_helpdesk_FT_lead: data.active_org === 'FieldTech-Lead' ?
               data.update_date === null ? moment(data.added_date).format('MM/DD/YYYY HH:mm') : moment(data.update_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_helpdesk2: data.active_org === 'FieldTech-L1' ?
               data.update_date === null ? moment(data.added_date).format('MM/DD/YYYY HH:mm') : moment(data.update_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_helpdesk2: data.active_org === 'FieldTech-L2' ?
               data.update_date === null ? moment(data.added_date).format('MM/DD/YYYY HH:mm') : moment(data.update_date).format('MM/DD/YYYY HH:mm'):'',
            date_and_time_helpdesk2: data.active_org === 'Third Party' ?
               data.update_date === null ? moment(data.added_date).format('MM/DD/YYYY HH:mm') : moment(data.update_date).format('MM/DD/YYYY HH:mm'):'',

         })
   })

   return dataArr
}

export function DownloadDataCSV({props})
{
   return(
      <>
      <Tooltip placement='top' title='Download CSV'>
         <button>
            <CSVLink
               data={props.dataToDownload}
               filename={`${props.type} as of ${moment().format('MM-DD-YYYY HH-mm')}`}
               >
                  <DocumentArrowDownIcon className="h-6 w-6"/>
            </CSVLink>
         </button>
      </Tooltip>
      </>
   )
}
