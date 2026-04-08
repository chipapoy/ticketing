import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';

export async function GET(request, { params }) {

  const action = params.action;

  const searchParams = request.nextUrl.searchParams;

  try {
    switch (action) {
      case 'getList':

        var query = `
          SELECT
          id,
          sub_category as name,
          category_id as dependency_id,
          priority_id,
          sla_id
          FROM
          sub_category_tbl
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

      case 'getListPerCategory':


        const cat_id = searchParams.get('cat_id');

        var query = `
          SELECT
          id,
          sub_category as name
          FROM
          sub_category_tbl
          WHERE
          category_id = ? 
        `;

        var values = [cat_id];

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

      case 'getDetails':
          
          const page = searchParams.get('page');
          const per_page = searchParams.get('per_page');
          const start = page == 1 ? 0 : (page - 1) * per_page;
          const limit = parseInt(per_page);

        const pageQuery = {
          page: page,
          per_page: per_page
        }

        var query = `
          SELECT
          sub_cat.id AS id,
          sub_cat.sub_category AS name,
          tt.ticket_type AS ticket_type_dependency,
          cat.category AS cat_dependency,
          sla.sla AS sla,
          prio.priority AS priority,
          sub_cat.is_active
          FROM
          sub_category_tbl sub_cat
          LEFT JOIN category_tbl cat ON sub_cat.category_id = cat.id 
          LEFT JOIN ticket_type_tbl tt ON sub_cat.ticket_type_id = tt.id
          LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
          LEFT JOIN priority_tbl prio ON sub_cat.priority_id = prio.id
        `;

        var values = [start, limit];

        var result = await executeQuery({
          query: query,
          values: values
        });

        return NextResponse.json(
          {
            result: {
              ...pageQuery,
              data:result
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
        error: 'Catch error'
      },
      {
        status: 404
      }
    );
  }
}

export async function POST(request, { params }) {

  const action = params.action;
  const formData = await request.formData();

  try {
    switch (action) {
      case 'getList':

        var query = `
            SELECT
            *
            FROM
            sub_category_tbl
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
            status: 200
          }
        )

      case 'getData':

        var query = `
          SELECT
            sub_cat.id,
            sub_cat.sub_category AS sub_cat_name,
            tt.id AS ttype_id,
            tt.ticket_type AS ticket_type_dependency,
            cat.id AS cat_id,
            cat.category AS cat_dependency,
            sla.id AS sla_id,
            sla.sla AS sla,
            prio.id AS prio_id,
            prio.priority AS priority,
            sub_cat.is_active
          FROM
            sub_category_tbl sub_cat
            LEFT JOIN category_tbl cat ON sub_cat.category_id = cat.id 
            LEFT JOIN ticket_type_tbl tt ON sub_cat.ticket_type_id = tt.id
            LEFT JOIN sla_tbl sla ON sub_cat.sla_id = sla.id
            LEFT JOIN priority_tbl prio ON sub_cat.priority_id = prio.id
            WHERE
            sub_cat.id = ?
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
            INSERT INTO sub_category_tbl 
            (sub_category,category_id,sla_id,priority_id,added_by,added_date,ticket_type_id)
            VALUES
            (?,?,?,?,?,?,?)
        `;

        var values = [
          formData.get('sub_category'),
          formData.get('category_id'),
          formData.get('sla_id'),
          formData.get('priority_id'),
          formData.get('added_by'),
          formData.get('added_date'),
          formData.get('ticket_type_id'),
        ];

        var result = await executeQuery({
          query: query,
          values: values
        });

        return NextResponse.json(
          {
            result: {
              data: result,
            },
            request: {
              value: values,
            },
            action: action
          },
          {
            status: 200
          }
        );

      case 'updateData':

        var query = `
            UPDATE sub_category_tbl SET
            sub_category = ?,
            category_id = ?,
            sla_id = ?,
            priority_id = ?,
            update_by = ?,
            update_date = ?,
            is_active = ?,
            ticket_type_id = ?
            WHERE
            id = ?
        `;

        var values = [
          formData.get('sub_category'),
          formData.get('category_id'),
          formData.get('sla_id'),
          formData.get('priority_id'),
          formData.get('update_by'),
          formData.get('update_date'),
          formData.get('is_active'),
          formData.get('ticket_type_id'),
          formData.get('id'),
        ]
        

        var result = await executeQuery({
          query: query,
          values: values
        })


        return NextResponse.json(
          {
            result: {
              data: result
            },
            request: {
              value: values
            },
            action: action
          },
          {
            status: 200
          }
        );

      case 'disableData':

        var query = `
            UPDATE sub_category_tbl SET
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


// export async function POST(req) {

//     try {

//         const query = `
//             SELECT
//             *
//             FROM
//             sub_category_tbl cat
//             LEFT JOIN
//             sub_sub_category_tbl sub_cat 
//             ON cat.id = sub_cat.category_id
//         `;

//         const result = await executeQuery({
//             query: query,
//             values: ''
//         });

//         return NextResponse.json(
//             { 
//                 result: result,
//                 request: req
//             },
//             {
//                 status: 200
//             }
//         );
//     } 
//     catch (error) {
//         return NextResponse.json(
//             { 
//                 error: error 
//             },
//             {
//                 status: 404
//             }
//         );
//     }

// };


const handler = () => {


}