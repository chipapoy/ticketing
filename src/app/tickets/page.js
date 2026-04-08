"use client";

import { useEffect, useState } from 'react';
import React from 'react'
import Top_nav from '@/Component/UI/Top_nav'
import { user, userNavigation } from '../Collections/collections';
import { Disclosure } from '@headlessui/react';

import Modal_window from '@/Component/UI/Modal_window';
import Create from '@/Component/Forms/Tickets/Create';
import TicketList from '@/Component/UI/Tickets/List';
import TicketListTech from '@/Component/UI/Tickets/ListTech';
import { Inter } from 'next/font/google'
import { IconButton } from "@material-tailwind/react";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

const Tickets = () => {

  const [modalInfo, setModalInfo] = useState({
    open: false,
    module: '',
    title: '',
    content: null
  });

  const [ticketDetails, setTicketDetails] = useState({
    ticket_id: null
  });

  const toggleCallback = (data) => {
    setModalInfo({
      open: data.open,
      module: data.module,
      title: data.title,
      content: data.content
    });
  };

  const ticketDetailsCB = (data) => {
    setTicketDetails({
      ticket_id: data.ticket_id
    });
  };

  useEffect(() => {

    console.log(ticketDetails);

  }, [])

  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <Top_nav
              user={user}
              userNavigation={userNavigation}
              pageName={"Tickets"}
              open={open}
            />
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow">
        <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tickets</h1>
        </div>
      </header>
      <main>
        {/* <div className="container"> */}
          <div className="grid auto-rows-max">
            <div>
              {/* <CreateButton
                buttonName="New Ticket"
                toggleCallback={toggleCallback}
              // isDisabled={disableBtn}
              /> */}
              <Modal_window
                formContent={modalInfo.content}
                modalInfo={modalInfo}
                toggleCallback={toggleCallback}
                modalWidth = {'1024px'}
              />
            </div>
            <div className='mt-10 grid'>
              <TicketList 
                ticketDetails={ticketDetailsCB}
                toggleCallback={toggleCallback}
              />
            </div>
          </div>
          <ToastContainer />
        {/* </div> */}
      </main>
    </div>
  )
}

export default Tickets