import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MAP_CONFIG, DEFAULT_CENTER, defaultIcon } from '../../utils/mapUtils';
import { reverseGeocode } from '../../api/services/locationService';
import useGeolocation from '../../hooks/useGeolocation';
import Button from '../common/Button';
import Loader from '../common/Loader';
import 'leaflet/dist/leaflet.css';

/**
 * Map event handler component (must be inside MapContainer)
 */
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

/**
 * Location picker with map — click to select or use GPS
 */
const LocationPicker = ({ value, onChange, error }) => {
  const [selectedLocation, setSelectedLocation] = useState(value || null);
  const [address, setAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  const { location: gpsLocation, loading: gpsLoading, error: gpsError, getCurrentLocation } = useGeolocation();

  // When GPS location is obtained, use it
  useEffect(() => {
    if (gpsLocation) {
      handleLocationSelect(gpsLocation);
    }
  }, [gpsLocation]);

  // When value prop changes externally, update local state
  useEffect(() => {
    if (value) {
      setSelectedLocation(value);
      fetchAddress(value.lat, value.lng);
    }
  }, [value]);

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    onChange(location);
    await fetchAddress(location.lat, location.lng);
  };

  const fetchAddress = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr || 'Address not found');
    } catch (err) {
      console.error('Geocoding error:', err);
      setAddress('Unable to get address');
    } finally {
      setLoadingAddress(false);
    }
  };

  const center = selectedLocation || DEFAULT_CENTER;

  return (
    <div className="space-y-3">
      {/* GPS Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={getCurrentLocation}
          loading={gpsLoading}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use My Location
        </Button>
        {gpsError && <p className="text-xs text-red-500">{gpsError}</p>}
      </div>

      {/* Map */}
      <div className={`h-80 rounded-lg overflow-hidden border ${error ? 'border-red-400' : 'border-gray-200'}`}>
        <MapContainer
          center={center}
          zoom={selectedLocation ? 15 : MAP_CONFIG.defaultZoom}
          style={{ height: '100%', width: '100%' }}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
        >
          <TileLayer
            url={MAP_CONFIG.tileURL}
            attribution={MAP_CONFIG.attribution}
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={defaultIcon} />
          )}
        </MapContainer>
      </div>

      {/* Address display */}
      {selectedLocation && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              {loadingAddress ? (
                <div className="flex items-center gap-2">
                  <Loader size="sm" />
                  <span className="text-sm text-blue-700">Getting address...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-blue-900">{address}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedLocation && (
        <p className="text-sm text-gray-500">
          Click on the map to select a location, or use the GPS button to detect your current location.
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default LocationPicker;