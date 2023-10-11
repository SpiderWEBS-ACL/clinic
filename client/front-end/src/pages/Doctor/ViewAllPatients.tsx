import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Input, Select } from "antd";
import InputField from "../../components/InputField";

const ViewAllPatients = () => {
  const [name, setName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const { id } = useParams<{ id: string }>();

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/doctor/viewPatients/${id}`)
      .then((response) => {
        setPatients(response.data);
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
    if (value === "Upcoming Appointments") {
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

  return (
    <div className="container">
      <Loading />

      <h2 className="text-center mt-4 mb-4">Patients</h2>
      <div style={rowStyle}>
        <Select
          defaultValue="All"
          style={{ width: 205 }}
          onChange={handleChange}
          options={[
            { value: "All", label: "All" },
            {
              value: "Upcoming Appointments",
              label: "Upcoming Appointments",
            },
          ]}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search Name"
          style={inputStyle}
          value={name}
          onChange={handleInputChange}
        />
        <button
          style={buttonStyle}
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <br />
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
              <td>
                <h4>{index + 1}</h4>
              </td>
              <td>
                <h4>{member.Name}</h4>
              </td>
              <td>
                <button
                  className="btn btn-primary"
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
