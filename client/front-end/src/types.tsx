export interface Medicine {
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
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface UnavailableMedicine {
  Medicine: string;
  Dosage: number;
  Instructions: string;
}
interface MedicineApi {
  MedicineId: string;
  Name?: string;
  MedicineName: string;
  Dosage: number;
  Instructions: string;
}

export interface Prescription {
  _id: string;
  Doctor: string;
  Patient: string;
  Medicines: MedicineApi[];
  UnavailableMedicines: UnavailableMedicine[];
  Date?: Date;
  Filled?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
