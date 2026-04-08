import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';

export async function GET(request, { params }) {

  const action = params.action;
  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page');
  const per_page = searchParams.get('per_page');
  const start = page == 1 ? 0 : (page - 1) * per_page;
  const limit = parseInt(per_page);

  const pageQuery = {
     page: page,
     per_page: per_page
  }

  try {
    switch (action) {
      case 'getList':

        var query = `
          SELECT
          id,
          technician_name as name,
          location
          FROM
          technician_tbl
          WHERE
          is_active = 1
          ORDER BY name ASC
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

      case 'getDetails':

        var query = `
          SELECT
          id,
          technician_name as name,
          location,
          is_active
          FROM
          technician_tbl
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
  const formData = await request.formData();

  try {
    switch (action) {
      case 'getList':

        var query = `
            SELECT
            *
            FROM
            technician_tbl
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
        );

        break;

      case 'getData':

        var query = `
            SELECT
            *
            FROM
            technician_tbl
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
            INSERT INTO technician_tbl 
            (technician_name,location,added_by,added_date)
            VALUES
            (?,?,?,?)
        `;

        var values = [
          formData.get('technician_name'),
          formData.get('location'),
          formData.get('added_by'),
          formData.get('added_date')
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

      case 'updateData':

        var query = `
            UPDATE technician_tbl SET
            technician_name = ?,
            location = ?,
            update_by = ?,
            update_date = ?,
            is_active = ?
            WHERE
            id = ?
        `;

        var values = [
          formData.get('technician_name'),
          formData.get('location'),
          formData.get('update_by'),
          formData.get('update_date'),
          formData.get('is_active'),
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

      case 'disableData':

        var query = `
            UPDATE technician_tbl SET
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
//             technician_tbl cat
//             LEFT JOIN
//             sub_technician_tbl sub_cat 
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