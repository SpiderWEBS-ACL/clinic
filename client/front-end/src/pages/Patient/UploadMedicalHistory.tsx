import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { JwtPayload } from "../../AppRouter";
import jwt_decode from "jwt-decode";
import { config, headers } from "../../Middleware/authMiddleware";
import { Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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

  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);


  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };
  
  const onFileUpload = async () => {
    if (selectedFiles) {
      const formData = new FormData();
  
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileData = await readFileAsync(file);
  
        const fileModel = {
          filedata: new Uint8Array(fileData),
          contentType: file.type,
          filename: file.name,
          originalname: file.name,
        };
  
        formData.append('files', new Blob([fileModel.filedata]), fileModel.filename);
        formData.append('contentType', fileModel.contentType);
        formData.append('filename', fileModel.filename);
        formData.append('originalname', fileModel.originalname);
      }
  
      try {
        const response = await api.post('/patient/uploadMedicalDocuments/', formData, config);
        message.success("File(s) uploaded successfully!")
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
    else{
        message.error("Please select file(s) to upload!")
    }
  };
  
  const readFileAsync = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          resolve(event.target.result as ArrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };
  
  
    return (
      <div className="container">
        <h2 className="text-center mt-4 mb-4">
          <strong>Upload Medical History</strong>
        </h2>   
       
        <input type="file" accept=".pdf, .jpeg, .jpg, .png" onChange={onFileChange} multiple/>
         
                <Button icon={<UploadOutlined />} onClick={onFileUpload}>
                 Upload!
             </Button>

                
      </div>
    
    );
}
  


export default UploadMedicalHistory;
