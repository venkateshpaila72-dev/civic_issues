import api from '../axios';
import { EMERGENCY } from '../endpoints';

/**
 * Create a new emergency with multipart data
 */
export const createEmergency = async (emergencyData) => {
  const formData = new FormData();

  // Log data for debugging
  console.log('Emergency data being sent:', emergencyData);

  // Required fields
  formData.append('type', emergencyData.type);
  formData.append('title', emergencyData.title);
  formData.append('description', emergencyData.description);
  formData.append('contactNumber', emergencyData.contactNumber);

  // Location - Send in the format validator expects
  // Validator expects: location.coordinates[0] and location.coordinates[1]
  if (emergencyData.location && emergencyData.location.coordinates && emergencyData.location.coordinates.length === 2) {
    const coords = emergencyData.location.coordinates;
    
    // Ensure coordinates are numbers
    const longitude = parseFloat(coords[0]);
    const latitude = parseFloat(coords[1]);
    
    console.log('Sending coordinates:', { longitude, latitude });
    
    // Send as separate FormData fields that express-validator can validate
    formData.append('location[coordinates][0]', longitude);
    formData.append('location[coordinates][1]', latitude);
    
    if (emergencyData.location.address) {
      formData.append('location[address]', emergencyData.location.address);
    }
  }
  
  // Landmark as separate field (backend controller expects it)
  if (emergencyData.location?.landmark) {
    formData.append('landmark', emergencyData.location.landmark);
  }

  // Media files (optional)
  if (emergencyData.images && emergencyData.images.length > 0) {
    emergencyData.images.forEach((file) => {
      formData.append('images', file);
    });
  }

  if (emergencyData.videos && emergencyData.videos.length > 0) {
    emergencyData.videos.forEach((file) => {
      formData.append('videos', file);
    });
  }

  if (emergencyData.audio && emergencyData.audio.length > 0) {
    emergencyData.audio.forEach((file) => {
      formData.append('audio', file);
    });
  }

  // Log FormData contents
  console.log('Sending emergency to backend...');

  const { data } = await api.post(EMERGENCY.CREATE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

/**
 * Get citizen's emergencies
 */
export const getMyEmergencies = async (params = {}) => {
  const { data } = await api.get(EMERGENCY.MY_EMERGENCIES, { params });
  return data;
};

/**
 * Get active emergencies (for officers/admins)
 */
export const getActiveEmergencies = async (params = {}) => {
  const { data } = await api.get(EMERGENCY.ACTIVE, { params });
  return data;
};

/**
 * Get emergency by ID
 */
export const getEmergencyById = async (id) => {
  const { data } = await api.get(EMERGENCY.BY_ID(id));
  return data;
};

/**
 * Update emergency status (officers/admins only)
 */
export const updateEmergencyStatus = async (id, status) => {
  const { data } = await api.patch(EMERGENCY.STATUS(id), { status });
  return data;
};