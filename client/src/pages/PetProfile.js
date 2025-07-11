import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  UserIcon,
  HeartIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const PetProfile = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [loadingMedications, setLoadingMedications] = useState(false);
  const [adverseReactions, setAdverseReactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (petId) {
      fetchPetData();
      fetchMedications();
      fetchAdverseReactions();
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

  const fetchMedications = async () => {
    setLoadingMedications(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}/medications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCurrentMedications(data.data.current || []);
        setMedicationHistory(data.data.history || []);
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast.error('Could not load medications');
    } finally {
      setLoadingMedications(false);
    }
  };

  const fetchAdverseReactions = async () => {
    try {
              const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}/reactions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAdverseReactions(data.data);
      }
    } catch (error) {
      console.error('Error fetching adverse reactions:', error);
    }
  };



  const downloadMedicalReport = async () => {
    setDownloadingReport(true);
    try {
              const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/reports/pet/${petId}/medical-record`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pet?.name || 'Pet'}_Medical_Report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Medical report downloaded successfully');
      } else {
        toast.error('Failed to download medical report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Error downloading medical report');
    } finally {
      setDownloadingReport(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      case 'life-threatening': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAge = (birthDate) => {
    // If pet has age and ageUnit fields, use those instead
    if (pet && pet.age && pet.ageUnit) {
      return `${pet.age} ${pet.ageUnit}`;
    }
    
    if (!birthDate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMs = today - birth;
    const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
    
    if (ageInYears < 1) {
      const ageInMonths = Math.floor(ageInYears * 12);
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(ageInYears);
      const months = Math.floor((ageInYears - years) * 12);
      return months > 0 ? `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}` : `${years} year${years !== 1 ? 's' : ''}`;
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (response.ok) {
        toast.success('Appointment marked as completed');
        fetchPetData(); // Refresh pet data
      } else {
        toast.error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Error updating appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        toast.success('Appointment cancelled');
        fetchPetData(); // Refresh pet data
      } else {
        toast.error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Error cancelling appointment');
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pet.name}'s Profile</h1>
            <p className="text-gray-600 mt-1">
              {pet.species} • {pet.breed} • {calculateAge(pet.birthDate)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => navigate(`/pets/${petId}/edit`)}
              className="btn-secondary flex items-center text-sm"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button
              onClick={downloadMedicalReport}
              disabled={downloadingReport}
              className="btn-primary flex items-center text-sm"
            >
              {downloadingReport ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              )}
              {downloadingReport ? 'Generating...' : 'Download Report'}
            </button>
            <button
              onClick={() => setShowDeleteConfirmModal(true)}
              className="btn-danger flex items-center text-sm"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Pet
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pet Information Card */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            {pet.photo ? (
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">{pet.species === 'dog' ? '🐕' : '🐱'}</span>
              </div>
            )}
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{pet.name}</h2>
              <p className="text-gray-600">{pet.breed}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Species:</span>
              <span className="font-medium capitalize">{pet.species}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Gender:</span>
              <span className="font-medium capitalize">{pet.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Age:</span>
              <span className="font-medium">{calculateAge(pet.birthDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Weight:</span>
              <span className="font-medium">{pet.weight ? `${pet.weight} ${pet.weightUnit || 'lbs'}` : 'Not recorded'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Microchip:</span>
              <span className="font-medium">{pet.microchipId || 'None'}</span>
            </div>
            {pet.insurance && (
              <div className="flex justify-between">
                <span className="text-gray-500">Insurance:</span>
                <span className="font-medium">{pet.insurance}</span>
              </div>
            )}
          </div>

          {pet.allergies && pet.allergies.length > 0 && (
            <div className="mt-6 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center mb-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                <span className="font-medium text-red-800">Allergies</span>
              </div>
              <div className="text-sm text-red-700">
                {pet.allergies.join(', ')}
              </div>
            </div>
          )}

          {pet.conditions && pet.conditions.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center mb-2">
                <HeartIcon className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Medical Conditions</span>
              </div>
              <div className="text-sm text-yellow-700">
                {pet.conditions.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('medications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'medications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Medications ({currentMedications.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Medical History
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Appointments ({pet.appointments?.filter(apt => apt.status === 'scheduled').length || 0})
              </button>
              <button
                onClick={() => setActiveTab('reactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reactions ({adverseReactions.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl mb-2">💊</div>
                      <div className="text-2xl font-bold text-blue-600">{currentMedications.length}</div>
                      <div className="text-sm text-blue-600">Current Medications</div>
                    </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{adverseReactions.length}</div>
                    <div className="text-sm text-yellow-600">Adverse Reactions</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <ChartBarIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {(pet.medicalHistory?.vaccinations?.length || 0) + 
                       (pet.medicalHistory?.allergies?.length || 0) + 
                       (pet.medicalHistory?.chronicConditions?.length || 0)}
                    </div>
                    <div className="text-sm text-red-600">Health History Alerts</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                                          {currentMedications.slice(0, 3).map((medication) => (
                        <div key={medication._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-xl mr-3">💊</span>
                          <div className="flex-1">
                          <div className="font-medium text-gray-900">{medication.name}</div>
                          <div className="text-sm text-gray-500">{medication.dosage} - {medication.frequency}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                          {medication.status}
                        </span>
                      </div>
                    ))}
                    
                    {adverseReactions.slice(0, 2).map((reaction) => (
                      <div key={reaction._id} className="flex items-center p-3 bg-red-50 rounded-lg">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Reaction to {reaction.medication}</div>
                          <div className="text-sm text-gray-500">{new Date(reaction.date).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(reaction.severity)}`}>
                          {reaction.severity}
                        </span>
                      </div>
                    ))}

                    {currentMedications.length === 0 && adverseReactions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No recent activity to display
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="space-y-4">
                                  {currentMedications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💊</div>
                      <p className="text-gray-500">No current medications</p>
                    <button
                      onClick={() => navigate('/medications')}
                      className="mt-4 btn-primary"
                    >
                      Add Medication
                    </button>
                  </div>
                ) : (
                  currentMedications.map((medication) => (
                    <div key={medication._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{medication.name}</h4>
                            {medication.brandName && (
                              <span className="text-sm text-gray-500">({medication.brandName})</span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                              {medication.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Dosage:</span>
                              <p className="font-medium">{medication.dosage}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Frequency:</span>
                              <p className="font-medium">{medication.frequency}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Route:</span>
                              <p className="font-medium capitalize">{medication.route || 'Not specified'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Started:</span>
                              <p className="font-medium">{new Date(medication.startDate).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {medication.reason && (
                            <div className="mt-3">
                              <span className="text-gray-500 text-sm">Reason:</span>
                              <p className="text-sm">{medication.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {!pet.medicalHistory || (!pet.medicalHistory.vaccinations?.length && !pet.medicalHistory.allergies?.length && !pet.medicalHistory.chronicConditions?.length) ? (
                  <div className="text-center py-12">
                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No medical history recorded</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Allergies */}
                    {pet.medicalHistory.allergies?.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Allergies</h4>
                        <div className="flex flex-wrap gap-2">
                          {pet.medicalHistory.allergies.map((allergy, index) => (
                            <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Chronic Conditions */}
                    {pet.medicalHistory.chronicConditions?.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Chronic Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          {pet.medicalHistory.chronicConditions.map((condition, index) => (
                            <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vaccinations */}
                    {pet.medicalHistory.vaccinations?.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Vaccination History</h4>
                        <div className="space-y-3">
                          {pet.medicalHistory.vaccinations.map((vaccination, index) => (
                            <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{vaccination.vaccine}</h5>
                                <p className="text-sm text-gray-500">
                                  Given: {new Date(vaccination.date).toLocaleDateString()}
                                </p>
                                {vaccination.nextDue && (
                                  <p className="text-sm text-gray-500">
                                    Next due: {new Date(vaccination.nextDue).toLocaleDateString()}
                                  </p>
                                )}
                                {vaccination.veterinarian && (
                                  <p className="text-sm text-gray-500">
                                    Veterinarian: {vaccination.veterinarian}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                Vaccination
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
                  <button
                    onClick={() => setShowAddAppointmentModal(true)}
                    className="btn-primary text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1 inline" />
                    Add Appointment
                  </button>
                </div>

                {!pet.appointments || pet.appointments.filter(apt => apt.status === 'scheduled').length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                    <button
                      onClick={() => setShowAddAppointmentModal(true)}
                      className="mt-4 btn-primary"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pet.appointments
                      .filter(apt => apt.status === 'scheduled')
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((appointment) => (
                        <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{appointment.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  appointment.type === 'checkup' ? 'bg-blue-100 text-blue-800' :
                                  appointment.type === 'vaccination' ? 'bg-green-100 text-green-800' :
                                  appointment.type === 'surgery' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {appointment.type}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                                </div>
                                {appointment.time && (
                                  <div>
                                    <span className="text-gray-500">Time:</span>
                                    <p className="font-medium">{appointment.time}</p>
                                  </div>
                                )}
                                {appointment.veterinarian && (
                                  <div>
                                    <span className="text-gray-500">Veterinarian:</span>
                                    <p className="font-medium">{appointment.veterinarian}</p>
                                  </div>
                                )}
                                {appointment.clinic && (
                                  <div>
                                    <span className="text-gray-500">Clinic:</span>
                                    <p className="font-medium">{appointment.clinic}</p>
                                  </div>
                                )}
                              </div>

                              {appointment.notes && (
                                <div className="mt-3">
                                  <span className="text-gray-500 text-sm">Notes:</span>
                                  <p className="text-sm">{appointment.notes}</p>
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                              <button
                                onClick={() => handleCompleteAppointment(appointment._id)}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Mark Complete
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appointment._id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reactions' && (
              <div className="space-y-4">
                {adverseReactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500">No adverse reactions recorded</p>
                  </div>
                ) : (
                  adverseReactions.map((reaction) => (
                    <div key={reaction._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{reaction.medication}</h4>
                          <p className="text-sm text-gray-500">{new Date(reaction.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(reaction.severity)}`}>
                          {reaction.severity}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Symptoms:</span>
                          <p className="font-medium">{reaction.symptoms.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-medium">{reaction.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Treatment:</span>
                          <p className="font-medium">{reaction.treatment}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Outcome:</span>
                          <p className="font-medium capitalize">{reaction.outcome}</p>
                        </div>
                      </div>

                      {reaction.notes && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Notes:</span>
                          <p className="text-sm">{reaction.notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <AddAppointmentModal
          petId={petId}
          onClose={() => setShowAddAppointmentModal(false)}
          onSuccess={() => {
            fetchPetData();
            setShowAddAppointmentModal(false);
          }}
        />
      )}

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

// Add Appointment Modal Component
const AddAppointmentModal = ({ petId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'checkup',
    title: '',
    date: '',
    time: '',
    veterinarian: '',
    clinic: '',
    address: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${petId}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Appointment scheduled successfully!');
        onSuccess();
      } else {
        toast.error('Failed to schedule appointment');
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Error scheduling appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Appointment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Appointment Type</label>
            <select
              className="form-input"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option value="checkup">Regular Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="surgery">Surgery</option>
              <option value="dental">Dental Cleaning</option>
              <option value="grooming">Grooming</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Annual checkup, Rabies vaccination"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Veterinarian</label>
            <input
              type="text"
              className="form-input"
              value={formData.veterinarian}
              onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
              placeholder="Dr. Smith"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinic/Hospital</label>
            <input
              type="text"
              className="form-input"
              value={formData.clinic}
              onChange={(e) => setFormData({...formData, clinic: e.target.value})}
              placeholder="City Veterinary Clinic"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes or special instructions"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetProfile; 