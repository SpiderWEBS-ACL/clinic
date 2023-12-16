import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Select, message } from "antd";
import { Col, Row } from "react-bootstrap";
import { Card, Avatar } from "antd";
import { getMyPatients } from "../../apis/Doctor/Patients/GetMyPatients";
import { upcomingAppointments } from "../../apis/Doctor/Appointments/UpcomigAppointments";
import { searchPatient } from "../../apis/Doctor/Patients/SearchPatient";
import { IoChatbox } from "react-icons/io5";

const ViewAllPatients = () => {
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");
  const { Meta } = Card;
  const [patients, setPatients] = useState<any[]>([]);
  const [AllPatients, setAllPatients] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const fetchPatients = async () => {
    await getMyPatients()
      .then((response) => {
        setPatients(response.data);
        setAllPatients(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingList(false);
      });
  };
  useEffect(() => {
    fetchPatients();
  }, []);

  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    navigate(`/doctor/viewPatientInfo/${item}`);
  };

  const handleChange = async (value: string) => {
    setLoadingList(true);
    if (value === "Upcoming") {
      setSelectedOption("Upcoming");
      await upcomingAppointments()
        .then((response) => {
          const array = response.data;
          const myArray: any[] = [];
          for (let i = 0; i < array.length; i++) {
            myArray.push(array[i].Patient);
          }
          setPatients(myArray);
          setLoadingList(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setPatients([]);
            setLoadingList(false);
            message.error("No upcoming appointments!");
          } else {
            console.error("Error:", error);
          }
        });
    } else {
      setSelectedOption("All");
      fetchPatients();
    }
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
  };

  const inputStyle = {
    marginRight: "0px",
    marginLeft: "250px",
    height: "40px",
    maxWidth: "200px",
  };

  const buttonStyle = {
    marginLeft: "2px",
    marginRight: "20px",
    height: "40px",
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSearch = async () => {
    setLoadingList(true);
    await searchPatient(name)
      .then((response) => {
        setPatients(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setLoadingList(false);
          setPatients([]);
          message.error("No patients found!");
        } else {
          console.error("Error:", error);
        }
      });
  };
  const handleClearFilters = async () => {
    setName("");
    setLoadingList(false);
    setSelectedOption("All");
    setPatients(AllPatients);
    message.success("Cleared!");
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Patients</h2>
      <div>
        <span>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <label
              style={{
                marginRight: "1rem",
                marginTop: "0.4rem",
              }}
            >
              <strong>Appointments</strong>
            </label>
            <Select
              defaultValue="All"
              value={selectedOption}
              style={{ width: 150, marginRight: 20 }}
              onChange={handleChange}
              options={[
                { value: "All", label: "All" },
                { value: "Upcoming", label: "Upcoming" },
              ]}
            />
            <label
              style={{
                marginRight: "1rem",
                marginTop: "0.4rem",
              }}
            >
              <strong>Name</strong>
            </label>
            <Input
              type="text"
              placeholder="Search"
              value={name}
              onChange={handleInputChange}
              style={{ width: 150, marginRight: 20 }}
            />
            <Button
              style={{ width: 80, marginRight: 20 }}
              type="primary"
              onClick={handleSearch}
            >
              filter
            </Button>

            <Button
              onClick={handleClearFilters}
              style={{ width: 100, marginRight: 20 }}
            >
              clear
            </Button>
          </div>
        </span>
      </div>
      <br />

      {patients.map(
        (patient, index) =>
          index % 3 === 0 && (
            <Row gutter={16} key={index}>
              {patients.slice(index, index + 3).map((patient, subIndex) => (
                <Col span={8} key={subIndex} style={{ maxWidth: "25rem" }}>
                  <div>
                    <Card
                      style={{
                        width: "24rem",
                        marginTop: "3rem",
                        height: "16rem",
                      }}
                      loading={loadingList}
                      hoverable
                      className="hover-card"
                      onClick={() => handleRedirection(patient._id)}
                    >
                      <Meta
                        avatar={
                          <Avatar
                            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                            style={{ width: 75, height: 75 }}
                          />
                        }
                        title={
                          <div style={{ fontSize: "20px" }}>{patient.Name}</div>
                        }
                        description={
                          <div>
                            <strong>Email:</strong> {patient.Email}
                            <br></br>
                            <br></br>
                            <strong>Date of birth:</strong>{" "}
                            {new Date(patient.Dob).toDateString()}
                            <br></br>
                            <br></br>
                            <strong>Gender:</strong> {patient.Gender}
                            <br></br>
                            <br></br>
                            <strong>Mobile:</strong> {patient.Mobile}
                            <button
                              style={{
                                marginLeft: "13rem",
                              }}
                              className="btn btn-sm btn-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/doctor/chat/${patient._id}`);
                              }}
                            >
                              <IoChatbox />
                            </button>
                          </div>
                        }
                      />
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
          )
      )}
    </div>
  );
};

export default ViewAllPatients;
