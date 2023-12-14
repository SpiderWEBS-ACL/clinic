import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  DatePicker,
  DatePickerProps,
  TimePickerProps,
  Modal,
  Button,
  Row,
  Col,
  Card,
  Avatar,
} from "antd";

import {
  ArrowRightOutlined,
  CreditCardFilled,
  WalletFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IoChatbox } from "react-icons/io5";
import { getPharmacists } from "../../apis/Doctor/GetAllPharmacists";

const { Option } = Select;

const ViewAllPharmacists = () => {
  const [Pharmacists, setPharmacists] = useState<any[]>([]);
  const [AllPharmacists, setAllPharmacists] = useState([]);
  const [Name, setName] = useState("");
  const [Specialty, setSpecialty] = useState("");
  const [Date, setDate] = useState("");
  const [AppointmentDate, setAppointmentDate] = useState("");
  const [Time, setTime] = useState("");
  const [AppointmentTime, setAppointmentTime] = useState("");
  const [DoctorId, setDoctorId] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [HourlyRate, setHourlyRate] = useState<number>(0);
  const [DoctorDiscount, setDoctorDiscount] = useState<number>(0);
  const [FamilyMembers, setFamilyMembers] = useState<string[]>([]);
  const [FamilyMember, setFamilyMember] = useState("");
  const [SessionPrice, setSessionPrice] = useState("");
  const navigate = useNavigate();
  const [loadingList, setLoadingList] = useState(true);
  const { Meta } = Card;

  const timeSlots = [];

  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const hourStr = hours.toString().padStart(2, "0");
      const minuteStr = minutes.toString().padStart(2, "0");
      timeSlots.push(`${hourStr}:${minuteStr}:00`);
    }
  }

  const getAllPharmacists = async () => {
    try {
      const response = await getPharmacists();
      setPharmacists(response.data);
      console.log("Pharmacists", response.data);
      setAllPharmacists(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRedirection = (item: any) => {
    navigate(`/doctor/chat/${item}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      getAllPharmacists();
    };
    fetchData();
    setLoadingList(false);
  }, []);

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialty(e.target.value);
  };
  const onTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
    setTime(timeString);
  };
  const handleTimeSlotChange = (selectedTimeSlot: string) => {
    setTime(selectedTimeSlot);
  };
  const handleAppointmentTimeSlotChange = (selectedTimeSlot: string) => {
    setAppointmentTime(selectedTimeSlot);
  };
  const handleAppointmentFamilyChange = (familyMember: string) => {
    setFamilyMember(familyMember);
  };

  const handleClearFilters = async () => {
    setLoadingList(true);
    setName("");
    setSpecialty("");
    setDate("");
    setTime("");
    setPharmacists(AllPharmacists);
    setLoadingList(false);
  };

  return (
    <div className="container">
      {/* <h2 className="text-center mt-4 mb-4">Pharmacists</h2> */}
      <div className="mb-3">
        <span></span>
      </div>
      <tbody>
        {Pharmacists.map(
          (request, index) =>
            index % 3 === 0 && (
              <Row gutter={16} key={index}>
                {Pharmacists.slice(index, index + 3).map(
                  (request, subIndex) => (
                    <Col span={8} key={subIndex} style={{ maxWidth: "27rem" }}>
                      <div>
                        <Card
                          style={{
                            width: "25rem",
                            marginTop: "3rem",
                            height: "12rem",
                          }}
                          loading={loadingList}
                          hoverable
                          className="hover-card"
                          onClick={() => {
                            handleRedirection(request._id);
                          }}
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
                                {request.Name}
                              </div>
                            }
                            description={
                              <div>
                                <strong>Affiliation: </strong>{" "}
                                {request.Affiliation}
                                <br></br>
                                <br></br>
                                <button
                                  style={{ marginLeft: "14rem" }}
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleRedirection(request._id)}
                                >
                                  <IoChatbox />
                                </button>
                              </div>
                            }
                          />
                        </Card>
                      </div>
                    </Col>
                  )
                )}
              </Row>
            )
        )}
      </tbody>
    </div>
  );
};

export default ViewAllPharmacists;
