import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Spin, Modal, Input, Select, message, Card, Avatar, Button} from "antd";
import { Divider } from "@chakra-ui/react";
import { Col, Row } from "react-bootstrap";
import { LinkOutlined } from "@ant-design/icons";
import { FloatButton } from 'antd';

const ViewFamilyMembers = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [familyMembers, setFamilyMembers] =  useState<any[]>([]);
  const [hasFamilyMembers, setHasFamilyMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const { Option } = Select;
  const [RelationToPatient, setRelationToPatient] = useState("Relation");
  const { Meta } = Card;
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
    setLoadingList(false);
  }, [id]);

 
  const openModal = () => {
    setShowPopup(true);
  };

  const handleFormSubmit = async() => {
    try {
      const data = {
        emailInput,
        phoneInput,
        RelationToPatient,
      };

      const headers = {
        Authorization: "Bearer " + accessToken,
      };
      if ((emailInput != "" || phoneInput != "") && RelationToPatient != "Relation") {
       await api
          .post(`/patient/linkFamily`, data, { headers })
          .then((response) => {
            message.success("Family Member Linked Successfuly");
            handleModalClose();
          })
          .catch((error) => {
            message.error(`${error.response.data.error}`);
          });
          setLoading(true);
          api
      .get(`/patient/viewFamilyMembers`,  config)
      .then((response) => {
        setFamilyMembers(response.data);
        setLoading(false);
        setHasFamilyMembers(response.data.length > 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      } else {
        message.warning("Please fill in the fields  ");
      }
    } catch (error: any) {
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
      <FloatButton
      icon={<LinkOutlined style={{fontSize: 20}}/>}
      tooltip={<div>Link a registered family member</div>}
      onClick={() => openModal()}
      style={{width: 75, height:75}}

/>


      <Modal
        title="Link a Registered Family Member"
        visible={showPopup}
        onOk={handleFormSubmit}
        onCancel={handleModalClose}
      >
        <div>
          <input
            style={{ margin: "10px" }}
            type="radio"
            value="email"
            checked={selectedOption === "email"}
            onChange={() => setSelectedOption("email")}
          />
          <label>Email</label>
          <input
            style={{ marginLeft: "100px", marginRight: "10px" }}
            type="radio"
            value="phone"
            checked={selectedOption === "phone"}
            onChange={() => setSelectedOption("phone")}
          />
          <label>Phone</label>

          {selectedOption === "phone" && (
            <Input
              style={{ marginTop: "10px" }}
              type="text"
              placeholder="Enter phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          )}
          {selectedOption === "email" && (
            <Input
              style={{ marginTop: "10px" }}
              type="text"
              placeholder="Enter email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          )}
        </div>
        <br></br>
        <Select
          style={{ marginTop: "10px" }}
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
<tbody>
        {familyMembers.map(
          (member, index) =>
            index % 3 === 0 && (
              <Row gutter={16} key={index}>
                {familyMembers.slice(index, index + 3).map((member, subIndex) => (
                  <Col span={8} key={subIndex} style={{maxWidth: "27rem"}}>
                    <div>
                      <Card
                        style={{
                          width: "25rem",
                          marginTop: "3rem",
                          height: "15rem",
                        }}
                        loading={loadingList}
                        hoverable
                        className="hover-card"
                       // onClick={() => handleRedirection(patient._id)}
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
                              {member.Name}
                            </div>
                          }
                          description={
                            <div>
                            
                                <strong>Relation:</strong> {member.RelationToPatient}
                              
                                <br></br>
                                <br></br>

                                <strong>Age: </strong>
                                {member.Age}
                                <br></br>
                                <br></br>
                              
                                <strong>Gender:</strong> {member.Gender}
                              
                                <br></br>
                                <br></br>
                                <strong>National ID:</strong> {member.NationalID || "N/A"}
                              
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

export default ViewFamilyMembers;
