import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  HeartIcon,
  CalendarDaysIcon,
  EllipsisVerticalIcon,
  ArrowRightIcon,
  ChartBarIcon,
  PencilIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import PhotoUpload from '../components/PhotoUpload';

// Calendar Module Component
const CalendarModule = ({ pets }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // Get all appointments from all pets
  useEffect(() => {
    const allAppointments = [];
    pets.forEach(pet => {
      if (pet.appointments) {
        pet.appointments.forEach(apt => {
          allAppointments.push({
            ...apt,
            petId: pet._id,
            petName: pet.name,
            petPhoto: pet.photo
          });
        });
      }
    });
    setAppointments(allAppointments);
  }, [pets]);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const hasAppointment = (date) => {
    return appointments.some(apt => {
      // Only count scheduled appointments, not cancelled ones
      if (apt.status === 'cancelled') return false;
      
      const aptDate = new Date(apt.date);
      // Use same date comparison as getDateAppointments
      return aptDate.getFullYear() === date.getFullYear() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getDate() === date.getDate();
    });
  };

  const getDateAppointments = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      // Compare date parts separately to avoid timezone issues
      return aptDate.getFullYear() === date.getFullYear() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getDate() === date.getDate();
    });
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth;
  };

  const handleDateClick = (date) => {
    if (date < today) return; // Can't schedule in the past
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= today && apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const pastAppointments = appointments
    .filter(apt => new Date(apt.date) < today || apt.status === 'completed' || apt.status === 'cancelled')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const [showPastAppointments, setShowPastAppointments] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Calendar & Appointments</h3>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Grid */}
        <div>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h4 className="text-lg font-medium text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const hasApt = hasAppointment(date);
              const dateAppointments = getDateAppointments(date);
              const isPast = date < today;
              const currentMonthDay = isCurrentMonth(date);
              const todayDate = isToday(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isPast}
                  className={`
                    relative aspect-square p-1 text-sm transition-colors rounded-lg
                    ${!currentMonthDay ? 'text-gray-300' : 'text-gray-900'}
                    ${todayDate ? 'bg-blue-100 border-2 border-blue-500 font-bold' : ''}
                    ${hasApt && currentMonthDay ? 'bg-green-100' : ''}
                    ${isPast ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 cursor-pointer'}
                  `}
                >
                  <span className="block">{date.getDate()}</span>
                  {hasApt && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h4>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarDaysIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No upcoming appointments</p>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Schedule your first appointment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {apt.petPhoto ? (
                    <img
                      src={apt.petPhoto}
                      alt={apt.petName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">🐾</span>
                    </div>
                  )}
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{apt.petName}</p>
                    <p className="text-xs text-gray-600">{apt.type || 'Check-up'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(apt.date + (apt.date.includes('T') ? '' : 'T12:00:00')).toLocaleDateString()} at {apt.time || '10:00 AM'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {apt.status || 'Scheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Appointments - Collapsible */}
          {pastAppointments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowPastAppointments(!showPastAppointments)}
                className="flex items-center justify-between w-full text-left"
              >
                <h5 className="text-sm font-medium text-gray-700">
                  Past Appointments ({pastAppointments.length})
                </h5>
                <ChevronDownIcon 
                  className={`h-4 w-4 text-gray-500 transform transition-transform ${
                    showPastAppointments ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {showPastAppointments && (
                <div className="mt-3 max-h-60 overflow-y-auto space-y-2 pr-2" style={{scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6'}}>
                  {pastAppointments.map((apt, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg opacity-75">
                      {apt.petPhoto ? (
                        <img
                          src={apt.petPhoto}
                          alt={apt.petName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">🐾</span>
                        </div>
                      )}
                      <div className="ml-2 flex-1">
                        <p className="text-xs font-medium text-gray-700">{apt.petName}</p>
                        <p className="text-xs text-gray-500">{apt.type || 'Check-up'}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(apt.date + (apt.date.includes('T') ? '' : 'T12:00:00')).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status || 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          selectedDate={selectedDate}
          pets={pets}
          onSuccess={() => {
            // Refresh pets data to get updated appointments
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

// Schedule Appointment Modal
const ScheduleModal = ({ onClose, selectedDate, pets, onSuccess }) => {
  const [formData, setFormData] = useState({
    petId: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    time: '10:00',
    type: 'check-up',
    veterinarian: '',
    clinic: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create date that won't shift when stored as UTC
      const localDate = new Date(formData.date + 'T12:00:00');
      // Adjust for timezone offset to keep the same date when stored as UTC
      const timezoneOffset = localDate.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(localDate.getTime() + timezoneOffset);
      
      const appointmentData = {
        date: adjustedDate.toISOString(),
        time: formData.time,
        type: formData.type,
        veterinarian: formData.veterinarian,
        clinic: formData.clinic,
        notes: formData.notes,
        status: 'scheduled'
      };

      await axios.post(`/api/pets/${formData.petId}/appointments`, appointmentData);
      toast.success('Appointment scheduled successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to schedule appointment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Schedule Appointment</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.petId}
                onChange={(e) => setFormData({...formData, petId: e.target.value})}
                required
              >
                <option value="">Select a pet</option>
                {pets.map(pet => (
                  <option key={pet._id} value={pet._id}>{pet.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="check-up">Regular Check-up</option>
                <option value="vaccination">Vaccination</option>
                <option value="dental">Dental Care</option>
                <option value="surgery">Surgery</option>
                <option value="emergency">Emergency</option>
                <option value="grooming">Grooming</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Veterinarian (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.veterinarian}
                onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                placeholder="Dr. Smith (leave blank if unknown)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic/Hospital (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.clinic}
                onChange={(e) => setFormData({...formData, clinic: e.target.value})}
                placeholder="Pet Care Clinic (leave blank if unknown)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any special instructions or concerns..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  const fetchPets = useCallback(async () => {
    try {
      const response = await axios.get('/api/pets');
      setPets(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">Welcome back! Here's what's happening with your pets today.</p>
            </div>
            <button
              onClick={() => setShowAddPetModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Pet
            </button>
          </div>
        </div>

        {pets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <HeartIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">Get started by adding your first pet to begin tracking their health and medications.</p>
            <button
              onClick={() => setShowAddPetModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Pet
            </button>
          </div>
        ) : (
          <>
            {/* Large Pet Cards Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Pets</h2>
            
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pets.map((pet) => {
                  const upcomingAppts = pet.appointments?.filter(apt => {
                    const aptDate = new Date(apt.date);
                    const today = new Date();
                    return aptDate >= today && apt.status === 'scheduled';
                  }).length || 0;
                  
                  return (
                    <div key={pet._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                      
                      {/* Pet Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            {pet.photo ? (
                              <img
                                src={pet.photo}
                                alt={pet.name}
                                className="w-32 h-32 object-cover rounded-full border-4 border-gray-100"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-100">
                                <span className="text-5xl">
                                  {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐾'}
                                </span>
                              </div>
                            )}
                            <div className="ml-8">
                              <h3 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h3>
                              <p className="text-xl text-gray-600 capitalize mb-3">{pet.species} • {pet.breed}</p>
                              <div className="flex items-center text-base text-gray-500 space-x-6">
                                <span>{pet.age} {pet.ageUnit} old</span>
                                <span>•</span>
                                <span>{pet.weight} {pet.weightUnit}</span>
                                <span>•</span>
                                <span className="capitalize">{pet.sex}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            to={`/pets/${pet._id}/edit`}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit pet"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>

                      {/* Health Alerts */}
                      <div className="px-6 pb-4 flex-grow">
                        {(pet.medicalHistory?.allergies?.length > 0 || pet.medicalHistory?.chronicConditions?.length > 0) && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-red-800 mb-1">Health Alerts</h4>
                                {pet.medicalHistory.allergies?.length > 0 && (
                                  <p className="text-sm text-red-700 mb-1">
                                    <span className="font-medium">Allergies:</span> {pet.medicalHistory.allergies.join(', ')}
                                  </p>
                                )}
                                {pet.medicalHistory.chronicConditions?.length > 0 && (
                                  <p className="text-sm text-red-700">
                                    <span className="font-medium">Conditions:</span> {pet.medicalHistory.chronicConditions.join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Footer */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 mt-auto">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Last updated {new Date(pet.updatedAt).toLocaleDateString()}
                          </div>
                          <Link
                            to={`/pet/${pet._id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            View Full Profile
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar Module */}
            <CalendarModule pets={pets} />
          </>
        )}

        {/* Add Pet Modal */}
        {showAddPetModal && (
          <AddPetModal
            onClose={() => setShowAddPetModal(false)}
            onSuccess={() => {
              fetchPets();
              setShowAddPetModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Simplified Add Pet Modal
const AddPetModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    weight: '',
    weightUnit: 'kg',
    age: '',
    ageUnit: 'years',
    sex: 'male',
    neutered: false,
    photo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pets', {
        ...formData,
        weight: parseFloat(formData.weight),
        age: parseInt(formData.age)
      });
      toast.success('Pet added successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add pet');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Pet</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.species}
                  onChange={(e) => setFormData({...formData, species: e.target.value})}
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    required
                  />
                  <select
                    className="px-3 py-2 border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    required
                  />
                  <select
                    className="px-3 py-2 border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.ageUnit}
                    onChange={(e) => setFormData({...formData, ageUnit: e.target.value})}
                  >
                    <option value="months">months</option>
                    <option value="years">years</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.sex}
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <PhotoUpload
                currentPhoto={formData.photo}
                onPhotoChange={(photo) => setFormData({...formData, photo})}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="neutered"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.neutered}
                onChange={(e) => setFormData({...formData, neutered: e.target.checked})}
              />
              <label htmlFor="neutered" className="ml-2 text-sm text-gray-700">
                Neutered/Spayed
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Pet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 