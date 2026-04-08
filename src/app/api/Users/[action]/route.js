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
          username as name
          FROM
          user_tbl
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

      case 'getDetails':

        var query = `
          SELECT
          user.id,
          user.fname,
          user.lname,
          user.username,
          user.email_add,
          user.role_id,
          role.role AS role_name,
          user.is_active
          FROM
          user_tbl user
          LEFT JOIN role_tbl role ON user.role_id = role.id

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
          user_tbl
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
          user.id,
          user.fname,
          user.lname,
          user.username,
          user.email_add,
          user.role_id,
          roles.role AS role_name,
          user.tech_id,
          tech.technician_name AS tech_name,
          user.is_active
          FROM
          user_tbl user
          LEFT JOIN role_tbl roles ON user.role_id = roles.id
          LEFT JOIN technician_tbl tech on user.tech_id = tech.id
          WHERE
          user.id = ?
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
      case 'getPassword':

        var query = `
          SELECT
            password
          FROM
            user_tbl
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

        

      case 'insertData':

        var query = `
                    INSERT INTO user_tbl 
                    (fname,lname,username,email_add,password,role_id,tech_id,token,is_active)
                    VALUES
                    (?,?,?,?,?,?,?,?,?)
                `;

        var values = [
            formData.get('fname'),
            formData.get('lname'),
            formData.get('username'),
            formData.get('email_add'),
            formData.get('password'),
            formData.get('role_id'),
            formData.get('tech_id'),
            formData.get('token'),
            formData.get('is_active')
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
                    UPDATE user_tbl SET
                    username = ?,
                    fname = ?,
                    lname = ?,
                    email_add = ?,
                    role_id = ?,
                    tech_id = ?,
                    is_active = ?
                    WHERE
                    id = ?
                `;

        var values = [
          formData.get('username'),
          formData.get('fname'),
          formData.get('lname'),
          formData.get('email_add'),
          formData.get('role_id'),
          formData.get('tech_id'),
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


        case 'changePassword':
        var query = `
                    UPDATE user_tbl SET
                    password = ?,
                    is_default_pass = ?
                    WHERE
                    id = ?
                `;

        var values = [
          formData.get('password'),
          formData.get('is_default_pass'),
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
                    UPDATE user_tbl SET
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




const handler = () => {


}