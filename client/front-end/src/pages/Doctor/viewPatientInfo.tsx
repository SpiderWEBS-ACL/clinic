import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Row,
  Select,
  TimePickerProps,
  message,
} from "antd";
import { Col } from "react-bootstrap";
import { Card, Skeleton, Switch } from "antd";
import { Avatar } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";
import { tr } from "date-fns/locale";
import "./StyleDoctor.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { green } from "@mui/material/colors";
import { headers } from "../../Middleware/authMiddleware";

const ViewPatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem("accessToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Message, setMessage] = useState("");
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isFamilyMembersModalOpen, setIsFamilyMembersModalOpen] =
    useState(false);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [AppointmentTime, setAppointmentTime] = useState<any>();
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [timeSlotsDoctor, setTimeSlotsDoctor] = useState([]);

  const [patientInfo, setPatientInfo] = useState<any>({});

  const { TextArea } = Input;
  const { Meta } = Card;
  const config = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });

  useEffect(() => {
    getPatientInfo();
  }, [id]);

  const getPatientInfo = async () => {
    await api
      .get(`/doctor/viewPatientInfo/${id}`, config)
      .then((response) => {
        console.log(response.data);
        setPatientInfo(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (name && selectedOption) {
      const data = {
        Description: name,
        Type: selectedOption,
      };
      setIsModalOpen(false);
      message.success("Health record added");

      const response = await api.post(
        `/doctor/addHealthRecordForPatient/${id}`,
        data,
        config
      );
    } else {
      message.error("Please enter required fields");
    }
  };
  const setTimeSlotsApi = (date: string) => {
    api
      .post(
        "patient/getTimeSlotsDoctorDate",
        {
          date: date,
        },
        { headers: headers }
      )
      .then((response) => {
        setTimeSlotsDoctor(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onAppointmentDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setAppointmentDate(dateString);
    setTimeSlotsApi(dateString);
    setMessage("");
    console.log(dateString);
  };

  const handleCheckAvailability = () => {
    if (AppointmentDate && AppointmentTime) {
      api
        .post(
          "doctor/checkDoctor",
          {
            Date: AppointmentDate,
            Time: AppointmentTime,
          },
          config
        )
        .then((response) => {
          setMessage(response.data.message);
          if (response.data.message === "available") {
            message.success("Available");
          } else {
            message.error("You are not available at this time");
          }
        });
    } else {
      message.error("Please enter required fields");
    }
  };
  const schedule = async () => {
    setShowDateTimeModal(true);
  };

  const handleAppointmentTimeSlotChange = (selectedTimeSlot: string) => {
    setAppointmentTime(selectedTimeSlot);
    setMessage("");
    console.log(selectedTimeSlot);
  };
  const handleOk2 = async () => {
    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (value: string) => {
    setSelectedOption(value);
  };
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(e.target.value);
  };
  const [year, month, day] = String(patientInfo.Dob)
    .substring(0, 10)
    .split("-");
  const currYear = new Date().getFullYear();
  const age = currYear - parseInt(year, 10); // Convert the string to an integer

  const handleHealth = async () => {
    setIsModalOpen2(true);
    const response = await api.get(`/doctor/viewHealthRecords/${id}`, config);
    if (response) {
      setHealthRecords(response.data);
      setLoading(false);
    } else {
      message.error("Something happened");
    }
  };
  const handleFamilyMembers = async () => {
    setIsFamilyMembersModalOpen(true);
  };
  const followup = async () => {
    const date = AppointmentDate.concat("T" + AppointmentTime + ".000" + "Z");
    const response = await api.post(
      `/doctor/scheduleFollowup/`,
      {
        Patient: id,
        appDate: date,
        followUp: true,
        status: "Upcoming",
      },
      config
    );
    setShowDateTimeModal(false);
    setAppointmentTime("");
    setAppointmentDate("");
  };
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Patient Information</strong>
      </h2>

      <Card
        style={{
          height: "27rem",
          width: "50rem",
          marginTop: "2rem",
          marginLeft: "12rem",
        }}
        loading={loadingList}
        hoverable
        className="hover-card"
        // cover={
        //   <img
        //     alt="example"
        //     src="https://img.freepik.com/free-vector/doctor-examining-patient-clinic-illustrated_23-2148856559.jpg?w=1380&t=st=1699651650~exp=1699652250~hmac=beb4f5b10e87a92fc98a6afdbec668faa4127bf16f374383eaacb5337798e6bf"
        //     />
        // }
      >
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #333",
            paddingBottom: "10px",
          }}
        >
          <Avatar
            src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            style={{ width: 100, height: 100 }}
          />
          <div style={{ marginLeft: "20px", flex: 1 }}>
            <div style={{ fontSize: "22px", marginBottom: "10px" }}>
              {patientInfo.Name}
            </div>
            <div style={{ fontSize: "15px", lineHeight: "1.5" }}>
              <p>
                <strong>Email: </strong>
                {patientInfo.Email}
              </p>
              <p>
                <strong>Date of birth: </strong>
                {String(patientInfo.Dob).substring(0, 10)}
              </p>
              <p>
                <strong>Gender: </strong>
                {patientInfo.Gender}
              </p>
              <p>
                <strong>Mobile: </strong>
                {patientInfo.Mobile}
              </p>
              <p>
                <strong>Age: </strong>
                {age}
              </p>
              <p>
                <strong>Health Records: </strong>
                <InfoCircleOutlined onClick={handleHealth} />
              </p>
              <p>
                <strong>Family Members: </strong>
                <InfoCircleOutlined onClick={handleFamilyMembers} />
              </p>
            </div>
          </div>
        </div>

        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 25,
          }}
        >
          <button
            onClick={showModal}
            style={{ marginLeft: 200 }}
            className="btn btn-sm btn-primary"
          >
            Add Health Record
          </button>
          <button
            onClick={schedule}
            style={{ marginRight: 200 }}
            className="btn btn-sm btn-primary"
          >
            Schedule a follow up
          </button>
        </Row>
      </Card>

      <Modal
        title="Enter health record:"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        style={{ height: "900px" }}
      >
        <p>
          <Select
            defaultValue="Type"
            value={selectedOption}
            style={{ width: 150 }}
            onChange={handleChange}
            options={[
              { value: "Surgical", label: "Surgical" },
              { value: "Allergy", label: "Allergy" },
              { value: "Diagnostic", label: "Diagnostic" },
              {
                value: "Immunization",
                label: "Immunization",
              },
            ]}
          />
        </p>

        <TextArea
          rows={4}
          placeholder="Enter description..."
          maxLength={200}
          onChange={handleInputChange}
        />
      </Modal>

      <Modal
        title={patientInfo.Name + "'s Health Records"}
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        width={500}
        bodyStyle={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {" "}
        {healthRecords.map((record, index) => (
          <div>
            <Card
              style={{ height: 150, width: 400, marginTop: 16 }}
              loading={loading}
              className="hover-card"
            >
              <Meta
                avatar={
                  <Avatar sx={{ bgcolor: green[500] }}>
                    {" "}
                    <AssignmentIcon />{" "}
                  </Avatar>
                }
                title={"Type: " + record.Type}
                description={"Description: " + record.Description}
              />
            </Card>
          </div>
        ))}
      </Modal>
      <Modal
        title={patientInfo.Name + "'s Family Members"}
        open={isFamilyMembersModalOpen}
        onOk={() => {
          setIsFamilyMembersModalOpen(false);
        }}
        onCancel={() => {
          setIsFamilyMembersModalOpen(false);
        }}
        width={500}
        bodyStyle={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {" "}
        {patientInfo.FamilyMembers?.map((member: any) => (
          <div>
            <Card
              style={{ height: 150, width: 400, marginTop: 16 }}
              loading={false}
              className="hover-card"
            >
              <Meta
                avatar={<Avatar style={{ width: 100, height: 100 }} />}
                title={member.Name}
                description={`${member.RelationToPatient}: ${member.Age} Years old`}
              />
            </Card>
          </div>
        ))}
      </Modal>

      <Modal
        title="Select FollowUp Time"
        visible={showDateTimeModal}
        onCancel={() => {
          setShowDateTimeModal(false);
          setMessage("");
        }}
        footer={null}
      >
        <DatePicker
          onChange={onAppointmentDateChange}
          style={{ width: 150, marginRight: 30 }}
        />
        <label style={{ marginRight: 8 }}></label>
        <Select
          defaultValue="Time Slots"
          value={AppointmentTime}
          onChange={handleAppointmentTimeSlotChange}
          style={{ width: 150, marginRight: 30 }}
        >
          <Select
            defaultValue="Time Slots"
            style={{ width: 150 }}
            onChange={handleChange}
            options={timeSlotsDoctor.map((slot) => ({
              value: slot,
              label: slot,
            }))}
          />
        </Select>

        <button
          className="btn btn-sm btn-primary"
          style={{
            marginBlock: "1rem",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
          }}
          onClick={() => handleCheckAvailability()}
        >
          <span aria-hidden="true"></span>
          Check Availability
        </button>
        <button
          className="btn btn-sm btn-success"
          style={{
            marginLeft: "1rem",
            marginBlock: "1rem",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "5px",
          }}
          disabled={Message === "available" ? false : true}
          onClick={followup}
        >
          <span aria-hidden="true"></span>
          Book
        </button>
      </Modal>
    </div>
  );
};

export default ViewPatientInfo;
