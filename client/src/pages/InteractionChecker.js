import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import MedicationAutocomplete from '../components/MedicationAutocomplete';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const InteractionChecker = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedPetData, setSelectedPetData] = useState(null);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [results, setResults] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingMedications, setLoadingMedications] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAiResults, setShowAiResults] = useState(false);

  // Fetch user's pets
  useEffect(() => {
    fetchPets();
  }, []);

  // Load pet's current medications when pet is selected
  useEffect(() => {
    if (selectedPet) {
      const petData = pets.find(pet => pet._id === selectedPet);
      setSelectedPetData(petData);
      fetchCurrentMedications(selectedPet);
    } else {
      setCurrentMedications([]);
      setResults(null);
      setShowResults(false);
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

  const fetchCurrentMedications = async (petId) => {
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
      }
    } catch (error) {
      console.error('Error fetching current medications:', error);
      toast.error('Could not load current medications');
    } finally {
      setLoadingMedications(false);
    }
  };

  const handleMedicationSelect = (medicationName) => {
    setNewMedication({ ...newMedication, name: medicationName });
  };

  const handleDosageSelect = (dosage) => {
    setNewMedication({ ...newMedication, dosage: dosage });
  };

  const checkInteractions = async () => {
    if (!selectedPet) {
      toast.error('Please select a pet');
      return;
    }

    if (!newMedication.name.trim()) {
      toast.error('Please enter the medication you want to check');
      return;
    }

    if (currentMedications.length === 0) {
      toast.error('This pet has no current medications to check against. Add some medications to their profile first.');
      return;
    }

    setLoading(true);
    try {
      // Combine current medications with the new one
      const allMedications = [
        ...currentMedications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency
        })),
        newMedication
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
        setResults(data.data);
        setShowResults(true);
        toast.success('Interaction check completed');
      } else {
        toast.error(data.message || 'Error checking interactions');
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
      toast.error('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  // Clean and parse AI response data
  const cleanAiResponse = (rawData) => {
    if (!rawData) return null;

    const cleaned = {
      analysis: '',
      riskLevel: '',
      recommendations: [],
      alternatives: [],
      warnings: [],
      sources: []
    };

    // Clean analysis text
    if (rawData.analysis) {
      cleaned.analysis = rawData.analysis
        .replace(/^"|"$/g, '') // Remove quotes at start/end
        .replace(/\\"/g, '"') // Unescape quotes
        .replace(/\\n/g, '\n') // Convert \n to actual line breaks
        .trim();
    }

    // Clean risk level
    if (rawData.riskLevel) {
      cleaned.riskLevel = rawData.riskLevel
        .replace(/^"|"$/g, '')
        .trim();
    }

    // Clean arrays
    const cleanArray = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => 
        typeof item === 'string' 
          ? item.replace(/^"|"$/g, '').replace(/\\"/g, '"').trim()
          : String(item).trim()
      ).filter(item => item.length > 0);
    };

    cleaned.recommendations = cleanArray(rawData.recommendations);
    cleaned.alternatives = cleanArray(rawData.alternatives);
    cleaned.warnings = cleanArray(rawData.warnings);
    cleaned.sources = cleanArray(rawData.sources);

    return cleaned;
  };

  // Function to get URL for veterinary sources
  const getSourceUrl = (sourceName) => {
    const sources = {
      // Veterinary Drug Handbooks
      "Plumb's Veterinary Drug Handbook": "https://www.wiley.com/en-us/Plumb%27s+Veterinary+Drug+Handbook%2C+10th+Edition-p-9781119344551",
      "Veterinary Drug Handbook": "https://www.wiley.com/en-us/Plumb%27s+Veterinary+Drug+Handbook%2C+10th+Edition-p-9781119344551",
      "Plumb's Drug Handbook": "https://www.wiley.com/en-us/Plumb%27s+Veterinary+Drug+Handbook%2C+10th+Edition-p-9781119344551",
      
      // Veterinary Manuals
      "Merck Veterinary Manual": "https://www.merckvetmanual.com/",
      "The Merck Veterinary Manual": "https://www.merckvetmanual.com/",
      "Merck Manual": "https://www.merckvetmanual.com/",
      
      // Professional Organizations
      "American Veterinary Medical Association": "https://www.avma.org/",
      "AVMA": "https://www.avma.org/",
      "American Association of Feline Practitioners": "https://catvets.com/",
      "AAFP": "https://catvets.com/",
      "American Animal Hospital Association": "https://www.aaha.org/",
      "AAHA": "https://www.aaha.org/",
      "World Small Animal Veterinary Association": "https://wsava.org/",
      "WSAVA": "https://wsava.org/",
      
      // FDA Resources
      "FDA Center for Veterinary Medicine": "https://www.fda.gov/animal-veterinary",
      "FDA CVM": "https://www.fda.gov/animal-veterinary",
      "Center for Veterinary Medicine": "https://www.fda.gov/animal-veterinary",
      
      // Veterinary Journals
      "Journal of Veterinary Internal Medicine": "https://onlinelibrary.wiley.com/journal/19391676",
      "JVIM": "https://onlinelibrary.wiley.com/journal/19391676",
      "Veterinary Clinics of North America": "https://www.vetsmall.theclinics.com/",
      "Journal of the American Veterinary Medical Association": "https://avmajournals.avma.org/loi/javma",
      "JAVMA": "https://avmajournals.avma.org/loi/javma",
      "Veterinary Therapeutics": "https://www.vetlearn.com/",
      
      // Specialized Resources
      "Veterinary Information Network": "https://www.vin.com/",
      "VIN": "https://www.vin.com/",
      "Veterinary Partner": "https://veterinarypartner.vin.com/",
      "Pet Poison Helpline": "https://www.petpoisonhelpline.com/",
      "ASPCA Animal Poison Control": "https://www.aspca.org/pet-care/animal-poison-control",
      
      // Pharmacology References
      "Veterinary Pharmacology and Therapeutics": "https://www.wiley.com/en-us/Veterinary+Pharmacology+and+Therapeutics%2C+10th+Edition-p-9781119222088",
      "Small Animal Clinical Pharmacology": "https://www.elsevier.com/books/small-animal-clinical-pharmacology/papich/978-0-7020-2882-2",
      "Handbook of Veterinary Pharmacology": "https://www.crcpress.com/Handbook-of-Veterinary-Pharmacology/Hsu/p/book/9781138197824",
      
      // Species-Specific Resources
      "Feline Medicine and Surgery": "https://www.elsevier.com/books/feline-medicine-and-surgery/little/978-0-7020-5275-9",
      "Canine and Feline Medicine": "https://www.elsevier.com/books/textbook-of-veterinary-internal-medicine/ettinger/978-0-323-31211-0",
      "Exotic Animal Medicine": "https://www.elsevier.com/books/maders-reptile-and-amphibian-medicine-and-surgery/divers/978-0-323-48253-0"
    };

    // Try exact match first
    if (sources[sourceName]) {
      return sources[sourceName];
    }

    // Try partial matches
    for (const [key, url] of Object.entries(sources)) {
      if (sourceName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(sourceName.toLowerCase())) {
        return url;
      }
    }

    // Default to veterinary medicine search if no match found
    const searchQuery = encodeURIComponent(sourceName + " veterinary medicine");
    return `https://scholar.google.com/scholar?q=${searchQuery}`;
  };

  const checkAiInteractions = async () => {
    if (!selectedPet) {
      toast.error('Please select a pet');
      return;
    }

    if (!newMedication.name.trim()) {
      toast.error('Please enter the medication you want to check');
      return;
    }

    if (currentMedications.length === 0) {
      toast.error('This pet has no current medications to check against. Add some medications to their profile first.');
      return;
    }

    setAiLoading(true);
    try {
      // Combine current medications with the new one
      const allMedications = [
        ...currentMedications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency
        })),
        newMedication
      ];

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://pawrx-production-5c30.up.railway.app'}/api/interactions/ai-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          petId: selectedPet,
          medications: allMedications,
          query: `Analyze medication safety for ${selectedPetData?.name}, a ${selectedPetData?.species}. Check for interactions, dosage considerations, and species-specific risks.`
        })
      });

      const data = await response.json();
      if (data.success) {
        // Clean the AI response before setting it
        const cleanedResults = cleanAiResponse(data.data);
        setAiResults(cleanedResults);
        setShowAiResults(true);
        toast.success('AI analysis completed');
      } else {
        toast.error(data.message || 'Error running AI analysis');
      }
    } catch (error) {
      console.error('Error running AI analysis:', error);
      toast.error('AI service unavailable - please try again later');
    } finally {
      setAiLoading(false);
    }
  };

  const getSafetyStatus = () => {
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

  const getSafetyMessage = () => {
    const status = getSafetyStatus();
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

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'medium': return <InformationCircleIcon className="h-5 w-5 text-yellow-600" />;
      case 'high': return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      case 'critical': return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default: return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Is this medication safe with my pet's current medications?</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select your pet to see their current medications, then check if a new medication is safe to add.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            <strong>⚡ Smart & Easy:</strong> Automatically loads your pet's profile • Checks against current medications • Instant safety results
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Pet Selection */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Step 1: Choose Your Pet</h2>
            
            <div className="text-center">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Which pet do you want to check medications for?
              </label>
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="max-w-md mx-auto w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="">Choose your pet...</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species} - {pet.breed})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Current Medications Display */}
        {selectedPet && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                {selectedPetData?.name}'s Current Medications
              </h2>
              
              {loadingMedications ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading current medications...</p>
                </div>
              ) : currentMedications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentMedications.map((medication, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="font-semibold text-gray-900">{medication.name}</h3>
                      {medication.brandName && (
                        <p className="text-sm text-gray-600">Brand: {medication.brandName}</p>
                      )}
                      <p className="text-sm text-gray-600">Dose: {medication.dosage}</p>
                      <p className="text-sm text-gray-600">Frequency: {medication.frequency}</p>
                      {medication.startDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          <ClockIcon className="h-4 w-4 inline mr-1" />
                          Started: {new Date(medication.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Current Medications</h3>
                    <p className="text-yellow-700 mb-4">
                      {selectedPetData?.name} doesn't have any medications in their profile yet.
                    </p>
                    <p className="text-sm text-yellow-600">
                      Add medications to their profile in the "Medications" section first, then come back to check interactions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Medication Input */}
        {selectedPet && currentMedications.length > 0 && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Step 2: What new medication do you want to check?
              </h2>
              
              <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication Name *
                    </label>
                    <MedicationAutocomplete
                      value={newMedication.name}
                      onChange={handleMedicationSelect}
                      onDosageSelect={handleDosageSelect}
                      species={selectedPetData?.species || 'all'}
                      placeholder="Type medication name (e.g., Carprofen, Gabapentin, Ivermectin...)"
                      className="text-lg p-4"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 25mg, 50mg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select frequency...</option>
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Every 8 hours">Every 8 hours</option>
                        <option value="Every 12 hours">Every 12 hours</option>
                        <option value="As needed">As needed</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={checkInteractions}
                      disabled={loading || aiLoading || !newMedication.name.trim()}
                      className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Checking Interactions...
                        </>
                      ) : (
                        <>
                          <MagnifyingGlassIcon className="h-5 w-5 mr-3" />
                          Quick Check
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={checkAiInteractions}
                      disabled={loading || aiLoading || !newMedication.name.trim()}
                      className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          AI Analyzing...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          AI Analysis
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 max-w-2xl mx-auto">
                    <p><strong>Quick Check:</strong> Fast rule-based analysis using our database</p>
                    <p><strong>AI Analysis:</strong> Advanced AI-powered analysis with personalized recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && results && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Interaction Check Results
              </h2>
              
              {/* Safety Summary */}
              <div className={`p-6 rounded-lg border-2 mb-8 ${getSafetyMessage().color}`}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{getSafetyMessage().title}</h3>
                  <p className="text-lg">{getSafetyMessage().message}</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-6">
                {/* Toxic Medications */}
                {results.toxicMedications && results.toxicMedications.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Toxic Medications for {selectedPetData?.species}s
                    </h3>
                    <div className="space-y-3">
                      {results.toxicMedications.map((toxic, index) => (
                        <div key={index} className="bg-white p-4 rounded border border-red-200">
                          <h4 className="font-semibold text-red-900">{toxic.medication}</h4>
                          <p className="text-red-700 mt-1">{toxic.reason}</p>
                          <p className="text-sm text-red-600 mt-2">{toxic.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drug Interactions */}
                {results.drugInteractions && results.drugInteractions.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                      Drug Interactions Found ({results.drugInteractions.length})
                    </h3>
                    <div className="space-y-4">
                      {results.drugInteractions.map((interaction, index) => (
                        <div key={index} className={`p-4 rounded border-2 ${getRiskColor(interaction.riskLevel)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                {getRiskIcon(interaction.riskLevel)}
                                <h4 className="font-semibold ml-2">
                                  {interaction.medication1} + {interaction.medication2}
                                </h4>
                                <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded ${getRiskColor(interaction.riskLevel)}`}>
                                  {interaction.riskLevel} Risk
                                </span>
                              </div>
                              <p className="text-sm mb-2">{interaction.description}</p>
                              <p className="text-sm font-medium">Recommendation: {interaction.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Interactions Found */}
                {(!results.drugInteractions || results.drugInteractions.length === 0) && 
                 (!results.toxicMedications || results.toxicMedications.length === 0) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">No Interactions Detected</h3>
                    <p className="text-green-700">
                      The new medication appears safe to give with {selectedPetData?.name}'s current medications.
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Always consult with your veterinarian before starting any new medication.
                    </p>
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              {results.analysis && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">AI Analysis & Recommendations</h3>
                  <p className="text-blue-700 whitespace-pre-wrap">{results.analysis}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">⚠️ Important Disclaimer</h3>
                <p className="text-sm text-gray-700">
                  This tool provides general guidance based on known drug interactions and should not replace professional veterinary advice. 
                  Always consult with your veterinarian before starting, stopping, or changing any medications for your pet. 
                  In case of emergency, contact your veterinarian or emergency animal hospital immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Results */}
        {showAiResults && aiResults && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg rounded-xl border border-purple-200">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center">
                <svg className="h-6 w-6 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI-Powered Analysis Results
              </h2>
              
              {/* AI Analysis Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                {/* Main Analysis */}
                {aiResults.analysis && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Analysis</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-gray-700 leading-relaxed">
                        {aiResults.analysis.split('\n').filter(line => line.trim()).map((paragraph, index) => (
                          <p key={index} className="mb-3 last:mb-0">
                            {paragraph.trim()}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Level */}
                {aiResults.riskLevel && (
                  <div className="mb-6">
                    <div className={`p-4 rounded-lg border-2 ${getRiskColor(aiResults.riskLevel)}`}>
                      <div className="flex items-center">
                        {getRiskIcon(aiResults.riskLevel)}
                        <span className="ml-2 font-semibold text-lg">
                          Risk Level: {aiResults.riskLevel.charAt(0).toUpperCase() + aiResults.riskLevel.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                {aiResults.recommendations && aiResults.recommendations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Recommendations</h3>
                    <div className="space-y-3">
                      {aiResults.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <svg className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternatives */}
                {aiResults.alternatives && aiResults.alternatives.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🔄 Alternatives</h3>
                    <div className="space-y-3">
                      {aiResults.alternatives.map((alt, index) => (
                        <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                          <svg className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <p className="text-gray-700">{alt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {aiResults.warnings && aiResults.warnings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Warnings</h3>
                    <div className="space-y-3">
                      {aiResults.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                          <svg className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-gray-700">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {aiResults.sources && aiResults.sources.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Sources & References</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-3">
                        The following sources were referenced in this analysis. Click to explore these for further information:
                      </p>
                      <div className="space-y-2">
                        {aiResults.sources.map((source, index) => (
                          <div key={index} className="flex items-start p-2 bg-white rounded border hover:bg-blue-50 transition-colors">
                            <svg className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c1.746 0-3.332.477 4.5 1.253" />
                            </svg>
                            <a 
                              href={getSourceUrl(source)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
                            >
                              {source}
                              <svg className="h-3 w-3 ml-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Disclaimer */}
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">🤖 AI Analysis Notice</h3>
                <p className="text-sm text-purple-700">
                  This analysis is generated by artificial intelligence and provides additional insights beyond our standard database check. 
                  While our AI considers your pet's specific characteristics, this should complement, not replace, professional veterinary judgment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionChecker; 