import { gql, useQuery } from '@apollo/client';
import { AccountCircleRounded, DashboardRounded, LogoutRounded, MonetizationOnRounded, PriceCheckRounded, Sell } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Avatar, Box, Menu, MenuItem, Stack, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { blue, pink, yellow } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";

const CURRENTUSER = gql`
query Query {
  me {
    _id
    name
    username
    img
  }
}
`

const Navbar = () => {

  const [nav, SetNav] = useState(false);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [img, setImg] = useState('');

  const navigate = useNavigate();

  const cookies = new Cookies();

  const { data, loading, error, refetch } = useQuery(CURRENTUSER)
  
  console.log(data);

  

  useEffect(() => {
    
    if (data) {
      refetch();
      setName(data.me.name);
      setImg(`http://localhost:80/${data.me.img}`)
    }
    
  }, [data])
  
  if (loading) return <h1>Loading...</h1>

  
  const Log_out = () => {
    
    cookies.remove('token');
    window.location.assign('/');

  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#3f51b5",
          }}
        >
          <Stack
            direction="row"
            gap={2}
            justifyContent="center"
            alignItems="center"
            ml={1}
          >
            <MonetizationOnRounded sx={{ fontSize: 35, color: yellow[600] }} />
            <Typography
              variant="p"
              sx={{
                fontSize: 20,
                color: "#7cf6fd",
                fontFamily: "cursive",
                fontStyle: "italic",
              }}
            >
              Financetor
            </Typography>
          </Stack>
          <Box
            onClick={() => setOpen(true)}
            sx={{
              cursor: "pointer",
              display: { xs: "none", md: "flex" },
              gap: "10px",
              alignItems: "center",
            }}
            mr={2}
          >
            <Avatar sx={{ width: 40, height: 40 }} src={img} />
            <Typography variant="span">{name}</Typography>
          </Box>
          <Box
            onClick={() => {
              SetNav(!nav);
            }}
            sx={{ display: { md: "none" }, zIndex: "10", cursor: "pointer" }}
          >
            {nav ? <CloseIcon /> : <MenuIcon />}
          </Box>
          {nav ? (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "#3f51b5",
                  display: { md: "none", xs: "flex" },
                  flexDirection: "column",
                }}
              >
                <List>
                  <ListItem sx={{ borderBottom: "2px solid #7cf6fd" }}>
                    <Stack
                      direction="row"
                      gap={2}
                      justifyContent="center"
                      alignItems="center"
                      ml={2}
                    >
                      <MonetizationOnRounded
                        sx={{ fontSize: 35, color: yellow[600] }}
                      />
                      <Typography
                        variant="p"
                        sx={{
                          fontSize: 20,
                          color: "#7cf6fd",
                          fontFamily: "cursive",
                          fontStyle: "italic",
                        }}
                      >
                        Financetor
                      </Typography>
                    </Stack>
                  </ListItem>
                  <ListItem>
                    <Box
                      sx={{
                        display: "flex" ,
                        gap: "27px",
                        alignItems: "center",
                      }}
                      ml={2}
                    >
                      <Avatar sx={{ width: 30, height: 30 }} src={img} />
                      <Typography variant="span">{name}</Typography>
                    </Box>
                  </ListItem>
                  <ListItem>
                    <ListItemButton onClick={() => navigate("/dashboard")}>
                      <ListItemIcon>
                        <DashboardRounded
                          sx={{ fontSize: 30, color: yellow[600] }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="My dashboard" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton
                      onClick={() => navigate("/dashboard/expenses")}
                    >
                      <ListItemIcon>
                        <PriceCheckRounded
                          sx={{ fontSize: 30, color: yellow[600] }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="My Expenses" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton onClick={() => navigate("/dashboard/tags")}>
                      <ListItemIcon>
                        <Sell sx={{ fontSize: 30, color: yellow[600] }} />
                      </ListItemIcon>
                      <ListItemText primary="My Tags" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountCircleRounded
                          sx={{ fontSize: 30, color: yellow[600] }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Edit Profile" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton onClick={Log_out}>
                      <ListItemIcon>
                        <LogoutRounded
                          sx={{ fontSize: 30, color: yellow[600] }}
                        />
                      </ListItemIcon>
                      <ListItemText primary="Log out" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </>
          ) : (
            ""
          )}
        </Toolbar>
        <Menu
          sx={{ marginTop: "45px", display: { xs: "none", md: "flex" } }}
          id="demo-positioned-menu"
          // aria-labelledby="demo-positioned-button"
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem sx={{ display: "flex", gap: 1 }} onClick={() => navigate(`editprofile/${data.me._id}`)}>
            <AccountCircleRounded />
            Edit Profile
          </MenuItem>
          <MenuItem sx={{ display: "flex", gap: 1 }} onClick={Log_out}>
            <LogoutRounded />
            Logout
          </MenuItem>
        </Menu>
      </AppBar>
    </>
  );
}

export default Navbar;
