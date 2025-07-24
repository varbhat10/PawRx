import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  ClockIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: HeartIcon,
      title: "Medication Management",
      description: "Track current medications, dosages, frequencies, and schedules for all your pets in one secure place."
    },
    {
      icon: ExclamationTriangleIcon,
      title: "Drug Interaction Checker",
      description: "Instantly check for dangerous drug interactions and receive safety alerts before administering medications."
    },
    {
      icon: ShieldCheckIcon,
      title: "Adverse Reaction Tracking",
      description: "Log and monitor adverse reactions with detailed symptom tracking and severity assessment."
    },
    {
      icon: CalendarDaysIcon,
      title: "Appointment Scheduling",
      description: "Schedule and track veterinary appointments with automated reminders and visit history."
    },
    {
      icon: DocumentTextIcon,
      title: "Medical Records",
      description: "Maintain comprehensive medical histories, vaccination records, and health documentation."
    },
    {
      icon: ChartBarIcon,
      title: "Health Analytics",
      description: "Monitor your pet's health trends with clear and digestable visuals."
    }
  ];

  const benefits = [
    {
      icon: HeartIcon,
      title: "Better Pet Health",
      description: "Prevent medication errors and ensure optimal care for your furry family members."
    },
    {
      icon: ClockIcon,
      title: "Save Time",
      description: "Quick access to all pet information during vet visits and emergency situations."
    },
    {
      icon: UserGroupIcon,
      title: "Multi-Pet Support",
      description: "Manage multiple pets with individual profiles and medication schedules."
    },
    {
      icon: CheckCircleIcon,
      title: "Peace of Mind",
      description: "Know you're providing the safest, most effective care with research-backed tools."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐾</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">PawRx</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Smart Pet Medication
              <span className="text-blue-600 block">Management</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Keep your pets safe and healthy with intelligent medication tracking, drug interaction checking, 
              and comprehensive health management tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Managing Your Pet's Health
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Sign In to Existing Account
              </button>
            </div>
            
                         {/* Stats */}
             <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center">
               <div className="flex items-center space-x-2">
                 <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                 <span className="text-gray-600">Created by a Vet Technician</span>
               </div>
               <div className="flex items-center space-x-2">
                 <HeartIcon className="h-6 w-6 text-red-500" />
                 <span className="text-gray-600">Built for Pet Safety</span>
               </div>
               <div className="flex items-center space-x-2">
                 <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                 <span className="text-gray-600">100% Free</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
               Everything You Need for Pet Health Management
             </h2>
             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
               Comprehensive tools designed by a <a href="https://www.linkedin.com/in/varun-bhat-osu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline font-medium">Veterinary Technician</a> who understands the critical importance of medication safety in animal care.
             </p>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

             {/* Creator Credibility Section */}
       <section className="py-16 bg-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
             <div className="text-center">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheckIcon className="h-10 w-10 text-green-600" />
               </div>
               <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                 Created by a Fear Free Certified Veterinary Technician
               </h2>
               <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                 PawRx was developed by <a href="https://www.linkedin.com/in/varun-bhat-osu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline font-semibold">Varun Bhat</a>, a Fear Free Certified Veterinary Technician with hands-on experience in animal care and medication management. A solution born from real veterinary practice and a personal understanding of pet safety challenges.
               </p>
               <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-500">
                 <div className="flex items-center space-x-2">
                   <CheckCircleIcon className="h-5 w-5 text-green-600" />
                   <span>Fear Free Certified Veterinary Technician</span>
                 </div>
                 <div className="flex items-center space-x-2">
                   <CheckCircleIcon className="h-5 w-5 text-green-600" />
                   <span>Real Clinical Experience</span>
                 </div>
                 <div className="flex items-center space-x-2">
                   <CheckCircleIcon className="h-5 w-5 text-green-600" />
                   <span>Medication Safety Expertise</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </section>

       {/* Benefits Section */}
       <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Pet Owners Choose PawRx
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of responsible pet owners who trust PawRx for their pet's medication management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How PawRx Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Set up your pet's profile and start managing their health in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Pet Profiles</h3>
              <p className="text-gray-600">Add your pets with their basic information, medical history, and current conditions.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Medications</h3>
              <p className="text-gray-600">Input current medications, dosages, and schedules. Check for interactions automatically.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitor & Track</h3>
              <p className="text-gray-600">Track appointments, monitor reactions, and maintain comprehensive health records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the PawRx community and take control of your pet's health today. It's completely free and always will be.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started Now - It's Free!
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Already Have an Account?
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>✅ No Fees • ✅ Quick Setup • ✅ Constant Updates</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                         <div className="col-span-1 md:col-span-2">
               <div className="flex items-center space-x-3 mb-4">
                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold">🐾</span>
                 </div>
                 <span className="text-xl font-bold">PawRx</span>
               </div>
               <p className="text-gray-400 mb-4">
                 Smart pet medication management created by <a href="https://www.linkedin.com/in/varun-bhat-osu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Varun Bhat, Veterinary Technician</a>. Built with real veterinary experience to keep your pets safe and healthy.
               </p>
               <p className="text-sm text-gray-500">
                 © 2025 Varun Bhat. All rights reserved.
               </p>
             </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Get Started</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/contact-support')} className="hover:text-white transition-colors">Contact Support</button></li>
                <li><span className="text-gray-500">Help Documentation</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 