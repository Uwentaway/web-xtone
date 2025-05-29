import React from 'react';
import { Settings } from '../types';
import SettingsPanel from '../components/SettingsPanel';

interface ProfilePageProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

function ProfilePage({ settings, onSettingsChange }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and settings
            </p>
          </div>
          <div className="border-t border-gray-200">
            <SettingsPanel 
              settings={settings} 
              onSettingsChange={onSettingsChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;