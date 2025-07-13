'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner, SuccessMessage } from '../../../../components/ui';
import { assignmentService } from '../../../../services';
import { Assignment, UpdateAssignmentDto } from '../../../../types';

export default function EditAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = Number(params.id);
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<UpdateAssignmentDto>({
    startDate: '',
    numberOfDays: 1,
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (assignmentId) {
      loadData();
    }
  }, [assignmentId]);

  const loadData = async () => {
    try {
      setDataLoading(true);
      const assignmentData = await assignmentService.getById(assignmentId);
      
      setAssignment(assignmentData);
      setFormData({
        startDate: assignmentData.startDate.split('T')[0], // Convert to YYYY-MM-DD format
        numberOfDays: assignmentData.numberOfDays,
      });
    } catch (err) {
      setError('Failed to load assignment data');
      console.error('Error loading data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'numberOfDays' 
        ? parseInt(value) || 1 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }

    if ((formData.numberOfDays || 0) <= 0) {
      setError('Number of days must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      // Ensure numberOfDays is properly converted to number
      const submissionData = {
        ...formData,
        numberOfDays: Number(formData.numberOfDays),
      };
      
      console.log('Updating assignment data:', submissionData);
      await assignmentService.update(assignmentId, submissionData);
      setSuccess('Assignment updated successfully!');
      setTimeout(() => {
        router.push('/assignments');
      }, 1500);
    } catch (err: any) {
      let errorMessage = 'Failed to update assignment. Please try again.';
      
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(', ');
        } else {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error updating assignment:', err);
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

  if (!assignment) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Assignment Not Found</h1>
            <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
            <Link
              href="/assignments"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Back to Assignments
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Assignment</h1>
          
          {error && <ErrorMessage message={error} className="mb-4" />}
          {success && <SuccessMessage message={success} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </div>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-900 font-medium">{assignment.patient.name}</span>
                <span className="text-gray-500 text-sm ml-2">(Cannot be changed)</span>
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Medication
              </div>
              <div className="p-3 bg-gray-50 rounded-md border">
                <span className="text-gray-900 font-medium">
                  {assignment.medication.name} ({assignment.medication.dosage} - {assignment.medication.frequency})
                </span>
                <span className="text-gray-500 text-sm ml-2">(Cannot be changed)</span>
              </div>
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
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Assignment'}
              </button>
              
              <Link
                href="/assignments"
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
