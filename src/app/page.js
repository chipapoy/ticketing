import React from 'react'
import { redirect } from 'next/navigation'

const Redirect = () => {
  redirect('/login');
}

export default Redirect
