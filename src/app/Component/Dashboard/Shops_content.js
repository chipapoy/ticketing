import React from 'react'

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import {    
   Accordion,
   AccordionDetails,
   AccordionSummary,
   Card,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   styled 
} from '@mui/material';

const Shops_content = (props) => {

      const Accordion = styled((props) => (
         <MuiAccordion disableGutters elevation={0} {...props} />
      ))(({ theme }) => ({
         border: `1px solid ${theme.palette.divider}`,
         '&:not(:last-child)': {
         borderBottom: 0,
         },
         '&:before': {
         display: 'none',
         },
      }))
      
      const AccordionSummary = styled((props) => (
         <MuiAccordionSummary
         expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
         {...props}
         />
      ))(({ theme }) => ({
         backgroundColor:
         theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
         flexDirection: 'row-reverse',
         '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
         transform: 'rotate(90deg)',
         },
         '& .MuiAccordionSummary-content': {
         marginLeft: theme.spacing(1),
         },
      }))
      
      const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
         padding: theme.spacing(2),
         borderTop: '1px solid rgba(0, 0, 0, .125)',
      }))
   
   return (
      <div className='mb-8 mx-4'>
         {props.shopsArr.map((item, index) => (
            <Accordion key={index}>
               <AccordionSummary>
                  <div className='w-full text-xs flex justify-between gap-4'>
                     <Typography>{item.shop_name}</Typography>
                     <Typography className='font-semibold'>{item.total_shop}</Typography>
                  </div>
               </AccordionSummary>
               {props.shopsLocArr.filter(shopsLoc => shopsLoc.shop_name === item.shop_name).length > 0 ? 
               <AccordionDetails>
                  <TableContainer sx={{ width: 'auto', margin: 2 }}>
                     <Table className='p-4'>
                        <TableHead>
                           <TableRow>
                              <TableCell className='font-semibold'>Shop Name</TableCell>
                              <TableCell align='center' className='font-semibold'>Total Tickets</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                        {props.shopsLocArr.map((loc, index2) => {
                           
                           return(
                              item.shop_name === loc.shop_name ? (
                              <TableRow key={index2}>
                                 <TableCell className='text-xs'>{loc.area_location}</TableCell>
                                 <TableCell align='center' className='text-xs'>{loc.area_count}</TableCell>
                              </TableRow>
                              )
                              :
                              null
                        )})}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </AccordionDetails>
               :
               <AccordionDetails>
                  <Typography>No Data available</Typography>
               </AccordionDetails>}
            </Accordion>
         ))}
      </div>
   )
}

export default Shops_content