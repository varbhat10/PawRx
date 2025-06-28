import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../Navbar';

// Mock the auth context
const mockUser = {
  _id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
};

const MockAuthProvider = ({ children, user = null }) => {
  const mockContext = {
    user,
    logout: jest.fn(),
    loading: false
  };

  return (
    <AuthProvider value={mockContext}>
      {children}
    </AuthProvider>
  );
};

const renderNavbar = (user = mockUser) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider user={user}>
        <Navbar />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  test('renders PawRx logo', () => {
    renderNavbar();
    expect(screen.getByText(/PawRX/i)).toBeInTheDocument();
  });

  test('displays user name when logged in', () => {
    renderNavbar(mockUser);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('shows navigation links for authenticated user', () => {
    renderNavbar(mockUser);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Medications')).toBeInTheDocument();
    expect(screen.getByText('Interaction Checker')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  test('mobile menu toggle works', () => {
    renderNavbar(mockUser);
    
    // Find mobile menu button
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    
    // Mobile menu should not be visible initially
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should now be visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  test('logout button calls logout function', () => {
    const mockLogout = jest.fn();
    
    render(
      <BrowserRouter>
        <AuthProvider value={{ user: mockUser, logout: mockLogout, loading: false }}>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
}); 