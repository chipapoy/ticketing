import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';

export async function GET(request, { params }) {

  const action = params.action;

  try {
    switch (action) {
      case 'customer':

        var query = `
          SELECT
          id,
          customer_name as name,
          email_add,
          contact_num
          FROM
          customer_tbl
          WHERE
          is_active = 1
          ORDER BY customer_name ASC
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'resolution':

        var query = `
          SELECT
          id,
          resolution as name
          FROM
          resolution_tbl
          WHERE
          is_active = 1
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'stage':

        var query = `
          SELECT
          id,
          stage as name
          FROM
          stage2_tbl
          WHERE
          is_active = 1
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;
      case 'ticket_stage':

        var query = `
          SELECT
          id,
          stage as name
          FROM
          stage_tbl
          WHERE
          is_active = 1
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'ticket_status':

        var query = `
          SELECT
          id,
          status as name
          FROM
          ticket_status_tbl
          WHERE
          is_active = 1
          ORDER BY FIELD(status, 'Open', 'Resolved', 'Closed')
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'tech_tagging':

        var query = `
          SELECT
          id,
          tagging as name
          FROM
          tagging_tbl
          WHERE
          is_active = 1
          AND
          id NOT IN (4,5,100)
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'helpdesk_tagging':

        var query = `
          SELECT
          id,
          tagging as name
          FROM
          tagging_tbl
          WHERE
          is_active = 1
          AND
          id NOT IN (3,4,5,100)
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'ftlead_tagging':

        var query = `
          SELECT
          id,
          tagging as name
          FROM
          tagging_tbl
          WHERE
          is_active = 1
          AND
          id NOT IN (3,4,5,100)
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'active_org':

        var query = `
          SELECT
          id,
          active_org as name
          FROM
          active_org_tbl
          WHERE
          is_active = 1
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
        );

        break;

      case 'open_ticket_notif':

        var query = `
          SELECT
          ticket_list.id,
          ticket_status.status,
          prio.priority,
          ticket_list.open_date
          FROM
          ticket_list_tbl ticket_list,
          sub_category_tbl sub_cat,
          priority_tbl prio,
          ticket_status_tbl ticket_status
          WHERE
          ticket_list.sub_category_id = sub_cat.id
          AND
          sub_cat.priority_id = prio.id 
          AND
          ticket_list.status_id = ticket_status.id
          AND
          ticket_status.status IN ("Open","Resolve")
          ORDER BY prio.priority DESC, open_date DESC
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
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          }
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


const handler = () => {


}