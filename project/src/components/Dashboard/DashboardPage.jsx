import React, { useMemo, useState } from 'react';
import { 
  Smartphone, 
  Users, 
  Activity, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  File,
  Layers,
  Satellite
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import FocusLocation from './FocusLocation';
import DashboardMap from './DashboardMap';

const DashboardPage = () => {
  const { dashboardStats, simCards, refreshLocations } = useData();
  const { user } = useAuth();
  const [focusedSim, setFocusedSim] = useState(null);
  const [mapType, setMapType] = useState('standard'); // 'standard' or 'satellite'

  // Filter SIM cards based on user role
  const userSimCards = user?.role === 'admin' 
    ? simCards 
    : simCards.filter(sim => sim.userId === user?.id);

  const statsCards = [
    {
      title: 'Active SIMs',
      value: userSimCards.filter(sim => sim.status === 'active').length,
      icon: CheckCircle,
      color: 'bg-green-600',
      change: '+5%'
    },
    {
      title: 'Tracking',
      value: userSimCards.filter(sim => sim.status === 'tracking').length,
      icon: Activity,
      color: 'bg-orange-600',
      change: '+8%'
    },
    // Data Usage Card
    {
      title: 'Data Usage (GB)',
      value: 4.2,
      icon: File,
      color: 'bg-purple-700',
      change: ''
    },
    ...(user?.role === 'admin' ? [{
      title: 'Total Users',
      value: dashboardStats.totalUsers,
      icon: Users,
      color: 'bg-purple-600',
      change: '+2%'
    }] : [])
  ];

  // Extract heat map points from SIM card locations
  const heatMapPoints = useMemo(() =>
    userSimCards
      .filter(sim => sim.lastLocation && sim.lastLocation.latitude && sim.lastLocation.longitude)
      .map(sim => ({
        lat: sim.lastLocation.latitude,
        lng: sim.lastLocation.longitude,
        simId: sim.id,
        alias: sim.alias,
        // Optionally add weight: sim.lastLocation.weight
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900/80 rounded-xl p-6 min-h-[120px] flex items-center justify-between shadow-sm hover:shadow-lg transition-shadow border border-gray-800"
            >
              <div>
                <p className="text-gray-400 text-xs font-light tracking-wide mb-1">{stat.title}</p>
                <p className="text-3xl font-extrabold text-white mb-1">{stat.value}</p>
                {stat.change && (
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-xs font-medium">{stat.change}</span>
                  </div>
                )}
              </div>
              <div className={`${stat.color} rounded-lg p-3 flex items-center justify-center shadow-md`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SIM Cards Overview & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SIM Cards */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">SIM Cards Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userSimCards.map((sim) => (
                <div 
                  key={sim.id} 
                  onClick={() => {
                    // Fetch new random locations for all SIM cards
                    refreshLocations();
                    // Set the clicked SIM as focused (will show red pin)
                    setFocusedSim(sim);
                  }}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      sim.status === 'active' ? 'bg-green-600' :
                      sim.status === 'tracking' ? 'bg-orange-600' : 'bg-gray-600'
                    }`}>
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{sim.alias}</p>
                      <p className="text-sm text-gray-400">{sim.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sim.status === 'active' ? 'bg-green-900 text-green-200' :
                      sim.status === 'tracking' ? 'bg-orange-900 text-orange-200' :
                      'bg-gray-900 text-gray-200'
                    }`}>
                      {sim.status}
                    </span>
                    {sim.lastLocation && (
                      <MapPin className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Map */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Live Map</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setMapType('standard')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    mapType === 'standard' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Standard</span>
                </button>
                <button 
                  onClick={() => setMapType('satellite')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    mapType === 'satellite' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Satellite className="h-3.5 w-3.5" />
                  <span>Satellite</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-96 bg-gray-700 rounded-lg overflow-hidden">
              <DashboardMap points={heatMapPoints} focusedLocation={focusedLocation} mapType={mapType} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardStats.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full mt-1 ${
                    alert.type === 'success' ? 'bg-green-600' :
                    alert.type === 'warning' ? 'bg-orange-600' :
                    alert.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="h-3 w-3 text-white" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Tracking Service</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Gateway</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-400 text-sm">Maintenance</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Map Service</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">SIM Cards Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSimCards.map((sim) => (
              <div
                key={sim.id}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => setFocusedSim(sim)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{sim.alias}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sim.status === 'active' ? 'bg-green-900 text-green-200' :
                    sim.status === 'tracking' ? 'bg-orange-900 text-orange-200' :
                    'bg-gray-900 text-gray-200'
                  }`}>
                    {sim.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm font-mono">{sim.phoneNumber}</p>
                {sim.lastLocation && (
                  <div className="mt-2 flex items-center text-gray-400 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{sim.lastLocation.address || 'Location available'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heat Map Block (Admin Only) */}
      {user?.role === 'admin' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 mt-6">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Location Heat Map</h3>
          </div>
          <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            <FocusLocation points={heatMapPoints} focusedLocation={focusedLocation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;