import { useState, useEffect } from "react";
import { Spin } from "antd";
import { getAllAdmins } from "../../apis/Admin/GetAllAdmins";
import { deleteAdmin } from "../../apis/Admin/DeleteAdmin";

const AllAdmins = () => {
  const [doctors, setDoctors] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem("id");

  const fetchAdmins = async () => {
    await getAllAdmins()
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchAdmins();
  }, [deleted]);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteAdmin(id);
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
        <strong>Admins</strong>
      </h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>
                {request._id == id
                  ? request.Username + " (You)"
                  : request.Username}
              </td>
              <td>{request.Email}</td>
              <td>
                <button
                  disabled={id == request._id ? true : false}
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

export default AllAdmins;
