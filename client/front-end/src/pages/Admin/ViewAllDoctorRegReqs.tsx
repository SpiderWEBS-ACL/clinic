import { useState, useEffect } from "react";
import { Avatar, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { getAllRegistrationRequests } from "../../apis/Admin/GetAllRegistrationRequests";

const AllDoctors = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const { Meta } = Card;

  const fetchRegistrationRequests = async () => {
    await getAllRegistrationRequests()
      .then((response) => {
        setDoctors(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchRegistrationRequests();
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = async (id: string) => {
    navigate("/admin/registrationRequests/" + id);
  };

  const headers = {
    Authorization: "Bearer " + accessToken,
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctors Registration Requests</strong>
      </h2>
      <tbody>
        {doctors.map(
          (request, index) =>
            index % 3 === 0 && (
              <Row gutter={16} key={index}>
                {doctors.slice(index, index + 3).map((request, subIndex) => (
                  <Col span={8} key={subIndex}>
                    <div>
                      <Card
                        style={{
                          width: "27rem",
                          marginTop: "3rem",
                          height: "14rem",
                        }}
                        loading={loadingList}
                        hoverable
                        className="hover-card"
                        onClick={() => handleViewDetails(request._id)}
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
                              {"Doctor's Name:" + request.Name}
                            </div>
                          }
                          description={
                            <div>
                              <strong>Specialty:</strong> {request.Specialty}
                              <br></br>
                              <br></br>
                              <strong>Status:</strong>{" "}
                              {request.AdminAccept ? (
                                request.DoctorReject ? (
                                  <i style={{ color: "red" }}>
                                    Employment Contract Rejected
                                  </i>
                                ) : (
                                  <i style={{ color: "green" }}>
                                    Employment Contract Sent. Pending Doctor
                                    Approval
                                  </i>
                                )
                              ) : (
                                <i>Pending</i>
                              )}
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

export default AllDoctors;
