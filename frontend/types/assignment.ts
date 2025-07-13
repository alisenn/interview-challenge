import { Medication } from './medication';
import { Patient } from './patient';

export interface Assignment {
  id: number;
  startDate: string;
  numberOfDays: number;
  remainingDays?: number;
  patient: Patient;
  patientId: number;
  medication: Medication;
  medicationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentDto {
  patientId: number;
  medicationId: number;
  startDate: string;
  numberOfDays: number;
}

export interface UpdateAssignmentDto {
  startDate?: string;
  numberOfDays?: number;
}
