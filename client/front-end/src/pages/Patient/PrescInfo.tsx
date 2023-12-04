import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import { Card } from "antd";
import { Avatar } from "@mui/material";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { tr } from "date-fns/locale";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { green } from "@mui/material/colors";
import FolderIcon from "@mui/icons-material/Folder";
import { headers } from "../../Middleware/authMiddleware";
const PrescInfo = () => {
  const { id } = useParams<{ id: string }>();
  const accessToken = localStorage.getItem("accessToken");
  const [loadingList, setLoadingList] = useState(true);
  const [prescInfo, setPrescInfo] = useState<any>({});
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
    getPresc();
  }, [id]);

  const getPresc = async () => {
    await api
      .get(`/patient/selectPrescription/${id}`, config)
      .then((response) => {
        setPrescInfo(response.data);
        setLoadingList(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

      
  
 
  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">
        <strong>Prescription Information</strong>
      </h2>

      <Card
        style={{
          height: "28rem",
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
          <Avatar sx={{ bgcolor: green[500]}}>
                            <AssignmentIcon />
                          </Avatar>
          <div style={{ marginLeft: "20px", flex: 1 }}>
            <div style={{ fontSize: "22px", marginBottom: "10px" }}>
            
            </div>
            <div style={{ fontSize: "15px", lineHeight: "1.5" }}>
            <strong>By Doctor: </strong>
                <br></br>
             <br></br>
                <strong>Medication: </strong>
                {prescInfo.Medication}
             <br></br>
             <br></br>
           
                <strong>Dosage: </strong>
                {prescInfo.Dosage}
                <br></br>
             <br></br>

                <strong>Filled: </strong>
                {prescInfo.Filled}
                <br></br>
             <br></br>
             <strong>Date: </strong>
                {prescInfo.Date}
                <br></br>
             <br></br>


            </div>
          </div>
        </div>

        
      </Card>

    
  

    </div>
  );
};

export default PrescInfo;
