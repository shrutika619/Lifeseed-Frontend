"use client";
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Stethoscope,
  Phone,
  AlertTriangle,
  ScrollText,
  Users,
  Bell,
  User,
  ChevronLeft,
} from 'lucide-react';

// Define the structure for permission items
const initialPermissions = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { id: 'inquiry_direct', name: 'Inquiry Direct', icon: Inbox, enabled: true },
  { id: 'in_clinic', name: 'In-clinic Consultation', icon: Stethoscope, enabled: true },
  { id: 'teleconsultation', name: 'Teleconsultation', icon: Phone, enabled: true },
  { id: 'emergency', name: 'Emergency', icon: AlertTriangle, enabled: true },
  { id: 'audit_logs', name: 'Audit logs', icon: ScrollText, enabled: true },
  { id: 'team_access', name: 'Team', icon: Users, enabled: false },
];

// Reusable Toggle Switch Component
const ToggleSwitch = ({ enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      enabled ? 'bg-blue-600' : 'bg-gray-200'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const TeamRolePage = () => {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [teamMember, setTeamMember] = useState('Pranjal Tidke');
  const [isSaving, setIsSaving] = useState(false);

  // Logic to handle permission toggle
  const handleToggle = (id) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  // Logic for the Save button
  const handleSave = async () => {
    setIsSaving(true);
    
    const enabledPermissions = permissions.filter(p => p.enabled).map(p => p.name);
    
    console.log('Saving permissions for:', teamMember);
    console.log('Enabled permissions:', enabledPermissions);
    
    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Permissions saved successfully for ${teamMember}!\n\nEnabled: ${enabledPermissions.join(', ')}`);
      console.log('Save successful!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Logic for the Back button
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      console.log('No history to go back to');
      alert('Cannot navigate back - no previous page');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm md:px-6">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="p-1 text-gray-600 transition-colors duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go back"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">Update Team</h1>
        </div>

        {/* User Info and Notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer">
            <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              08
            </span>
          </div>
          <div className="w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-blue-500 cursor-pointer hover:opacity-90 transition-opacity">
            <User className="w-full h-full text-white p-1"/>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="p-4 md:p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
          {/* Team Member Input and Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
            <div className="flex-grow">
              <label htmlFor="team-member" className="block text-sm font-medium text-gray-700 mb-2">
                Team Member
              </label>
              <input
                id="team-member"
                type="text"
                value={teamMember}
                onChange={(e) => setTeamMember(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
                aria-label="Team Member Name"
                placeholder="Enter team member name"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !teamMember.trim()}
              className="px-6 py-3 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-150 shadow-md transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-w-[100px]"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Permissions</h2>
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 hover:bg-white"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${permission.enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <permission.icon 
                      className={`w-5 h-5 ${permission.enabled ? 'text-blue-600' : 'text-gray-400'}`} 
                      aria-hidden="true" 
                    />
                  </div>
                  <span className={`text-base font-medium ${permission.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
                    {permission.name}
                  </span>
                </div>
                <ToggleSwitch
                  enabled={permission.enabled}
                  onToggle={() => handleToggle(permission.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamRolePage;