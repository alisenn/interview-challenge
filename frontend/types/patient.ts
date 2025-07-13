export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  assignments?: any[]; // Using any to avoid circular dependency
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  name: string;
  dateOfBirth: string;
}

export interface UpdatePatientDto {
  name?: string;
  dateOfBirth?: string;
}
