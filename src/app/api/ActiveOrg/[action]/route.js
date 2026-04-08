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
               org_code as code, 
               active_org as name,
            FROM
               active_org_tbl
            WHERE
               is_active = 1
         `

         var values = [];

         var result = await executeQuery({
            query: query,
            values: values
         })

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
         )

      case 'getDetails':

         var query = `
            SELECT
               id,
               active_org as name,
               org_code as code,
               is_active
            FROM
               active_org_tbl
            `;

         var values = [start, limit];

         var result = await executeQuery({
            query: query,
            values: values
         })

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
      )
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
               id,
               active_org as name,
               org_code as code
            FROM 
               active_org_tbl
            WHERE 
               is_active = 1
         `

         var values = []

         var result = await executeQuery({
            query: query,
            values: values
         })

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
               id,
               active_org, 
               org_code, 
               is_active
               FROM 
               active_org_tbl
            WHERE 
               id = ?
         `

         var values = [
            formData.get('id')
         ]

         var result = await executeQuery({
            query: query,
            values: values
         })

         return NextResponse.json(
            {
               result: result[0],
               request: values,
               action: action
            },
            {
               status: 200
            }
         )

      case 'insertData':

         var query = `
            INSERT INTO active_org_tbl 
               (org_code,active_org,added_by,added_date)
            VALUES 
               (?,?,?,?)
         `

         var values = [
            formData.get('org_code'),
            formData.get('active_org'),
            formData.get('added_by'),
            formData.get('added_date')
         ]

         var result = await executeQuery({
            query: query,
            values: values
         })

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

      case 'updateData':

         var query = `
            UPDATE active_org_tbl SET
               org_code = ?,
               active_org = ?,
               update_by = ?,
               update_date = ?,
               is_active = ?
            WHERE 
               id = ?
         `

         var values = [
            formData.get('org_code'),
            formData.get('active_org'),
            formData.get('update_by'),
            formData.get('update_date'),
            formData.get('is_active'),
            formData.get('id')
         ]

         var result = await executeQuery({
            query: query,
            values: values
         })

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

      case 'disableData':

         var query = `
            UPDATE active_org_tbl SET
               is_active = 0
            WHERE 
               id = ?
                  `

         var values = [
            formData.get('id')
         ]

         var result = await executeQuery({
            query: query,
            values: values
         })

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
      
      default:

         return NextResponse.json(
            {
               error: 'Action not found'
            },
            {
               status: 404
            }
         )
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
      )
   }
}
