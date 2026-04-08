import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';

export async function GET(request, { params }) {

   const action = params.action;
   
   const searchParams = request.nextUrl.searchParams;
   const page = searchParams.get('page')
   const per_page = searchParams.get('per_page')
   const start = page == 1 ? 0 : (page - 1) * per_page
   const limit = parseInt(per_page)

   const pageQuery = {
      page: page,
      per_page: per_page
   }

   
   try {
      switch (action) {

         case 'getList':
   
            var query = `
               SELECT
                  customer.id,
                  customer.customer_name AS name,
                  customer.email_add,
                  customer.contact_num,
                  customer.dept_id,
                  dept.department AS dept_name
               FROM
                  customer_tbl customer
               LEFT JOIN 
                  department_tbl dept ON customer.dept_id = dept.id
               WHERE
                  customer.is_active = 1
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

         case 'getDetails':

            var query = `
               SELECT
                  customer.id AS id,
                  customer.customer_name AS name,
                  customer.email_add,
                  customer.contact_num,
                  customer.dept_id,
                  dept.department AS dept_name,
                  customer.is_active
               FROM
                  customer_tbl customer
               LEFT JOIN 
                  department_tbl dept ON customer.dept_id = dept.id
            `

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
   const formData = request ? await request.formData() : null;
   
   try {
      switch (action) {

      case 'getData':

         var query = `
            SELECT
               customer.id AS customer_id,
               customer.customer_name AS name,
               customer.email_add,
               customer.contact_num,
               customer.dept_id,
               dept.department AS dept_name,
               customer.is_active
            FROM
               customer_tbl customer
            LEFT JOIN 
               department_tbl dept ON customer.dept_id = dept.id
            WHERE
               customer.id = ?
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
            INSERT INTO 
               customer_tbl 
               (customer_name,email_add,contact_num, dept_id, added_by, added_date)
            VALUES
               (?,?,?,?,?,?)
         `

         var values = [
            formData.get('customer_name'),
            formData.get('email_add'),
            formData.get('contact_num'),
            formData.get('dept_id'),
            formData.get('added_by'),
            formData.get('added_date')
         ];

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
            UPDATE customer_tbl SET
               customer_name = ?,
               email_add = ?,
               contact_num = ?,
               dept_id = ?,
               update_by = ?,
               update_date = ?,
               is_active = ?
            WHERE
               id = ?
         `

         var values = [
            formData.get('customer_name'),
            formData.get('email_add'),
            formData.get('contact_num'),
            formData.get('dept_id'),
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
            UPDATE customer_tbl SET
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
         );
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