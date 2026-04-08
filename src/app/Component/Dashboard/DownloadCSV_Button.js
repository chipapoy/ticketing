import React from 'react'

import { CSVLink } from 'react-csv'

import moment from 'moment'

import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadCSV_Button = (props) => {
   return (
      <button 
         className='sm:mt-0 sm:w-auto mt-3 justify-center ring-1 ring-inset ring-gray-500 px-3 py-2 text-md font-medium hover:font-semibold bg-green-600 text-white hover:bg-green-700 hover:text-gray-100'>
         <CSVLink
            data={props.extractData}
            filename={`${moment().format('MM-DD-YYYY HH-mm')} ${props.title}`}>
            Extract <FileDownloadIcon className='text-white '/>
         </CSVLink>
      </button>
   )
}

export default DownloadCSV_Button