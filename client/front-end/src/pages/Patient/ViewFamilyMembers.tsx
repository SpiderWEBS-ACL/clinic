import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin, Modal, Input, Select, message } from "antd";
import { Divider } from "@chakra-ui/react";

const ViewFamilyMembers = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [hasFamilyMembers, setHasFamilyMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const { Option } = Select;
  const [RelationToPatient, setRelationToPatient] = useState("Relation");


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
  const openModal = () => {
    setShowPopup(true);
  };
  

  const handleFormSubmit = () => {
    try{
    const data = {
      emailInput,
      phoneInput,
      RelationToPatient
    }
    
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    if((emailInput != "" || phoneInput != "") && RelationToPatient != ""){
    api
    .post(`/patient/linkFamily`,data,{headers}).then(response => {
      message.success('Family Member Linked Successfuly');
      handleModalClose();
    }).catch(error =>{
      message.error(`${error.response.data.error}`);
    })
    
   
  }
  else{
    message.warning("Please fill in the fields  ")
  }
  }
  catch(error: any){
    message.error(`${error.response.data.error}`);
  }
  };
  
  const handleModalClose = () => {
    api
    .get(`/patient/viewFamilyMembers`)
    .then((response) => {
      setFamilyMembers(response.data);
      setLoading(false);
      setHasFamilyMembers(response.data.length > 0);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  setLoading(false);
    setShowPopup(false);
    setSelectedOption("");
  };
  
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Family Members</strong>
      </h2>
      <button
        className="btn btn-primary"
        style={{ marginTop: "10px" }}
        onClick={() => openModal()}
      >
        Link a registered family member 
      </button>

      <Modal
      title="Link a Registered Family Member"
      visible={showPopup}
      onOk={handleFormSubmit}
      onCancel={handleModalClose}
    >
      <div>
        <input
        style={{ margin: '10px' }}
          type="radio"
          value="email"
          checked={selectedOption === "email"}
          onChange={() => setSelectedOption("email")}
        />
        <label>Email</label>    
        <input
        style={{ marginLeft: '100px',marginRight: '10px' }}
          type="radio"
          value="phone"
          checked={selectedOption === "phone"}
          onChange={() => setSelectedOption("phone")}
        />
        <label>Phone</label>
          
        {selectedOption === "phone" && (
          <Input
          style={{ marginTop: '10px' }}
            type="text"
            placeholder="Enter phone number"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />
        )}
        {selectedOption === "email" && (
          <Input
          style={{ marginTop: '10px' }}
            type="text"
            placeholder="Enter email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        )}
      </div>
      <br></br>
      <Select
              style={{ marginTop: '10px' }}
              id="RelationToPatient"
              placeholder="Select an option"
              value={RelationToPatient}
              onChange={setRelationToPatient}
                >
              <Option value="Husband">Husband</Option>
              <Option value="Wife">Wife</Option>   
              <Option value="Son">Son</Option>            
              <Option value="Daughter">Daughter</Option>            
              </Select>
    </Modal>


     
      <Divider borderColor="#052c65" borderWidth="1px" />

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
