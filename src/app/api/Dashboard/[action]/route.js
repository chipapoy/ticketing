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

  const action = params.action

  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page')
  const per_page = searchParams.get('per_page')
  const from_date = searchParams.get('from_date')
  const to_date = searchParams.get('to_date')
  const search = searchParams.get('search')
  const status_id = searchParams.get('status_id')
  const start = page == 1 ? 0 : (page - 1) * per_page;
  const limit = per_page * 1;
  

  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const week = searchParams.get('week')
  const tech_filter = searchParams.get('tech_filter')

  const pageQuery = {
    page: page,
    per_page: per_page
  }

  try {
    switch (action) {
      case 'getUnfilteredTicketList':
        
        var query = `
        ${TICKET_LIST_TABLE}
          `
        
          var queryCount = `
            SELECT 
            COUNT (*) AS TOTAL
            FROM 
            ticket_list_tbl'
          `
        
          var values = []

          var result = await executeQuery({
            query: query,
            values: values
          })

        return NextResponse.json(
          {
            result: {
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
      )
     
      case 'getFilteredTicketList':

      
      var query = `
        ${TICKET_LIST_TABLE}
        WHERE 
        DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
        ORDER BY id DESC
        `

        var queryCount = `
          SELECT 
          COUNT (*) AS Total
          FROM 
          ticket_list_tbl
          WHERE 
          DATE(ticket_list_tbl.open_date) BETWEEN '${from_date}' AND '${to_date}'
        `
      
        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

        var resultCount = await executeQuery({
          query: queryCount,
          values: []
        })

      return NextResponse.json(
        {
          result: {
            data: result,
            total: resultCount[0].Total
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
      )
      
      case 'searchTicket':

        
      var query = `
      ${TICKET_LIST_TABLE}
        WHERE 
        DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
        ORDER BY id DESC
        `;
          var queryCount = `
            SELECT COUNT (*) AS TOTAL
            FROM ticket_list_tbl
            WHERE DATE(ticket_list_tbl.open_date) BETWEEN '${from_date}' AND '${to_date}'
          `
        
          var values = [start, limit]

          var result = await executeQuery({
            query: query,
            values: values
          })

          var resultCount = await executeQuery({
            query: queryCount,
            values: []
          })

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
      )

      case 'getOverdueTickets':
        var query = `
        ${TICKET_LIST_TABLE}
          WHERE tickets.status_id = 1
          AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
          AND NOW() > 
          DATE_ADD(tickets.open_date, INTERVAL CAST( SUBSTRING_INDEX(
            (SELECT sla  
              FROM sla_tbl 
              LEFT JOIN sub_category_tbl sub_cat ON sla_tbl.id = sub_cat.sla_id
              WHERE tickets.sub_category_id = sub_cat.id 
              ) , ' ' , 1 ) AS UNSIGNED) HOUR)
          ORDER BY id DESC
        `

        var queryCount = `
          SELECT COUNT(*) AS Total
          FROM ticket_list_tbl tickets
            WHERE tickets.status_id = 1
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
            AND NOW() > 
            DATE_ADD(tickets.open_date, INTERVAL CAST( SUBSTRING_INDEX(
              (SELECT sla  
                FROM sla_tbl 
                LEFT JOIN sub_category_tbl sub_cat ON sla_tbl.id = sub_cat.sla_id
                WHERE tickets.sub_category_id = sub_cat.id 
                ) , ' ' , 1 ) AS UNSIGNED) HOUR)
        `

        var values = []

        var resultCount = await executeQuery({
          query: queryCount,
          values: values
        })
        var result = await executeQuery({
          query: query,
          values: values
        })


      return NextResponse.json(
        {
          result: {
            data: result,
            total: resultCount[0].Total
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
      )

      case 'getTicketsByStatus':
      
      var query = `
        ${TICKET_LIST_TABLE}
          WHERE tickets.status_id = ${status_id}
          AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
          ORDER BY id DESC  
        `

        var queryCount = `
          SELECT COUNT(*) AS Total
            FROM ticket_list_tbl tickets
            WHERE tickets.status_id = ${status_id}
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

        var resultCount = await executeQuery({
          query: queryCount,
          values: values
        })

      return NextResponse.json(
        {
          result: {
            data: result,
            total: resultCount[0].Total
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
      )

      case 'getUnassignedTicketList':
      
      var query = `
        ${TICKET_LIST_TABLE}
          WHERE ISNULL(tickets.tech_tagging_id)
          AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
          ORDER BY id DESC  
        `

        var queryCount = `
        SELECT COUNT(*) AS Total
          FROM ticket_list_tbl tickets
          WHERE ISNULL(tickets.tech_tagging_id)
          AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

        var resultCount = await executeQuery({
          query: queryCount,
          values: values
        })

      return NextResponse.json(
        {
          result: {
            data: result,
            total: resultCount[0].Total
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
      )
      
      case 'getActiveOrgList':

      var query = `
        SELECT ao.active_org,
          (SELECT COUNT(*) 
            FROM ticket_list_tbl tickets 
            WHERE tickets.active_org_id = ao.id 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS count
          FROM active_org_tbl ao
          WHERE ao.is_active = 1
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )

      case 'getClusterList':

      var query = `
        SELECT cluster,
        (SELECT COUNT(*) 
        FROM ticket_list_tbl tickets 
        LEFT JOIN shop_location_tbl shop_loc ON (
          CASE WHEN ISNULL(tickets.shop_loc_id) THEN 12 
            ELSE tickets.shop_loc_id END) = shop_loc.id 
          WHERE clusterLoc.id = shop_loc.cluster_id 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS Total
        FROM cluster_tbl clusterLoc
        WHERE is_active = 1
        `
      
        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )

      case 'getAllbranchesCount':

      var query = `
        SELECT COUNT(*) AS all_branches
          FROM ticket_list_tbl tickets 
          LEFT JOIN shop_location_tbl shop_loc ON tickets.shop_loc_id = shop_loc.id 
          WHERE tickets.shop_loc_id = 33 AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
        `
      
        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
            data: result[0]
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
      )
      
      case 'getPriorityList':

      var query = `
          SELECT priority as label,
            (SELECT COUNT(*) 
              FROM sub_category_tbl sub_cat, ticket_list_tbl tickets
              WHERE sub_cat.priority_id = prio.id
              AND tickets.sub_category_id = sub_cat.id
              AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS value
            FROM priority_tbl prio
            WHERE is_active = 1
        `
      var queryOpenDateArr = `
          SELECT priority as label,
            (SELECT COUNT(*) 
              FROM sub_category_tbl sub_cat, ticket_list_tbl tickets
              WHERE sub_cat.priority_id = prio.id
              AND tickets.sub_category_id = sub_cat.id
              AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
              AND tickets.status_id = 1) AS value
            FROM priority_tbl prio
            WHERE is_active = 1
            
        `
        

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

        var resultOpenDate = await executeQuery({
          query: queryOpenDateArr,
          values: values
        })

      return NextResponse.json(
        {
          result: {

            data: result,
            openData: resultOpenDate
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
      )

      case 'getTeleTsPerc':

      var query = `
          SELECT ts.tele_ts AS label, 
          ((SELECT COUNT(*) FROM ticket_list_tbl tickets WHERE ts.id = tickets.tele_ts_id AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') 
            / (SELECT COUNT(*) FROM ticket_list_tbl tickets WHERE DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}')) * 100  AS value
            FROM tele_ts_tbl ts, ticket_list_tbl tickets
            WHERE ts.is_active = 1
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
            GROUP BY ts.id
            ORDER BY ts.id ASC;
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )

      case 'getTicketTypesCount':

      var query = `
        SELECT ticket_type as label, 
          (SELECT COUNT(*) 
            FROM ticket_list_tbl tickets 
            WHERE tickets.ticket_type_id = ticket_type_tbl.id 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}')
            AS value
          FROM ticket_type_tbl
          WHERE is_active = 1
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )

      case 'getPlatformCount':

      var query = `
        SELECT platform AS label,
          (SELECT COUNT(*)
            FROM ticket_list_tbl tickets
            WHERE tickets.platform_id = platform_tbl.id
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') 
            AS value
          FROM platform_tbl
          WHERE is_active = 1
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )

      case 'getTicketStatusCount':
        var query = `
        SELECT status AS Label, 
        (SELECT COUNT(*) 
          FROM ticket_list_tbl tickets 
              WHERE tickets.status_id= ticket_status_tbl.id 
              AND DATE(tickets.open_date) BETWEEN  '${from_date}' AND '${to_date}')
              AS Total
        FROM ticket_status_tbl
        WHERE is_active = 1
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )
      
      case 'getTicketCreatorList':

        var query = `

        SELECT tickets.id AS ticket_id, CONCAT(user.fname,' ', user.lname) AS name
          FROM ticket_list_tbl tickets
          LEFT JOIN user_tbl user ON user.id = tickets.added_by
          ORDER BY ticket_id DESC
          LIMIT 5
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )

      case 'getTechPerformanceList':

        var query = `

        SELECT tech.technician_name,
        (SELECT COUNT(tickets.assigned_tech_id) 
        FROM ticket_list_tbl tickets 
            WHERE tech.id = tickets.assigned_tech_id 
            AND tickets.status_id = 1 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS open_total,
          (SELECT COUNT(tickets.assigned_tech_id) 
            FROM ticket_list_tbl tickets 
            WHERE tech.id = tickets.assigned_tech_id 
            AND tickets.status_id = 3 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS resolved_total,
          (SELECT COUNT(tickets.assigned_tech_id) 
            FROM ticket_list_tbl tickets 
            WHERE tech.id = tickets.assigned_tech_id 
            AND tickets.status_id = 2 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS closed_total,
          (SELECT COUNT(tickets.assigned_tech_id) 
            FROM ticket_list_tbl tickets 
            WHERE tech.id = tickets.assigned_tech_id 
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS total
          FROM technician_tbl tech
          WHERE tech.is_active = 1
          ORDER BY total DESC
        `

        var values = []

        var result = await executeQuery({
          query: query,
          values: values
        })

      return NextResponse.json(
        {
          result: {
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
      )



      case 'getShopLocationTickets':

        var queryLoc = `
          SELECT DISTINCT 
          shop.shop_name, 
              shop_loc.area_location, 
          (SELECT COUNT(*) 
            FROM ticket_list_tbl tickets 
              WHERE CASE WHEN ISNULL(tickets.shop_loc_id) THEN shop_loc.id = 12 ELSE tickets.shop_loc_id = shop_loc.id END
              AND CASE WHEN ISNULL(tickets.shop_id) THEN shop.id = 13 ELSE tickets.shop_id = shop.id END
            AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS area_count
              FROM ticket_list_tbl tickets 
              LEFT JOIN shop_tbl shop ON CASE WHEN ISNULL(tickets.shop_id) THEN 13 ELSE tickets.shop_id END = shop.id
              LEFT JOIN shop_location_tbl shop_loc ON CASE WHEN ISNULL(tickets.shop_loc_id) THEN 12 ELSE tickets.shop_loc_id END = shop_loc.id
              WHERE DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
              ORDER BY shop_name, area_count DESC
        `

        var queryShop = `
          SELECT shop.shop_name, 
          (SELECT COUNT(*) 
            FROM ticket_list_tbl tickets 
            WHERE CASE WHEN ISNULL(tickets.shop_id) THEN shop.id = 13 ELSE tickets.shop_id = shop.id END
                AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}') AS total_shop
            FROM shop_tbl shop, ticket_list_tbl tickets
              WHERE shop.is_active = 1
              AND DATE(tickets.open_date) BETWEEN '${from_date}' AND '${to_date}'
            GROUP BY shop.id
              ORDER BY total_shop DESC
        `

        var values = []

        var resultLoc = await executeQuery({
          query: queryLoc,
          values: values
        })
        
        var resultShop = await executeQuery({
          query: queryShop,
          values: values
        })

      return NextResponse.json(
        {
          result: {
            loc: resultLoc,
            shop: resultShop
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
      )

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

