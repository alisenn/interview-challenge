'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner, SuccessMessage } from '../../../components/ui';
import { assignmentService, medicationService, patientService } from '../../../services';
import { CreateAssignmentDto, Medication, Patient } from '../../../types';

export default function NewAssignmentPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [formData, setFormData] = useState<CreateAssignmentDto>({
    patientId: 0,
    medicationId: 0,
    startDate: new Date().toISOString().split('T')[0],
    numberOfDays: 1,
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setDataLoading(true);
      const [patientsData, medicationsData] = await Promise.all([
        patientService.getAll(),
        medicationService.getAll(),
      ]);
      setPatients(patientsData);
      setMedications(medicationsData);
    } catch (err) {
      setError('Failed to load patients and medications');
      console.error('Error loading data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'patientId' || name === 'medicationId' || name === 'numberOfDays' 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.patientId === 0) {
      setError('Please select a patient');
      return;
    }

    if (formData.medicationId === 0) {
      setError('Please select a medication');
      return;
    }

    if (formData.numberOfDays <= 0) {
      setError('Number of days must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      // Ensure all numeric fields are properly converted
      const submissionData = {
        ...formData,
        patientId: Number(formData.patientId),
        medicationId: Number(formData.medicationId),
        numberOfDays: Number(formData.numberOfDays),
      };
      
      console.log('Submitting assignment data:', submissionData);
      await assignmentService.create(submissionData);
      setSuccess('Assignment created successfully!');
      setTimeout(() => {
        router.push('/assignments');
      }, 1500);
    } catch (err: any) {
      let errorMessage = 'Failed to create assignment. Please try again.';
      
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(', ');
        } else {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error creating assignment:', err);
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

  if (patients.length === 0 || medications.length === 0) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Cannot Create Assignment</h1>
            <p className="text-gray-600 mb-6">
              You need at least one patient and one medication to create an assignment.
            </p>
            <div className="space-x-3">
              {patients.length === 0 && (
                <Link
                  href="/patients/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Patient
                </Link>
              )}
              {medications.length === 0 && (
                <Link
                  href="/medications/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Add Medication
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Assignment</h1>
          
          {error && <ErrorMessage message={error} className="mb-4" />}
          {success && <SuccessMessage message={success} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                id="patientId"
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={0}>Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="medicationId" className="block text-sm font-medium text-gray-700">
                Medication
              </label>
              <select
                id="medicationId"
                name="medicationId"
                required
                value={formData.medicationId}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={0}>Select a medication</option>
                {medications.map((medication) => (
                  <option key={medication.id} value={medication.id}>
                    {medication.name} ({medication.dosage} - {medication.frequency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="numberOfDays" className="block text-sm font-medium text-gray-700">
                Number of Days
              </label>
              <input
                type="number"
                id="numberOfDays"
                name="numberOfDays"
                required
                min="1"
                max="365"
                value={formData.numberOfDays}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter duration in days"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
