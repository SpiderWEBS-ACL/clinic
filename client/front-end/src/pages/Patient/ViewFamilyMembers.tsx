import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewFamilyMembers = () => {
  const { id } = useParams<{ id: string }>();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [hasFamilyMembers, setHasFamilyMembers] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    api
      .get(`/patient/viewFamilyMembers/${id}`)
      .then((response) => {
        setFamilyMembers(response.data);
        console.log(response.data);
        setHasFamilyMembers(response.data.length > 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

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
