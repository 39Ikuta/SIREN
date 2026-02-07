import React from 'react';

const FocusLocation = ({ points, focusedLocation }) => {
  // In the future, render Google Maps HeatmapLayer here
  return (
    <div className="h-64 w-full bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
      <span className="text-gray-400 text-center">
        Heat map visualization will appear here.<br />
        Points: {points.length}<br />
        {focusedLocation ? (
          <>
            <br />Focused Location: <b>{focusedLocation.lat}, {focusedLocation.lng}</b>
          </>
        ) : null}
        <br />(Google Maps Heat Map integration coming soon)
      </span>
    </div>
  );
};

export default FocusLocation; 