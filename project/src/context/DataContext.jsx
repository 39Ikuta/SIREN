import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DataContext = createContext(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockSimCards = [
  {
    id: '1',
    phoneNumber: '+63-912-000-0001',
    alias: 'Juan Dela Cruz',
    imsi: '310260000000001',
    imei: '860000000000001',
    status: 'active',
    userId: '2',
    createdAt: '2024-01-01T00:00:00Z',
    remarks: 'Primary device for field operations',
    lastLocation: null // Will be populated by API
  },
  {
    id: '2',
    phoneNumber: '+63-917-000-0002',
    alias: 'Maria Santos',
    imsi: '310260000000002',
    imei: '860000000000002',
    status: 'tracking',
    userId: '3',
    createdAt: '2024-01-02T00:00:00Z',
    remarks: 'Backup device',
    lastLocation: null // Will be populated by API
  },
  {
    id: '3',
    phoneNumber: '+63-915-000-0003',
    alias: 'Carlos Reyes',
    imsi: '310260000000003',
    imei: '860000000000003',
    status: 'active',
    userId: '1',
    createdAt: '2024-01-03T00:00:00Z',
    remarks: 'Admin test device',
    lastLocation: null // Will be populated by API
  }
];

const mockAlerts = [
  {
    id: '1',
    type: 'success',
    message: 'SIM +1-555-0001 location updated successfully',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    simId: '1'
  },
  {
    id: '2',
    type: 'warning',
    message: 'SIM +1-555-0002 has been offline for 2 hours',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    simId: '2'
  },
  {
    id: '3',
    type: 'info',
    message: 'New tracking request initiated',
    timestamp: new Date(Date.now() - 900000).toISOString(),
  }
];

export const DataProvider = ({ children }) => {
  const [simCards, setSimCards] = useState(mockSimCards);
  const [locations, setLocations] = useState([]);
  const [trackingRequests, setTrackingRequests] = useState([]);
  const refreshIntervalRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
  const REFRESH_INTERVAL = 30000; // 30 seconds

  // Fetch randomized locations from API
  const fetchRandomLocations = async () => {
    try {
      const url = `${API_BASE_URL}/locations`;
      console.log('Fetching random locations from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Received locations from API:', data);
      
      if (data.success && data.locations) {
        // Update locations state
        setLocations(prev => {
          const newLocations = [...prev, ...data.locations];
          // Keep only last 100 locations to prevent memory issues
          return newLocations.slice(-100);
        });
        
        // Update SIM cards with new locations
        setSimCards(prev => prev.map(sim => {
          const locationUpdate = data.locations.find(loc => loc.simId === sim.id);
          if (locationUpdate) {
            console.log(`Updating SIM ${sim.id} with location:`, locationUpdate);
            return {
              ...sim,
              lastLocation: {
                id: locationUpdate.id,
                simId: locationUpdate.simId,
                latitude: locationUpdate.latitude,
                longitude: locationUpdate.longitude,
                timestamp: locationUpdate.timestamp,
                address: locationUpdate.address || 'Random Location in Luzon'
              },
              status: sim.status === 'tracking' ? 'tracking' : 'active'
            };
          }
          return sim;
        }));
      }
    } catch (error) {
      console.error('❌ Error fetching random locations:', error);
      console.error('Make sure the API server is running on port 3001. Run: npm run api');
      // Silently fail - don't break the app if API is unavailable
    }
  };

  // Fetch locations on mount only (no auto-refresh)
  useEffect(() => {
    // Fetch immediately on mount
    fetchRandomLocations();
    
    // Auto-refresh disabled - locations will be updated on user click instead
    // refreshIntervalRef.current = setInterval(() => {
    //   fetchRandomLocations();
    // }, REFRESH_INTERVAL);
    
    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const dashboardStats = {
    totalSims: simCards.length,
    activeSims: simCards.filter(sim => sim.status === 'active').length,
    trackingSims: simCards.filter(sim => sim.status === 'tracking').length,
    totalUsers: 3, // Mock value
    recentAlerts: mockAlerts
  };

  const addSimCard = (sim) => {
    const newSim = {
      ...sim,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setSimCards(prev => [...prev, newSim]);
  };

  const updateSimCard = (id, updates) => {
    setSimCards(prev => prev.map(sim => 
      sim.id === id ? { ...sim, ...updates } : sim
    ));
  };

  const deleteSimCard = (id) => {
    setSimCards(prev => prev.filter(sim => sim.id !== id));
  };

  const addLocation = (location) => {
    const newLocation = {
      ...location,
      id: Date.now().toString(),
    };
    setLocations(prev => [...prev, newLocation]);
    
    // Update SIM card's last location
    updateSimCard(location.simId, { 
      lastLocation: newLocation,
      status: 'active'
    });
  };

  const startTracking = (simId, userId) => {
    const newRequest = {
      id: Date.now().toString(),
      simId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      requestedBy: userId,
    };
    setTrackingRequests(prev => [...prev, newRequest]);
    updateSimCard(simId, { status: 'tracking' });
  };

  return (
    <DataContext.Provider value={{
      simCards,
      locations,
      trackingRequests,
      dashboardStats,
      addSimCard,
      updateSimCard,
      deleteSimCard,
      addLocation,
      startTracking,
      refreshLocations: fetchRandomLocations,
    }}>
      {children}
    </DataContext.Provider>
  );
};