export const API_BASE_URL = 'http://localhost:8080';

export const API_ENDPOINTS = {
  PATIENTS: `${API_BASE_URL}/patients`,
  MEDICATIONS: `${API_BASE_URL}/medications`,
  ASSIGNMENTS: `${API_BASE_URL}/assignments`,
} as const;
