import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';

export async function GET(request, { params }) {

  const action = params.action;

  try {
    switch (action) {
      case 'getList':

        var query = `
          SELECT
          id,
          section as name,
          dept_id as dependency_id
          FROM
          dept_section_tbl
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

      case 'getListPerDepartment':

        const searchParams = request.nextUrl.searchParams;
        const dept_id = searchParams.get('dept_id');

        var query = `
          SELECT
          id,
          section as name
          FROM
          dept_section_tbl
          WHERE
          dept_id = ? 
        `;

        var values = [dept_id];

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
                    dept_section_tbl
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
                    dept_section_tbl
                    WHERE
                    is_active = 1
                    AND
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

      case 'insertData':

        var query = `
                    INSERT INTO dept_section_tbl 
                    (sec_code,section,dept_id,added_by,added_date)
                    VALUES
                    (?,?,?)
                `;

        var values = [
          formData.get('sec_code'),
          formData.get('section'),
          formData.get('dept_id'),
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
                    UPDATE dept_section_tbl SET
                    sec_code = ?,
                    section = ?,
                    dept_id = ?,
                    update_by = ?,
                    update_date = ?,
                    is_active = ?
                    WHERE
                    id = ?
                `;

        var values = [
          formData.get('sec_code'),
          formData.get('section'),
          formData.get('dept_id'),
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
                    UPDATE dept_section_tbl SET
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
