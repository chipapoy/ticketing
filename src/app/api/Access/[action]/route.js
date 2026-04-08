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

        const searchParams = request.nextUrl.searchParams;
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
      case 'login':

        var query = `
            SELECT
            id,
            CONCAT(fname,' ',lname) as name,
            email_add,
            username,
            role_id,
            token,
            tech_id,
            is_default_pass
            FROM
            user_tbl
            WHERE
            username =?
            AND
            password = ?
            AND
            is_active = 1
        `;

        var values = [
          formData.get('username'),
          formData.get('password')
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

      case 'logs':

        var query = `
            INSERT INTO user_logs_tbl
            (
              username,
              login_date
            )
            VALUES
            (?,?)
        `;

        var values = [
          formData.get('username'),
          formData.get('login_date')
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

      case 'resetPassword':

        var query = `
            UPDATE user_tbl
            SET
            is_default_pass = 0,
            password = ?
            WHERE
            id = ?
        `;

        var values = [
          formData.get('password'),
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