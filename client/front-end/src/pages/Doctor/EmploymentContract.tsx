import React, { useState, useEffect } from "react";
import { Layout, message } from "antd";
const { Header } = Layout;
import Typography from "@mui/material/Typography";
import {
  ChakraProvider,
  Container,
  Heading,
  HStack,
  Divider,
  Flex,
  useQuery,
} from "@chakra-ui/react";
import axios from "axios";
import "./StyleDoctor.css";
import { config } from "../../Middleware/authMiddleware";
import { useNavigate, useParams } from "react-router-dom";

const EmploymentContract = () => {
  const {id} = useParams<{ id: string }>();
  // const id = "654ebafc8c55248699ce62b5"
  const [regReqDetails, setRegReqDetails] = useState<any>({});
  const [date, setDate] = useState<string>("");

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/doctor/registrationRequest/${id}`, config)
      .then((response) => {
        setRegReqDetails(response.data);
        getDate(response.data.AcceptanceDate);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  const navigate = useNavigate();

  async function getDate(date: string) {
    var dateObj = new Date(date.split("T")[0]);
    setDate(dateObj.toLocaleDateString());
  }

  const handleAccept = async () => {
    try {
      await api.post("doctor/acceptContract/" + id, config);
      message.success("Employment Contract Accepted! Welcome Aboard!");
      setTimeout(() => {
        navigate("/doctor/timeSlots");
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        message.error(apiError);
      } else {
        message.error("An error has occurred");
      }
    }
  };

  const handleReject = async () => {
    try {
      await api.post("doctor/rejectContract/" + id, config);
      message.success(
        "Employment Contract Rejected! We're sorry you Couldn't join us."
      );
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data.error;
        message.error(apiError);
      } else {
        message.error("An error has occurred");
      }
    }
  };

  return (
    <div style={{ alignContent: "center" }}>
      <Header style={{ padding: 20, height: 80 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            color: "white",
            fontFamily: "serif",
            fontWeight: "bold",
          }}
        >
          Employment Contract
        </Typography>
      </Header>

      <ChakraProvider cssVarsRoot={undefined}>
        <Container
          marginTop="5"
          boxShadow="lg" // Add shadow
          borderRadius="lg" // Add border radius for curved edges
          border="3px solid #052c65" // Add border
          p={6}
          maxW="container.md"
        >
          <Heading as="h1" size="xl" mt={0} style={{ fontFamily: "serif" }}>
            Dear Dr. {regReqDetails.Name},<br></br>
            <Divider borderColor="#052c65" borderWidth="2px" />
          </Heading>
          <HStack w="350px" align="start" spacing={2}></HStack>

          <div style={{ fontFamily: "serif", fontSize: 18 }}>
            <h5 style={{ fontFamily: "serif", fontWeight: "bold" }}>
              THIS EMPLOYMENT CONTRACT (this "Agreement") is effective as of
              <i>
                {" "}
                <u style={{ fontFamily: "serif", fontWeight: "bold" }}>
                  {date}{" "}
                </u>
              </i>
              <br />
              <br />
              BETWEEN:
            </h5>
            <br />
            <div style={{ textAlign: "center" }}>
              <h4>
                <u>
                  <i style={{ fontFamily: "serif" }}>SpiderWEBS</i>
                </u>
              </h4>
              <h5 style={{ fontFamily: "serif" }}>
                <b style={{ fontFamily: "serif" }}>("Employer")</b>
                <br />
                <br />
                and{" "}
              </h5>
              <br />
              <h4>
                <u>
                  <i style={{ fontFamily: "serif" }}>{regReqDetails.Name}</i>
                </u>
              </h4>
              <h5>
                <b style={{ fontFamily: "serif" }}>("Employee")</b>
                <br />
                <br />
              </h5>
              <br />
            </div>
            WHEREAS the Employer intends to hire the Employee for the Position:{" "}
            <b>
              <i style={{ fontFamily: "serif" }}>
                <u style={{ fontFamily: "serif", fontWeight: "bold" }}>
                  {regReqDetails.Specialty}
                </u>{" "}
                Doctor
              </i>
            </b>{" "}
            and the Employee desires to provide their services to the Employer
            for payment. <br />
            <br />
            IN CONSIDERATION of promises and other good and valuable
            consideration, the parties agree to the following:
            <br />
            <br />
            <h5>
              <b style={{ fontFamily: "serif" }}>I. EMPLOYEE DUTIES.</b>
            </h5>
            The Employee agrees that they will act in accordance with this
            Agreement and with the best interests of the Employer in mind, which
            may or may not require them to present the best of their skills,
            experience, and talents, to perform all the duties required of the
            Position. In carrying out the duties and responsibilities of their
            Position, the Employee agrees to adhere to any and all policies,
            procedures, rules, regulations, as administered by the Employer. In
            addition, the Employee agrees to abide by all local, county, State,
            and Federal laws while employed by the Employer.
            <br />
            <br />
            <h5>
              <b style={{ fontFamily: "serif" }}>II. PAY AND COMPENSATION.</b>{" "}
            </h5>
            &emsp; a. The Parties hereby agree that the Employee will be paid an
            hourly rate of{" "}
            <u>
              <b style={{ fontFamily: "serif" }}>{regReqDetails.Salary}</b>
            </u>{" "}
            <br />
            &emsp; b. Whereas the Parties also agree that the clinic will
            receive a clinical markup of{" "}
            <b style={{ fontFamily: "serif" }}>10%</b> on every &emsp;
            appointment
            <br />
            <br />
            <h5>
              <b style={{ fontFamily: "serif" }}>III. TERMS OF AGREEMENT.</b>{" "}
            </h5>
            This Agreement shall be effective on the date of signing this
            Agreement (hereinafter referred to as the “Effective Date”). Upon
            the end of the term of the Agreement, this Agreement will not be
            automatically renewed for a new term.
            <br />
            <br />
            <h5>
              <b style={{ fontFamily: "serif" }}>IV. CONFIDENTIALITY</b>
            </h5>
            All terms and conditions of this Agreement and any materials
            provided during the term of the Agreement must be kept confidential
            by the Employee, unless the disclosure is required pursuant to
            process of law. Disclosing or using this information for any purpose
            beyond the scope of this Agreement, or beyond the exceptions set
            forth above, is expressly forbidden without the prior consent of the
            Employer.
          </div>
          <br />

          <div style={{ display: "flex" }}>
            <button
              style={{ marginLeft: "auto", marginRight: "20px" }}
              className="btn btn-success"
              type="button"
              onClick={handleAccept}
            >
              Accept Contract
            </button>
            <button
              style={{ marginRight: "20px" }}
              className="btn btn-danger"
              type="button"
              onClick={handleReject}
            >
              Reject Contract
            </button>
          </div>

          <br></br>
          <br></br>
        </Container>
      </ChakraProvider>

      <br />
    </div>
  );
};

export default EmploymentContract;
