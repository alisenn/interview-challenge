'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ErrorMessage, SuccessMessage } from '../../../components/ui';
import { medicationService } from '../../../services';
import { CreateMedicationDto } from '../../../types';

export default function NewMedicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateMedicationDto>({
    name: '',
    dosage: '',
    frequency: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setLoading(true);

    try {
      await medicationService.create(formData);
      setSuccess('Medication created successfully!');
      setTimeout(() => {
        router.push('/medications');
      }, 1500);
    } catch (err) {
      setError('Failed to create medication. Please try again.');
      console.error('Error creating medication:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Medication</h1>
          
          {error && <ErrorMessage message={error} className="mb-4" />}
          {success && <SuccessMessage message={success} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Medication Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter medication name"
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
                value={formData.dosage}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 500mg, 10ml"
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                <option value="Weekly">Weekly</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Medication'}
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
