import { Box } from '@mui/material';
import React from 'react'
import { Outlet } from 'react-router-dom';

const WebLayout = () => {
  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  )
}

export default WebLayout;