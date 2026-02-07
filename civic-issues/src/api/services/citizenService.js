import api from '../axios';
import { CITIZEN } from '../endpoints';

/* ─── Dashboard ─── */
export const getDashboard = async () => {
  const { data } = await api.get(CITIZEN.DASHBOARD);
  return data;
};

/* ─── Profile ─── */
export const getProfile = async () => {
  const { data } = await api.get(CITIZEN.PROFILE);
  return data;
};

/**
 * Update profile (with optional profile image).
 * If profileImage is included, sends as multipart/form-data.
 */
export const updateProfile = async (profileData) => {
  const formData = new FormData();

  // Append text fields
  Object.keys(profileData).forEach((key) => {
    if (key !== 'profileImage' && profileData[key] !== undefined && profileData[key] !== null) {
      formData.append(key, profileData[key]);
    }
  });

  // Append profile image if exists
  if (profileData.profileImage instanceof File) {
    formData.append('profileImage', profileData.profileImage);
  }

  const { data } = await api.put(CITIZEN.PROFILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};