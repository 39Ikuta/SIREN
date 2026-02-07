import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Activity, 
  Phone,
  Smartphone
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const SimManagementPage = () => {
  const { simCards, addSimCard, updateSimCard, deleteSimCard, startTracking } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSim, setEditingSim] = useState(null);

  // Filter SIM cards based on user role and search
  const filteredSims = simCards
    .filter(sim => user?.role === 'admin' || sim.userId === user?.id)
    .filter(sim => 
      sim.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddSim = (formData) => {
    addSimCard({
      ...formData,
      userId: user?.id || '',
      status: 'inactive'
    });
    setShowAddModal(false);
  };

  const handleEditSim = (formData) => {
    if (editingSim) {
      updateSimCard(editingSim.id, formData);
      setEditingSim(null);
    }
  };

  const handleDeleteSim = (id) => {
    if (window.confirm('Are you sure you want to delete this SIM card?')) {
      deleteSimCard(id);
    }
  };

  const handleStartTracking = (simId) => {
    startTracking(simId, user?.id || '');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SIM Management</h1>
          <p className="text-gray-400">Manage and track your SIM cards</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add SIM</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by alias or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SIM Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((sim) => (
          <div key={sim.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    sim.status === 'active' ? 'bg-green-600' :
                    sim.status === 'tracking' ? 'bg-orange-600' : 'bg-gray-600'
                  }`}>
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{sim.alias}</h3>
                    <p className="text-gray-400 font-mono text-sm">{sim.phoneNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sim.status === 'active' ? 'bg-green-900 text-green-200' :
                  sim.status === 'tracking' ? 'bg-orange-900 text-orange-200' :
                  'bg-gray-900 text-gray-200'
                }`}>
                  {sim.status}
                </span>
              </div>

              <div className="space-y-3">
                {sim.lastLocation && (
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-green-400" />
                    <span>{sim.lastLocation.address || 'Location available'}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingSim(sim)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSim(sim.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {sim.status !== 'tracking' && (
                  <button
                    onClick={() => handleStartTracking(sim.id)}
                    className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    <Activity className="h-3 w-3" />
                    <span>Track</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSims.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No SIM cards found</h3>
          <p className="text-gray-500">Add a new SIM card to get started</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingSim) && (
        <SimModal
          sim={editingSim}
          onSave={editingSim ? handleEditSim : handleAddSim}
          onCancel={() => {
            setShowAddModal(false);
            setEditingSim(null);
          }}
        />
      )}
    </div>
  );
};

// Modal Component
const SimModal = ({ sim, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    phoneNumber: sim?.phoneNumber || '',
    alias: sim?.alias || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">
          {sim ? 'Edit SIM Card' : 'Add New SIM Card'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alias
            </label>
            <input
              type="text"
              value={formData.alias}
              onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {sim ? 'Update' : 'Add'} SIM
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimManagementPage;