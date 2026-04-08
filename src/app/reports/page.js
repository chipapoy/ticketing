"use client";

import Reports_TicketList from '../Component/Reports/Reports_TicketList';

import Top_nav from '@/Component/UI/Top_nav';
import { Disclosure } from '@headlessui/react';
import { React, useState } from 'react';
import { user, userNavigation } from '../Collections/collections';

import { DateRangePicker, DateRangePickerItem, } from '@tremor/react';

import moment from 'moment';

const Reports = () => {

    const [dateValue, setDateValue] = useState({
        //year, month, day
        from: new Date(moment().startOf('week')),
        to: new Date(),
    })

    const updateDateValue = (selectedRange) => {
       
        if (selectedRange.selectValue === undefined){  
            const newToDate = moment(selectedRange.to)
            newToDate.set('hour', 23)
            newToDate.set('minute', 59)
            newToDate.set('second', 59)
            newToDate.set('millisecond', 999)
   
            setDateValue({from: selectedRange.from, to: new Date(newToDate)})
         }
   
         if (selectedRange.to === undefined && selectedRange.from !== undefined){
            selectedRange.to = selectedRange.from
         }
         
         setDateValue(selectedRange)
    }

    return (
        <>
        {/* {console.log(`Date from: ${dateValue.from} | Date to: ${dateValue.to}`)} */}
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <Top_nav
                            user={user}
                            userNavigation={userNavigation}
                            pageName={"Reports"}
                        />
                    </>
                )}
            </Disclosure>
            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-full px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reports</h1>
                    <DateRangePicker
                        className="max-w-sm ml-auto"
                        value={dateValue}
                        onValueChange={
                            updateDateValue
                        }
                        selectPlaceholder={
                            <span className='text-center'>Filter by Date</span>
                        }
                    >
                        <DateRangePickerItem key="YTD" value="YTD" from={new Date(moment().year(), 0, 1)}>
                            Year to Date
                        </DateRangePickerItem>

                        <DateRangePickerItem
                            key="WTD"
                            value="WTD"
                            from={new Date(moment().startOf('week'))}
                            to={new Date(moment())}
                        >
                            Week to Date
                        </DateRangePickerItem>

                        <DateRangePickerItem
                            key="MTD"
                            value="MTD"
                            from={new Date(moment().startOf('month'))}
                            to={new Date(moment())}
                        >
                            Month to Date
                        </DateRangePickerItem>
                        <DateRangePickerItem
                            key="DTD"
                            value="DTD"
                            from={new Date(moment())}
                            to={new Date(moment())}
                        >
                            Today
                        </DateRangePickerItem>
                    </DateRangePicker>
                </div>
            </header>
            <main>
                <div className="grid auto-rows-max">
                    <div className='mt-10 grid'>
                        <Reports_TicketList
                            filterDate={dateValue}
                        />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Reports