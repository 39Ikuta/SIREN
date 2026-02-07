import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, Database, Smartphone } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      locationUpdates: true,
      systemMaintenance: true,
    },
    tracking: {
      autoRefresh: true,
      refreshInterval: 30,
      enableLiveTracking: true,
      highAccuracyMode: false,
    },
    security: {
      sessionTimeout: 60,
      requireStrongPassword: true,
      enableTwoFactor: false,
      auditLogging: true,
    },
    display: {
      theme: 'dark',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      mapProvider: 'google',
    }
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Configure system preferences and options</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Email Alerts</label>
              <p className="text-gray-400 text-sm">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailAlerts}
              onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">SMS Alerts</label>
              <p className="text-gray-400 text-sm">Receive critical alerts via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.smsAlerts}
              onChange={(e) => updateSetting('notifications', 'smsAlerts', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Location Updates</label>
              <p className="text-gray-400 text-sm">Get notified when SIM locations update</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.locationUpdates}
              onChange={(e) => updateSetting('notifications', 'locationUpdates', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tracking Settings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Tracking</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Auto Refresh</label>
              <p className="text-gray-400 text-sm">Automatically refresh location data</p>
            </div>
            <input
              type="checkbox"
              checked={settings.tracking.autoRefresh}
              onChange={(e) => updateSetting('tracking', 'autoRefresh', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Refresh Interval</label>
              <p className="text-gray-400 text-sm">How often to refresh data (seconds)</p>
            </div>
            <select
              value={settings.tracking.refreshInterval}
              onChange={(e) => updateSetting('tracking', 'refreshInterval', parseInt(e.target.value))}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">High Accuracy Mode</label>
              <p className="text-gray-400 text-sm">Use GPS for more accurate tracking</p>
            </div>
            <input
              type="checkbox"
              checked={settings.tracking.highAccuracyMode}
              onChange={(e) => updateSetting('tracking', 'highAccuracyMode', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Session Timeout</label>
              <p className="text-gray-400 text-sm">Auto logout after inactivity (minutes)</p>
            </div>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Audit Logging</label>
              <p className="text-gray-400 text-sm">Log all user actions for security</p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.auditLogging}
              onChange={(e) => updateSetting('security', 'auditLogging', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Display */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Display</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Timezone</label>
              <p className="text-gray-400 text-sm">Display timezone for timestamps</p>
            </div>
            <select
              value={settings.display.timezone}
              onChange={(e) => updateSetting('display', 'timezone', e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="CST">Central Time</option>
              <option value="PST">Pacific Time</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Date Format</label>
              <p className="text-gray-400 text-sm">How dates are displayed</p>
            </div>
            <select
              value={settings.display.dateFormat}
              onChange={(e) => updateSetting('display', 'dateFormat', e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Map Provider</label>
              <p className="text-gray-400 text-sm">Choose map service provider</p>
            </div>
            <select
              value={settings.display.mapProvider}
              onChange={(e) => updateSetting('display', 'mapProvider', e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="google">Google Maps</option>
              <option value="openstreet">OpenStreetMap</option>
              <option value="mapbox">Mapbox</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;