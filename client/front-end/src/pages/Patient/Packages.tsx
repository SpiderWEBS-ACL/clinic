import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { JwtPayload } from "../../AppRouter";
import jwt_decode from "jwt-decode";

const AllPackagesPatient = () => {
  const [Packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = axios.create({
    baseURL: "http://localhost:8000/",
  });
  const accessToken = Cookies.get("accessToken");

  let patientId = "";

  if (accessToken) {
    const decodedToken: JwtPayload = jwt_decode(accessToken);
    patientId = decodedToken.role as string;
  }

  const redirectToStripe = async (id: string) => {
    try {
      try {
        const response = await api.post("subscription/subscribe/" + patientId, {
          packageId: id,
        });
        window.location.href = response.data.url;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const headers = {
      Authorization: "Bearer " + accessToken,
    };
    api
      .get("patient/allPackages", { headers })
      .then((response) => {
        setPackages(response.data);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
            <th>Price (USD)</th>
            <th>Doctor Discount</th>
            <th>Pharmacy Discount</th>
            <th>Family Discount</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {Packages.map((request: any, index) => (
            <tr key={request._id}>
              <td>
                <strong>{request.Name}</strong>
              </td>
              <td>{request.SubscriptionPrice / 100}</td>
              <td>{request.DoctorDiscount}%</td>
              <td>{request.PharmacyDiscount}%</td>
              <td>{request.FamilyDiscount}%</td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => redirectToStripe(request._id)}
                >
                  Subscribe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllPackagesPatient;
