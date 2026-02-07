# API Setup for Randomized Location Tracking

This API generates randomized tracked locations for the SIREN dashboard map.

## Quick Start

### Option 1: Run API and Frontend Separately (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the API server:**
   ```bash
   npm run api
   ```
   The API will run on `http://localhost:3001`

3. **In a separate terminal, start the frontend:**
   ```bash
   npm run dev
   ```

### Option 2: Run Both Together

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both API and frontend:**
   ```bash
   npm run dev:all
   ```

## API Endpoints

### GET `/api/locations`
Returns randomized locations for all SIM cards.

**Response:**
```json
{
  "success": true,
  "locations": [
    {
      "id": "1-1234567890",
      "simId": "1",
      "latitude": 14.9586,
      "longitude": 120.9199,
      "timestamp": "2024-01-01T00:00:00.000Z",
      "address": "Random Location near Bulacan State University",
      "alias": "Juan Dela Cruz"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET `/api/locations/:simId`
Returns a randomized location for a specific SIM card.

**Example:** `/api/locations/1`

### GET `/api/health`
Health check endpoint.

## Features

- **Randomized Locations**: Generates random locations within a 5km radius of Bulacan State University – Bustos Campus
- **Auto-refresh**: The dashboard automatically fetches new locations every 30 seconds
- **CORS Enabled**: API is configured to accept requests from the frontend
- **Vite Proxy**: Frontend requests to `/api/*` are automatically proxied to the API server

## Configuration

The API generates locations within a 5km radius of:
- **Base Latitude**: 14.9586
- **Base Longitude**: 120.9199

You can modify these values in `server/api.js`:
```javascript
const BASE_LAT = 14.9586;
const BASE_LNG = 120.9199;
const RADIUS_KM = 5; // Adjust radius as needed
```

## Frontend Integration

The frontend automatically:
- Fetches locations when the dashboard loads
- Refreshes locations every 30 seconds
- Updates the map with new randomized locations
- Maintains location history (last 100 locations)

## Troubleshooting

- **API not responding**: Make sure the API server is running on port 3001
- **CORS errors**: The API has CORS enabled, but ensure both servers are running
- **Locations not updating**: Check browser console for errors and verify API is accessible

