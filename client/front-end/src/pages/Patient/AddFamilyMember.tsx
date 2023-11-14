import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { message } from "antd";

const AddFamilyMember = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [Name, setName] = useState<string>(" ");
  const Relation = {
    Husband: "Husband",
    Wife: "Wife",
    Son: "Son",
    Daughter: "Daughter",
  };
  const [RelationToPatient, setRelationToPatient] = useState(Relation.Husband);
  const [NationalID, setNationalID] = useState<string>(" ");
  const [age, setage] = useState<number>(0);
  const gender = {
    Male: "Male",
    Female: "Female",
  };
  const [Gender, setGender] = useState(gender.Male);
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const Age = parseInt(age + "");
    try {
      const data = {
        Name,
        RelationToPatient,
        NationalID,
        Age,
        Gender,
      };
      const headers = {
        Authorization: "Bearer " + accessToken,
      };
      if (Name != " " && NationalID != " " && Age != 0) {
        const response = await axios.post(
          "http://localhost:8000/patient/addFamilyMember/",
          data,
          { headers }
        );
        message.success("Family member added successfully!");
      } else {
        message.warning("Please fill all the required fields");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to add family member. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Add Family Member</h1>
          <form>
            <InputField
              id="Name"
              label="Name"
              type="text"
              value={Name}
              onChange={setName}
              required={true}
            ></InputField>

            <InputField
              id="RelationToPatient"
              label="Relation"
              type="select"
              options={["Husband", "Wife", "Son", "Daughter"]}
              value={RelationToPatient}
              onChange={setRelationToPatient}
              required={true}
            ></InputField>

            <InputField
              id="NationalID"
              label="National ID"
              type="text"
              value={NationalID}
              onChange={setNationalID}
              required={true}
            ></InputField>

            <InputField
              id="age"
              label="age"
              type="number"
              value={age}
              onChange={setage}
              required={true}
            ></InputField>

            <InputField
              id="Gender"
              label="Gender"
              type="select"
              options={["Male", "Female"]}
              value={Gender}
              onChange={setGender}
              required={true}
            ></InputField>

            <button
              className="btn btn-primary"
              style={{ marginRight: "10px", marginTop: "10px" }}
              onClick={(e: FormEvent) => handleSubmit(e)}
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMember;
