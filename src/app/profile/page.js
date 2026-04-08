'use client'

import { React,  useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import Top_nav from '@/Component/UI/Top_nav';
import { user, userNavigation } from '../Collections/collections';
import { ToastContainer } from 'react-toastify';

import ProfileContent from '@/Component/Profile/ProfileContent';

const UserProfile = () => {
   return (
      <div>
         <Disclosure as="nav" className="bg-gray-800">
         {({ open }) => (
         <>
            <Top_nav 
               user={user}
               userNavigation={userNavigation}
               pageName={""}
            />
         </>
         )}
         </Disclosure>
         <div>
            <ProfileContent />
         </div>
         <ToastContainer />
      </div>
   )
}

export default UserProfile