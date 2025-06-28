import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import PhotoUpload from '../components/PhotoUpload';

const PetEdit = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    sex: 'male',
    age: '',
    ageUnit: 'years',
    weight: '',
    weightUnit: 'lbs',
    microchipId: '',
    photo: '',
    insuranceInfo: {
      provider: ''
    },
    medicalHistory: {
      allergies: [],
      allergiesInput: '',
      chronicConditions: [],
      chronicConditionsInput: ''
    }
  });

  useEffect(() => {
    if (petId) {
      fetchPetData();
    }
  }, [petId]);

  const fetchPetData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPet(data.data);
        setFormData({
          name: data.data.name || '',
          species: data.data.species || 'dog',
          breed: data.data.breed || '',
          sex: data.data.sex || 'male',
          age: data.data.age || '',
          ageUnit: data.data.ageUnit || 'years',
          weight: data.data.weight || '',
          weightUnit: data.data.weightUnit || 'lbs',
          microchipId: data.data.microchipId || '',
          photo: data.data.photo || '',
          insuranceInfo: {
            provider: data.data.insuranceInfo?.provider || ''
          },
          medicalHistory: {
            allergies: data.data.medicalHistory?.allergies || [],
            allergiesInput: data.data.medicalHistory?.allergies?.join(', ') || '',
            chronicConditions: data.data.medicalHistory?.chronicConditions || [],
            chronicConditionsInput: data.data.medicalHistory?.chronicConditions?.join(', ') || ''
          }
        });
      } else {
        toast.error('Pet not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching pet:', error);
      toast.error('Error loading pet profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up form data for submission - remove input fields
      const submitData = {
        ...formData,
        medicalHistory: {
          allergies: formData.medicalHistory.allergies,
          chronicConditions: formData.medicalHistory.chronicConditions
        }
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Pet profile updated successfully!');
        navigate(`/pet/${petId}`);
      } else {
        toast.error(data.message || 'Failed to update pet profile');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Error updating pet profile');
    } finally {
      setSaving(false);
    }
  };

  const handleArrayInput = (field, value) => {
    // Store the raw input value and only process it when needed
    setFormData(prev => ({ 
      ...prev, 
      medicalHistory: {
        ...prev.medicalHistory,
        [`${field}Input`]: value, // Store raw input
        [field]: value.split(',').map(item => item.trim()).filter(item => item) // Process for backend
      }
    }));
  };

  const handleDeletePet = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}?permanent=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Pet profile deleted successfully');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to delete pet profile');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Error deleting pet profile');
    } finally {
      setDeleting(false);
      setShowDeleteConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Pet Not Found</h1>
          <p className="text-gray-600 mt-2">The requested pet could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(`/pet/${petId}`)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit {pet.name}'s Profile</h1>
            <p className="text-gray-600 mt-1">Update your pet's information</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            
            {/* Photo Upload */}
            <div className="mb-6">
              <label className="form-label">Profile Photo</label>
              <PhotoUpload
                currentPhoto={formData.photo}
                onPhotoChange={(photo) => setFormData({...formData, photo})}
                className="mt-2"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Pet Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Species *</label>
                <select
                  className="form-input"
                  value={formData.species}
                  onChange={(e) => setFormData({...formData, species: e.target.value})}
                  required
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Breed</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="e.g., Golden Retriever, Persian Cat"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sex *</label>
                <select
                  className="form-input"
                  value={formData.sex}
                  onChange={(e) => setFormData({...formData, sex: e.target.value})}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="form-input flex-1"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                  <select
                    className="form-input w-24"
                    value={formData.ageUnit}
                    onChange={(e) => setFormData({...formData, ageUnit: e.target.value})}
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Weight</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="form-input flex-1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="0"
                    step="0.1"
                  />
                  <select
                    className="form-input w-20"
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Microchip ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.microchipId}
                  onChange={(e) => setFormData({...formData, microchipId: e.target.value})}
                  placeholder="Enter microchip ID if available"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pet Insurance</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.insuranceInfo.provider}
                  onChange={(e) => setFormData({
                    ...formData, 
                    insuranceInfo: {
                      ...formData.insuranceInfo,
                      provider: e.target.value
                    }
                  })}
                  placeholder="Insurance provider (if any)"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Allergies</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.medicalHistory.allergiesInput}
                  onChange={(e) => handleArrayInput('allergies', e.target.value)}
                  placeholder="Enter allergies separated by commas (e.g., chicken, beef, pollen)"
                />
                <p className="text-sm text-gray-500 mt-1">Separate multiple allergies with commas</p>
              </div>

              <div className="form-group">
                <label className="form-label">Chronic Conditions</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.medicalHistory.chronicConditionsInput}
                  onChange={(e) => handleArrayInput('chronicConditions', e.target.value)}
                  placeholder="Enter conditions separated by commas (e.g., diabetes, arthritis)"
                />
                <p className="text-sm text-gray-500 mt-1">Separate multiple conditions with commas</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowDeleteConfirmModal(true)}
              className="btn-danger flex items-center"
              disabled={saving || deleting}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Pet
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/pet/${petId}`)}
                className="btn-secondary"
                disabled={saving || deleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving || deleting}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Pet Profile</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to permanently delete <strong>{pet?.name}'s</strong> profile? 
                  This action cannot be undone and will remove all medical records, medications, and appointments.
                </p>
              </div>
              <div className="flex gap-3 px-4 py-3">
                <button
                  onClick={() => setShowDeleteConfirmModal(false)}
                  disabled={deleting}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePet}
                  disabled={deleting}
                  className="btn-danger flex-1 flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetEdit; 