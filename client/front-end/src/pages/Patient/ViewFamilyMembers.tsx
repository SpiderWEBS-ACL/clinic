import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

const ViewFamilyMembers = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [hasFamilyMembers, setHasFamilyMembers] = useState(false);
  const [loading, setLoading] = useState(true);

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
      .get(`/patient/viewFamilyMembers`, config)
      .then((response) => {
        setFamilyMembers(response.data);
        setLoading(false);
        setHasFamilyMembers(response.data.length > 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  }, [id]);

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

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Family Members</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Relation</th>
            <th>National ID</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>

        <tbody>
          {familyMembers.map((member: any, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{member.Name}</td>
              <td>{member.RelationToPatient}</td>
              <td>{member.NationalID}</td>
              <td>{member.Age}</td>
              <td>{member.Gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFamilyMembers;
