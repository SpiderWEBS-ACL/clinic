import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Container,
  Heading,
  VStack,
  HStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import "./StyleDoctor.css";
import { getDoctor } from "../../apis/Doctor/GetDoctor";
const DoctorHome = () => {
  const { id } = useParams<{ id: string }>();
  const [doctorInfo, setDoctorInfo] = useState<any>({});

  const fetchDoctor = async () => {
    await getDoctor()
      .then((response) => {
        setDoctorInfo(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchDoctor();
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
  const appoint = async () => {
    navigate(`/doctor/allAppointments`);
  };
  const viewpatients = async () => {
    navigate(`/doctor/viewPatients`);
  };

  return (
    <div>
      <ChakraProvider cssVarsRoot={undefined}>
        <Container
          marginTop="5"
          boxShadow="lg"
          borderRadius="lg"
          border="3px solid #052c65"
          p={6}
          maxW="container.xl"
        >
          <Heading as="h1" size="xl" mt={0}>
            Welcome Dr. {doctorInfo.Name}!<br></br>
            <Divider borderColor="#052c65" borderWidth="2px" />
          </Heading>
          <HStack w="350px" align="start" spacing={2}></HStack>

          <div style={{ display: "flex" }}>
            <button
              style={{ marginLeft: "auto", marginRight: "20px" }}
              className="btn btn-danger"
              type="button"
              onClick={() => {
                navigate("/doctor/changePassword");
              }}
            >
              Change Password
            </button>
          </div>

          <br></br>
          <br></br>
          <Flex mt={8} justify="space-between">
            <VStack w="30%" align="start" spacing={4}>
              <Heading as="h2" size="md">
                Upcoming Appointments
              </Heading>
              <Divider borderColor="#052c65" borderWidth="1px" />
              <button
                style={{ width: 150 }}
                className="btn btn-sm btn-primary"
                onClick={appoint}
              >
                View Details
              </button>
            </VStack>

            <VStack w="30%" align="start" spacing={4}>
              <Heading as="h2" size="md">
                View Patients
              </Heading>
              <Divider borderColor="#052c65" borderWidth="1px" />
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

      <br />
    </div>
  );
};

export default DoctorHome;
