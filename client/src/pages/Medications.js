import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import MedicationAutocomplete from '../components/MedicationAutocomplete';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Medications = () => {

  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [loadingMedications, setLoadingMedications] = useState(false);
  const [adverseReactions, setAdverseReactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [interactionResults, setInteractionResults] = useState(null);
  const [pendingMedication, setPendingMedication] = useState(null);

  // Form states
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    brandName: '',
    dosage: '',
    frequency: '',
    route: 'oral',
    startDate: '',
    endDate: '',
    prescribedBy: '',
    reason: '',
    instructions: ''
  });

  const [reactionForm, setReactionForm] = useState({
    medication: '',
    date: '',
    severity: 'mild',
    symptoms: [],
    symptomsInput: '',
    duration: '',
    treatment: '',
    outcome: 'recovered',
    notes: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      const petData = pets.find(pet => pet._id === selectedPet);
      setSelectedPetData(petData);
      fetchMedications(selectedPet);
      fetchAdverseReactions();
    } else {
      setCurrentMedications([]);
      setMedicationHistory([]);
      setAdverseReactions([]);
    }
  }, [selectedPet, pets]);

  const fetchPets = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPets(data.data);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchMedications = async (petId) => {
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
    if (!selectedPet) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${selectedPet}/reactions`, {
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

  // Function to check for drug interactions
  const checkInteractions = async (medicationToCheck) => {
    try {
      // Combine current medications with the new one
      const allMedications = [
        ...currentMedications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency
        })),
        {
          name: medicationToCheck.name,
          dosage: medicationToCheck.dosage,
          frequency: medicationToCheck.frequency
        }
      ];

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/interactions/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          petId: selectedPet,
          medications: allMedications
        })
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        console.error('Interaction check failed:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
      return null;
    }
  };

  const handleSaveMedication = async () => {
    // Only medication name is required
    if (!medicationForm.name.trim()) {
      toast.error('Medication name is required');
      return;
    }

    // If adding a new medication and pet has existing medications, check for interactions first
    if (!editingMedication && currentMedications.length > 0) {
      const interactionData = await checkInteractions(medicationForm);
      
      if (interactionData) {
        // Check if there are any concerning interactions
        const hasToxic = interactionData.toxicMedications?.length > 0;
        const hasDangerous = interactionData.drugInteractions?.some(i => 
          i.riskLevel === 'Critical' || i.riskLevel === 'High'
        );
        const hasInteractions = interactionData.drugInteractions?.length > 0;
        
        if (hasToxic || hasDangerous || hasInteractions) {
          // Show interaction warning modal
          setInteractionResults(interactionData);
          setPendingMedication(medicationForm);
          setShowInteractionModal(true);
          return; // Don't save yet, wait for user confirmation
        }
      }
      // If no interactions or interaction check failed, proceed normally
    }

    // Proceed with saving
    await saveMedicationNow(medicationForm);
  };

  const saveMedicationNow = async (medicationData) => {
    try {
      const url = editingMedication
        ? `${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${selectedPet}/medications/${editingMedication._id}`
        : `${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${selectedPet}/medications`;
      
      const method = editingMedication ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(medicationData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingMedication ? 'Medication updated' : 'Medication added');
        fetchMedications(selectedPet);
        closeModal();
        closeInteractionModal();
      } else {
        toast.error(data.message || 'Error saving medication');
      }
    } catch (error) {
      console.error('Error saving medication:', error);
      toast.error('Network error - please try again');
    }
  };

  const closeInteractionModal = () => {
    setShowInteractionModal(false);
    setInteractionResults(null);
    setPendingMedication(null);
  };

  const proceedWithMedication = () => {
    if (pendingMedication) {
      saveMedicationNow(pendingMedication);
    }
  };

  // Helper functions for interaction display
  const getSafetyStatus = (results) => {
    if (!results) return 'unknown';
    
    const hasToxic = results.toxicMedications?.length > 0;
    const hasDangerous = results.drugInteractions?.some(i => 
      i.riskLevel === 'Critical' || i.riskLevel === 'High'
    );
    const hasInteractions = results.drugInteractions?.length > 0;
    
    if (hasToxic || hasDangerous) return 'dangerous';
    if (hasInteractions) return 'caution';
    return 'safe';
  };

  const getSafetyMessage = (results) => {
    const status = getSafetyStatus(results);
    switch (status) {
      case 'safe':
        return {
          title: '✅ Safe to Give Together',
          message: 'No dangerous interactions detected between the new medication and current medications.',
          color: 'text-green-800 bg-green-50 border-green-200'
        };
      case 'caution':
        return {
          title: '⚠️ Use with Caution',
          message: 'Some interactions detected. Monitor your pet closely and consult your veterinarian.',
          color: 'text-yellow-800 bg-yellow-50 border-yellow-200'
        };
      case 'dangerous':
        return {
          title: '🚨 Do Not Give Together',
          message: 'Dangerous interactions detected. Do not give this medication without veterinary supervision.',
          color: 'text-red-800 bg-red-50 border-red-200'
        };
      default:
        return {
          title: 'Analysis Complete',
          message: 'Check the details below for interaction information.',
          color: 'text-blue-800 bg-blue-50 border-blue-200'
        };
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleDeleteMedication = async (medicationId) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${selectedPet}/medications/${medicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Medication deleted');
        fetchMedications(selectedPet);
      } else {
        toast.error(data.message || 'Error deleting medication');
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Network error - please try again');
    }
  };

  const handleSaveReaction = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/pets/${selectedPet}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...reactionForm,
          symptoms: reactionForm.symptomsInput.split(',').map(s => s.trim()).filter(s => s)
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Adverse reaction recorded');
        fetchAdverseReactions();
        closeReactionModal();
      } else {
        toast.error(data.message || 'Error saving reaction');
      }
    } catch (error) {
      console.error('Error saving reaction:', error);
      toast.error('Network error - please try again');
    }
  };

  const openAddModal = () => {
    setEditingMedication(null);
    setMedicationForm({
      name: '',
      brandName: '',
      dosage: '',
      frequency: '',
      route: '',
      startDate: '',
      endDate: '',
      prescribedBy: '',
      reason: '',
      instructions: ''
    });
    setShowAddModal(true);
  };

  const openEditModal = (medication) => {
    setEditingMedication(medication);
    setMedicationForm({
      name: medication.name || '',
      brandName: medication.brandName || '',
      dosage: medication.dosage || '',
      frequency: medication.frequency || '',
      route: medication.route || '',
      startDate: medication.startDate ? medication.startDate.split('T')[0] : '',
      endDate: medication.endDate ? medication.endDate.split('T')[0] : '',
      prescribedBy: medication.prescribedBy || '',
      reason: medication.reason || '',
      instructions: medication.instructions || ''
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingMedication(null);
  };

  const closeReactionModal = () => {
    setShowReactionModal(false);
    setReactionForm({
      medication: '',
      date: '',
      severity: 'mild',
      symptoms: [],
      symptomsInput: '',
      duration: '',
      treatment: '',
      outcome: 'recovered',
      notes: ''
    });
  };

  const handleMedicationSelect = (medicationName) => {
    setMedicationForm({
      ...medicationForm,
      name: medicationName
    });
  };

  const handleDosageSelect = (dosage) => {
    setMedicationForm({
      ...medicationForm,
      dosage: dosage
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!selectedPet ? (
          /* Hero Section - Before Pet Selection */
          <div className="mb-8">
            {/* Header */}
            <div className="text-center mb-12">
                              <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">💊</span>
                  </div>
                </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Pet Medication Management</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Keep your furry friends healthy with comprehensive medication tracking, 
                dosage reminders, and adverse reaction monitoring.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Active Medications</h3>
                <p className="text-gray-600">
                  Monitor current prescriptions with dosage, frequency, and administration routes. 
                  Never miss a dose with our organized tracking system.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitor Reactions</h3>
                <p className="text-gray-600">
                  Record and track adverse reactions to medications. Build a comprehensive 
                  health history to share with your veterinarian.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete History</h3>
                <p className="text-gray-600">
                  Maintain detailed records of past medications and treatments. 
                  Perfect for vet visits and tracking treatment effectiveness.
                </p>
              </div>
            </div>

            {/* Pet Selection Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Get Started</h2>
                <p className="text-gray-600">Select one of your pets to begin managing their medications</p>
              </div>

              {pets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pets Added Yet</h3>
                  <p className="text-gray-600 mb-6">You'll need to add a pet to your account before you can track medications.</p>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Your First Pet
                  </a>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Your Pet
                  </label>
                  <select
                    value={selectedPet}
                    onChange={(e) => setSelectedPet(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value="">Select a pet to manage medications...</option>
                    {pets.map((pet) => (
                      <option key={pet._id} value={pet._id}>
                        {pet.name} - {pet.species} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Important Safety Reminders</h3>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Always follow your veterinarian's prescribed dosage and schedule</li>
                    <li>• Never give human medications to pets without veterinary approval</li>
                    <li>• Store medications in a cool, dry place away from children and other pets</li>
                    <li>• Report any adverse reactions to your veterinarian immediately</li>
                    <li>• Keep medications in their original containers with labels intact</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Existing Pet-Selected Content */
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {selectedPetData?.name}'s Medications
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Manage medications and track adverse reactions for your {selectedPetData?.species}.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPet('')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  ← Back to Pet Selection
                </button>
              </div>
            </div>

            {/* Pet Info Card */}
            {selectedPetData && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center">
                  {selectedPetData.photo ? (
                    <img
                      src={selectedPetData.photo}
                      alt={selectedPetData.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">
                        {selectedPetData.species === 'dog' ? '🐕' : selectedPetData.species === 'cat' ? '🐱' : '🐾'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedPetData.name}</h2>
                    <p className="text-gray-600 capitalize">
                      {selectedPetData.species} • {selectedPetData.breed} • {selectedPetData.age} {selectedPetData.ageUnit} • {selectedPetData.weight} {selectedPetData.weightUnit}
                    </p>
                    {selectedPetData.medicalHistory?.allergies?.length > 0 && (
                      <div className="mt-2 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-600 font-medium">
                          Allergies: {selectedPetData.medicalHistory.allergies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-6 flex flex-wrap gap-4">
              <button
                onClick={openAddModal}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Medication
              </button>
              <button
                onClick={() => setShowReactionModal(true)}
                className="btn-secondary flex items-center"
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                Report Adverse Reaction
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('current')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'current'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Current Medications ({currentMedications.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  History ({medicationHistory.length})
                </button>
                <button
                  onClick={() => setActiveTab('reactions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reactions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Adverse Reactions ({adverseReactions.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'current' && (
              <div className="space-y-4">
                {currentMedications.length === 0 ? (
                                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <div className="text-6xl mb-4">💊</div>
                      <p className="text-gray-500 mb-4">No current medications for {selectedPetData?.name}</p>
                    <button
                      onClick={openAddModal}
                      className="btn-primary"
                    >
                      Add First Medication
                    </button>
                  </div>
                ) : (
                  currentMedications.map((medication) => (
                    <div key={medication._id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {medication.name}
                            </h3>
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

                          {medication.instructions && (
                            <div className="mt-2">
                              <span className="text-gray-500 text-sm">Instructions:</span>
                              <p className="text-sm">{medication.instructions}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openEditModal(medication)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedication(medication._id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {medicationHistory.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No medication history for {selectedPetData?.name}</p>
                  </div>
                ) : (
                  medicationHistory.map((medication) => (
                    <div key={medication._id} className="bg-white p-6 rounded-lg border border-gray-200 opacity-75">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {medication.name}
                            </h3>
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
                              <span className="text-gray-500">Duration:</span>
                              <p className="font-medium">
                                {new Date(medication.startDate).toLocaleDateString()} - {' '}
                                {medication.endDate ? new Date(medication.endDate).toLocaleDateString() : 'Ongoing'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reactions' && (
              <div className="space-y-4">
                {adverseReactions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500">No adverse reactions reported</p>
                  </div>
                ) : (
                  adverseReactions.map((reaction) => (
                    <div key={reaction._id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reaction.medication}</h3>
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
          </>
        )}

        {/* Add/Edit Medication Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingMedication ? 'Edit Medication' : 'Add New Medication'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medication Name *
                    </label>
                    <MedicationAutocomplete
                      value={medicationForm.name}
                      onChange={handleMedicationSelect}
                      onDosageSelect={handleDosageSelect}
                      species={selectedPetData?.species || 'all'}
                      placeholder="Search for medication..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={medicationForm.brandName}
                      onChange={(e) => setMedicationForm({...medicationForm, brandName: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medicationForm.dosage}
                      onChange={(e) => setMedicationForm({...medicationForm, dosage: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 10mg (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={medicationForm.frequency}
                      onChange={(e) => setMedicationForm({...medicationForm, frequency: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., twice daily (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Route
                    </label>
                    <select
                      value={medicationForm.route}
                      onChange={(e) => setMedicationForm({...medicationForm, route: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select route (optional)</option>
                      <option value="oral">Oral</option>
                      <option value="topical">Topical</option>
                      <option value="injection">Injection</option>
                      <option value="inhalation">Inhalation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={medicationForm.startDate}
                      onChange={(e) => setMedicationForm({...medicationForm, startDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={medicationForm.endDate}
                      onChange={(e) => setMedicationForm({...medicationForm, endDate: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    value={medicationForm.prescribedBy}
                    onChange={(e) => setMedicationForm({...medicationForm, prescribedBy: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Veterinarian name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Medication
                  </label>
                  <input
                    type="text"
                    value={medicationForm.reason}
                    onChange={(e) => setMedicationForm({...medicationForm, reason: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., arthritis pain management (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    value={medicationForm.instructions}
                    onChange={(e) => setMedicationForm({...medicationForm, instructions: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="e.g., give with food, monitor for side effects (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMedication}
                  className="btn-primary"
                >
                  {editingMedication ? 'Update' : 'Add'} Medication
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interaction Warning Modal */}
        {showInteractionModal && interactionResults && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">⚠️ Drug Interaction Warning</h3>
                <button onClick={closeInteractionModal} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Safety Summary */}
              <div className={`p-4 rounded-lg border mb-6 ${getSafetyMessage(interactionResults).color}`}>
                <h4 className="font-semibold text-lg mb-2">{getSafetyMessage(interactionResults).title}</h4>
                <p className="text-sm">{getSafetyMessage(interactionResults).message}</p>
              </div>

              {/* Toxic Medications */}
              {interactionResults.toxicMedications && interactionResults.toxicMedications.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">🚨 Toxic Medications Detected</h4>
                  <div className="space-y-2">
                    {interactionResults.toxicMedications.map((toxicMed, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="font-semibold text-red-800">{toxicMed.medication}</div>
                        <div className="text-sm text-red-700">{toxicMed.reason}</div>
                        <div className="text-xs text-red-600 mt-1">
                          Species: {toxicMed.species?.join(', ') || 'All'}
                          {toxicMed.severity && ` • Severity: ${toxicMed.severity}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drug Interactions */}
              {interactionResults.drugInteractions && interactionResults.drugInteractions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">🔄 Drug Interactions</h4>
                  <div className="space-y-3">
                    {interactionResults.drugInteractions.map((interaction, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${getRiskColor(interaction.riskLevel)}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{interaction.drug1} + {interaction.drug2}</div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(interaction.riskLevel)}`}>
                            {interaction.riskLevel}
                          </span>
                        </div>
                        <div className="text-sm mb-2">{interaction.description}</div>
                        {interaction.recommendations && (
                          <div className="text-xs">
                            <strong>Recommendations:</strong> {interaction.recommendations}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medication being added */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Medication you're trying to add:</h4>
                <div className="text-sm text-blue-700">
                  <strong>{pendingMedication?.name}</strong>
                  {pendingMedication?.dosage && ` - ${pendingMedication.dosage}`}
                  {pendingMedication?.frequency && ` - ${pendingMedication.frequency}`}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={closeInteractionModal}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 order-2 sm:order-1"
                >
                  Cancel
                </button>
                {getSafetyStatus(interactionResults) === 'dangerous' ? (
                  <button
                    onClick={proceedWithMedication}
                    className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 order-1 sm:order-2"
                  >
                    ⚠️ Add Anyway (Consult Vet First!)
                  </button>
                ) : (
                  <button
                    onClick={proceedWithMedication}
                    className="px-6 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 order-1 sm:order-2"
                  >
                    Proceed with Caution
                  </button>
                )}
              </div>

              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Important:</strong> This interaction check is for informational purposes only. 
                  Always consult with your veterinarian before making medication decisions, especially 
                  if dangerous interactions are detected.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Adverse Reaction Modal */}
        {showReactionModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Report Adverse Reaction</h3>
                <button onClick={closeReactionModal} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medication *
                    </label>
                    <MedicationAutocomplete
                      value={reactionForm.medication}
                      onChange={(value) => setReactionForm({...reactionForm, medication: value})}
                      species={selectedPetData?.species || 'all'}
                      placeholder="Search for medication..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={reactionForm.date}
                      onChange={(e) => setReactionForm({...reactionForm, date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity *
                  </label>
                  <select
                    value={reactionForm.severity}
                    onChange={(e) => setReactionForm({...reactionForm, severity: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="life-threatening">Life-threatening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms *
                  </label>
                  <textarea
                    value={reactionForm.symptomsInput}
                    onChange={(e) => setReactionForm({
                      ...reactionForm, 
                      symptomsInput: e.target.value,
                      symptoms: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="e.g., vomiting, diarrhea, lethargy"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={reactionForm.duration}
                      onChange={(e) => setReactionForm({...reactionForm, duration: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2 days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outcome
                    </label>
                    <select
                      value={reactionForm.outcome}
                      onChange={(e) => setReactionForm({...reactionForm, outcome: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="recovered">Recovered</option>
                      <option value="recovering">Recovering</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="fatal">Fatal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Given
                  </label>
                  <textarea
                    value={reactionForm.treatment}
                    onChange={(e) => setReactionForm({...reactionForm, treatment: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="Treatment provided by veterinarian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={reactionForm.notes}
                    onChange={(e) => setReactionForm({...reactionForm, notes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Any additional details about the reaction"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeReactionModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReaction}
                  className="btn-primary"
                >
                  Save Reaction
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medications; 