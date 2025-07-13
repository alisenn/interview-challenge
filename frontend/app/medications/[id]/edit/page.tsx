'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner, SuccessMessage } from '../../../../components/ui';
import { medicationService } from '../../../../services';
import { Medication, UpdateMedicationDto } from '../../../../types';

export default function EditMedicationPage() {
  const params = useParams();
  const router = useRouter();
  const medicationId = Number(params.id);
  
  const [medication, setMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<UpdateMedicationDto>({
    name: '',
    dosage: '',
    frequency: '',
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (medicationId) {
      loadMedication();
    }
  }, [medicationId]);

  const loadMedication = async () => {
    try {
      setDataLoading(true);
      const data = await medicationService.getById(medicationId);
      setMedication(data);
      setFormData({
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
      });
    } catch (err) {
      setError('Failed to load medication data');
      console.error('Error loading medication:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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

    if (!formData.dosage?.trim()) {
      setError('Dosage is required');
      return;
    }

    if (!formData.frequency?.trim()) {
      setError('Frequency is required');
      return;
    }

    setLoading(true);

    try {
      await medicationService.update(medicationId, formData);
      setSuccess('Medication updated successfully!');
      setTimeout(() => {
        router.push('/medications');
      }, 1500);
    } catch (err: any) {
      let errorMessage = 'Failed to update medication. Please try again.';
      
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(', ');
        } else {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error updating medication:', err);
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

  if (!medication) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Medication Not Found</h1>
            <p className="text-gray-600 mb-4">The medication you're looking for doesn't exist.</p>
            <Link
              href="/medications"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Back to Medications
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Medication</h1>
          
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
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                Dosage
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                required
                placeholder="e.g., 10mg, 500ml"
                value={formData.dosage}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                required
                value={formData.frequency}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="Every 12 hours">Every 12 hours</option>
                <option value="As needed">As needed</option>
                <option value="Before meals">Before meals</option>
                <option value="After meals">After meals</option>
                <option value="At bedtime">At bedtime</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Medication'}
              </button>
              
              <Link
                href="/medications"
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
