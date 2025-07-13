'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner } from '../../components/ui';
import { calculateAge, formatDate, getRemainingDaysColor, getRemainingDaysLabel } from '../../lib/utils';
import { patientService } from '../../services';
import { Patient } from '../../types';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      await patientService.delete(id);
      await loadPatients();
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError('Failed to delete patient');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage patient information and view their medication assignments
          </p>
        </div>
        <Link
          href="/patients/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Add New Patient
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Patients List */}
      {patients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first patient.</p>
          <Link
            href="/patients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Patient
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <li key={patient.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {patient.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            View
                          </Link>
                          <Link
                            href={`/patients/${patient.id}/edit`}
                            className="text-green-600 hover:text-green-900 text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            📅 Born: {formatDate(patient.dateOfBirth)} (Age: {calculateAge(patient.dateOfBirth)})
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            📋 {patient.assignments?.length || 0} assignment(s)
                          </p>
                        </div>
                      </div>
                      
                      {/* Active Assignments */}
                      {patient.assignments && patient.assignments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Active Treatments:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {patient.assignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="bg-gray-50 rounded-lg p-3 border"
                              >
                                <p className="text-sm font-medium text-gray-900">
                                  {assignment.medication.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {assignment.medication.dosage} - {assignment.medication.frequency}
                                </p>
                                <p className={`text-xs font-medium mt-1 ${getRemainingDaysColor(assignment.remainingDays)}`}>
                                  {getRemainingDaysLabel(assignment.remainingDays)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
