import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getErrorMessage } from '../../utils/errorHandler';
import useGeolocation from '../../hooks/useGeolocation';
import PageContainer from '../../components/layout/PageContainer';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { timeAgo } from '../../utils/formatters';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getToken } from '../../utils/storage';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const NearbyReportsPage = () => {
  const { location, loading: geoLoading, error: geoError, getCurrentLocation } = useGeolocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5000); // 5km default

  const fetchNearbyReports = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      // This would call: GET /api/reports/nearby?lat=X&lng=Y&radius=5000
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reports/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby reports');
      }

      const data = await response.json();
      
      if (data?.success && data?.data?.reports) {
        setReports(data.data.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('Nearby reports fetch error:', err);
      setError(getErrorMessage(err));
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchNearbyReports(location.lat, location.lng);
    }
  }, [location, radius]);

  if (geoLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (geoError) {
    return (
      <PageContainer title="Nearby Reports">
        <Alert type="error" className="mb-6">
          {geoError}
        </Alert>
        <Button onClick={getCurrentLocation}>
          Try Again
        </Button>
      </PageContainer>
    );
  }

  if (!location) {
    return (
      <PageContainer title="Nearby Reports">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Required</h3>
          <p className="text-gray-600 mb-6">
            We need your location to show nearby reports
          </p>
          <Button variant="primary" onClick={getCurrentLocation}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Get My Location
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Nearby Reports"
      subtitle={`${reports.length} report${reports.length !== 1 ? 's' : ''} within ${radius / 1000}km`}
      actions={
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="input"
        >
          <option value={1000}>1 km</option>
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
          <option value={25000}>25 km</option>
        </select>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User's location */}
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  <strong>Your Location</strong>
                </Popup>
              </Marker>

              {/* Nearby reports */}
              {reports.map((report) => (
                <Marker
                  key={report._id}
                  position={[
                    report.location.coordinates[1],
                    report.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-semibold mb-1">{report.title}</h4>
                      <Badge variant={report.status === 'resolved' ? 'success' : 'warning'}>
                        {report.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {timeAgo(report.createdAt)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Reports List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No reports found in this area</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report._id} className="card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{report.title}</h4>
                    <Badge variant={report.status === 'resolved' ? 'success' : 'warning'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {report.description}
                  </p>
                  {report.location?.address && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {report.location.address}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{timeAgo(report.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default NearbyReportsPage;