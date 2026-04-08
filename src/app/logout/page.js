"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation'

const Redirect = () => {

  useEffect( () => {
    localStorage.clear();
    // sessionStorage.clear();

    if(localStorage.length === 0){
      redirect('/login')
    }
  })
}

export default Redirect
