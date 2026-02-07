import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Luzon Island geographic boundaries (approximate bounding box)
// Northernmost: ~18.5°N (Ilocos Norte)
// Southernmost: ~13.7°N (Batangas/Cavite)
// Westernmost: ~120.0°E (Zambales coast)
// Easternmost: ~122.5°E (Quezon Province coast)
const LUZON_BOUNDS = {
  north: 18.5,
  south: 13.7,
  west: 120.0,
  east: 122.5
};

// Generate random location within Luzon Island
function generateRandomLocationInLuzon() {
  // Generate random latitude within Luzon bounds
  const lat = LUZON_BOUNDS.south + (Math.random() * (LUZON_BOUNDS.north - LUZON_BOUNDS.south));
  
  // Generate random longitude within Luzon bounds
  const lng = LUZON_BOUNDS.west + (Math.random() * (LUZON_BOUNDS.east - LUZON_BOUNDS.west));
  
  return { lat, lng };
}

// Store SIM card IDs for consistency
const simCardIds = ['1', '2', '3'];
const simAliases = {
  '1': 'Juan Dela Cruz',
  '2': 'Maria Santos',
  '3': 'Carlos Reyes'
};

// GET /api/locations - Get randomized tracked locations
app.get('/api/locations', (req, res) => {
  try {
    const locations = simCardIds.map(simId => {
      const { lat, lng } = generateRandomLocationInLuzon();
      
      return {
        id: `${simId}-${Date.now()}`,
        simId: simId,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
        timestamp: new Date().toISOString(),
        address: `Random Location in Luzon`,
        alias: simAliases[simId] || 'Unknown'
      };
    });
    
    res.json({
      success: true,
      locations: locations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate locations',
      message: error.message
    });
  }
});

// GET /api/locations/:simId - Get randomized location for specific SIM
app.get('/api/locations/:simId', (req, res) => {
  const { simId } = req.params;
  
  if (!simCardIds.includes(simId)) {
    return res.status(404).json({
      success: false,
      error: 'SIM card not found'
    });
  }
  
  const { lat, lng } = generateRandomLocationInLuzon();
  
  const location = {
    id: `${simId}-${Date.now()}`,
    simId: simId,
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lng.toFixed(6)),
    timestamp: new Date().toISOString(),
    address: `Random Location in Luzon`,
    alias: simAliases[simId] || 'Unknown'
  };
  
  res.json({
    success: true,
    location: location
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📍 Location endpoint: http://localhost:${PORT}/api/locations`);
  console.log(`✅ Server ready to accept requests`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the server using that port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

