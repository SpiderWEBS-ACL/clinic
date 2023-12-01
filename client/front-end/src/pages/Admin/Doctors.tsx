import { useState, useEffect } from "react";
import { Spin } from "antd";
import { getAllDoctorsAdmin } from "../../apis/Admin/GetallDoctorsAdmin";
import { deleteDoctor } from "../../apis/Admin/DeleteDoctor";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    await getAllDoctorsAdmin()
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchDoctors();
  }, [deleted]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoctor(id);
      setDeleted(!deleted);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

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

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctors</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dob</th>
            <th>HourlyRate</th>
            <th>Affiliation</th>
            <th>Specialty</th>
            <th>Education</th>
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Username}</td>
              <td>{request.Name}</td>
              <td>{request.Email}</td>
              <td>
                {request.Dob == null
                  ? request.Dob
                  : request.Dob.substring(0, 10)}
              </td>
              <td>{request.HourlyRate}</td>
              <td>{request.Affiliation}</td>
              <td>{request.Specialty}</td>
              <td>{request.EducationalBackground}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => handleDelete(request._id)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDoctors;
