import { DashboardRounded, PriceCheckRounded, Sell } from '@mui/icons-material';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { yellow } from '@mui/material/colors';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const navigate = useNavigate();

  return (
    <>
      <Box flex={1} pt={2} sx={{
        display: { xs: "none", md: "flex" },
        backgroundColor: "#3f51b5",
        justifyContent: "flex-start", height:"100vh" , position:"fixed" 
      }}>
        <Box>
          <List>
            <ListItem>
              <ListItemButton onClick={() => navigate("/dashboard")}>
                <ListItemIcon>
                  <DashboardRounded sx={{ fontSize: 30 , color: yellow[600] }}  />
                </ListItemIcon>
                <ListItemText primary="My dashboard" sx={{color:"white"}}/>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("/dashboard/expenses")}>
                <ListItemIcon>
                  <PriceCheckRounded sx={{ fontSize: 30 , color: yellow[600] }}  />
                </ListItemIcon>
                <ListItemText primary="My Expenses" sx={{color:"white"}}/>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("/dashboard/tags")}>
                <ListItemIcon>
                  <Sell sx={{ fontSize: 30 , color: yellow[600] }}  />
                </ListItemIcon>
                <ListItemText primary="My Tags" sx={{color:"white"}}/>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </>
  )
}

export default Sidebar;