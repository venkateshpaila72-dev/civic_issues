import api from '../axios';
import { CITIZEN } from '../endpoints';
import { appendLocation, appendFiles } from '../../utils/fileUtils';

/**
 * Create a new report with multipart data (images, location, etc.)
 */
export const createReport = async (reportData) => {
  const formData = new FormData();

  // Text fields
  formData.append('title', reportData.title);
  formData.append('description', reportData.description);
  formData.append('department', reportData.departmentId);

  // Location coordinates in backend format: location[coordinates][0] = lng, location[coordinates][1] = lat
  if (reportData.location) {
    appendLocation(formData, reportData.location);
  }

  // Images (multiple files)
  if (reportData.images && reportData.images.length > 0) {
    appendFiles(formData, 'images', reportData.images);
  }

  // Videos (optional)
  if (reportData.videos && reportData.videos.length > 0) {
    appendFiles(formData, 'videos', reportData.videos);
  }

  // Audio (optional)
  if (reportData.audio && reportData.audio.length > 0) {
    appendFiles(formData, 'audio', reportData.audio);
  }

  const { data } = await api.post(CITIZEN.CREATE_REPORT, formData);
  return data;
};

/**
 * Get citizen's reports with optional filters
 */
export const getMyReports = async (params = {}) => {
  const { data } = await api.get(CITIZEN.MY_REPORTS, { params });
  return data;
};

/**
 * Get a single report by ID
 */
export const getReportById = async (reportId) => {
  const { data } = await api.get(CITIZEN.REPORT_BY_ID(reportId));
  return data;
};

