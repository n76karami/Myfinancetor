import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  styled,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Alert,
  AlertTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";

const SIGNUP = gql`
mutation Mutation($name: String!, $username: String!, $password: String!) {
  signup(name: $name, username: $username, password: $password) {
    token
  }
}
`

const LOGIN = gql`
mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
  }
}
`

const CssTextField = styled(
  TextField,
  // OutlinedInput
)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& label": {
    color: "white",
  },
  "& text": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});

const Home = () => {

  const cookies = new Cookies();

  const [select_form, setselect_form] = useState(true);
  const [myalert, setmyalert] = useState(false);
  const [errorAlert, seterrorAlert] = useState(false);
  const [mainerrorAlert, setmainerrorAlert] = useState(false);


  const [values, setValues] = useState({
    name: "",
    username:"",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  useEffect(() => {

    if (cookies.get('token')) {     
      window.location.assign('/dashboard')
    }
    
  }, [])

  const [SignUp] = useMutation(SIGNUP);

  const [LogIn] = useMutation(LOGIN);

  const Sign_up = async() => {
    
    try {
      if (!values.name || !values.username || !values.password) {
        seterrorAlert(true)
      }
  
      const newuser = await SignUp({
        variables: {
        "name": values.name,
        "username": values.username,
        "password": values.password
      }
      })
  
      console.log(newuser)
      
      if (newuser.data.signup.token !== undefined) {
  
        cookies.set('token', newuser.data.signup.token);
        setmyalert(true)    
      }
      // else {     
      //   setmainerrorAlert(true)   
      // }
    } catch (error) {
      console.log(error)

      console.log(error.graphQLErrors)

      error.graphQLErrors.forEach(item => {
        console.log('item :', item)
        if (item.message === 'this username already exists')  setmainerrorAlert(true)
      })
    }

  }

  const Log_in = async () => {
    
    try {
      if (!values.username || !values.password) {
        seterrorAlert(true)
      }
  
      const loginuser = await LogIn({
        variables: {
        "username": values.username,
        "password": values.password
      }
      })
  
      console.log(loginuser)
  
      if (loginuser.data.login.token !== undefined) {
  
        cookies.set('token', loginuser.data.login.token);
        setmyalert(true)    
      }
      // else {     
      //   setmainerrorAlert(true)   
      // }
    } catch (error) {
      console.log(error)

      error.graphQLErrors.forEach(item => {
        console.log('item :', item)
        if (item.message === 'password doesnt match')  setmainerrorAlert(true)
        if (item.message === 'bad request' && (values.name != '' || values.username != '' || values.password != ''))  setmainerrorAlert(true)
      })
    }

  }

  return (
    <>
      <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
        <img
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            objectFit: "cover",
          }}
          src="./p.jpg.jpg"
          alt="/"
        />
        <Box sx={{
            backgroundColor: "black",
            opacity: "0.9",
            borderRadius: "7px",
            position: "absolute",
            top: "calc(50vh - 280px)",
            left: "calc(50vw - 145px)",
          }}>
          {myalert ?
            <Alert severity="success" variant="filled"  action={
              <Button color="inherit" size="small" onClick={() => { setmyalert(false);  window.location.assign("/dashboard");}}>
                <Close />
              </Button>
              } >
              You've {values.name ? "signed up" : "logged in"}  successfully
            </Alert>
            : ""}
        </Box>
        <Box sx={{
            backgroundColor: "black",
            opacity: "0.9",
            borderRadius: "7px",
            position: "absolute",
            top: "calc(50vh - 280px)",
            left: "calc(50vw - 125px)",
          }}>
          {errorAlert ?
            <Alert severity="warning" variant="filled"  action={
              <Button color="inherit" size="small" onClick={() => { seterrorAlert(false);}}>
                <Close />
              </Button>
              } >
              Please fill all sections
            </Alert>
            : ""}
        </Box>
        <Box sx={{
            backgroundColor: "black",
            opacity: "0.9",
            borderRadius: "7px",
            position: "absolute",
            top: "calc(50vh - 280px)",
            left: "calc(50vw - 155px)",
          }}>
          {mainerrorAlert ?
            <Alert severity="error" variant="filled"  action={
              <Button color="inherit" size="small" onClick={() => { setmainerrorAlert(false);}}>
                <Close />
              </Button>
              } >
              {values.name ? "this username already exists" : "Username or password incorrect"}
            </Alert>
            : ""}
        </Box>
        <Stack
          direction="column"
          spacing={2}
          width="350px"
          height="400px"
          color="white"
          p={2}
          sx={{
            backgroundColor: "black",
            opacity: "0.9",
            borderRadius: "7px",
            position: "absolute",
            top: "calc(50vh - 200px)",
            left: "calc(50vw - 175px)",
          }}
        >
          <Typography variant="h5" fontWeight={500} sx={{ mx: "auto" }}>
            Wellcome to financetor
          </Typography>
          <Typography
            variant="span"
            fontWeight={600}
            color="gray"
            sx={{ textAlign: "center", paddingTop: "10px" }}
          >
            Sign in to continue.
          </Typography>
          {select_form ? (
            <Box>
              <Stack direction="column" spacing={3} mt={3}>
                <CssTextField
                  sx={{ input: { color: "white" } }}
                  label="UserName"
                  value={values.username}
                  onChange={(e) => {setValues({...values , username:e.target.value})}}
                />
                <CssTextField
                  sx={{ input: { color: "white" } }}
                  label="Password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ width: "20px", height: "30px", padding: "7px" }}
                      >
                        <IconButton
                          onClick={() =>
                            setValues({
                              ...values,
                              showPassword: !values.showPassword,
                            })
                          }
                        >
                          {/* <AccountCircle sx={{backgroundColor:"white" , borderRadius:"50%"}} /> */}
                          {values.showPassword ? (
                            <VisibilityOff
                              sx={{
                                backgroundColor: "gray",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <Visibility
                              sx={{
                                backgroundColor: "gray",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Box sx={{ padding: "15px 0" }}>
                <Button
                  variant="contained"
                  sx={{ width: "100%", backgroundColor: "blue" }}
                  onClick={Log_in}
                >
                  Log in
                </Button>
              </Box>
              <Typography
                fontSize="sm"
                sx={{ textAlign: "center", width: "100%" }}
              >
                Don&apos;t have an account? <Button onClick={() => setselect_form(false)}>sign up</Button>
              </Typography>
            </Box>
          ) : (
              
            <Box>
              <Stack direction="column" spacing={2}>
                <CssTextField
                  sx={{ input: { color: "white" } }}
                    label="Name"
                    value={values.name}
                    onChange={(e) => {setValues({...values , name:e.target.value})}}
                  />
                  <CssTextField
                    sx={{ input: { color: "white" } }}
                    label="UserName"
                    value={values.username}
                    onChange={(e) => {setValues({...values , username:e.target.value})}}
                  />
                  <CssTextField
                  sx={{ input: { color: "white" } }}
                  label="Password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ width: "20px", height: "30px", padding: "7px" }}
                      >
                        <IconButton
                          onClick={() =>
                            setValues({
                              ...values,
                              showPassword: !values.showPassword,
                            })
                          }
                        >
                          {/* <AccountCircle sx={{backgroundColor:"white" , borderRadius:"50%"}} /> */}
                          {values.showPassword ? (
                            <VisibilityOff
                              sx={{
                                backgroundColor: "gray",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <Visibility
                              sx={{
                                backgroundColor: "gray",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                </Stack>
                <Box sx={{ padding: "15px 0" }}>
                  <Button
                    variant="contained"
                    sx={{ width: "100%", backgroundColor: "blue" }}
                    onClick={Sign_up}
                    >
                   sign up
                  </Button>
                </Box>
                <Typography
                fontSize="sm"
                sx={{ textAlign: "center", width: "100%" }}
                >
                You have an account already? <Button onClick={() => setselect_form(true)}>log in</Button>
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default Home;
