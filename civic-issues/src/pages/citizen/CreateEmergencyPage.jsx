import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmergency } from '../../api/services/emergencyService';
import { getErrorMessage } from '../../utils/errorHandler';
import useNotification from '../../hooks/useNotification';
import useGeolocation from '../../hooks/useGeolocation';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Select from '../../components/common/Select';
import FileUpload from '../../components/common/FileUpload';
import LocationPicker from '../../components/shared/LocationPicker';
import Alert from '../../components/common/Alert';
import { CITIZEN_ROUTES } from '../../constants/routes';
import { EMERGENCY_TYPES } from '../../constants/emergencyTypes';
import { SUCCESS } from '../../constants/messages';

const CreateEmergencyPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const { location, loading: locationLoading, error: locationError } = useGeolocation();

  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    contactNumber: '',
    location: {
      coordinates: [],
      address: '',
      landmark: '',
    },
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [audio, setAudio] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-fill location when available
  React.useEffect(() => {
    if (location && formData.location.coordinates.length === 0) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [location.longitude, location.latitude],
        },
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      location: locationData,
    }));
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = 'Emergency type is required';
    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required for emergencies';
    } else if (!/^[0-9]{10,15}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Invalid phone number';
    }
    if (!formData.location.coordinates || formData.location.coordinates.length !== 2) {
      newErrors.location = 'Location is required for emergencies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showError('Please fix the errors before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const emergencyData = {
        ...formData,
        images,
        videos,
        audio,
      };

      const response = await createEmergency(emergencyData);

      if (response?.success) {
        success(SUCCESS.EMERGENCY_CREATED || 'Emergency reported successfully!');
        navigate(CITIZEN_ROUTES.MY_EMERGENCIES);
      } else {
        throw new Error('Failed to create emergency');
      }
    } catch (err) {
      console.error('Create emergency error:', err);
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const emergencyTypeOptions = Object.entries(EMERGENCY_TYPES).map(([key, value]) => ({
    value,
    label: key.charAt(0) + key.slice(1).toLowerCase(),
  }));

  return (
    <PageContainer
      title="Report Emergency"
      subtitle="Get immediate help - emergency services will be notified"
    >
      {/* Emergency Warning */}
      <Alert type="error" className="mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Emergency Alert</p>
            <p className="text-red-800 mt-1">
              For life-threatening emergencies, please call emergency services (911/100) immediately. 
              This form will notify authorities but may not guarantee instant response.
            </p>
          </div>
        </div>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Emergency Type */}
        <div className="card">
          <h3 className="card-title mb-4">Emergency Type</h3>
          <Select
            name="type"
            label="Type of Emergency *"
            value={formData.type}
            onChange={handleChange}
            options={emergencyTypeOptions}
            error={errors.type}
            placeholder="Select emergency type"
            required
          />
        </div>

        {/* Emergency Details */}
        <div className="card">
          <h3 className="card-title mb-4">Emergency Details</h3>
          <div className="space-y-4">
            <Input
              name="title"
              label="Emergency Title *"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Brief description (e.g., 'House Fire on Main Street')"
              required
            />

            <TextArea
              name="description"
              label="Detailed Description *"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Provide detailed information about the emergency..."
              rows={5}
              required
            />

            <Input
              name="contactNumber"
              label="Contact Number *"
              type="tel"
              value={formData.contactNumber}
              onChange={handleChange}
              error={errors.contactNumber}
              placeholder="Your phone number for emergency response"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h3 className="card-title mb-4">Emergency Location *</h3>
          {locationError && (
            <Alert type="warning" className="mb-4">
              {locationError}
            </Alert>
          )}
          <LocationPicker
            value={formData.location}
            onChange={handleLocationChange}
            error={errors.location}
            required
          />
        </div>

        {/* Media Attachments (Optional) */}
        <div className="card">
          <h3 className="card-title mb-4">Media Attachments (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Photos, videos, or audio can help emergency responders assess the situation
          </p>
          <div className="space-y-4">
            <FileUpload
              label="Images"
              accept="image/*"
              multiple
              files={images}
              onChange={setImages}
              maxFiles={5}
              maxSize={10 * 1024 * 1024} // 10MB
            />

            <FileUpload
              label="Videos"
              accept="video/*"
              multiple
              files={videos}
              onChange={setVideos}
              maxFiles={2}
              maxSize={50 * 1024 * 1024} // 50MB
            />

            <FileUpload
              label="Audio"
              accept="audio/*"
              multiple
              files={audio}
              onChange={setAudio}
              maxFiles={2}
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="danger"
            loading={submitting}
            disabled={submitting || locationLoading}
            className="flex-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Emergency
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(CITIZEN_ROUTES.MY_EMERGENCIES)}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default CreateEmergencyPage;