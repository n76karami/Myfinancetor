import { gql, useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import { Bar, Tooltip, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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

const Mydashboard = () => {

  const [chartdata, setchartdata] = useState('');

  const { data, loading, refetch } = useQuery(GET_MYEXPENSES);
  // console.log(data)
  // console.log(chartdata)

  useEffect(() => {

    if (data) {
      setchartdata(data.getMyExpenses)
    }
    
  }, [data])
  
  if (loading) return <h1>Loading...</h1>;


  return (
    <Box flex={3} p={2}>
      <Box
        sx={{
          width: { lg: "82%", xs: "90%", md: "70%" },
          float: { md: "right" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 5,
          padding: "20px 0",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: grey[800], borderBottom: "1px solid grey" }}
        >
          My Dashboard
        </Typography>
        <Box mt={5} sx={{
          // width: { lg: "600px", md: "500px", xs: "400px" },
          width: "80%",
          height: "400px"
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={chartdata}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={20}
            >
              <XAxis dataKey="date" scale="auto" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="amount" fill="#8884d8" background={{ fill: '#eee' }} />
            </BarChart>
          </ResponsiveContainer>
          
        </Box>
      </Box>
    </Box>
  );
}

export default Mydashboard;