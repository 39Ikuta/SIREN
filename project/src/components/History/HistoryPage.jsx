import React, { useState } from 'react';
import { Search, MapPin, Clock, Filter, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const HistoryPage = () => {
  const { simCards } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSim, setSelectedSim] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Filter SIM cards based on user role
  const userSimCards = user?.role === 'admin' 
    ? simCards 
    : simCards.filter(sim => sim.userId === user?.id);

  // Mock location history data
  const mockLocationHistory = [
    {
      id: '1',
      simId: '1',
      phoneNumber: '+1-555-0001',
      alias: 'Agent Alpha',
      imsi: '310260000000001',
      imei: '860000000000001',
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY, USA',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      accuracy: 10
    },
    {
      id: '2',
      simId: '2',
      phoneNumber: '+1-555-0002',
      alias: 'Agent Beta',
      imsi: '310260000000002',
      imei: '860000000000002',
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA, USA',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      accuracy: 15
    },
    {
      id: '3',
      simId: '1',
      phoneNumber: '+1-555-0001',
      alias: 'Agent Alpha',
      imsi: '310260000000001',
      imei: '860000000000001',
      latitude: 40.7589,
      longitude: -73.9851,
      address: 'Central Park, New York, NY, USA',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      accuracy: 8
    }
  ];

  // Filter history based on user permissions and search
  const filteredHistory = mockLocationHistory
    .filter(entry => {
      const sim = userSimCards.find(s => s.id === entry.simId);
      return sim !== undefined;
    })
    .filter(entry => {
      if (selectedSim !== 'all' && entry.simId !== selectedSim) return false;
      if (searchTerm) {
        return (
          entry.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.imsi.includes(searchTerm) ||
          entry.imei.includes(searchTerm) ||
          entry.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Location History</h1>
          <p className="text-gray-400">Searchable log of SIM card locations</p>
        </div>
        <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by alias, number, IMSI, IMEI, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SIM Filter */}
          <select
            value={selectedSim}
            onChange={(e) => setSelectedSim(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All SIM Cards</option>
            {userSimCards.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.alias} ({sim.phoneNumber})
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                {filteredHistory.length} location{filteredHistory.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {searchTerm && (
              <span className="text-blue-400 text-sm">
                Searching for: "{searchTerm}"
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  SIM Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  IMSI / IMEI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{entry.alias}</div>
                      <div className="text-sm text-gray-400 font-mono">{entry.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-300">
                      <div>IMSI: {entry.imsi}</div>
                      <div>IMEI: {entry.imei}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{entry.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-400">
                      <div>Lat: {entry.latitude.toFixed(6)}</div>
                      <div>Lng: {entry.longitude.toFixed(6)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div className="text-sm text-gray-300">
                        <div>{new Date(entry.timestamp).toLocaleDateString()}</div>
                        <div className="text-gray-400">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.accuracy <= 10 
                        ? 'bg-green-900 text-green-200' 
                        : entry.accuracy <= 20 
                        ? 'bg-yellow-900 text-yellow-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      ±{entry.accuracy}m
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No location history found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms or filters' 
                : 'Location data will appear here as SIM cards are tracked'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;