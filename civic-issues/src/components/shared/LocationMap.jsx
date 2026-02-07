import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { MAP_CONFIG, defaultIcon, geoToLatLng } from '../../utils/mapUtils';
import 'leaflet/dist/leaflet.css';

/**
 * Static map showing a location (read-only).
 * Address overlay is responsive and stable.
 */
const LocationMap = ({ location, className = '' }) => {
  if (!location || !location.coordinates) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
        Location not available
      </div>
    );
  }

  const center = geoToLatLng(location);

  return (
    <div
      className={`relative h-64 pb-16 rounded-lg overflow-hidden border border-gray-200 ${className}`}
    >
      {/* Map */}
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={MAP_CONFIG.tileURL}
          attribution={MAP_CONFIG.attribution}
        />
        <Marker position={center} icon={defaultIcon} />
      </MapContainer>

      {/* Address overlay */}
      {location.address && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white p-3 text-sm rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>

            <div>
              <p className="font-medium">{location.address}</p>
              <p className="text-xs text-gray-300 mt-0.5">
                {center[0].toFixed(6)}, {center[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
