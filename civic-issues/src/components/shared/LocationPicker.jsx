import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * Location picker with map integration
 * Allows users to select location via coordinates or address
 */
const LocationPicker = ({ value, onChange, error, required = false }) => {
  const [locationData, setLocationData] = useState({
    coordinates: value?.coordinates || [],
    address: value?.address || '',
    landmark: value?.landmark || '',
  });

  const [gettingLocation, setGettingLocation] = useState(false);

  // Update parent when location changes
  useEffect(() => {
    onChange(locationData);
  }, [locationData]);

  const handleAddressChange = (e) => {
    setLocationData(prev => ({
      ...prev,
      address: e.target.value,
    }));
  };

  const handleLandmarkChange = (e) => {
    setLocationData(prev => ({
      ...prev,
      landmark: e.target.value,
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData(prev => ({
          ...prev,
          coordinates: [longitude, latitude],
        }));
        setGettingLocation(false);

        // Optional: Reverse geocode to get address
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter manually.');
        setGettingLocation(false);
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setLocationData(prev => ({
          ...prev,
          address: data.display_name,
        }));
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={getCurrentLocation}
          loading={gettingLocation}
          disabled={gettingLocation}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use Current Location
        </Button>

        {locationData.coordinates.length === 2 && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Location set
          </span>
        )}
      </div>

      {/* Coordinates Display */}
      {locationData.coordinates.length === 2 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Coordinates: </span>
            Lat: {locationData.coordinates[1].toFixed(6)}, 
            Lng: {locationData.coordinates[0].toFixed(6)}
          </p>
        </div>
      )}

      {/* Address Input */}
      <Input
        label="Address"
        value={locationData.address}
        onChange={handleAddressChange}
        placeholder="Enter full address"
        required={required}
        error={error}
      />

      {/* Landmark Input */}
      <Input
        label="Landmark (Optional)"
        value={locationData.landmark}
        onChange={handleLandmarkChange}
        placeholder="Nearby landmark or reference point"
      />

      {/* Map Preview (optional - can add Google Maps or OpenStreetMap iframe) */}
      {locationData.coordinates.length === 2 && (
        <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
          <iframe
            title="Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationData.coordinates[0]-0.01},${locationData.coordinates[1]-0.01},${locationData.coordinates[0]+0.01},${locationData.coordinates[1]+0.01}&layer=mapnik&marker=${locationData.coordinates[1]},${locationData.coordinates[0]}`}
          />
        </div>
      )}

      {error && !locationData.coordinates.length && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default LocationPicker;