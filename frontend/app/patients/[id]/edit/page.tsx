'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner, SuccessMessage } from '../../../../components/ui';
import { patientService } from '../../../../services';
import { Patient, UpdatePatientDto } from '../../../../types';

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<UpdatePatientDto>({
    name: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      loadPatient();
    }
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setDataLoading(true);
      const data = await patientService.getById(patientId);
      setPatient(data);
      setFormData({
        name: data.name,
        dateOfBirth: data.dateOfBirth.split('T')[0], // Convert to YYYY-MM-DD format
      });
    } catch (err) {
      setError('Failed to load patient data');
      console.error('Error loading patient:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name?.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }

    setLoading(true);

    try {
      await patientService.update(patientId, formData);
      setSuccess('Patient updated successfully!');
      setTimeout(() => {
        router.push('/patients');
      }, 1500);
    } catch (err: any) {
      let errorMessage = 'Failed to update patient. Please try again.';
      
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(', ');
        } else {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error updating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Not Found</h1>
            <p className="text-gray-600 mb-4">The patient you're looking for doesn't exist.</p>
            <Link
              href="/patients"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Back to Patients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Patient</h1>
          
          {error && <ErrorMessage message={error} className="mb-4" />}
          {success && <SuccessMessage message={success} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Patient'}
              </button>
              
              <Link
                href="/patients"
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
