import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Select, message } from "antd";
import { Col, Row } from "react-bootstrap";
import {Card, Skeleton, Switch } from 'antd';
import Avatar from '@mui/material/Avatar';


const ViewAllPatients = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");
  const { Meta } = Card;
  const [patients, setPatients] = useState<any[]>([]);
  const [AllPatients, setAllPatients] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  useEffect(() => {
    api
      .get(`/doctor/viewPatients/`, config)
      .then((response) => {
        setLoadingList(false);
        setPatients(response.data);
        setAllPatients(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },[]);

  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    navigate(`/doctor/viewPatientInfo/${item}`);
  };

 
  const handleChange = (value: string) => {
    setLoadingList(true);
    if (value === "Upcoming") {
      setSelectedOption("Upcoming");
      api
        .get(`/doctor/upcomingAppointments/`, config)
        .then((response) => {
          const array = response.data;
          const myArray: any[] = [];
          for (let i = 0; i < array.length; i++) {
            myArray.push(array[i].Patient);
          }
          setPatients(myArray);
          console.log(response.data);
          setLoadingList(false);
        })
        .catch((error) => {

          if (error.response && error.response.status === 404) {
            setPatients([])
            setLoadingList(false);
            message.error("No upcoming appointments!")
          }
          else{
            console.error("Error:", error);

          }
                });
    } else {
      setSelectedOption("All");

      api
        .get(`/doctor/viewPatients/`, config)
        .then((response) => {
          setPatients(response.data);
          setLoadingList(false);
        })
        .catch((error) => {
          setLoadingList(false);
          message.error(error);

          console.error("Error:", error);
        });
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
 
  const handleSearch = () => {
    setLoadingList(true);
    api
      .get(`/doctor/searchPatient/${name}`, config)
      .then((response) => {
        setPatients(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log(1111111111)
          setLoadingList(false);
          setPatients([]);
          message.error("No data found!")
        }
        else{
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
      <div style={rowStyle}>
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
              {
                value: "Upcoming",
                label: "Upcoming",
              },
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
        {patients.map((patient, index) => (
      index % 3 === 0  && (
        <Row gutter={16} key={index}>
          {patients.slice(index, index + 3).map((patient, subIndex) => (
            <Col span={8} key={subIndex}>
              <div>
              <Card
                style={{ height: 150, width: 400, marginTop: 16 }}
                loading={loadingList}
                hoverable
                className="hover-card"
                onClick={() => handleRedirection(patient._id)}

              >
                <Meta
                  avatar={<Avatar src="/broken-image.jpg" sx={{ width: 100, height: 100 }} />}
                  title={patient.Name}
                  description={"Email: " + patient.Email + "\n" + "Date of birth: " + patient.Dob + "\n" + "Gender: " + patient.Gender + "\n" + "Mobile: " + patient.Mobile}
                  />
              </Card>
              </div>

            </Col>
          ))}
        </Row>
      )
    ))}
             
              
              
              
          
              
           
          
        </tbody>
     
    </div>
  );
};

export default ViewAllPatients;
