import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { message } from "antd";

const AddFamilyMember = () => {
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

  const handleSubmit = async () => {
    const Age = parseInt(age + "");
    try {
      const data = {
        Name,
        RelationToPatient,
        NationalID,
        Age,
        Gender,
      };
      debugger;
      console.log(data);
      console.log("http://localhost:8000/patient/addFamilyMember/" + id);
      const response = await axios.post(
        "http://localhost:8000/patient/addFamilyMember/" + id,
        data
      );
      message.success("Family member added successfully!");
      console.log("Response:", response.data);
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
            ></InputField>

            <InputField
              id="RelationToPatient"
              label="Relation"
              type="select"
              options={["Husband", "Wife", "Son", "Daughter"]}
              value={RelationToPatient}
              onChange={setRelationToPatient}
            ></InputField>

            <InputField
              id="NationalID"
              label="National ID"
              type="text"
              value={NationalID}
              onChange={setNationalID}
            ></InputField>

            <InputField
              id="age"
              label="age"
              type="number"
              value={age}
              onChange={setage}
            ></InputField>

            <InputField
              id="Gender"
              label="Gender"
              type="select"
              options={["Male", "Female"]}
              value={Gender}
              onChange={setGender}
            ></InputField>

            <Button
              style={{ marginRight: "10px", marginTop: "10px" }}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMember;
