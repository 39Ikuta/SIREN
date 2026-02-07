import React, { useMemo, useState } from 'react';
import { MapPin, Navigation, Layers, Satellite } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import DashboardMap from '../Dashboard/DashboardMap';

const MapPage = () => {
  const { simCards, refreshLocations } = useData();
  const { user } = useAuth();
  const [focusedSim, setFocusedSim] = useState(null);
  const [mapType, setMapType] = useState('standard'); // 'standard' or 'satellite'

  // Filter SIM cards based on user role
  const userSimCards = user?.role === 'admin' 
    ? simCards 
    : simCards.filter(sim => sim.userId === user?.id);

  const simsWithLocation = userSimCards.filter(sim => sim.lastLocation);

  // Extract map points from SIM card locations (same as Dashboard)
  const mapPoints = useMemo(() =>
    userSimCards
      .filter(sim => sim.lastLocation && sim.lastLocation.latitude && sim.lastLocation.longitude)
      .map(sim => ({
        lat: sim.lastLocation.latitude,
        lng: sim.lastLocation.longitude,
        simId: sim.id,
        alias: sim.alias,
      })),
    [userSimCards]
  );

  // Find the focused location from the focusedSim
  const focusedLocation = focusedSim && focusedSim.lastLocation && focusedSim.lastLocation.latitude && focusedSim.lastLocation.longitude
    ? {
        lat: focusedSim.lastLocation.latitude,
        lng: focusedSim.lastLocation.longitude,
      }
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Map</h1>
          <p className="text-gray-400">Real-time location tracking of SIM cards</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setMapType('standard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mapType === 'standard' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Standard</span>
          </button>
          <button 
            onClick={() => setMapType('satellite')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mapType === 'satellite' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Satellite className="h-4 w-4" />
            <span>Satellite</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="h-96 lg:h-[500px] bg-gray-700 rounded-lg overflow-hidden">
            <DashboardMap points={mapPoints} focusedLocation={focusedLocation} mapType={mapType} />
          </div>
        </div>
      </div>

      {/* Location Summary */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Location Summary</h3>
          <p className="text-gray-400 text-sm">
            {simsWithLocation.length} of {userSimCards.length} SIM cards have location data
          </p>
        </div>
        <div className="p-6">
          {simsWithLocation.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simsWithLocation.map((sim) => (
                <div 
                  key={sim.id} 
                  onClick={() => {
                    // Fetch new random locations for all SIM cards
                    refreshLocations();
                    // Set the clicked SIM as focused (will show red pin)
                    setFocusedSim(sim);
                  }}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        sim.status === 'active' ? 'bg-green-500' :
                        sim.status === 'tracking' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                      <h4 className="font-medium text-white">{sim.alias}</h4>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{sim.phoneNumber}</span>
                  </div>
                  
                  {sim.lastLocation && (
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                        <span>{sim.lastLocation.address || 'Location available'}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        <div>Lat: {sim.lastLocation.latitude.toFixed(6)}</div>
                        <div>Lng: {sim.lastLocation.longitude.toFixed(6)}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(sim.lastLocation.timestamp).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Navigation className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Location Data</h3>
              <p className="text-gray-500">Start tracking SIM cards to see their locations on the map</p>
            </div>
          )}
        </div>
      </div>

      {/* All Numbers and Aliases Summary */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">All SIM Cards Summary</h3>
          <p className="text-gray-400 text-sm">Complete list of all managed SIM cards</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userSimCards.map((sim) => (
              <div key={sim.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{sim.alias}</h4>
                  <span className={`w-2 h-2 rounded-full ${
                    sim.status === 'active' ? 'bg-green-500' :
                    sim.status === 'tracking' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                <p className="text-gray-300 text-sm font-mono">{sim.phoneNumber}</p>
                <div className="mt-2 text-xs text-gray-400">
                  <div>IMSI: {sim.imsi}</div>
                  <div>Status: <span className="capitalize">{sim.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;