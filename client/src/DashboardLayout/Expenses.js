import { gql, useMutation, useQuery } from "@apollo/client";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { blue, grey, red, yellow } from "@mui/material/colors";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Close, Delete, ModeEdit } from "@mui/icons-material";
import { icon } from "leaflet";


const ADD_EXPENSE = gql`
mutation Mutation($data: ExpenseInfo!) {
  create_expense(data: $data) {
    status
    msg
  }
}
`

const GET_MYEXPENSES = gql`
query Query {
  getMyExpenses {
    _id
    amount
    tag {
      _id
      name
      color
    }
    date
    geo {
      lat
      lon
    }
  }
  getMyTags {
    _id
    name
    color
  }
}
`

const DELETE_EXPENSE = gql`
mutation Mutation($id: ID!) {
  delete_expense(_id: $id) {
    status
    msg
  }
}
`

const EDIT_EXPENSE = gql`
mutation Mutation($id: ID!, $data: ExpenseInfo!) {
  edit_expense(_id: $id, data: $data) {
    status
    msg
  }
}
`

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));


const Expenses = () => {

  // main state
  const [mydate, setMydate] = useState(null);
  const [amount, setAmount] = useState(null);
  const [tag_id, setTag_id] = useState('choose');
 
  // edit state
  const [editmydate, setEditMydate] = useState(null);
  const [editamount, setEditAmount] = useState(null);
  const [edittag_id, setEditTag_id] = useState('choose');
  const [editlat, setEditlat] = useState(null);
  const [editlon, setEditlon] = useState(null);
  const [id, setid] = useState('');

  const [editmodal, setEditmodal] = useState(false);
  
  const mapRef = useRef(null);
  const editmapRef = useRef(null);

  console.log(mapRef)

  const { data, loading, refetch } = useQuery(GET_MYEXPENSES);
  
  const [AddExpense] = useMutation(ADD_EXPENSE);
  const [DeleteExpense] = useMutation(DELETE_EXPENSE);
  const [EditExpense] = useMutation(EDIT_EXPENSE);

  console.log(data);

  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data]);

  if (loading) return <h1>Loading...</h1>;

  const openmodal = (item) => {
    
    setEditmodal(true);

    setEditMydate(item.date);
    setEditAmount(item.amount);
    setEditTag_id(item.tag._id);
    setEditlat(item.geo.lat);
    setEditlon(item.geo.lon);
    setid(item._id)
  }

  const add_expense = async () => {
    try {
      
      if (!mydate || !amount) return alert("please fill all sections");
      if (tag_id === 'choose') return alert('please choose');

      const newexpense = await AddExpense({
        variables: {
          "data": {
            "amount": Number(amount),
            "date": mydate,
            "geo": {
              "lat": parseFloat(mapRef.current.getCenter().lat),
              "lon": parseFloat(mapRef.current.getCenter().lng)
            },
            "tag": tag_id
          }
        }
      })

      await refetch();
      setMydate("");
      setAmount("");
      setTag_id('choose'); 
      return alert("success");

    } catch (error) {
      return alert("error");
    }
  }

  const delete_expense = async (myid) => {
    
    const deleteexpense = await DeleteExpense({
      variables: {
        "id": myid,
      }
    })

    await refetch();

  }

  
  const edit_expense = async (id) => {
    console.log(id)
    try {
      
      if (!editmydate || !editamount) return alert("please fill all sections");
      if (edittag_id === 'choose') return alert('please choose');

      const editexpense = await EditExpense({
        variables: {
        "id": id,
        "data": {
          "amount": Number(editamount),
          "geo": {
            "lat": parseFloat(editmapRef.current.getCenter().lat),
            "lon": parseFloat(editmapRef.current.getCenter().lng),
          },
          "tag": edittag_id,
          "date": editmydate
        }
      }
      })
      await refetch();
      setEditmodal(false);
      return alert("success");

    } catch (error) {
      return alert("error");
    }
  }



  const ICON = icon({
    iconUrl: "/mi.png.png",//داخل پوشه public
    iconSize: [32, 32]
  })

  return (
    <Box flex={4} p={1}>
      <Stack
        sx={{
          flexDirection: { xs: "column", lg: "row" },
          float: { md: "right" },
          width: { lg: "82%", xs: "90%", md: "70%" },
        }}
        justifyContent="flex-end"
        mt={2}
        // mr={3}
        gap={1}
      >
        <Box
          flex={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            boxShadow: 5,
            padding: "20px 0",
            height: "500px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: grey[800], borderBottom: "1px solid grey" }}
          >
            Create New Expense
          </Typography>
          <Box
            sx={{
              width: { xs: "40%", lg: "80%" },
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="span" sx={{ color: grey[800] }}>
              Select your Date:
            </Typography>
            <TextField
              value={mydate}
              onChange={(e) => setMydate(e.target.value)}
              type="date"
              placeholder="myPlaceholder"
            />
          </Box>
          <TextField
            type="number"
            id="standard-basic"
            label="Enter amount"
            variant="standard"
            sx={{ width: { lg: "80%", xs: "40%" } }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <FormControl sx={{ width: "200px" }}>
            {/* <InputLabel id="demo-simple-select-label">Select your tag</InputLabel> */}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tag_id}
              onChange={(e) => setTag_id(e.target.value)}
              // label="Age"
            >
              <MenuItem value="choose">Select your tag</MenuItem>
              {data.getMyTags.map((item) => {
                return <MenuItem value={item._id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <Box sx={{ width: "300px", height: "200px" }}>
            {/* hcsckjhkl */}
            <MapContainer
              ref={mapRef}
              center={["35.73825", "51.50962"]}
              zoom={16}
              scrollWheelZoom={true}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationOnIcon
                sx={{
                  color: blue[400],
                  zIndex: "1000",
                  position: "absolute",
                  top: "calc(50% - 24px)",
                  left: "calc(50% - 24px)",
                  fontSize: "40px",
                }}
              />
            </MapContainer>
          </Box>
          <Button
            variant="contained"
            sx={{ width: "50%" }}
            onClick={add_expense}
          >
            ADD
          </Button>
        </Box>
        <Box
          flex={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            // justifyContent: "center",
            alignItems: "center",
            boxShadow: 5,
            padding: "30px 5px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: grey[800], borderBottom: "1px solid grey" }}
          >
            My Expenses
          </Typography>
          <Box sx={{ width: "100%" }}>
            {!data.getMyExpenses[0] ? (
              <>
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  <Typography variant="p">
                    You have no expense yet. Start by adding new one!
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" sx={{ width: "60px" }}>
                          Tag
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: "10px" }}>
                          Amount
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: "75px" }}>
                          Date
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Location
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: "10px" }}>
                          Edit
                        </StyledTableCell>
                        <StyledTableCell align="center" sx={{ width: "10px" }}>
                          Delete
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.getMyExpenses.map((item) => {
                        return (
                          <>
                            <StyledTableRow>
                              <StyledTableCell
                                align="center"
                                sx={{ backgroundColor: `${item.tag.color}` }}
                              >
                                {item.tag.name}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {item.amount}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {item.date}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Box sx={{ width: "250px", height: "150px" }}>
                                  <MapContainer
                                    center={[item.geo.lat, item.geo.lon]}
                                    zoom={16}
                                    scrollWheelZoom={true}
                                    style={{ width: "100%", height: "100%" }}
                                  >
                                    <TileLayer
                                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker
                                      position={[item.geo.lat, item.geo.lon]}
                                      icon={ICON}
                                    >
                                      {/* <LocationOnIcon
                                        sx={{
                                          color: "blue",
                                          zIndex: "1000",
                                          position: "absolute",
                                          top: "calc(50% - 24px)",
                                          left: "calc(50% - 24px)",
                                          fontSize: "40px",
                                        }}
                                      /> */}
                                    </Marker>
                                  </MapContainer>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <ModeEdit
                                  onClick={() => openmodal(item)}
                                  sx={{
                                    color: yellow[800],
                                    cursor: "pointer",
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <Delete
                                  onClick={() => delete_expense(item._id)}
                                  sx={{ color: red[800], cursor: "pointer" }}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </Box>
      </Stack>
      {editmodal ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              width: "600px",
              height: "540px",
              top: "calc(50vh - 220px)",
              left: "calc(50vw - 300px)",
              backgroundColor: grey[300],
              zIndex: "1000",
              // justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
            >
              Edit Expense
            </Typography>
            <IconButton
              onClick={() => setEditmodal(false)}
              position="absolute"
              color="error"
              sx={{ top: "-30px", right: "-220px " }}
            >
              <Close sx={{ fontSize: "30px" }} />
            </IconButton>
            <Box
              sx={{
                width: { xs: "40%", md: "80%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: { xs: "40%", lg: "80%" },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography variant="span" sx={{ color: grey[800] }}>
                  Select your Date:
                </Typography>
                <TextField
                  value={editmydate}
                  onChange={(e) => setEditMydate(e.target.value)}
                  type="date"
                  placeholder="myPlaceholder"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <TextField
                  type="number"
                  id="standard-basic"
                  label="Enter amount"
                  variant="standard"
                  sx={{ width: { lg: "80%", xs: "40%" } }}
                  value={editamount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
                <FormControl sx={{ width: "200px" }}>
                  {/* <InputLabel id="demo-simple-select-label">Select your tag</InputLabel> */}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={edittag_id}
                    onChange={(e) => setEditTag_id(e.target.value)}
                    // label="Age"
                  >
                    <MenuItem value="choose">Select your tag</MenuItem>
                    {data.getMyTags.map((item) => {
                      return <MenuItem value={item._id}>{item.name}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "300px", height: "200px" }}>
                <MapContainer
                  ref={editmapRef}
                  center={[editlat, editlon]}
                  zoom={16}
                  scrollWheelZoom={true}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationOnIcon
                    sx={{
                      color: "blue",
                      zIndex: "1000",
                      position: "absolute",
                      top: "calc(50% - 24px)",
                      left: "calc(50% - 24px)",
                      fontSize: "40px",
                    }}
                  />
                </MapContainer>
              </Box>
              <Button variant="contained" sx={{ width: "50%" , marginTop:"20px" }} onClick={() => edit_expense(id)}>
                Edit
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Expenses;
