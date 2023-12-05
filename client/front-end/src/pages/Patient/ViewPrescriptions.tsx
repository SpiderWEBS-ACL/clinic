import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  DatePicker,
  DatePickerProps,
  Input,
  Select,
  message,
} from "antd";
import "./error-box.css";
import { getMyPrescription } from "../../apis/Patient/Prescriptions/GetMyPrescription";
import { filterPrescriptions } from "../../apis/Patient/Prescriptions/FilterPrescriptions";
import { getSelectedPrescription } from "../../apis/Patient/Prescriptions/GetSelectedPrescription";
import { Col, Row } from "react-bootstrap";
import { ArrowRightOutlined } from "@ant-design/icons";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Avatar } from "@mui/material";
import { green } from "@mui/material/colors";

const ViewPrescriptions = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setError] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const config = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  const { Meta } = Card;
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(
    null
  );

  const { Option } = Select;
  const { id } = useParams<{ id: string }>();

  const fetchPrescription = async () => {
    try {
      const prescription = await getMyPrescription();
      setPrescriptions(prescription.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const [Doctor, setDoctor] = useState("");
  const [Date, setDate] = useState("");
  const [Filled, setFilled] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDoctor(event.target.value);
  };
  const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };

  const filter = async () => {
    setLoadingList(true);
    try {
      const response = await filterPrescriptions(Doctor, Filled, Date, id);
      const data = response.data;
      if (data.length == 0) {
        message.error("No data");
        setPrescriptions([]);
      } else {
        setPrescriptions(data);
        setLoadingList(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearFilter = async () => {
    setLoadingList(true);
    try {
      const response = await getMyPrescription();
      setDoctor("");
      setFilled("");
      setError(false);
      setPrescriptions(response.data);
      setLoadingList(false);
    } catch (error) {
      console.error(error);
    }
  };
  const navigate = useNavigate();

  const handleRedirection = (item: any) => {
    navigate(`/patient/viewPrescriptionDetails/${item}`);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Prescriptions</h2>
      <span>
        <label style={{ marginRight: 4, marginBottom: 20 }}>
          <strong>Doctor Name:</strong>
        </label>
        <Input
          type="text"
          value={Doctor}
          onChange={handleNameChange}
          style={{ width: 150, marginRight: 80 }}
        />
        <label style={{ marginRight: 8 }}>
          <strong>Filled/Unfilled:</strong>
        </label>
        <Select
          style={{ width: 150, marginRight: "50px" }}
          onChange={setFilled}
          value={Filled}
        >
          <Option value="Filled">Filled</Option>
          <Option value="Unfilled">Unfilled</Option>
                 
        </Select>
        <label style={{ marginLeft: 10 }}>
          <strong>Date:</strong>
        </label>
        <DatePicker
          onChange={handleDateChange}
          style={{ width: 150, marginLeft: "8px" }}
          allowClear
        />
        <button
          onClick={filter}
          style={{
            width: 100,
            marginRight: 20,
            marginLeft: devicePixelRatio * 40,
          }}
          className="btn btn-sm btn-primary"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilter}
          style={{ width: 150 }}
          className="btn btn-sm btn-primary"
        >
          Clear Filters
        </button>
                
      </span>
      <tbody>
        {prescriptions.map(
          (presc, index) =>
            index % 3 === 0 && (
              <Row gutter={16} key={index}>
                {prescriptions
                  .slice(index, index + 3)
                  .map((presc, subIndex) => (
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
                          onClick={() => handleRedirection(presc._id)}
                        >
                          <Meta
                            avatar={
                              <Avatar sx={{ bgcolor: green[500] }}>
                                <AssignmentIcon />
                              </Avatar>
                            }
                            title={
                              <div style={{ fontSize: "20px" }}>
                                Prescription #{subIndex + 1}
                              </div>
                            }
                            description={
                              <div>
                                <strong>By Doctor: </strong> {presc.Doctor.Name}
                                <br></br>
                                <br></br>
                                <strong>Date: </strong> {presc.Date}
                                <br></br>
                                <br></br>
                                <ArrowRightOutlined
                                  style={{ marginLeft: "13rem" }}
                                ></ArrowRightOutlined>
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

export default ViewPrescriptions;
