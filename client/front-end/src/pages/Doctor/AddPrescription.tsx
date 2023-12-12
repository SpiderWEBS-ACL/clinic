import { Form, Input, Button, Select, AutoComplete, Tag, message } from "antd";
import { FormInstance } from "antd/lib/form";
import { ChangeEvent, useEffect, useState } from "react";
import { getAllMedicines } from "../../apis/Doctor/GetAllMedicines";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { addPrescription } from "../../apis/Doctor/Prescriptions/AddPrescription";

const { Option } = Select;

interface Prescription {
  Doctor: string;
  Patient: string;
  Medicines: { MedicineId: string; Dosage: number; Instructions?: string }[];
}
interface Medicine {
  _id: string;
  Name: string;
  Description: string;
  Price: number;
  ActiveIngredients: string[];
  Quantity: number;
  MedicinalUse: string;
  imageURL: string;
  Sales: number;
  Archived: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UnavailableMedicine {
  Medicine: string;
  Dosage: number;
  Instructions: string;
}
interface MedicineApi {
  MedicineId: string;
  MedicineName: string;
  Dosage: number;
  Instructions: string;
}

interface PrescriptionModel {
  Doctor: string;
  Patient: string;
  Medicines: MedicineApi[];
  UnavailableMedicines: UnavailableMedicine[];
  Date?: Date;
  Filled?: string;
}

const AddPrescription = () => {
  const { id } = useParams();
  const [form] = Form.useForm<FormInstance>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [UnavailableMedicine, setUnavailableMedicine] = useState<any>();
  const [Dosage, setDosage] = useState<number>(0);
  const [Instructions, setInstructions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [Medicines, setMedicines] = useState<Medicine[]>([]);
  const [DisableUnavailable, setDisableUnavailable] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [filteredMedicines, setfilteredMedicines] = useState<any[]>([]);
  const [medicineAdded, setMedicineAdded] = useState<boolean>(false);
  const navigate = useNavigate();
  const [Prescription, setPrescription] = useState<PrescriptionModel>({
    Doctor: "" + localStorage.getItem("id"),
    Patient: "" + id,
    Medicines: [],
    UnavailableMedicines: [],
  });

  const options = Medicines.map((medicine) => ({
    value: medicine._id,
    label: medicine.Name,
  }));

  const fetchMedicines = async () => {
    try {
      const response = await getAllMedicines();
      setMedicines(response.data);
    } catch (error) {
      message.error("An error has occured, please try again");
    }
  };

  const filterMedicines = async (search: string = searchQuery) => {
    const filtered = Medicines.filter((medicine) =>
      medicine.Name.toLowerCase().includes(search.toLowerCase())
    );
    const options = filtered.map((medicine) => ({
      value: medicine.Name,
      label: medicine.Name,
      id: medicine._id,
    }));
    setfilteredMedicines(options);
  };
  useEffect(() => {
    fetchMedicines();
  }, []);
  useEffect(() => {
    console.log("In search use effect");
    filterMedicines();
  }, [searchQuery]);

  const handleOptionChange = (value: string, option: any) => {
    console.log(option);
    setSelectedOption(option);
    setUnavailableMedicine(null);
    setDisableUnavailable(true);
  };
  const handleAddClick = async () => {
    console.log(
      "Data: " + selectedOption?.id,
      selectedOption?.value,
      UnavailableMedicine,
      Dosage,
      Instructions
    );
    try {
      await form.validateFields();
    } catch {
      message.error("Please fill all the required fields.");
      return;
    }
    if (selectedOption && !UnavailableMedicine) {
      const newMedicine: MedicineApi = {
        MedicineId: selectedOption.id,
        MedicineName: selectedOption.value,
        Dosage: Dosage,
        Instructions: Instructions,
      };

      setPrescription((prevPrescription) => ({
        ...prevPrescription,
        Medicines: [...prevPrescription.Medicines, newMedicine],
      }));
    } else if (UnavailableMedicine && !selectedOption) {
      const newMedicine: UnavailableMedicine = {
        Medicine: UnavailableMedicine,
        Dosage: Dosage,
        Instructions: Instructions,
      };
      console.log(newMedicine);
      setPrescription((prevPrescription) => ({
        ...prevPrescription,
        UnavailableMedicines: [
          ...prevPrescription.UnavailableMedicines,
          newMedicine,
        ],
      }));
    }
    message.success("Added!");
    setDisableUnavailable(false);
    form.resetFields();
    setMedicineAdded(true);
    console.log(Prescription);
  };
  const handleDoneClick = async () => {
    try {
      if (medicineAdded) {
        await addPrescription(Prescription);
        message.success("Prescription added successfully!");
        navigate(`/doctor/prescriptions/${id}`);
      } else {
        message.error("Please add a medicine");
      }
    } catch (error) {
      message.error("An error has occured, please try again");
      console.log(error);
    }
  };
  const handleAutoCompleteOnChange = () => {
    if (searchQuery === "") setDisableUnavailable(false);
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Add Prescription</h1>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Add Medicine from Pharmacy Platform (if available)"
              name="Medicine"
              rules={[
                {
                  required: DisableUnavailable,
                  message: "Please choose medicine",
                },
              ]}
            >
              <AutoComplete
                options={filteredMedicines}
                onSearch={(text) => filterMedicines(text)}
                onSelect={handleOptionChange}
                onChange={handleAutoCompleteOnChange}
                value={selectedOption?.label}
                placeholder="Search for medicine..."
                style={{ width: "100%" }}
              />
            </Form.Item>
            {!DisableUnavailable && (
              <Form.Item
                label="Unavailable Medicine Name"
                name="UnavailableMedicine"
                rules={[
                  {
                    required: !DisableUnavailable,
                    message: "Please enter medicine name",
                  },
                ]}
              >
                <Input
                  onChange={(e) => {
                    setUnavailableMedicine(e.target.value);
                    setSelectedOption(null);
                  }}
                  placeholder="Medicine name"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Dosage (in mg)"
              name="Dosage"
              rules={[{ required: true, message: "Please enter dosage" }]}
            >
              <Input
                type="number"
                onChange={(e) => setDosage(parseFloat(e.target.value))}
                value={Dosage}
                placeholder="Dosage"
              />
            </Form.Item>
            <Form.Item label="Instructions" name="Instructions">
              <Input.TextArea
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions"
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleAddClick}>Add</Button>
              <Button
                type="primary"
                onClick={handleDoneClick}
                style={{ marginLeft: 8 }}
              >
                Done
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="tags-container">
            {Prescription.Medicines.map((medicine, index) => (
              <Tag
                style={{
                  marginTop: "1rem",
                  fontSize: "16px",
                  padding: "8px 12px",
                }}
                key={index}
                className="prescription-tag"
                color="blue"
              >
                {medicine.MedicineName}
              </Tag>
            ))}
            {Prescription.UnavailableMedicines.map((medicine, index) => (
              <Tag
                style={{
                  marginTop: "1rem",
                  fontSize: "16px",
                  padding: "8px 12px",
                }}
                key={index}
                className="prescription-tag"
                color="green"
              >
                {medicine.Medicine}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;
