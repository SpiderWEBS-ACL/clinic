import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, message } from "antd";
import { Col, Row } from "react-bootstrap";
import { Card, Avatar } from "antd";
import { getMyPatients } from "../../apis/Doctor/Patients/GetMyPatients";
import { upcomingAppointments } from "../../apis/Doctor/Appointments/UpcomigAppointments";
import { searchPatient } from "../../apis/Doctor/Patients/SearchPatient";

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
        setLoadingList(false);
        setAllPatients(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
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
          message.error("No data found!");
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
      <h2 className="text-center mt-4 mb-4">
        <strong>Patients</strong>
      </h2>
      <div>
        <span>
          <label style={{ marginRight: 8, marginLeft: 250 }}>
            <strong>Appointments:</strong>
          </label>
          <Select
            defaultValue="All"
            value={selectedOption}
            style={{ width: 150 }}
            onChange={handleChange}
            options={[
              { value: "All", label: "All" },
              { value: "Upcoming", label: "Upcoming" },
            ]}
          />
          <label style={{ marginRight: 8, marginLeft: 10 }}>
            <strong>Name:</strong>
          </label>
          <Input
            type="text"
            placeholder="Search"
            value={name}
            onChange={handleInputChange}
            style={{ width: 150, marginRight: 30 }}
          />
          <button
            style={{ width: 80, marginRight: 10 }}
            className="btn btn-sm btn-primary"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>

          <button
            onClick={handleClearFilters}
            style={{ width: 100 }}
            className="btn btn-sm btn-primary"
          >
            Clear filters
          </button>
        </span>
      </div>
      <br />

      <tbody>
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
                          height: "15rem",
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
                            <div style={{ fontSize: "20px" }}>
                              {patient.Name}
                            </div>
                          }
                          description={
                            <div>
                              <strong>Email:</strong> {patient.Email}
                              <br></br>
                              <br></br>
                              <strong>Date of birth:</strong>{" "}
                              {patient.Dob.substring(0, 10)}
                              <br></br>
                              <br></br>
                              <strong>Gender:</strong> {patient.Gender}
                              <br></br>
                              <br></br>
                              <strong>Mobile:</strong> {patient.Mobile}
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
      </tbody>
    </div>
  );
};

export default ViewAllPatients;
