import { NextResponse } from "next/server";
import executeQuery from '@/connections/db';

const StageAllowed = (role_id) => {

  switch (role_id) {
    case 1: // ADMIN
      return "(1,2,3,4,5,6)";

    case 2: // HELPDESK
      return "(1,2,3,4,5,6)";

    case 6: // IT LEAD
      return "(3,4,5,6)";

    case 7: // FIELD TECH1
      return "(4,5,6)";

    case 8: // FIELD TECH2
      return "(4,5,6)";

    default:
      break;
  }

}

export async function GET(request, { params }) {

  const action = params.action;
  const searchParams = request.nextUrl.searchParams;


  const page = searchParams.get('page');
  const per_page = searchParams.get('per_page');
  const start = page == 1 ? 0 : (page - 1) * per_page;
  const limit = per_page * 1;

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
            resolution as name,
            is_active
            FROM
            resolution_tbl
         `;

         var values = [start, limit];

         var result = await executeQuery({
            query: query,
            values: values
         });

         return NextResponse.json(
            {
               ...pageQuery,
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
               resolution as name,
               is_active
               FROM
               resolution_tbl
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
               status: 200
            }
         );

         case 'getData':

         var query = `
                     SELECT
                     *
                     FROM
                     resolution_tbl
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
                     INSERT INTO resolution_tbl 
                     (resolution,added_by,added_date)
                     VALUES
                     (?,?,?)
                  `;

         var values = [
            formData.get('resolution'),
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
                     UPDATE resolution_tbl SET
                     resolution = ?,
                     update_by = ?,
                     update_date = ?,
                     is_active = ?
                     WHERE
                     id = ?
                  `;

         var values = [
            formData.get('resolution'),
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
                     UPDATE resolution_tbl SET
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