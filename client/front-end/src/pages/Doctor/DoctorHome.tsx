import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  ChakraProvider,
  Container,
  Heading,
  List,
  ListItem,
  UnorderedList,
  VStack,HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./StyleDoctor.css";
const DoctorHome = () => {
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  const { id } = useParams<{ id: string }>();
  const [doctorInfo, setDoctorInfo] = useState<any>({});


  useEffect(() => {
    api
      .get(`/doctor/getDoctor/${id}`)
      .then((response) => {
        setDoctorInfo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);
  
  const [patientData, setPatientData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    appointments: [
      { date: "2023-10-20", time: "09:00 AM", doctor: "Dr. Smith" },
      { date: "2023-10-25", time: "02:30 PM", doctor: "Dr. Johnson" },
    ],
    medicalHistory: ["Flu", "Cold", "Annual checkup"],
    prescriptions: [
      {
        medication: "Aspirin",
        dosage: "500mg",
        instructions: "Take with food",
      },
      { medication: "Antibiotics", dosage: "1 tablet every 12 hours" },
    ],
  });
  const navigate = useNavigate();
  const appoint = async () =>{
    navigate(`/appointment/view/${id}`);
  }
  const viewpatients = async() =>{
    navigate(`/doctor/viewPatients/${id}`);

  }

  // const getDrDetails = async ()=>{
  //   try{
  //   const doctor = await api.get(`/doctor/getDoctor/${id}`)
  //   setDoctorName(doctor.data.Name);
  //   }catch(error){`
  //     console.error(error);
  //   }
    
  // };

  return (
    <ChakraProvider cssVarsRoot={undefined}>
      <Container
        marginTop="5"
        boxShadow="lg" // Add shadow
        borderRadius="lg" // Add border radius for curved edges
        border="3px solid #052c65" // Add border
        p={6}
        maxW="container.xl"
      >
        <Heading as="h1" size="xl" mt={0}>
          Hello Dr {doctorInfo.Name}<br></br>
          <Divider borderColor="#052c65" borderWidth="2px" />
        </Heading>
        <HStack w="350px" align="start" spacing={2}>
       
        </HStack>

        <br></br>
        <br></br>
        <Flex mt={8} justify="space-between">
         

          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="lg">
              Upcoming Appointments
            </Heading>
            <Divider borderColor="#052c65" borderWidth="2px" />
            <button
          style={{ width: 150 }}
          className="btn btn-sm btn-primary"
          onClick={appoint}
        >
          View Details
        </button>
          </VStack>

          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="lg">
              View Patients
            </Heading>
            <Divider borderColor="#052c65" borderWidth="2px" />
            <button
          style={{ width: 150 }}
          className="btn btn-sm btn-primary"
          onClick={viewpatients}
        >
          View Details
        </button>
          </VStack>
        </Flex>
      </Container>

    </ChakraProvider>
    
  );
};

export default DoctorHome;










