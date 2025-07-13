export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  assignments?: any[]; // Using any to avoid circular dependency
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicationDto {
  name: string;
  dosage: string;
  frequency: string;
}

export interface UpdateMedicationDto {
  name?: string;
  dosage?: string;
  frequency?: string;
}
