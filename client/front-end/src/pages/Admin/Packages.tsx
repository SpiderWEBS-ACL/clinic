import { useState, useEffect } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllPackagesAdmin } from "../../apis/Admin/GetAllPackages";

const AllPackages = () => {
  const [Packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    await getAllPackagesAdmin()
      .then((response) => {
        setPackages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchPackages();
  }, []);

  const navigate = useNavigate();
  const handleRedirect = async (id: string) => {
    navigate("/admin/editPackage/" + id);
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
        <strong>Health Packages</strong>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (EGP)</th>
            <th>Doctor Discount</th>
            <th>Pharmacy Discount</th>
            <th>Family Discount</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>

        <tbody>
          {Packages.map((request: any, index) => (
            <tr key={request._id}>
              <td>
                <strong>{request.Name}</strong>
              </td>
              <td>{request.SubscriptionPrice}</td>
              <td>{request.DoctorDiscount}%</td>
              <td>{request.PharmacyDiscount}%</td>
              <td>{request.FamilyDiscount}%</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleRedirect(request._id)}
                >
                  edit/delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllPackages;
