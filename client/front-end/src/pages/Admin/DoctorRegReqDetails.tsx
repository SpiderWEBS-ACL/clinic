import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Card, Modal, Row, Spin, message } from "antd";
import InputField from "../../components/InputField";
import { InfoCircleOutlined } from "@ant-design/icons";
import FolderIcon from "@mui/icons-material/Folder";
import { acceptRegistrationRequest } from "../../apis/Admin/AcceptRegstrationRequest";
import { rejectRegistrationRequest } from "../../apis/Admin/RejectRegistrationRequest";
import { getRegistrationRequestDetails } from "../../apis/Admin/GetRegistrationRequestDetails";
import { getPersonalIDRegistrationRequest } from "../../apis/Admin/GetPersonalIDRegistrationRequest";
import { getDegree } from "../../apis/Admin/GetDegreeRegistrationRequest";
import { getLisenceRegistrationRequest } from "../../apis/Admin/GetLisenceRegistrationRequest";

const RegistrationRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [registrationDetails, setRegistrationDetails] = useState<any>("");
  const [salary, setSalary] = useState<Number>();
  const [loadingList, setLoadingList] = useState(true);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [licFiles, setLicFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleAccept = async (id: string) => {
    if (!salary) {
      message.error("Please enter an offered hourly rate");
      return;
    }
    try {
      await acceptRegistrationRequest(id, salary).then(
        message.success("Registration Request Accepted!")
      );
    } catch (error) {
      message.error("An Error has occurred");
    }
    navigate("/admin/registrationRequests");
  };

  const handleReject = async (id: string) => {
    await rejectRegistrationRequest(id)
      .then(message.success("Registration Request Rejected!"))
      .catch((error) => {
        message.error("An Error has occurred");
      });
    navigate("/admin/registrationRequests");
  };

  const fetchRegistrationRequestDetails = async () => {
    await getRegistrationRequestDetails(id)
      .then((response) => {
        setRegistrationDetails(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchRegistrationRequestDetails();
  }, [id]);

  const getPersonalID = async () => {
    const response = await getPersonalIDRegistrationRequest(id);

    const pdfPath = `http://localhost:8000/uploads/${response.data.filename}`;

    window.open(pdfPath, "_blank");
  };
  const getMedicalDegree = async () => {
    const response = await getDegree(id);

    const pdfPath = `http://localhost:8000/uploads/${response.data.filename}`;

    window.open(pdfPath, "_blank");
  };
  const getLicenses = async () => {
    const response = await getLisenceRegistrationRequest(id);

    setLicFiles(response.data);
    setLoadingHealth(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    getLicenses();
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const viewFiles = (filename: String) => {
    const pdfPath = `http://localhost:8000/uploads/${filename}`;

    window.open(pdfPath, "_blank");
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Registration Request Details</h2>
      <Card
        style={{
          height: "41rem",
          width: "50rem",
          marginTop: "2rem",
          marginLeft: "12rem",
        }}
        loading={loadingList}
        hoverable
        className="hover-card"
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
              <strong>{registrationDetails.Name}</strong>
            </div>
            <div style={{ fontSize: "15px", lineHeight: "1.5" }}>
              <strong>Username: </strong>
              {registrationDetails.Username}
              <br></br>
              <br></br>
              <strong>Email: </strong>
              {registrationDetails.Email}
              <br></br>
              <br></br>
              <strong>Date of Birth: </strong>
              {registrationDetails.Dob == null
                ? registrationDetails.Dob
                : registrationDetails.Dob.substring(0, 10)}
              <br></br>
              <br></br>
              <strong>Hourly Rate: </strong>
              {registrationDetails.HourlyRate}
              <br></br>
              <br></br>
              <strong>Affiliation: </strong>
              {registrationDetails.Affiliation}
              <br></br>
              <br></br>
              <strong>Specialty: </strong>
              {registrationDetails.Specialty}
              <br></br>
              <br></br>
              <strong>Education: </strong>
              {registrationDetails.EducationalBackground}
              <br></br>
              <br></br>
              <strong>Personal ID: </strong>
              <InfoCircleOutlined onClick={getPersonalID} />
              <br></br>
              <br></br>
              <strong>Medical Licenses: </strong>
              <InfoCircleOutlined onClick={showModal} />
              <br></br>
              <br></br>
              <strong>Medical Degree: </strong>
              <InfoCircleOutlined onClick={getMedicalDegree} />
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
          <Button
            className="btn btn-sm btn-success"
            onClick={() => handleAccept(registrationDetails._id)}
            style={{ marginLeft: 200, width: 150 }}
          >
            Accept
          </Button>
          <Button
            onClick={() => handleReject(registrationDetails._id)}
            style={{ marginRight: 200, width: 150 }}
          >
            Reject
          </Button>
        </Row>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          {registrationDetails.AdminAccept ? (
            registrationDetails.DoctorReject ? (
              <i style={{ color: "red" }}>Employment Contract Rejected</i>
            ) : (
              <i style={{ color: "green" }}>
                Employment Contract Sent. Pending Doctor Approval
              </i>
            )
          ) : (
            <InputField
              id="salary"
              label="Offered Hourly Rate"
              type="Number"
              value={salary}
              onChange={setSalary}
              required={true}
              style={{ borderWidth: 2, borderColor: "darkgray", width: 500 }}
            />
          )}
        </div>
      </Card>

      <Modal
        title={registrationDetails.Name + "'s Medical Licenses"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Card
          style={{ height: 350, width: 500, marginTop: 16 }}
          loading={loadingHealth}
          bodyStyle={{ height: "380px", maxHeight: "300px", overflowY: "auto" }}
          hoverable
          className="hover-card"
        >
          <div style={{ maxHeight: "230px", overflowY: "auto" }}>
            {licFiles.map((file, index) => (
              <div
                style={{
                  display: "flex",
                  borderBottom: "0.5px solid #333",
                  paddingBottom: "10px",
                  marginTop: 20,
                }}
              >
                <Avatar>
                  <FolderIcon />
                </Avatar>
                <div style={{ marginLeft: "20px", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.5",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div onClick={() => viewFiles(file.filename)}>
                      <div>
                        <p>
                          <strong>File Name: </strong>
                          {file.filename}
                        </p>
                        <p>
                          <strong>Type: </strong>
                          {file.contentType === "application/pdf"
                            ? "PDF"
                            : file.contentType ||
                              file.contentType === "application/png"
                            ? "PNG"
                            : file.contentType}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default RegistrationRequestDetails;
