import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { JwtPayload } from "../../AppRouter";
import jwt_decode from "jwt-decode";
import { config, headers } from "../../Middleware/authMiddleware";
import { Button, Card, Row, message } from "antd";
import { CloseOutlined, DeleteOutlined, InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { green } from "@mui/material/colors";
import { Avatar } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from '@mui/icons-material/Folder';
import { Document, Page } from 'react-pdf';

import { Buffer } from 'buffer';

const UploadMedicalHistory = () => {
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

  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [patientFiles, setPatientFiles] = useState<any[]>([]);

  const tabList = [
    {
      key: 'tab1',
      tab: 'Health Records by your Doctors',
    },
    {
      key: 'tab2',
      tab: 'Medical History',
    },
  ];

  useEffect(() => {
    getHealth();
  }, []);
  
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };
  
  const onFileUpload = async () => {
    if (selectedFiles) {
      const formData = new FormData();
  
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
  
        formData.append('files', file); 
        formData.append('filename', file.name); 
        formData.append('originalname', file.name); 
       formData.append('contentType', file.type); 

      }
  
      try {
        const response = await api.post('/patient/uploadMedicalDocuments/', formData, config);
        message.success("File(s) uploaded successfully!")
        getFiles();
        setLoading(true);
  
        console.log(response)
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
    else{
        message.error("Please select file(s) to upload!")
    }
  };
  const getHealth = async () => {
    try {
      const response = await api.get(`/patient/viewHealthRecords`, config);
      if (response.data) {
        setHealthRecords(response.data);
        setLoading(false);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error("An error occurred while fetching health records");
      console.error(error);
    }
  };
  
  const getFiles = async () => {
    try {
      const response = await api.get(`/patient/viewMyMedicalDocument`, config);
      if (response.data) {
        setPatientFiles(response.data);
        setLoading(false);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      message.error("An error occurred while fetching patient files");
      console.error(error);
    }
  };
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
    if(key=="tab2"){
      setLoading(true);
      getFiles();

    }
  };
  
  
  const viewFiles = (filename: String) => {

    const pdfPath = `http://localhost:8000/uploads/${filename}`;

    window.open(pdfPath, '_blank');
  }
  const removeFile = async(fileid: any) =>{

  const response = await api.delete('/patient/removeMedicalDocument', {
  data: { fileid: fileid },
  ...config,
});
  getFiles();
  setLoading(true);
  message.success("File is being deleted");

  }
  

  
  const contentList : Record<string, React.ReactNode> = {
    tab1: (
      <p>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {healthRecords.map((record, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              borderBottom: "0.5px solid #333",
              paddingBottom: "10px",
              marginTop: 20
            }}
          >
            <Avatar sx={{ bgcolor: green[500]}}>
              <AssignmentIcon />
            </Avatar>
            <div style={{ marginLeft: "20px", flex: 1 }}>
              
              <div style={{ fontSize: "15px", lineHeight: "1.5" }}>
                <p>
                  <strong>Type: </strong>
                  {record.Type}
                </p>
                <p>
                  <strong>Description: </strong>
                  {record.Description}
                </p>
                <p>
                  <strong>By Doctor: </strong>
                  {record.Doctor.Name}
                </p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </p>
    ),
    tab2: <p>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
       {patientFiles.map((file, index) => (
<div
    style={{
      display: "flex",
      borderBottom: "0.5px solid #333",
      paddingBottom: "10px",
      marginTop: 20
    }}
  >
   <Avatar>
                  
                    <FolderIcon />
                  </Avatar>
                  <div style={{ marginLeft: "20px", flex: 1 }}>
                  <div style={{ fontSize: "15px", lineHeight: "1.5", display: "flex", justifyContent: "space-between" } }  >
                  <div onClick={() => viewFiles(file.filename)}>

    <div>
      
      <p>
        
        <strong>File Name: </strong>
        {file.filename}
      </p>
      <p>
        <strong>Type: </strong>
        {file.contentType === "application/pdf" ? "PDF" : file.contentType|| file.contentType === "application/png" ? "PNG" :file.contentType}
      </p>
    </div>
    </div>
    <div style={{ display: "flex" }}>
      <DeleteOutlined  onClick={() => removeFile(file._id)} style={{color:"#FF0000", marginRight:20}}/>   
       </div>
 

  </div>
</div>

  </div>
       ))}
       </div>
       
  <Row
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: 50,
    }}
  >
            <input type="file" accept=".pdf, .jpeg, .jpg, .png" onChange={onFileChange} multiple/>
   
            <Button icon={<UploadOutlined />} onClick={onFileUpload}>
                 Upload!
            </Button>
           </Row>
  
  </p>,
  };
  
  
    return (
      <div className="container">
        <h2 className="text-center mt-4 mb-4">
          <strong>Health Records</strong>
        </h2>   
        <Card
        tabList={tabList}
        style={{ height: 400, width: 800, marginTop: 16, marginLeft: 220 }}
        loading={loading}
        hoverable
        className="hover-card"
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
                {contentList[activeTabKey1]}


      </Card>


     

     

                
      </div>
    
    );
}
  


export default UploadMedicalHistory;
