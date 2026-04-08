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
            ticket_ref_id,
            work_notes,

            FROM
            ticket_work_notes_tbl
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

      case 'getData':

      const ref_id = searchParams.get('ticket_ref_id')

         var query = `
         SELECT 
         *
         FROM
         ticket_work_notes_tbl
         WHERE
         ticket_ref_id = '${ref_id}'
         ORDER BY id DESC LIMIT 1
            `;

         var values = [];

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
         ticket_work_notes_tbl
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
      ticket_work_notes_tbl
      WHERE
      ticket_ref_id = ?
      ORDER BY id DESC LIMIT 1
      `;

      var values = [
         formData.get('ticket_ref_id')
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
