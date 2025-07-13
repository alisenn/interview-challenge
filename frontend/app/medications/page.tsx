'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ErrorMessage, LoadingSpinner } from '../../components/ui';
import { medicationService } from '../../services';
import { Medication } from '../../types';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await medicationService.getAll();
      setMedications(data);
    } catch (err) {
      setError('Failed to load medications');
      console.error('Error loading medications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this medication?')) return;
    
    try {
      await medicationService.delete(id);
      await loadMedications();
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError('Failed to delete medication');
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
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage medication information and dosage details
          </p>
        </div>
        <Link
          href="/medications/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Add New Medication
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Medications List */}
      {medications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medications</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first medication.</p>
          <Link
            href="/medications/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Add Medication
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((medication) => (
            <div key={medication.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {medication.name}
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      href={`/medications/${medication.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(medication.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Dosage:</span>
                    <span>{medication.dosage}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Frequency:</span>
                    <span>{medication.frequency}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Assignments:</span>
                    <span>{medication.assignments?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
