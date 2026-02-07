import React, { useEffect, useRef } from 'react';

const DashboardMap = ({ points, focusedLocation, mapType = 'standard' }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const tileLayerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Initialize map once
    if (!mapRef.current && window.L) {
      // Default center for Luzon Island (Manila area)
      const defaultCenter = [15.5, 121.0];
      mapRef.current = window.L.map(containerRef.current, {
        center: defaultCenter,
        zoom: 7, // Zoomed out to show more of Luzon
        zoomControl: true,
        attributionControl: true,
      });

      // Add initial tile layer
      tileLayerRef.current = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    return () => {
      // Do not destroy to preserve map instance between re-renders
    };
  }, []);

  // Switch between standard and satellite view
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Only switch layers if map is already initialized and tileLayer exists
    if (tileLayerRef.current) {
      // Remove current tile layer
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    // Add new tile layer based on mapType
    if (mapType === 'satellite') {
      tileLayerRef.current = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
      }).addTo(mapRef.current);
    } else {
      tileLayerRef.current = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
  }, [mapType]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Clear existing layer group if any
    if (mapRef.current._sirenLayerGroup) {
      mapRef.current.removeLayer(mapRef.current._sirenLayerGroup);
    }

    const layerGroup = window.L.layerGroup();

    // Add markers for points
    const markerLatLngs = [];
    points.forEach((p) => {
      if (typeof p.lat === 'number' && typeof p.lng === 'number') {
        const latlng = [p.lat, p.lng];
        markerLatLngs.push(latlng);
        window.L.circleMarker(latlng, {
          radius: 6,
          color: '#60a5fa',
          weight: 2,
          fillColor: '#3b82f6',
          fillOpacity: 0.6,
        })
          .bindPopup(
            `<div style="min-width:160px">
               <div style="font-weight:600;margin-bottom:4px">${p.alias || 'SIM'}</div>
               <div style="font-size:12px;color:#6b7280">ID: ${p.simId ?? ''}</div>
               <div style="font-size:12px;color:#6b7280">${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}</div>
             </div>`
          )
          .addTo(layerGroup);
      }
    });

    // Add red pin for focused location
    if (focusedLocation && typeof focusedLocation.lat === 'number' && typeof focusedLocation.lng === 'number') {
      const focusedLatLng = [focusedLocation.lat, focusedLocation.lng];
      
      // Create a red marker/pin for the focused location
      const redIcon = window.L.divIcon({
        className: 'custom-red-pin',
        html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -20]
      });
      
      window.L.marker(focusedLatLng, { icon: redIcon })
        .bindPopup(
          `<div style="min-width:160px">
             <div style="font-weight:600;margin-bottom:4px;color:#ef4444">📍 Focused Location</div>
             <div style="font-size:12px;color:#6b7280">${focusedLocation.lat.toFixed(5)}, ${focusedLocation.lng.toFixed(5)}</div>
           </div>`
        )
        .addTo(layerGroup);
    }

    layerGroup.addTo(mapRef.current);
    mapRef.current._sirenLayerGroup = layerGroup;

    // Determine view: focus > bounds > default
    if (focusedLocation && typeof focusedLocation.lat === 'number' && typeof focusedLocation.lng === 'number') {
      mapRef.current.setView([focusedLocation.lat, focusedLocation.lng], 10, { animate: true });
      return;
    }

    if (markerLatLngs.length >= 1) {
      if (markerLatLngs.length === 1) {
        mapRef.current.setView(markerLatLngs[0], 10);
      } else {
        // Fit bounds to show all markers, with padding
        const bounds = window.L.latLngBounds(markerLatLngs);
        mapRef.current.fitBounds(bounds.pad(0.3));
      }
    }
  }, [points, focusedLocation]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default DashboardMap;


