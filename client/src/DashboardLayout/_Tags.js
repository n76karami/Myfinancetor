import { gql, useMutation, useQuery } from "@apollo/client";
import { Close, Delete, ModeEdit } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Modal from '@mui/material/Modal';
import { grey, red, yellow } from "@mui/material/colors";
import React, { useEffect, useState } from "react";

const ADD_TAG = gql`
  mutation Mutation($data: tagInfo!) {
    create_tag(data: $data) {
      status
      msg
    }
  }
`;

const GET_MYTAGS = gql`
  query Query {
    getMyTags {
      _id
      name
      color
    }
  }
`;

const EDIT_TAG = gql`
mutation Mutation($id: ID!, $data: tagInfo!) {
  edit_tag(_id: $id, data: $data) {
    status
    msg
  }
}
`

const DELETE_TAG = gql`
mutation Mutation($id: ID!) {
  delete_tag(_id: $id) {
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


const Tags = () => {

  // main state
  const [color, setColor] = useState(null);
  const [name, setName] = useState("");

  // edit state
  const [editcolor, setEditcolor] = useState(null);
  const [editname, setEditname] = useState("");
  const [id, setid] = useState('');

  const [editmodal, setEditmodal] = useState(false);

  // modals
  const [modal1, setmodal1] = useState(false);
  const [modal2, setmodal2] = useState(false);
  const [modal3, setmodal3] = useState(false);
  const [modal4, setmodal4] = useState(false);
  const [modal5, setmodal5] = useState(false);

  const [delete_id, setDelete_id] = useState('');


  const { data, loading, refetch } = useQuery(GET_MYTAGS);

  const [AddTag] = useMutation(ADD_TAG);
  const [EditTag] = useMutation(EDIT_TAG);
  const [DeleteTag] = useMutation(DELETE_TAG);

  console.log(data);

  useEffect(() => {
    if (data) {
      refetch();
    }
  }, [data]);

  if (loading) return <h1>Loading...</h1>;

  const openmodal = (item) => {
    
    setEditmodal(true);

    setEditname(item.name)
    setEditcolor(item.color)
    setid(item._id)
  }
  
 
  const add_tag = async () => {
    try {
      if (!name || !color) return alert("please fill all sections");

      const newtag = await AddTag({
        variables: {
          "data": {
            "name": name,
            "color": color,
          },
        },
      });

      await refetch();
      setName("");
      setColor("");
      return alert("success");
    } catch (error) {
      return alert("error");
    }
  };

  const edit_tag = async (id) => {
    
    try {

      if (!editname || !editcolor) return alert("please fill all sections");

      const edittag = await EditTag({
        variables: {
          "id": id,
          "data": {
            "name": editname,
            "color": editcolor
          }
        }
      })

      await refetch();
      setEditname("")
      setEditcolor("")
      setid("")
      setEditmodal(false)
      // return alert("success");
      
    } catch (error) {
      return alert("error");
    }
  }

  const delete_tag = async (myid) => {

    console.log(myid)

    const deletetag = await DeleteTag({
      variables: {
        "id": myid,
      }
    })

    await refetch();

  }

  // console.log(mymodal)


  return (
    <>
      <Box flex={4} p={1}>
        <Stack
          sx={{
            flexDirection: { xs: "column", lg: "row" }, float: { md: "right" }
             , width: {lg:"82%"  ,xs:"90%" , md:"70%"}
          }}
          justifyContent="space-between"
          mt={3}
          gap={1}
        >
          <Box
            flex={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              boxShadow: 5,
              padding: "30px 0",
              height: "300px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
            >
              Create New Tag
            </Typography>
            <Box sx={{ width: { xs: "40%", md: "80%" } }}>
              <Typography variant="span" sx={{ color: grey[800] }}>
                pick your tag color:
              </Typography>
              <TextField
                type="color"
                onChange={(e) => setColor(e.target.value)}
                sx={{ width: "100%", margin: "10px 0" }}
                value={color}
              />
            </Box>
            <TextField
              id="standard-basic"
              label="Enter your tag name"
              variant="standard"
              sx={{ width: "80%" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button variant="contained" sx={{ width: "50%" }} onClick={add_tag}>
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
              My Tags
            </Typography>
            <Box sx={{ width: "100%" }}>
              {!data.getMyTags[0] ? (
                <>
                  <Box sx={{textAlign:"center" , marginTop:"20px"}}>
                    <Typography variant="p">
                      You have no tags yet. Start by adding new one!
                    </Typography>
                  </Box>
                  
                </>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Name</StyledTableCell>
                          <StyledTableCell align="center">
                            Color
                          </StyledTableCell>
                          <StyledTableCell align="center">Edit</StyledTableCell>
                          <StyledTableCell align="center">
                            Delete
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.getMyTags.map((item) => {
                          return (
                            <>
                              <StyledTableRow>
                                <StyledTableCell align="center">
                                  {item.name}
                                </StyledTableCell>
                                <StyledTableCell
                                  align="center"
                                  sx={{ backgroundColor: `${item.color}` }}
                                >
                                  {item.color}
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
                                    // onClick={() => delete_tag(item._id)}
                                    onClick={() => {
                                      setmodal1(true)
                                      setDelete_id(item._id)
                                    }}
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
        {editmodal ?
          <>
            {/* <Box sx={{ width:"100vw" , height:"100vh" , backgroundColor:"black" , opacity:"0.9"}}></Box> */}
            <Box sx={{
              display: "flex", flexDirection:"column" , position: "fixed", width: "500px", height: "300px",
              top:"calc(50vh - 150px)" , left:"calc(50vw - 250px)",
              backgroundColor:grey[300],
              justifyContent: "center", alignItems: "center"
            }}
            >           
              <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
              >
                Edit Tag
              </Typography>
              <IconButton
                onClick={() => setEditmodal(false)}
                position="absolute" color="error"
                sx={{ top: "-30px", right: "-220px " }}>
                <Close sx={{fontSize:"30px"}} />
              </IconButton>
              <Box sx={{ width: { xs: "40%", md: "80%" } }}>
              <Typography variant="span" sx={{ color: grey[800] }}>
                pick your tag color:
              </Typography>
              <TextField
                type="color"
                onChange={(e) => setEditcolor(e.target.value)}
                sx={{ width: "100%", margin: "10px 0" }}
                value={editcolor}
              />
            </Box>
            <TextField
              id="standard-basic"
              label="Enter your tag name"
              variant="standard"
              sx={{ width: "80%" }}
              value={editname}
              onChange={(e) => setEditname(e.target.value)}
            />
            <Button variant="contained" sx={{ width: "50%" , marginTop:"20px" }} onClick={() => edit_tag(id)}>
              Edit
            </Button>
            </Box>
          </>
          :
          ""
        }
        {modal1 ?
          <>
            <Box p={2} sx={{
              display: "flex", flexDirection:"column" , position: "fixed", width: "300px", height: "200px",
              top:"calc(50vh - 100px)" , left:"calc(50vw - 150px)",
              backgroundColor:grey[300],
              alignItems: "center" , 
            }}
            >
              <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
              >
                Really?
              </Typography>
              {/* <IconButton
                onClick={() => setmodal1(false)}
                position="absolute" color="error"
                sx={{ top: "-30px", right: "-220px " }}>
                <Close sx={{fontSize:"30px"}} />
              </IconButton> */}
              <Stack flexDirection='row' gap={2} mt={5}>
                <Button variant="contained" onClick={() => { setmodal1(false); setmodal2(true); }}>Yes</Button>
                <Button variant="contained" color="error" onClick={() => setmodal1(false)}>No</Button>
              </Stack>
            </Box> 
          </>
          :
          ""
        }
        {modal2 ?
          <>
            <Box p={2} sx={{
              display: "flex", flexDirection:"column" , position: "fixed", width: "300px", height: "200px",
              top:"calc(50vh - 100px)" , left:"calc(50vw - 150px)",
              backgroundColor:grey[300],
              alignItems: "center" , 
            }}
            >
              <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
              >
                Are you sure?
              </Typography>
              {/* <IconButton
                onClick={() => setmodal1(false)}
                position="absolute" color="error"
                sx={{ top: "-30px", right: "-220px " }}>
                <Close sx={{fontSize:"30px"}} />
              </IconButton> */}
              <Stack flexDirection='row' gap={2} mt={5}>
                <Button variant="contained" onClick={() => { setmodal2(false); setmodal3(true); }}>Yes</Button>
                <Button variant="contained" color="error" onClick={() => setmodal2(false)}>No</Button>
              </Stack>
            </Box> 
          </>
          :
          ""
        }
        {modal3 ?
          <>
            <Box p={2} sx={{
              display: "flex", flexDirection:"column" , position: "fixed", width: "300px", height: "200px",
              top:"calc(50vh - 100px)" , left:"calc(50vw - 150px)",
              backgroundColor:grey[300],
              alignItems: "center" , 
            }}
            >
              <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
              >
                Are you kidding?
              </Typography>
              {/* <IconButton
                onClick={() => setmodal1(false)}
                position="absolute" color="error"
                sx={{ top: "-30px", right: "-220px " }}>
                <Close sx={{fontSize:"30px"}} />
              </IconButton> */}
              <Stack flexDirection='row' gap={2} mt={5}>
                <Button variant="contained" onClick={() => { setmodal3(false); setmodal4(true); }}>Yes</Button>
                <Button variant="contained" color="error" onClick={() => setmodal3(false)}>No</Button>
              </Stack>
            </Box> 
          </>
          :
          ""
        }
        {modal4 ?
          <>
            <Box p={2} sx={{
              display: "flex", flexDirection:"column" , position: "fixed", width: "350px", height: "200px",
              top:"calc(50vh - 100px)" , left:"calc(50vw - 175px)",
              backgroundColor:grey[300],
              alignItems: "center" , 
            }}
            >
              <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
              >
                Will all your expenses be cleared?
              </Typography>
              {/* <IconButton
                onClick={() => setmodal1(false)}
                position="absolute" color="error"
                sx={{ top: "-30px", right: "-220px " }}>
                <Close sx={{fontSize:"30px"}} />
              </IconButton> */}
              <Stack flexDirection='row' gap={2} mt={5}>
                <Button variant="contained" onClick={() => { setmodal4(false); setmodal5(true); }}>Yes</Button>
                <Button variant="contained" color="error" onClick={() => setmodal4(false)}>No</Button>
              </Stack>
            </Box> 
          </>
          :
          ""
        }
        {modal5 ?
          <>
            <Box p={2} sx={{
              display: "flex", flexDirection:"column" , position: "fixed", width: "350px", height: "200px",
              top:"calc(50vh - 100px)" , left:"calc(50vw - 175px)",
              backgroundColor:grey[300],
              alignItems: "center" , 
            }}
            >
              <Typography
              variant="h6"
              sx={{ color: grey[800], borderBottom: "1px solid grey" }}
              >
                Namosan?
              </Typography>
              {/* <IconButton
                onClick={() => setmodal1(false)}
                position="absolute" color="error"
                sx={{ top: "-30px", right: "-220px " }}>
                <Close sx={{fontSize:"30px"}} />
              </IconButton> */}
              <Stack flexDirection='row' gap={2} mt={5}>
                <Button variant="contained" onClick={() => { setmodal5(false); delete_tag(delete_id);  }}>Yes</Button>
                <Button variant="contained" color="error" onClick={() => setmodal5(false)}>No</Button>
              </Stack>
            </Box> 
          </>
          :
          ""
        }
      </Box>
    </>
  );
};

export default Tags;
