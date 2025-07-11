import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

const Footer = ({ className = '', fixed = false }) => {
  const currentYear = new Date().getFullYear();
  const footerClasses = fixed 
    ? "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 sm:py-4 z-10 shadow-lg"
    : `bg-white border-t border-gray-200 py-2 sm:py-4 mt-auto ${className}`;

  return (
    <footer className={footerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Compact single line */}
        <div className="block sm:hidden text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <span>© {currentYear} PawRx</span>
            <span>•</span>
            <span>Made with</span>
            <HeartIcon className="h-3 w-3 text-red-500" />
            <span>for pets</span>
          </div>
        </div>

        {/* Desktop: Full layout */}
        <div className="hidden sm:flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* Left side - Copyright and MIT License */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-1 md:space-y-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-sm text-gray-600">
                © {currentYear} <span className="font-semibold text-gray-800">Varun Bhat</span>. All rights reserved.
              </span>
            </div>
          </div>

          {/* Center - Brand/App Info */}
          <div className="flex items-center space-x-2 text-center">
            <span className="text-lg font-bold text-blue-600">PawRx</span>
            <span className="text-sm text-gray-500">Pet Medication Management</span>
          </div>

          {/* Right side - Made with love */}
          <div className="flex items-center justify-center space-x-2 text-center">
            <span className="text-sm text-gray-600">Made with</span>
            <HeartIcon className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600">for pet health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 