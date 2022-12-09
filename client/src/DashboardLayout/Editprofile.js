import { gql, useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';

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

const EDITME = gql`
mutation Mutation($name: String!, $img: Upload) {
  editMe(name: $name, img: $img) {
    status
    msg
  }
}
`

const Editprofile = () => {

  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {

      const fileReader = new FileReader()

      fileReader.onload = function (e) {
        setImg(e.target.result)
      }

      fileReader.readAsDataURL(file)
    }
  }, [file])

  const { data, loading, error, refetch } = useQuery(CURRENTUSER);
  const [Editme] = useMutation(EDITME);


  useEffect(() => {
    
    if (data) {
      refetch();
      setName(data.me.name);
      setImg(`http://localhost:80/${data.me.img}`)
    }

    
  }, [data])
  
  if (loading) return <h1>Loading...</h1>

  const edit_me = async () => {
    try {
      
      if (!name) return alert("please fill all sections");

      const editme = await Editme({
        variables: {
         
          "name": name,
          "img": file
          
        }
      })

      await refetch();

    } catch (error) {
        return alert("error");
    }
  }

  return (
    <Box flex={3} p={2} >
      <Box sx={{
        width: { lg: "82%", xs: "90%", md: "70%" },
        float: { md: "right" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: 5,
        padding:"20px 0"
      }}
      >
        <Typography
            variant="h6"
            sx={{ color: grey[800], borderBottom: "1px solid grey" }}
          >
            Edit Profile
        </Typography>
        <Box mt={5}>
          <Avatar sx={{ width: 200, height: 200 }} src={img}/>
        </Box>
        <Box mt={5} sx={{ display: "flex", flexDirection: "row" , alignItems:"center" , justifyContent:"center" , gap:2 }}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="select name"
          />
          <TextField
            // value={name}
            sx={{width:"40%"}}
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            name="avatar"
            accept="image/png, image/jpeg"
          />
        </Box>
        <Box mt={5}>
          <Button variant='contained' onClick={edit_me}>
            submit
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Editprofile;