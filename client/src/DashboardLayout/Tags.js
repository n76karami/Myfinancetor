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

const CustomModal = ({ _id, cta, closeModal }) => {
  
  const [route, setroute] = useState('sefr')

  const obj = {
    'sefr': <div>
      this action will delete this tag and all its expenses, are u sure ? 
      <br />
      <Button variant="contained" onClick={closeModal} > close  </Button>
      <Button variant="contained"  onClick={() => setroute('yek')} > yes im sure  </Button>
    </div>,
    'yek': <div>
      are u really sure ? 
      <br />
      <Button variant="contained" onClick={closeModal} > close  </Button>
      <Button variant="contained"  onClick={() => setroute('do')} > yes im sure  </Button>
    </div>,
      'do': <div>
        are u really really sure ? 
        <br />
        <Button variant="contained" onClick={closeModal} > close  </Button>
        <Button variant="contained"  onClick={() => setroute('se')} > yes im really really sure  </Button>
    </div>,
    'se': <div>
      Namoosaaaaaaaaaaaaaaaaaaaaaaaaaan ? 
    <br />
    <Button variant="contained" onClick={closeModal} > close  </Button>
    <Button variant="contained"  onClick={() => cta(_id)} > Namoosaaaaaaaaaaaaaaaaaaaaaaaaaan !  </Button>
</div>,
  }

  const ConditionalRender = route => {

    if (!obj[route]) return <h4> unwritten component </h4>

    return obj[route]
  }

  return (
    <div
      style={{
        backgroundColor: 'gray', width: 600, height: 400,
        position: "fixed",
        top: 'calc(50vh - 200px)',
        left: 'calc(50vw - 300px)',
        zIndex: 100,
        borderRadius: 12,
        fontSize: 50, color: '#fff',
        padding: 16
      }}
    >
      {ConditionalRender(route)} 
    </div>
  )
}

const Tags = () => {

  // main state
  const [color, setColor] = useState(null);
  const [name, setName] = useState("");
  const [tags, setTags] = useState([])

  // edit state
  const [editcolor, setEditcolor] = useState(null);
  const [editname, setEditname] = useState("");
  const [editmodal, setEditmodal] = useState(false);
  const [id, setid] = useState('');

  const [delete_id, setDelete_id] = useState(null);
  const [isOpen, setIsOpen] = useState(false)

  const { data, loading, refetch } = useQuery(GET_MYTAGS);

  const [AddTag] = useMutation(ADD_TAG);
  const [EditTag] = useMutation(EDIT_TAG);
  const [DeleteTag] = useMutation(DELETE_TAG);

  console.log(data);

  useEffect(() => {
    if (data) setTags(data.getMyTags);
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

    const { data: { delete_tag: { status } } } = await DeleteTag({
      variables: {
        "id": myid,
      }
    });

    if (status == 200) {
      refetch()
      setIsOpen(false)
      setDelete_id(null)
    }

    // await refetch();

  }

  // console.log(mymodal)


  return (
    <>
      {
        isOpen && <CustomModal
          _id={delete_id}
          cta={delete_tag}
          closeModal={() => {
            setIsOpen(false);
            
          }}
        />
      }
      
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
              {!tags[0] ? (
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
                        {tags.map((item) => {
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
                                    onClick={() => {
                                      setIsOpen(true)
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

      </Box>
    </>
  );
};

export default Tags;
