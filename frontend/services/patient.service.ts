import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/config';
import { CreatePatientDto, Patient, UpdatePatientDto } from '../types';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const response = await apiClient.get(API_ENDPOINTS.PATIENTS);
    return response.data;
  },

  async getById(id: number): Promise<Patient> {
    const response = await apiClient.get(`${API_ENDPOINTS.PATIENTS}/${id}`);
    return response.data;
  },

  async create(data: CreatePatientDto): Promise<Patient> {
    const response = await apiClient.post(API_ENDPOINTS.PATIENTS, data);
    return response.data;
  },

  async update(id: number, data: UpdatePatientDto): Promise<Patient> {
    const response = await apiClient.patch(`${API_ENDPOINTS.PATIENTS}/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PATIENTS}/${id}`);
  },
};
