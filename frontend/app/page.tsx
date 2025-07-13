'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner } from '../components/ui';
import { calculateAge, formatDate, getRemainingDaysColor, getRemainingDaysLabel } from '../lib/utils';
import { healthService, patientService } from '../services';
import { Patient } from '../types';

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const testConnection = async () => {
    try {
      const response = await healthService.check();
      setConnectionTest(`✅ Backend connected: ${response.service} (${response.status})`);
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setConnectionTest(`❌ Backend connection failed: ${err.message}`);
    }
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading patients:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Please make sure the backend is running on http://localhost:8080');
      } else if (err.response?.status === 404) {
        setError('Patients endpoint not found. Please check the backend API.');
      } else if (err.response?.status >= 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError(`Failed to load patients data: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} className="mb-6" />
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Debug Connection</h3>
          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Test Backend Connection
            </button>
            {connectionTest && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{connectionTest}</p>
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p><strong>Expected Backend URL:</strong> http://localhost:8080</p>
              <p><strong>Health Check:</strong> http://localhost:8080/health</p>
              <p><strong>Patients API:</strong> http://localhost:8080/patients</p>
            </div>
            <button
              onClick={loadPatients}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Retry Loading Patients
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPatients = patients.length;
  const totalAssignments = patients.reduce((sum, patient) => sum + (patient.assignments?.length || 0), 0);
  const activeAssignments = patients.reduce((sum, patient) => {
    const active = patient.assignments?.filter(assignment => 
      assignment.remainingDays !== undefined && assignment.remainingDays >= 0
    ).length || 0;
    return sum + active;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of patients and their medication assignments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Patients
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalPatients}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Assignments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalAssignments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Treatments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeAssignments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/patients/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <span className="mr-2">👤</span>
              Add New Patient
            </Link>
            <Link
              href="/medications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <span className="mr-2">💊</span>
              Add New Medication
            </Link>
            <Link
              href="/assignments/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <span className="mr-2">📋</span>
              Create Assignment
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Patients with Assignments */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Patients with Active Treatments
            </h3>
            <Link
              href="/patients"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all patients →
            </Link>
          </div>
          
          {patients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No patients found. <Link href="/patients/new" className="text-blue-600 hover:text-blue-500">Add the first patient</Link>
            </p>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.flatMap(patient =>
                    patient.assignments?.map(assignment => (
                      <tr key={`${patient.id}-${assignment.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Age: {calculateAge(patient.dateOfBirth)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {assignment.medication.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.medication.dosage} - {assignment.medication.frequency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getRemainingDaysColor(assignment.remainingDays)}`}>
                            {getRemainingDaysLabel(assignment.remainingDays)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(assignment.startDate)}
                        </td>
                      </tr>
                    )) || []
                  )}
                </tbody>
              </table>
              {patients.every(patient => !patient.assignments?.length) && (
                <div className="text-center py-8 text-gray-500">
                  No active treatments found. <Link href="/assignments/new" className="text-blue-600 hover:text-blue-500">Create the first assignment</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
