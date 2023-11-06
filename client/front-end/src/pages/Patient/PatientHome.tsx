import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Container,
  Heading,
  List,
  ListItem,
  UnorderedList,
  VStack,
  HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StylePatient.css";
const PatientHome = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [patientInfo, setPatientInfo] = useState<any>({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    api
      .get(`/patient/getPatient`, config)
      .then((response) => {
        setPatientInfo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  return (
    <ChakraProvider>
      <Container
        marginTop="5"
        boxShadow="lg" // Add shadow
        borderRadius="lg" // Add border radius for curved edges
        border="3px solid #052c65" // Add border
        p={6}
        maxW="container.xl"
      >
        <Heading as="h1" size="xl" mt={0}>
          Dashboard<br></br>
          <Divider borderColor="#052c65" borderWidth="2px" />
        </Heading>
        <HStack w="350px" align="start" spacing={2}>
          <Heading as="h5" size="md" mt={0}>
            Mr./Ms. {patientInfo.Name}
            <Divider borderColor="#052c65" borderWidth="2px" />
          </Heading>
        </HStack>

        <br></br>
        <br></br>
        <Flex mt={8} justify="space-between">
          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="md">
              Upcoming Appointments
            </Heading>
            <Divider borderColor="#052c65" borderWidth="1px" />
            <List spacing={2}>
              {appointments.map((appointment: any, index) => (
                <ListItem key={index}>
                  Date: {appointment.AppointmentDate} | Doctor:{" "}
                  {appointment.Doctor}
                </ListItem>
              ))}
            </List>
          </VStack>

          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="md">
              Medical History
            </Heading>
            <Divider borderColor="#052c65" borderWidth="1px" />
            No records
          </VStack>

          <VStack w="30%" align="start" spacing={4}>
            <Heading as="h2" size="md">
              Prescriptions
            </Heading>
            <Divider borderColor="#052c65" borderWidth="1px" />
            <List spacing={2}>
              {prescriptions.map((prescription: any, index) => (
                <ListItem key={index}>
                  Medication: {prescription.Medication} | Dosage:{" "}
                  {prescription.Dosage} | Instructions:{" "}
                  {prescription.Instructions}
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
