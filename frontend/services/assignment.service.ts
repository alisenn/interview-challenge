import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/config';
import { Assignment, CreateAssignmentDto, UpdateAssignmentDto } from '../types';

export const assignmentService = {
  async getAll(): Promise<Assignment[]> {
    const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS);
    return response.data;
  },

  async getById(id: number): Promise<Assignment> {
    const response = await apiClient.get(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`);
    return response.data;
  },

  async create(data: CreateAssignmentDto): Promise<Assignment> {
    const response = await apiClient.post(API_ENDPOINTS.ASSIGNMENTS, data);
    return response.data;
  },

  async update(id: number, data: UpdateAssignmentDto): Promise<Assignment> {
    const response = await apiClient.patch(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.ASSIGNMENTS}/${id}`);
  },
};
