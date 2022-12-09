import { Stack } from '@mui/material';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Cookies from "universal-cookie";


const DashboardLayout = () => {

  const cookies = new Cookies();

  useEffect(() => {

    if (!cookies.get('token')) {     
      window.location.assign('/')
    }
    
  }, [])

  return (
    <>
      <Navbar />
      <Stack direction="row" sx={{gap:{xs:1 , md:2}}} justifyContent="space-between">
        <Sidebar />
        <Outlet />
      </Stack>
    </>
  )
}

export default DashboardLayout;