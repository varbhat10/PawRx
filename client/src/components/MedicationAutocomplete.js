import React, { useState, useEffect, useRef } from 'react';
import { searchMedications, getCommonDoses, submitMedicationRequest } from '../data/medications';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const MedicationAutocomplete = ({ 
  value = '', 
  onChange, 
  onDosageSelect,
  species = 'all',
  placeholder = 'Search medications...',
  className = '',
  disabled = false
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [commonDoses, setCommonDoses] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    medicationName: '',
    brandName: '',
    category: '',
    commonDoses: '',
    species: species,
    reason: ''
  });
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Search for medications when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const results = searchMedications(query, species);
      setSuggestions(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, species]);

  // Get common doses when medication is selected
  useEffect(() => {
    if (value) {
      const doses = getCommonDoses(value);
      setCommonDoses(doses);
    } else {
      setCommonDoses([]);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (medication) => {
    setQuery(medication.name);
    onChange(medication.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Auto-focus on next field if available
    const form = inputRef.current?.closest('form');
    if (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      const currentIndex = Array.from(inputs).indexOf(inputRef.current);
      if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  };

  const handleDosageClick = (dosage) => {
    if (onDosageSelect) {
      onDosageSelect(dosage);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const clearInput = () => {
    setQuery('');
    onChange('');
    setShowSuggestions(false);
    setCommonDoses([]);
    inputRef.current?.focus();
  };

  const handleRequestMedication = () => {
    setRequestForm({
      ...requestForm,
      medicationName: query,
      species: species
    });
    setShowRequestModal(true);
    setShowSuggestions(false);
  };

  const submitRequest = async () => {
    try {
      await submitMedicationRequest(requestForm);
      toast.success('Medication request submitted! We\'ll review it and add it to our database.');
      setShowRequestModal(false);
      setRequestForm({
        medicationName: '',
        brandName: '',
        category: '',
        commonDoses: '',
        species: species,
        reason: ''
      });
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        />
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((medication, index) => (
            <div
              key={`${medication.name}-${index}`}
              onClick={() => handleSuggestionClick(medication)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {medication.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {medication.category}
                  </div>
                </div>
                <div className="text-xs text-blue-600 ml-2">
                  Click to select
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Common Doses */}
      {commonDoses.length > 0 && onDosageSelect && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Common doses:</div>
          <div className="flex flex-wrap gap-1">
            {commonDoses.map((dose, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDosageClick(dose)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dose}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No medications found matching "{query}"
            <div className="text-xs mt-1">
              Try searching by brand name or category
            </div>
            <button
              type="button"
              onClick={handleRequestMedication}
              className="mt-2 inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Request this medication
            </button>
          </div>
        </div>
      )}

      {/* Request Medication Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Request New Medication</h3>
              <button 
                onClick={() => setShowRequestModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={requestForm.medicationName}
                  onChange={(e) => setRequestForm({...requestForm, medicationName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name (Optional)
                </label>
                <input
                  type="text"
                  value={requestForm.brandName}
                  onChange={(e) => setRequestForm({...requestForm, brandName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Rimadyl (if different from generic name)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only include if this medication is primarily known by its brand name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={requestForm.category}
                  onChange={(e) => setRequestForm({...requestForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category...</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Anti-inflammatory">Anti-inflammatory</option>
                  <option value="Pain">Pain Management</option>
                  <option value="Heart">Heart Medication</option>
                  <option value="Seizure">Seizure Medication</option>
                  <option value="Steroid">Steroid</option>
                  <option value="Allergy">Allergy Treatment</option>
                  <option value="Gastrointestinal">Gastrointestinal</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Parasite Prevention">Parasite Prevention</option>
                  <option value="Supplement">Supplement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Common Doses
                </label>
                <input
                  type="text"
                  value={requestForm.commonDoses}
                  onChange={(e) => setRequestForm({...requestForm, commonDoses: e.target.value})}
                  placeholder="e.g., 5mg, 10mg, 25mg"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Request
                </label>
                <textarea
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                  placeholder="Why should this medication be added? (e.g., commonly prescribed by my vet)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationAutocomplete; 