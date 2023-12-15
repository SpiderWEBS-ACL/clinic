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
import { Alert, Button, Input, Tag, message } from "antd";
import { useParams } from "react-router-dom";
import { updateMedicineInPrescription } from "../../apis/Doctor/Prescriptions/UpdateMedicineInPrescription";

const PatientsPrescriptions = () => {
  const { id } = useParams();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [UpdatedPrescription, setUpdatedPrescription] =
    useState<Prescription>();
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await getAllPatientsPrescriptions(id + "");
      console.log(response.data);
      setPrescriptions(response.data);
    } catch (error) {
      message.error("An error has occurred, please try again");
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDosageChange = (
    input: number,
    prescriptionIndex: number,
    MedicineIndex: number,
    available: boolean
  ) => {
    const updatedPrescriptions = [...prescriptions];

    if (available) {
      updatedPrescriptions[prescriptionIndex].Medicines[MedicineIndex].Dosage =
        input;
    } else {
      updatedPrescriptions[prescriptionIndex].UnavailableMedicines[
        MedicineIndex
      ].Dosage = input;
    }
    setPrescriptions(updatedPrescriptions);
    setUpdatedPrescription(updatedPrescriptions[prescriptionIndex]);
    console.log(updatedPrescriptions);
  };
  const handleInstructionsChange = (
    input: string,
    prescriptionIndex: number,
    MedicineIndex: number,
    available: boolean
  ) => {
    const updatedPrescriptions = [...prescriptions];

    if (available) {
      updatedPrescriptions[prescriptionIndex].Medicines[
        MedicineIndex
      ].Instructions = input;
    } else {
      updatedPrescriptions[prescriptionIndex].UnavailableMedicines[
        MedicineIndex
      ].Instructions = input;
    }
    setPrescriptions(updatedPrescriptions);
    setUpdatedPrescription(updatedPrescriptions[prescriptionIndex]);
    console.log(updatedPrescriptions);
  };
  const handleDeleteClick = async (
    prescriptionIndex: number,
    MedicineIndex: number,
    available: boolean
  ) => {
    const updatedPrescriptions = [...prescriptions];

    if (available) {
      updatedPrescriptions[prescriptionIndex].Medicines.splice(
        MedicineIndex,
        1
      );
    } else {
      updatedPrescriptions[prescriptionIndex].UnavailableMedicines.splice(
        MedicineIndex,
        1
      );
    }

    setPrescriptions(updatedPrescriptions);
    setUpdatedPrescription(updatedPrescriptions[prescriptionIndex]);
    try {
      await updateMedicineInPrescription(
        updatedPrescriptions[prescriptionIndex]
      );
      message.success("Deleted!");
    } catch (error) {
      message.error("An error has occurred, please try again");
    }
    console.log(updatedPrescriptions[prescriptionIndex], prescriptionIndex);
  };

  const handleSubmit = async () => {
    try {
      await updateMedicineInPrescription(UpdatedPrescription);
      message.success("Saved!");
      setEditMode(false);
    } catch (error) {
      message.error("An error has occured, please try again");
    }
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
                        {prescription.Filled === "Unfilled" && (
                          <IconButton
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "40px",
                              color: "#555",
                            }}
                            onClick={handleEditClick}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            color: "#d32f2f",
                          }}
                          onClick={() => {
                            handleDeleteClick(index, MedicineIndex, true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Box mt={2}>
                          <label>Dosage </label>
                          <Input
                            value={medicine?.Dosage}
                            disabled={!editMode}
                            type="number"
                            onChange={(e) =>
                              handleDosageChange(
                                parseFloat(e.target.value),
                                index,
                                MedicineIndex,
                                true
                              )
                            }
                          />
                        </Box>
                        <Box mt={2}>
                          <label>Instructions </label>
                          <Input
                            value={medicine?.Instructions}
                            disabled={!editMode}
                            onChange={(e) =>
                              handleInstructionsChange(
                                e.target.value,
                                index,
                                MedicineIndex,
                                true
                              )
                            }
                          />
                        </Box>
                        {editMode && (
                          <Box mt={2}>
                            <Button
                              type="primary"
                              style={{ marginRight: "1rem" }}
                              onClick={handleSubmit}
                            >
                              Save
                            </Button>
                            <Button onClick={handleCancelEdit}>Cancel</Button>
                          </Box>
                        )}
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
                          <IconButton
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "40px",
                              color: "#555",
                            }}
                            onClick={handleEditClick}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              color: "#d32f2f",
                            }}
                            onClick={() => {
                              handleDeleteClick(index, MedicineIndex, false);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Box mt={2}>
                            <label>Dosage</label>
                            <Input
                              value={medicine?.Dosage}
                              disabled={!editMode}
                              type="number"
                              onChange={(e) =>
                                handleDosageChange(
                                  parseFloat(e.target.value),
                                  index,
                                  MedicineIndex,
                                  false
                                )
                              }
                            />
                          </Box>
                          <Box mt={2}>
                            <label>Instructions</label>
                            <Input
                              value={medicine?.Instructions}
                              disabled={!editMode}
                              onChange={(e) =>
                                handleInstructionsChange(
                                  e.target.value,
                                  index,
                                  MedicineIndex,
                                  false
                                )
                              }
                            />
                          </Box>
                          {editMode && (
                            <Box mt={2}>
                              <Button
                                type="primary"
                                style={{ marginRight: "1rem" }}
                                onClick={handleSubmit}
                              >
                                Save
                              </Button>
                              <Button onClick={handleCancelEdit}>Cancel</Button>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    )
                  )}{" "}
                </AccordionDetails>
              </Accordion>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientsPrescriptions;
