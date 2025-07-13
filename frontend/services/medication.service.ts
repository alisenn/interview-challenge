import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/config';
import { CreateMedicationDto, Medication, UpdateMedicationDto } from '../types';

export const medicationService = {
  async getAll(): Promise<Medication[]> {
    const response = await apiClient.get(API_ENDPOINTS.MEDICATIONS);
    return response.data;
  },

  async getById(id: number): Promise<Medication> {
    const response = await apiClient.get(`${API_ENDPOINTS.MEDICATIONS}/${id}`);
    return response.data;
  },

  async create(data: CreateMedicationDto): Promise<Medication> {
    const response = await apiClient.post(API_ENDPOINTS.MEDICATIONS, data);
    return response.data;
  },

  async update(id: number, data: UpdateMedicationDto): Promise<Medication> {
    const response = await apiClient.patch(`${API_ENDPOINTS.MEDICATIONS}/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.MEDICATIONS}/${id}`);
  },
};
