import React, { useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import "./StylePatient.css";
const PatientHome = () => {
  
  const { id } = useParams<{ id: string }>();
  const [patientInfo, setPatientInfo] = useState<any>({});
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/doctor/viewPatientInfo/${id}`)
      .then((response) => {
        setPatientInfo(response.data);
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
          My Clinic Dashboard<br></br>
          <Divider borderColor="#052c65" borderWidth="2px" />
        </Heading>
        <HStack w="350px" align="start" spacing={2}>
          <Heading as="h5" size="md" mt={0}>
            MR. {patientInfo.Name}
            <Divider borderColor="#052c65" borderWidth="2px" />
          </Heading>
        </HStack>

        <br></br>
        <br></br>
        <Flex mt={8} justify="space-between">
          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="lg">
              Upcoming Appointments
            </Heading>
            <Divider borderColor="#052c65" borderWidth="2px" />
            <List spacing={2}>
              {patientData.appointments.map((appointment, index) => (
                <ListItem key={index}>
                  Date: {appointment.date} | Time: {appointment.time} | Doctor:{" "}
                  {appointment.doctor}
                </ListItem>
              ))}
            </List>
          </VStack>

          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="lg">
              Medical History
            </Heading>
            <Divider borderColor="#052c65" borderWidth="2px" />
            <UnorderedList spacing={2}>
              {patientData.medicalHistory.map((entry, index) => (
                <ListItem key={index}>{entry}</ListItem>
              ))}
            </UnorderedList>
          </VStack>

          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="lg">
              Prescriptions
            </Heading>
            <Divider borderColor="#052c65" borderWidth="2px" />
            <List spacing={2}>
              {patientData.prescriptions.map((prescription, index) => (
                <ListItem key={index}>
                  Medication: {prescription.medication} | Dosage:{" "}
                  {prescription.dosage} | Instructions:{" "}
                  {prescription.instructions}
                </ListItem>
              ))}
            </List>
          </VStack>
        </Flex>
      </Container>
    </ChakraProvider>
  );
};

export default PatientHome;
