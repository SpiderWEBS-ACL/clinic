import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Input, Select } from "antd";
import InputField from "../../components/InputField";

const ViewAllPatients = () => {
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");
  const { id } = useParams<{ id: string }>();

  const [patients, setPatients] = useState<any[]>([]);
  const [AllPatients, setAllPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/doctor/viewPatients/${id}`)
      .then((response) => {
        setPatients(response.data);
        setAllPatients(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [id]);

  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    navigate(`/doctor/viewPatientInfo/${item}`);
  };

  const Loading = () => {
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    return null;
  };

  const handleChange = (value: string) => {
    setLoading(true);
    if (value === "Upcoming") {
      api
        .get(`/doctor/upcomingAppointments/${id}`)
        .then((response) => {
          const array = response.data;
          const myArray: any[] = [];
          for (let i = 0; i < array.length; i++) {
            myArray.push(array[i].Patient);
          }
          setPatients(myArray);
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } else {
      api
        .get(`/doctor/viewPatients/${id}`)
        .then((response) => {
          setPatients(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
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
    setLoading(true);
    api
      .get(`/doctor/searchPatient/${name}`)
      .then((response) => {
        setPatients(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };
  const handleClearFilters = async () => {
    setName("");
    setSelectedOption("All");
    setPatients(AllPatients);
  };

  return (
    <div className="container">
      <Loading />
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
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>View Details</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((member: any, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{member.Name}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleRedirection(member._id)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllPatients;
