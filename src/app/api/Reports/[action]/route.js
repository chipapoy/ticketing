import executeQuery from '@/connections/db';
import { NextResponse } from "next/server";

const TICKET_LIST_TABLE = 
`
SELECT
tickets.id,
active_org.active_org,
cat.category,
class.classification,
cluster.cluster,
dept.department,
dept_sec.section,
loc.area_location,
platform.platform,
priority.priority,
sla.sla,
shop.shop_name,
sub_cat.sub_category,
tagging.tagging,
tech.location as tech_location,
tech.technician_name,
tele_ts.tele_ts,
tickets.contact_num,
tickets.customer_name,
tickets.spec_request,
tickets.resolution,
(SELECT work_notes FROM ticket_work_notes_tbl WHERE ticket_ref_id = tickets.ticket_ref_id ORDER BY id DESC LIMIT 1) AS work_notes,
DATE_FORMAT(tickets.tech_start, "%Y-%m-%d %H:%i:%s:%f") AS tech_start,
DATE_FORMAT(tickets.tech_end, "%Y-%m-%d %H:%i:%s:%f") AS tech_end,
DATE_FORMAT(tickets.assigned_date,"%Y-%m-%d %H:%i:%s:%f") AS assigned_date,
tickets.ticket_ref_id,
tstatus.status,
ttype.ticket_type,
CONCAT(user.fname,' ', user.lname) AS username,
DATE_FORMAT( (SELECT added_date FROM ticket_work_notes_tbl WHERE ticket_ref_id = tickets.ticket_ref_id ORDER BY id DESC LIMIT 1),"%Y-%m-%d %H:%i:%s") AS wn_update_date,
DATE_FORMAT(tickets.open_date, "%Y-%m-%d %H:%i:%s:%f") AS open_date,
DATE_FORMAT(tickets.closed_date, "%Y-%m-%d %H:%i:%s:%f") AS closed_date,
DATE_FORMAT(tickets.added_date, "%Y-%m-%d %H:%i:%s:%f") AS added_date,
DATE_FORMAT(tickets.update_date, "%Y-%m-%d %H:%i:%s:%f") AS update_date,
TIMESTAMPDIFF(MINUTE,tickets.open_date,tickets.closed_date) AS durationMin,
TIMESTAMPDIFF(HOUR,tickets.open_date,tickets.closed_date) AS durationHour,
TIMESTAMPDIFF(MINUTE,tickets.added_date,tickets.closed_date) AS addedDurationMin,
TIMESTAMPDIFF(HOUR,tickets.added_date,tickets.closed_date) AS addedDurationHour
FROM ticket_list_tbl tickets
LEFT JOIN class_tbl class ON tickets.class_id = class.id
LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
LEFT JOIN cluster_tbl cluster ON loc.cluster_id = cluster.id
LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
LEFT JOIN tele_ts_tbl tele_ts ON tickets.tele_ts_id = tele_ts.id
LEFT JOIN user_tbl user ON tickets.added_by = user.id
LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
LEFT JOIN dept_section_tbl dept_sec ON tickets.dept_sec_id = dept_sec.id
LEFT JOIN active_org_tbl active_org ON tickets.active_org_id = active_org.id
LEFT JOIN tagging_tbl tagging ON tickets.tech_tagging_id = tagging.id
LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id

`

export async function GET(request, { params }) {

  const action = params.action;

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const per_page = searchParams.get('per_page');
  const from_date = searchParams.get('from_date');
  const to_date = searchParams.get('to_date');
  const search = searchParams.get('search')
  const start = page == 1 ? 0 : (page - 1) * per_page;
  const limit = per_page * 1;

  const pageQuery = {
    page: page,
    per_page: per_page
  }

  try {
    switch (action) {
         case 'getTicketList':
         
         var query = `
         ${TICKET_LIST_TABLE}
         WHERE 
         tickets.open_date BETWEEN '${from_date}' AND '${to_date}'
         ORDER BY id DESC
         `

         var queryCount = `
            SELECT 
            COUNT (*) AS TOTAL
            FROM 
            ticket_list_tbl
            WHERE 
            ticket_list_tbl.open_date BETWEEN '${from_date}' AND '${to_date}'
         `
         
         var values = [start, limit];

         var result = await executeQuery({
            query: query,
            values: values
         });

         var resultCount = 
         await executeQuery({
            query: queryCount,
            values: []
         });

         return NextResponse.json(
         {
            result: {
               ...pageQuery,
               total: resultCount[0]['TOTAL'],
               total_pages: Math.ceil(resultCount[0]['TOTAL'] / per_page),
               data: result
            },
            request: values,
            action: action
         },
         {
            status: 200,
            headers: {
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
               'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
         },
         );
      
         case 'searchTicket':

         
         var query = `
         ${TICKET_LIST_TABLE}
         WHERE 
         tickets.open_date BETWEEN '${from_date}' AND '${to_date}'
         ORDER BY id DESC
         `;
            // LEFT JOIN ticket_work_notes_tbl work_notes ON tickets.ticket_ref_id = work_notes.ticket_ref_id 
            //          DATE_FORMAT(work_notes.added_date, "%Y-%m-%d %H:%i") AS update_date,
         
            var queryCount = `
               SELECT 
               COUNT (*) AS TOTAL
               FROM 
               ticket_list_tbl
               WHERE 
               ticket_list_tbl.open_date BETWEEN '${from_date}' AND '${to_date}'
            `
         
            var values = [start, limit];

            var result = await executeQuery({
               query: query,
               values: values
            });

            var resultCount = await executeQuery({
               query: queryCount,
               values: []
            });

         return NextResponse.json(
            {
               result: {
               ...pageQuery,
               total: result.filter(ticket => ticket.id.toString().includes(search)).length,
               total_pages: Math.ceil(result.filter(ticket => ticket.id.toString().includes(search)).length / per_page),
               data: result.filter(ticket => ticket.id.toString().includes(search))
               },
               request: values,
               action: action
            },
            {
               status: 200,
               headers: {
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
               'Access-Control-Allow-Headers': 'Content-Type, Authorization',
               }
            },
         );

         default:

         return NextResponse.json(
            {
               error: 'Action not found'
            },
            {
               status: 404
            }
         );
         break;
      }
   }
   catch (error) {
      return NextResponse.json(
         {
            error: error
         },
         {
            status: 404
         }
      );
   }
}
