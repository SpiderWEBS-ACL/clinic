import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewAllDoctors = () => {
  const [Doctors, setDoctors] = useState([]);;
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState< any| null>(null);
  const [searchDoc, setSearchDoc] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  const api = axios.create({
    baseURL: "http://localhost:8000/admin",
  });
  useEffect(() => {
    api
    .get("/allDoctors")
    .then((response) => {
      setDoctors(response.data);
    })
    
    .catch((error) => {
      console.error("Error:", error);
    });
});



  
  const viewDetails = (doctor: []) => {
    setShowPopup(true); 
    setSelectedDoctor(doctor);
  };

 
  const search  = async() => {
    
    try {
      const response = await axios.get("/patient/searchForDoctor", {
        params: {
          name:searchTerm,
          speciality: searchTerm,
        },
      });

      setSearchDoc(response.data);
    } catch (error) {
      console.error(error);
    }
  };
 
  

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Doctors</strong>
      </h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by date, doctor, filled, or unfilled"
          value={searchTerm}
        />
      </div>
    
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Speciality</th>
            <th>Sesssion Price</th>
            <th>
            </th>
          </tr>
        </thead>

        <tbody>
          {Doctors.map((request: any, index) => (
            <tr key={request._id}>
              <td>{request.Name}</td>
              <td>{request.Speciality}</td>
              <td>{request.HourlyRate}</td>

              <td className="text-end">
                <button
                  className="btn btn-sm btn-danger"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => viewDetails(request)}                   
                >
                  <span aria-hidden="true"></span>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && selectedDoctor && (
        <div className="popup">
           <h3>Doctor Details</h3>
          <table className="table">
            <thead>
              <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dob</th>
            <th>HourlyRate</th>
            <th>Affiliation</th>
            <th>Speciality</th>
            <th>Education</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td>{selectedDoctor.Username}</td>
              <td>{selectedDoctor.Name}</td>
              <td>{selectedDoctor.Email}</td>
              <td>{selectedDoctor.Dob}</td>
              <td>{selectedDoctor.HourlyRate}</td>
              <td>{selectedDoctor.Affiliation}</td>
              <td>{selectedDoctor.Speciality}</td>
              <td>{selectedDoctor.EducationalBackground}</td>

              </tr>
            </tbody>
          </table>

          <button
                  className="btn btn-sm btn-danger"
                  style={{
                    padding: "4px 8px",
                    fontSize: "12px",
                    borderRadius: "5px",
                  }}
                  onClick={() => setShowPopup(false)}
                >
                  <span aria-hidden="true"></span>
                  Hide
                </button>
                

        </div>
      )};
    </div>
                
  );
};

export default ViewAllDoctors;
