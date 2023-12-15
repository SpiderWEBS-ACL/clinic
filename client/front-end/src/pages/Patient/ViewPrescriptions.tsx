import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { getAllPatientsPrescriptions } from "../../apis/Doctor/Prescriptions/getPatientsPrescriptions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Prescription } from "../../types";
import { Alert, Tooltip, Input, Tag, message } from "antd";
import { useParams } from "react-router-dom";
import { updateMedicineInPrescription } from "../../apis/Doctor/Prescriptions/UpdateMedicineInPrescription";
import { getMyPrescription } from "../../apis/Patient/Prescriptions/GetMyPrescription";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";

const PatientsPrescriptions = () => {
  const { id } = useParams();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [UpdatedPrescription, setUpdatedPrescription] =
    useState<Prescription>();
  const [editMode, setEditMode] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      const response = await getMyPrescription();
      console.log(response.data);
      setPrescriptions(response.data);
    } catch (error) {
      message.error("An error has occurred, please try again");
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDownloadClick = (currPresc: Prescription) => {
    const pdfDoc = new jsPDF();

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Your prescription details", 65, 30);
    pdfDoc.text(
      "Date: " + new Date(currPresc.Date + "").toDateString(),
      65,
      40
    );
    pdfDoc.text("Filled: " + currPresc.Filled, 65, 50);

    pdfDoc.text("Medicines:", 10, 75);

    pdfDoc.setFont("helvetica", "normal");

    currPresc.Medicines?.forEach((medicine, MedicineIndex) => {
      const startY = 85 + MedicineIndex * 30;

      pdfDoc.text("• Name: " + medicine.Name, 10, startY);
      pdfDoc.text("• Dosage: " + medicine.Dosage, 10, startY + 10);
      pdfDoc.text("• Instructions: " + medicine.Instructions, 10, startY + 20);
    });

    const medicinesHeight = (currPresc.Medicines?.length || 0) * 30;

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Unavailable Medicines: ", 10, 100 + medicinesHeight);

    pdfDoc.setFont("helvetica", "normal");

    currPresc.UnavailableMedicines?.forEach((medicine, MedicineIndex) => {
      const startY = 110 + medicinesHeight + MedicineIndex * 30;

      pdfDoc.text("• Name: " + medicine.Medicine, 10, startY);
      pdfDoc.text("• Dosage: " + medicine.Dosage, 10, startY + 10);
      pdfDoc.text("• Instructions: " + medicine.Instructions, 10, startY + 20);
    });

    pdfDoc.save("downloaded-pdf.pdf");
  };

  const tagStyle = {
    fontSize: "12px",
    marginRight: "1rem",
    width: "50px",
    height: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Prescriptions</h1>
          {prescriptions.map((prescription, index) => (
            <>
              {/* <DateSeparator date={prescription.Date + ""} /> */}
              <Accordion
                key={index}
                style={{ marginBottom: "1rem", marginTop: "1rem" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index + 1}-content`}
                  id={`panel${index + 1}-header`}
                >
                  <Typography
                    style={{ marginRight: "29rem" }}
                  >{`Prescription #${index + 1}`}</Typography>

                  <Tag
                    style={tagStyle}
                    key={index}
                    className="prescription-tag"
                    color={prescription.Filled === "Filled" ? "green" : "red"}
                  >
                    {prescription.Filled}
                  </Tag>
                  <Typography fontSize={"14px"} color={"#b9bbbe"}>
                    {new Date(prescription.Date + "").toDateString()}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {prescription.Medicines?.length == 0 &&
                    prescription.UnavailableMedicines?.length == 0 && (
                      <Alert message="No medicines" type="info" showIcon />
                    )}
                  {prescription.Medicines?.length != 0 && (
                    <Typography
                      fontStyle="italic"
                      color={"lightgray"}
                      style={{ marginBottom: "1rem" }}
                    >
                      Medicine(s) available on pharmacy platform
                    </Typography>
                  )}
                  {prescription.Medicines?.map((medicine, MedicineIndex) => (
                    <Accordion key={MedicineIndex}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${MedicineIndex + 1}-content`}
                        id={`panel${MedicineIndex + 1}-header`}
                      >
                        <Typography style={{ color: "#1890ff" }}>
                          {medicine.Name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box mt={2}>
                          <label>Dosage </label>
                          <Input
                            value={medicine?.Dosage}
                            disabled={!editMode}
                            type="number"
                          />
                        </Box>
                        <Box mt={2}>
                          <label>Instructions </label>
                          <Input
                            value={medicine?.Instructions}
                            disabled={!editMode}
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  {prescription.UnavailableMedicines?.length != 0 && (
                    <Typography
                      fontStyle="italic"
                      color={"lightgray"}
                      style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    >
                      Medicine(s) not available on pharmacy platform
                    </Typography>
                  )}
                  {prescription.UnavailableMedicines?.map(
                    (medicine, MedicineIndex) => (
                      <Accordion key={MedicineIndex}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${MedicineIndex + 1}-content`}
                          id={`panel${MedicineIndex + 1}-header`}
                        >
                          <Typography style={{ color: "#1890ff" }}>
                            {medicine.Medicine}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box mt={2}>
                            <label>Dosage</label>
                            <Input
                              value={medicine?.Dosage}
                              disabled={!editMode}
                              type="number"
                            />
                          </Box>
                          <Box mt={2}>
                            <label>Instructions</label>
                            <Input
                              value={medicine?.Instructions}
                              disabled={!editMode}
                            />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )
                  )}{" "}
                </AccordionDetails>
                <div style={{ display: "flex" }}>
                  <Tooltip title="Download selected prescription as PDF">
                    <DownloadOutlined
                      onClick={() => handleDownloadClick(prescription)}
                      style={{
                        fontSize: 20,
                        marginLeft: "auto",
                        marginRight: 20,
                        marginBottom: 10,
                      }}
                    />
                  </Tooltip>
                </div>
              </Accordion>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientsPrescriptions;
