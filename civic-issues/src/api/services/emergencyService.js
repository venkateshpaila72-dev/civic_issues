import api from '../axios';
import { EMERGENCY } from '../endpoints';
import { appendLocation, appendFiles } from '../../utils/fileUtils';

/**
 * Create a new emergency with multipart data
 */
export const createEmergency = async (emergencyData) => {
  const formData = new FormData();

  // Required fields
  formData.append('type', emergencyData.type);
  formData.append('description', emergencyData.description);
  formData.append('contactNumber', emergencyData.contactNumber);

  // Location
  if (emergencyData.location) {
    appendLocation(formData, emergencyData.location);
  }

  // Media (optional)
  if (emergencyData.images && emergencyData.images.length > 0) {
    appendFiles(formData, 'images', emergencyData.images);
  }

  if (emergencyData.videos && emergencyData.videos.length > 0) {
    appendFiles(formData, 'videos', emergencyData.videos);
  }

  if (emergencyData.audio && emergencyData.audio.length > 0) {
    appendFiles(formData, 'audio', emergencyData.audio);
  }

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