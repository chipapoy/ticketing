import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';
import moment from "moment";
import { parseJSON } from "date-fns";


const StageAllowed = (role_id) => {

  switch (role_id) {
    case 1: // ADMIN

      return "(1,2,3,4,5,6)";

      break;

    case 2: // HELPDESK

      return "(1,2,3,4,5,6)";

      break;

    case 6: // IT LEAD

      return "(1,2,3,4,5,6)";

      break;

    case 7: // FIELD TECH1

      return "(4,5,6)";

      break;

    case 8: // FIELD TECH2

      return "(4,5,6)";

      break;

    default:
      break;
  }

}

const AccessParam = (user_id, tech_id, role_id) => {

  return tech_id ? `OR tickets.assigned_tech_id = ${tech_id}` : "";

  // if(tech_id != null){
  //   return `AND tickets.assigned_tech_id = ${tech_id}`
  // }
  // else{
  //   return ""
  // }

}

export async function GET(request, { params }) {

  const action = params.action;
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const per_page = searchParams.get('per_page');
  const start = page == 1 ? 0 : (page - 1) * per_page;
  const limit = per_page * 1;

  const user_id = parseInt(searchParams.get('user_id'))
  const tech_id = parseInt(searchParams.get('tech_id'))
  const role_id = parseInt(searchParams.get('role_id'))

  const paramStage = StageAllowed(role_id)
  const accessParam = AccessParam(user_id, tech_id, role_id)

  const pageQuery = {
    page: page,
    per_page: per_page
  }

  try {
    switch (action) {
      case 'getList':

        var query = `
          SELECT
          tickets.id,
          class.classification,
          shop.shop_name,
          ttype.ticket_type,
          cat.category,
          sub_cat.sub_category,
          priority.priority,
          ts.tele_ts,
          tstatus.status,
          tech.technician_name,
          loc.area_location,
          customer.customer_name,
          customer.email_add,
          customer.contact_num,
          platform.platform,
          tickets.resolution,
          tickets.open_date,
          tickets.closed_date,
          tickets.tech_start,
          tickets.tech_end,
          CASE 
            WHEN tickets.closed_date IS NULL 
            THEN TIMESTAMPDIFF(MINUTE,tickets.open_date,NOW())
            ELSE TIMESTAMPDIFF(MINUTE,tickets.open_date,tickets.closed_date)
          END AS durationMin,
          TIMESTAMPDIFF(HOUR,tickets.open_date,tickets.closed_date) AS durationHour,
          org.active_org,
          sla.sla,
          dept.department,
          dept_sec.section,
          tag.tagging as tag_name,
          CONCAT(user_added.fname,' ',user_added.lname) AS added_by,
          tickets.added_date,
          CONCAT(user_update.fname,' ',user_update.lname) AS update_by,
          tickets.update_date,
          (SELECT tg.tagging FROM ticket_work_notes_tbl wn, tagging_tbl tg WHERE wn.ticket_ref_id = tickets.ticket_ref_id AND wn.tagging = tg.id ORDER BY wn.id DESC LIMIT 1) AS tagging
          FROM
          ticket_list_tbl tickets
          LEFT JOIN class_tbl class ON tickets.class_id = class.id
          LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
          LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
          LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
          LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
          LEFT JOIN tele_ts_tbl ts ON tickets.tele_ts_id = ts.id
          LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
          LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id
          LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
          LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
          LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
          LEFT JOIN active_org_tbl org ON tickets.active_org_id = org.id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
          LEFT JOIN dept_section_tbl dept_sec ON tickets.dept_sec_id = dept_sec.id
          LEFT JOIN tagging_tbl tag ON tickets.tech_tagging_id = tag.id
          LEFT JOIN user_tbl user_update ON tickets.update_by = user_update.id
          LEFT JOIN user_tbl user_added ON tickets.added_by = user_added.id
          LEFT JOIN customer_tbl customer ON tickets.customer_id = customer.id
          WHERE
          tickets.active_org_id IN ${paramStage}
          ${accessParam}
          ORDER BY FIELD(tstatus.status, 'Closed', 'Resolved', 'Open') DESC, tickets.open_date DESC
          LIMIT ?, ?
        `;

        var values = [start, limit];

        var result = await executeQuery({
          query: query,
          values: values,
          param: paramStage
        });

        var queryCount = `
          SELECT
          COUNT(*) AS TOTAL
          FROM
          ticket_list_tbl tickets
          WHERE
          tickets.active_org_id IN ${paramStage}
          ${accessParam}
        `;

        var resultCount = await executeQuery({
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

        break;

      case 'searchList':

        const search = searchParams.get('search');

        var query = `
          SELECT
          tickets.id,
          class.classification,
          shop.shop_name,
          ttype.ticket_type,
          cat.category,
          sub_cat.sub_category,
          priority.priority,
          ts.tele_ts,
          tstatus.status,
          tech.technician_name,
          loc.area_location,
          customer.customer_name,
          customer.email_add,
          customer.contact_num,
          platform.platform,
          tickets.resolution,
          tickets.open_date,
          tickets.closed_date,
          tickets.tech_start,
          tickets.tech_end,
          CASE 
            WHEN tickets.closed_date IS NULL 
            THEN TIMESTAMPDIFF(MINUTE,tickets.open_date,NOW())
            ELSE TIMESTAMPDIFF(MINUTE,tickets.open_date,tickets.closed_date)
          END AS durationMin,
          TIMESTAMPDIFF(HOUR,tickets.open_date,tickets.closed_date) AS durationHour,
          org.active_org,
          sla.sla,
          dept.department,
          dept_sec.section,
          tag.tagging as tag_name,
          CONCAT(user_added.fname,' ',user_added.lname) AS added_by,
          tickets.added_date,
          CONCAT(user_update.fname,' ',user_update.lname) AS update_by,
          tickets.update_date,
          (SELECT tg.tagging FROM ticket_work_notes_tbl wn, tagging_tbl tg WHERE wn.ticket_ref_id = tickets.ticket_ref_id AND wn.tagging = tg.id ORDER BY wn.id DESC LIMIT 1) AS tagging
          FROM
          ticket_list_tbl tickets
          LEFT JOIN class_tbl class ON tickets.class_id = class.id
          LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
          LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
          LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
          LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
          LEFT JOIN tele_ts_tbl ts ON tickets.tele_ts_id = ts.id
          LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
          LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id
          LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
          LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
          LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
          LEFT JOIN active_org_tbl org ON tickets.active_org_id = org.id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
          LEFT JOIN dept_section_tbl dept_sec ON tickets.dept_sec_id = dept_sec.id
          LEFT JOIN tagging_tbl tag ON tickets.tech_tagging_id = tag.id
          LEFT JOIN user_tbl user_update ON tickets.update_by = user_update.id
          LEFT JOIN user_tbl user_added ON tickets.added_by = user_added.id
          LEFT JOIN customer_tbl customer ON tickets.customer_id = customer.id
          WHERE
          tickets.id LIKE '${search}%'
          AND
          tickets.active_org_id IN ${paramStage}
          ${accessParam}
          ORDER BY FIELD(tstatus.status, 'Closed', 'Resolved', 'Open') DESC, tickets.open_date DESC
          LIMIT ?, ?
        `;

        var values = [start, limit];

        var result = await executeQuery({
          query: query,
          values: values
        });

        var queryCount = `
          SELECT
          COUNT(*) AS TOTAL
          FROM
          ticket_list_tbl tickets
          WHERE
          tickets.id LIKE '${search}%'
          AND
          tickets.active_org_id IN ${paramStage}
          ${accessParam}
        `;

        var resultCount = await executeQuery({
          query: queryCount,
          values: [search]
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

        break;

      case 'getTechList':

        var query = `
          SELECT
          tickets.id,
          class.classification,
          shop.shop_name,
          ttype.ticket_type,
          cat.category,
          sub_cat.sub_category,
          priority.priority,
          ts.tele_ts,
          tstatus.status,
          tech.technician_name,
          loc.area_location,
          customer.customer_name,
          customer.email_add,
          customer.contact_num,
          platform.platform,
          tickets.resolution,
          tickets.open_date,
          tickets.closed_date,
          tickets.tech_start,
          tickets.tech_end,
          CASE 
            WHEN tickets.closed_date IS NULL 
            THEN TIMESTAMPDIFF(MINUTE,tickets.open_date,NOW())
            ELSE TIMESTAMPDIFF(MINUTE,tickets.open_date,tickets.closed_date)
          END AS durationMin,
          TIMESTAMPDIFF(HOUR,tickets.open_date,tickets.closed_date) AS durationHour,
          org.active_org,
          sla.sla,
          dept.department,
          dept_sec.section,
          CONCAT(user_added.fname,' ',user_added.lname) AS added_by,
          tickets.added_date,
          CONCAT(user.fname,' ',user.lname) AS update_by,
          tickets.update_date,
          (SELECT tg.tagging FROM ticket_work_notes_tbl wn, tagging_tbl tg WHERE wn.ticket_ref_id = tickets.ticket_ref_id AND wn.tagging = tg.id ORDER BY wn.id DESC LIMIT 1) AS tagging
          FROM
          ticket_list_tbl tickets
          LEFT JOIN class_tbl class ON tickets.class_id = class.id
          LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
          LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
          LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
          LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
          LEFT JOIN tele_ts_tbl ts ON tickets.tele_ts_id = ts.id
          LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
          LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id
          LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
          LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
          LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
          LEFT JOIN active_org_tbl org ON tickets.active_org_id = org.id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
          LEFT JOIN dept_section_tbl dept_sec ON tickets.dept_sec_id = dept_sec.id
          LEFT JOIN user_tbl user ON tickets.update_by = user.id
          LEFT JOIN user_tbl user_added ON tickets.added_by = user_added.id
          LEFT JOIN customer_tbl customer ON tickets.customer_id = customer.id
          WHERE
          tickets.assigned_tech_id = ${tech_id}
          ORDER BY FIELD(tstatus.status, 'Closed', 'Resolved', 'Open') DESC, tickets.open_date DESC
          LIMIT ?, ?
        `;

        var values = [start, limit];

        var result = await executeQuery({
          query: query,
          values: values,
          param: paramStage
        });

        var queryCount = `
          SELECT
          COUNT(*) AS TOTAL
          FROM
          ticket_list_tbl tickets
          WHERE
          tickets.assigned_tech_id = ${tech_id}
        `;

        var resultCount = await executeQuery({
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

        break;

      case 'searchTechList':

        const searchTech = searchParams.get('search');

        var query = `
          SELECT
          tickets.id,
          class.classification,
          shop.shop_name,
          ttype.ticket_type,
          cat.category,
          sub_cat.sub_category,
          ts.tele_ts,
          priority.priority,
          tstatus.status,
          tech.technician_name,
          loc.area_location,
          customer.customer_name,
          customer.email_add,
          customer.contact_num,
          platform.platform,
          tickets.resolution,
          tickets.open_date,
          tickets.closed_date,
          tickets.tech_start,
          tickets.tech_end,
          CASE 
            WHEN tickets.closed_date IS NULL 
            THEN TIMESTAMPDIFF(MINUTE,tickets.open_date,NOW())
            ELSE TIMESTAMPDIFF(MINUTE,tickets.open_date,tickets.closed_date)
          END AS durationMin,
          TIMESTAMPDIFF(HOUR,tickets.open_date,tickets.closed_date) AS durationHour,
          org.active_org,
          sla.sla,
          dept.department,
          dept_sec.section,
          CONCAT(user_added.fname,' ',user_added.lname) AS added_by,
          tickets.added_date,
          CONCAT(user.fname,' ',user.lname) AS update_by,
          tickets.update_date,
          (SELECT tg.tagging FROM ticket_work_notes_tbl wn, tagging_tbl tg WHERE wn.ticket_ref_id = tickets.ticket_ref_id AND wn.tagging = tg.id ORDER BY wn.id DESC LIMIT 1) AS tagging
          FROM
          ticket_list_tbl tickets
          LEFT JOIN class_tbl class ON tickets.class_id = class.id
          LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
          LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
          LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
          LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
          LEFT JOIN tele_ts_tbl ts ON tickets.tele_ts_id = ts.id
          LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
          LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id
          LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
          LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
          LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
          LEFT JOIN active_org_tbl org ON tickets.active_org_id = org.id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
          LEFT JOIN dept_section_tbl dept_sec ON tickets.dept_sec_id = dept_sec.id
          LEFT JOIN user_tbl user ON tickets.update_by = user.id
          LEFT JOIN user_tbl user_added ON tickets.added_by = user_added.id
          LEFT JOIN customer_tbl customer ON tickets.customer_id = customer.id
          WHERE
          tickets.id LIKE '${searchTech}%'
          AND
          tickets.assigned_tech_id = ${tech_id}
          ORDER BY FIELD(tstatus.status, 'Closed', 'Resolved', 'Open') DESC, tickets.open_date DESC
          LIMIT ?, ?
        `;

        var values = [start, limit];

        var result = await executeQuery({
          query: query,
          values: values
        });

        var queryCount = `
          SELECT
          COUNT(*) AS TOTAL
          FROM
          ticket_list_tbl tickets
          WHERE
          tickets.id LIKE '${searchTech}%'
          AND
          tickets.assigned_tech_id = ${tech_id}
        `;

        var resultCount = await executeQuery({
          query: queryCount,
          values: [searchTech]
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

        break;

      case 'filterList':

        const status_id = searchParams.get('status_id')
        const active_org_id = searchParams.get('active_org_id')
        const shop_id = searchParams.get('shop_id')
        const class_id = searchParams.get('class_id')
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        const paramStatus = status_id != 'null' ? `tickets.status_id = ${status_id}` : `tickets.status_id > 0`
        const paramActiveOrg = active_org_id != 'null' ? `tickets.active_org_id = ${active_org_id}` : `tickets.active_org_id > 0`
        const paramShops = shop_id != 'null' ? `tickets.shop_id IN (${shop_id})` : `tickets.shop_id > -1`
        const paramClass = class_id != 'null' ? `tickets.class_id = ${class_id}` : `tickets.class_id > 0`
        const paramOpenDate = from != 'null' ? `AND DATE(tickets.open_date) BETWEEN '${from}' AND '${to}' ` : ``

        var query = `
          SELECT
          tickets.id,
          class.classification,
          shop.shop_name,
          ttype.ticket_type,
          cat.category,
          sub_cat.sub_category,
          ts.tele_ts,
          priority.priority,
          tstatus.status,
          tech.technician_name,
          loc.area_location,
          customer.customer_name,
          customer.email_add,
          customer.contact_num,
          platform.platform,
          tickets.resolution,
          tickets.open_date,
          tickets.closed_date,
          tickets.tech_start,
          tickets.tech_end,
          CASE 
            WHEN tickets.closed_date IS NULL 
            THEN TIMESTAMPDIFF(MINUTE,tickets.open_date,NOW())
            ELSE TIMESTAMPDIFF(MINUTE,tickets.open_date,tickets.closed_date)
          END AS durationMin,
          TIMESTAMPDIFF(HOUR,tickets.open_date,tickets.closed_date) AS durationHour,
          org.active_org,
          sla.sla,
          dept.department,
          dept_sec.section,
          CONCAT(user_added.fname,' ',user_added.lname) AS added_by,
          tickets.added_date,
          CONCAT(user.fname,' ',user.lname) AS update_by,
          tickets.update_date,
          (SELECT tg.tagging FROM ticket_work_notes_tbl wn, tagging_tbl tg WHERE wn.ticket_ref_id = tickets.ticket_ref_id AND wn.tagging = tg.id ORDER BY wn.id DESC LIMIT 1) AS tagging
          FROM
          ticket_list_tbl tickets
          LEFT JOIN class_tbl class ON tickets.class_id = class.id
          LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
          LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
          LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
          LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
          LEFT JOIN tele_ts_tbl ts ON tickets.tele_ts_id = ts.id
          LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
          LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id
          LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
          LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
          LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
          LEFT JOIN active_org_tbl org ON tickets.active_org_id = org.id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
          LEFT JOIN dept_section_tbl dept_sec ON tickets.dept_sec_id = dept_sec.id
          LEFT JOIN user_tbl user ON tickets.update_by = user.id
          LEFT JOIN user_tbl user_added ON tickets.added_by = user_added.id
          LEFT JOIN customer_tbl customer ON tickets.customer_id = customer.id
          WHERE
          (
            ${paramStatus}
            AND
            ${paramActiveOrg}
            AND
            ${paramShops}
            AND
            ${paramClass}
            ${paramOpenDate}
          )
          ORDER BY FIELD(tstatus.status, 'Closed', 'Resolved', 'Open') DESC, tickets.open_date DESC
          LIMIT ?, ?
        `;

        var values = [start, limit];

        var result = await executeQuery({
          query: query,
          values: values
        });

        var queryCount = `
          SELECT
          COUNT(*) AS TOTAL
          FROM
          ticket_list_tbl tickets
          WHERE
          (
            ${paramStatus}
            AND
            ${paramActiveOrg}
            AND
            ${paramShops}
            AND
            ${paramClass}
            ${paramOpenDate}
          )
        `;

        var resultCount = await executeQuery({
          query: queryCount,
          values: []
        });

        return NextResponse.json(
          {
            result: {
              ...pageQuery,
              total: resultCount[0]['TOTAL'],
              total_pages: Math.ceil(resultCount[0]['TOTAL'] / per_page),
              data: result,
              query: query
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

        break;


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

export async function POST(request, { params }) {

  const action = params.action;
  const formData = request ? await request.formData() : null;

  try {
    switch (action) {
      case 'getList':

        var query = `
                    SELECT
                    *
                    FROM
                    ticket_list_tbl
                `;

        var values = [];

        var result = await executeQuery({
          query: query,
          values: values
        });

        return NextResponse.json(
          {
            result: result,
            request: values,
            action: action
          },
          {
            status: 200
          }
        );

        break;

      case 'getData':

        var query = `
          SELECT
          tickets.id as ticket_id,
          tickets.ticket_ref_id as ticket_ref_id,
          class.id as class_id,
          class.classification,
          shop.id as shop_id,
          shop.shop_name,
          ttype.id as ticket_type_id,
          ttype.ticket_type,
          cat.id as category_id,
          cat.category,
          sub_cat.id as sub_category_id,
          sub_cat.sub_category,
          priority.id as priority_id,
          priority.priority,
          sla.sla,
          tstatus.id as status_id,
          tstatus.status,
          tech.id as assigned_tech_id,
          tech.technician_name,
          tech.location as tech_location,
          DATE_FORMAT(tickets.tech_start, "%Y-%m-%d %H:%i") AS tech_start,
          DATE_FORMAT(tickets.tech_end, "%Y-%m-%d %H:%i") AS tech_end,
          loc.id as shop_loc_id,
          loc.area_location,
          cluster.cluster,
          tickets.customer_name,
          tickets.contact_num,
          platform.id as platform_id,
          platform.platform,
          dept.id as dept_id,
          dept.department,
          dept_sec.id as dept_sec_id,
          dept_sec.section,
          org.id as active_org_id,
          org.active_org,
          tele_ts.id as tele_ts_id,
          tele_ts.tele_ts,
          tickets.work_note,
          tickets.spec_request,
          tickets.reso_id,
          reso.resolution,
          tickets.tech_tagging_id,
          tagging.tagging,
          DATE_FORMAT(tickets.open_date, "%Y-%m-%d %H:%i") AS open_date,
          DATE_FORMAT(tickets.closed_date, "%Y-%m-%d %H:%i") AS closed_date,
          (SELECT tagging FROM ticket_work_notes_tbl WHERE ticket_ref_id = tickets.ticket_ref_id ORDER BY id DESC LIMIT 1) AS tagging
          FROM
          ticket_list_tbl tickets
          LEFT JOIN class_tbl class ON tickets.class_id = class.id
          LEFT JOIN shop_tbl shop ON tickets.shop_id = shop.id
          LEFT JOIN ticket_type_tbl ttype ON tickets.ticket_type_id = ttype.id
          LEFT JOIN category_tbl cat ON tickets.category_id = cat.id
          LEFT JOIN sub_category_tbl sub_cat ON tickets.sub_category_id = sub_cat.id
          LEFT JOIN priority_tbl priority ON sub_cat.priority_id = priority.id
          LEFT JOIN ticket_status_tbl tstatus ON tickets.status_id = tstatus.id
          LEFT JOIN technician_tbl tech ON tickets.assigned_tech_id = tech.id
          LEFT JOIN shop_location_tbl loc ON tickets.shop_loc_id = loc.id
          LEFT JOIN cluster_tbl cluster ON loc.cluster_id = cluster.id
          LEFT JOIN platform_tbl platform ON tickets.platform_id = platform.id
          LEFT JOIN department_tbl dept ON tickets.dept_id = dept.id
          LEFT JOIN dept_section_tbl dept_sec ON dept.id = dept_sec.dept_id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN active_org_tbl org ON tickets.active_org_id = org.id
          LEFT JOIN tele_ts_tbl tele_ts ON tickets.tele_ts_id = tele_ts.id
          LEFT JOIN resolution_tbl reso ON tickets.reso_id = reso.id
          LEFT JOIN tagging_tbl tagging ON tickets.tech_tagging_id = tagging.id
          WHERE
          tickets.is_active = 1
          AND
          tickets.id = ?
        `;

        var values = [
          formData.get('id')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        return NextResponse.json(
          {
            result: result[0],
            request: values,
            action: action
          },
          {
            status: 200
          }
        );

        break;

      case 'insertData':

        var query = `
            INSERT INTO ticket_list_tbl 
            (
              ticket_ref_id,
              ticket_type_id,
              category_id,
              sub_category_id,
              priority_id,
              tele_ts_id,
              status_id,
              assigned_tech_id,
              spec_request,
              customer_id,
              customer_name,
              contact_num,
              class_id,
              dept_id,
              dept_sec_id,
              shop_id,
              shop_loc_id,
              active_org_id,
              reso_id,
              resolution,
              platform_id,
              work_note,
              open_date,
              closed_date,
              added_by,
              added_date
            )
            VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        var values = [
          formData.get('ticket_ref_id'),
          formData.get('ticket_type_id'),
          formData.get('category_id'),
          formData.get('sub_category_id'),
          formData.get('priority_id'),
          formData.get('tele_ts_id'),
          formData.get('status_id'),
          formData.get('assigned_tech_id'),
          formData.get('spec_request'),
          formData.get('customer_id'),
          formData.get('customer_name'),
          formData.get('contact_num'),
          formData.get('class_id'),
          formData.get('dept_id'),
          formData.get('dept_sec_id'),
          formData.get('shop_id'),
          formData.get('shop_loc_id'),
          formData.get('active_org_id'),
          formData.get('reso_id'),
          formData.get('resolution'),
          formData.get('platform_id'),
          formData.get('work_note'),
          formData.get('open_date'),
          formData.get('closed_date'),
          // formData.get('status_id') == 2 ? formData.get('added_date') : null,
          formData.get('added_by'),
          formData.get('added_date')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        if (result.serverStatus == 2) {
          var queryLogs = `
          INSERT INTO data_logs_tbl
          (
            transaction,
            module,
            ref_id,
            current_data,
            update_by,
            update_date
          )
          VALUES
          (?,?,?,?,?,?)
          `;

          var dataList = {
            ticket_ref_id: formData.get('ticket_ref_id'),
            ticket_type_id: formData.get('ticket_type_id'),
            category_id: formData.get('category_id'),
            sub_category_id: formData.get('sub_category_id'),
            priority_id: formData.get('priority_id'),
            tele_ts_id: formData.get('tele_ts_id'),
            status_id: formData.get('status_id'),
            assigned_tech_id: formData.get('assigned_tech_id'),
            spec_request: formData.get('spec_request'),
            customer_id: formData.get('customer_id'),
            customer_name: formData.get('customer_name'),
            contact_num: formData.get('contact_num'),
            class_id: formData.get('class_id'),
            dept_id: formData.get('dept_id'),
            dept_sec_id: formData.get('dept_sec_id'),
            shop_id: formData.get('shop_id'),
            shop_loc_id: formData.get('shop_loc_id'),
            active_org_id: formData.get('active_org_id'),
            reso_id: formData.get('reso_id'),
            resolution: formData.get('resolution'),
            platform_id: formData.get('platform_id'),
            work_note: formData.get('work_note'),
            open_date: formData.get('open_date'),
            added_by: formData.get('added_by'),
            added_date: formData.get('added_date')
          };

          var valuesLogs = [
            'insert',
            'ticket_list',
            formData.get('ticket_ref_id'),
            JSON.stringify(dataList),
            formData.get('added_by'),
            formData.get('added_date')
          ];

          var resultLogs = await executeQuery({
            query: queryLogs,
            values: valuesLogs
          });


          return NextResponse.json(
            {
              result: {
                result,
                resultLogs
              },
              request: values,
              action: action
            },
            {
              status: 200
            }
          );
        }
        else {
          return NextResponse.json(
            {
              result
            },
            {
              status: 500
            }
          );
        }


        break;

      case 'updateData':

        var query = `
            UPDATE ticket_list_tbl SET
            ticket_type_id= ?,
            category_id= ?,
            sub_category_id= ?,
            priority_id= ?,
            tele_ts_id= ?,
            status_id= ?,
            assigned_tech_id= ?,
            tech_start = ?,
            tech_end = ?,
            spec_request= ?,
            customer_name= ?,
            contact_num= ?,
            class_id= ?,
            dept_id= ?,
            dept_sec_id= ?,
            shop_id= ?,
            shop_loc_id= ?,
            active_org_id= ?,
            reso_id= ?,
            resolution= ?,
            platform_id= ?,
            tech_tagging_id= ?,
            work_note= ?,
            open_date= ?,
            closed_date= ?,
            update_by = ?,
            update_date = ?
            WHERE
            id = ?
        `;

        var values = [
          formData.get('ticket_type_id'),
          formData.get('category_id'),
          formData.get('sub_category_id'),
          formData.get('priority_id'),
          formData.get('tele_ts_id'),
          formData.get('status_id'),
          formData.get('assigned_tech_id'),
          formData.get('tech_start'),
          formData.get('tech_end'),
          formData.get('spec_request'),
          formData.get('customer_name'),
          formData.get('contact_num'),
          formData.get('class_id'),
          formData.get('dept_id'),
          formData.get('dept_sec_id'),
          formData.get('shop_id'),
          formData.get('shop_loc_id'),
          formData.get('active_org_id'),
          formData.get('reso_id'),
          formData.get('resolution'),
          formData.get('platform_id'),
          formData.get('tech_tagging_id'),
          formData.get('work_note'),
          formData.get('open_date'),
          formData.get('closed_date') != null ? formData.get('closed_date') : null,
          formData.get('update_by'),
          formData.get('update_date'),
          formData.get('id')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        if (result.serverStatus == 2) {
          var queryLogs = `
          INSERT INTO data_logs_tbl
          (
            transaction,
            module,
            ref_id,
            current_data,
            update_by,
            update_date
          )
          VALUES
          (?,?,?,?,?,?)
          `;

          var dataList = {
            ticket_ref_id: formData.get('ticket_ref_id'),
            ticket_type_id: formData.get('ticket_type_id'),
            category_id: formData.get('category_id'),
            sub_category_id: formData.get('sub_category_id'),
            priority_id: formData.get('priority_id'),
            tele_ts_id: formData.get('tele_ts_id'),
            status_id: formData.get('status_id'),
            assigned_tech_id: formData.get('assigned_tech_id'),
            tech_start: formData.get('tech_start'),
            tech_end: formData.get('tech_end'),
            spec_request: formData.get('spec_request'),
            customer_id: formData.get('customer_id'),
            customer_name: formData.get('customer_name'),
            contact_num: formData.get('contact_num'),
            class_id: formData.get('class_id'),
            dept_id: formData.get('dept_id'),
            dept_sec_id: formData.get('dept_sec_id'),
            shop_id: formData.get('shop_id'),
            shop_loc_id: formData.get('shop_loc_id'),
            active_org_id: formData.get('active_org_id'),
            reso_id: formData.get('reso_id'),
            resolution: formData.get('resolution'),
            platform_id: formData.get('platform_id'),
            work_note: formData.get('work_note'),
            open_date: formData.get('open_date'),
            added_by: formData.get('added_by'),
            added_date: formData.get('added_date')
          };

          var valuesLogs = [
            'update',
            'ticket_list',
            formData.get('ticket_ref_id'),
            JSON.stringify(dataList),
            formData.get('update_by'),
            formData.get('update_date')
          ];

          var resultLogs = await executeQuery({
            query: queryLogs,
            values: valuesLogs
          });

          return NextResponse.json(
            {
              result: {
                result,
                valuesLogs
              },
              request: values,
              action: action
            },
            {
              status: 200
            }
          );
        }
        else {
          return NextResponse.json(
            {
              result
            },
            {
              status: 500
            }
          );
        }



        break;

      case 'updateTechData':

        var reso_id = formData.get('reso_id')
        var resolution = formData.get('resolution')
        var assigned_tech_id = formData.get('assigned_tech_id')
        var tagging = formData.get('tagging')
        var user_id = formData.get('added_by')
        var timestamp = formData.get('timestamp')
        var ticket_ref_id = formData.get('ticket_ref_id')

        var query = `
            UPDATE ticket_list_tbl SET
            active_org_id = ?,
            reso_id= ?,
            resolution= ?,
            assigned_tech_id = ?,
            tech_tagging_id = ?,
            ${tagging == 4 ? 'tech_start' : 'tech_end'} = ?,
            status_id= ?,
            is_3p_dependent = ?,
            update_by = ?,
            update_date = ?
            WHERE
            ticket_ref_id = ?
        `;

        var values = [
          tagging == 2 ? 3 : tagging == 3 ? 6 : tagging == 4 ? 4 : 1, // active_org_id selection
          reso_id,
          resolution,
          tagging == 2 ? null : assigned_tech_id, // tech assignment
          tagging == 2 ? null : tagging, // tech tagging
          tagging == 4 ? timestamp : tagging == 3 ? null : timestamp, // start and end
          tagging != 1 ? 1 : 3, // status id selection
          tagging == 3 ? 1 : 0, // is 3rd party
          user_id,
          timestamp,
          ticket_ref_id
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        if (result.serverStatus == 34) {
          var queryLogs = `
          INSERT INTO data_logs_tbl
          (
            transaction,
            module,
            ref_id,
            current_data,
            update_by,
            update_date
          )
          VALUES
          (?,?,?,?,?,?)
          `;

          var dataList = {
            active_org_id: tagging == 2 ? 3 : tagging == 3 ? 6 : tagging == 4 ? 4 : 1,
            reso_id: formData.get('reso_id'),
            resolution: formData.get('resolution'),
            tagging: formData.get('tagging'),
            timestamp: timestamp,
            status_id: tagging != 1 ? 1 : 3,
            is_3p_dependent: tagging == 3 ? 1 : 0,
            update_by: formData.get('added_by'),
            update_date: timestamp,
          };

          var valuesLogs = [
            'update',
            'ticket_list',
            formData.get('ticket_ref_id'),
            JSON.stringify(dataList),
            formData.get('added_by'),
            timestamp
          ];

          var resultLogs = await executeQuery({
            query: queryLogs,
            values: valuesLogs
          });

          return NextResponse.json(
            {
              result: {
                result,
                valuesLogs
              },
              request: values,
              action: action
            },
            {
              status: 200
            }
          );
        }
        else {
          return NextResponse.json(
            {
              result
            },
            {
              status: 500
            }
          );
        }



        break;

      case 'updateLeadData':

        var query = `
            UPDATE ticket_list_tbl SET
            active_org_id = ?,
            assigned_tech_id = ?,
            assigned_date = ?,
            tech_start = ?,
            tech_end = ?,
            update_by = ?,
            update_date = ?
            WHERE
            ticket_ref_id = ?
        `;

        var values = [
          formData.get('active_org_id') == 6 ? formData.get('active_org_id') : 4,
          formData.get('assigned_tech_id'),
          formData.get('assigned_date'),
          formData.get('tech_start'),
          formData.get('tech_end'),
          formData.get('update_by'),
          formData.get('update_date'),
          formData.get('ticket_ref_id')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        if (result.serverStatus == 34) {
          var queryLogs = `
          INSERT INTO data_logs_tbl
          (
            transaction,
            module,
            ref_id,
            current_data,
            update_by,
            update_date
          )
          VALUES
          (?,?,?,?,?,?)
          `;

          var dataList = {
            active_org_id: 4,
            assigned_tech_id: formData.get('assigned_tech_id'),
            assigned_date: formData.get('assigned_date'),
            tech_start: formData.get('tech_start'),
            tech_end: formData.get('tech_end'),
            update_by: formData.get('update_by'),
            update_date: formData.get('update_date'),
            ticket_ref_id: formData.get('ticket_ref_id')
          };

          var valuesLogs = [
            'update',
            'ticket_list',
            formData.get('ticket_ref_id'),
            JSON.stringify(dataList),
            formData.get('update_by'),
            formData.get('update_date')
          ];

          var resultLogs = await executeQuery({
            query: queryLogs,
            values: valuesLogs
          });

          return NextResponse.json(
            {
              result: {
                result,
                valuesLogs
              },
              request: values,
              action: action
            },
            {
              status: 200
            }
          );
        }
        else {
          return NextResponse.json(
            {
              result
            },
            {
              status: 500
            }
          );
        }

        break;


      case 'disableData':

        var query = `
                    UPDATE ticket_list_tbl SET
                    is_active = 0
                    WHERE
                    id = ?
                `;

        var values = [
          formData.get('id')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        return NextResponse.json(
          {
            result: result,
            request: values,
            action: action
          },
          {
            status: 200
          }
        );

        break;

      case 'getWorkNote':

        var query = `
          SELECT
          work_note.id,
          work_note.ticket_ref_id,
          work_note.work_notes,
          work_note.resolution,
          DATE_FORMAT(work_note.timestamp, "%Y-%m-%d %H:%i") AS timestamp,
          tag.id as tag_id,
          tag.tagging,
          role.role,
          user.id as user_id,
          CONCAT(user.fname,' ',user.lname) AS user_name,
          DATE_FORMAT(work_note.added_date, "%Y-%m-%d %H:%i") AS added_date
          FROM
          ticket_work_notes_tbl work_note
          LEFT JOIN user_tbl user ON work_note.added_by = user.id
          LEFT JOIN tagging_tbl tag ON work_note.tagging = tag.id
          LEFT JOIN role_tbl role ON user.role_id = role.id
          WHERE
          work_note.is_active = 1
          AND
          work_note.ticket_ref_id = ?
          ORDER BY work_note.id DESC
        `;

        var values = [
          formData.get('id')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        return NextResponse.json(
          {
            result: result,
            request: values,
            action: action
          },
          {
            status: 200
          }
        );

        break;

      case 'insertWorkNote':

        var query = `
            INSERT INTO ticket_work_notes_tbl 
            (
              ticket_ref_id,
              work_notes,
              tagging,
              timestamp,
              reso_id,
              resolution,
              added_by,
              added_date
            )
            VALUES
            (?,?,?,?,?,?,?,?)
        `;

        var values = [
          formData.get('ticket_ref_id'),
          formData.get('work_note'),
          formData.get('tagging'),
          formData.get('timestamp'),
          formData.get('reso_id'),
          formData.get('resolution'),
          formData.get('added_by'),
          formData.get('added_date')
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        if (result.serverStatus == 2) {
          var queryLogs = `
            INSERT INTO data_logs_tbl
            (
              transaction,
              module,
              ref_id,
              current_data,
              update_by,
              update_date
            )
            VALUES
            (?,?,?,?,?,?)
          `;

          var dataList = {
            ticket_ref_id: formData.get('ticket_ref_id'),
            work_note: formData.get('work_note'),
            tagging: formData.get('tagging'),
            timestamp: formData.get('start'),
            reso_id: formData.get('reso_id'),
            resolution: formData.get('resolution'),
            added_by: formData.get('added_by'),
            added_date: formData.get('added_date')
          };

          var valuesLogs = [
            'insert',
            'work_note',
            formData.get('ticket_ref_id'),
            JSON.stringify(dataList),
            formData.get('added_by'),
            formData.get('added_date')
          ];

          var resultLogs = await executeQuery({
            query: queryLogs,
            values: valuesLogs
          });

          return NextResponse.json(
            {
              result: result,
              request: values,
              action: action
            },
            {
              status: 200
            }
          );
        }
        else {
          return NextResponse.json(
            {
              result
            },
            {
              status: 500
            }
          );
        }



        break;

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

};

const handler = () => {


}