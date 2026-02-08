import api from '../axios';
import { OFFICER } from '../endpoints';
import { getSelectedDept } from '../../utils/storage';

/**
 * Get headers with X-Department-Id for officer requests.
 * Backend requires this header for all officer endpoints except select-department.
 */
const getOfficerHeaders = () => {
  const departmentId = getSelectedDept();

  if (!departmentId) {
    throw new Error('Department not selected');
  }

  return {
    'X-Department-Id': departmentId,
  };
};


/* ─── Department Selection ─── */
export const selectDepartment = async (departmentId) => {
  const { data } = await api.post(OFFICER.SELECT_DEPARTMENT, { departmentId });
  return data;
};

/* ─── Dashboard ─── */
export const getOfficerDashboard = async () => {
  const { data } = await api.get(OFFICER.DASHBOARD, {
    headers: getOfficerHeaders(),
  });
  return data;
};

/* ─── Reports ─── */
export const getOfficerReports = async (params = {}) => {
  const { data } = await api.get(OFFICER.REPORTS, {
    params,
    headers: getOfficerHeaders(),
  });
  return data;
};

export const getOfficerReportById = async (reportId) => {
  const { data } = await api.get(OFFICER.REPORT_BY_ID(reportId), {
    headers: getOfficerHeaders(),
  });
  return data;
};

export const updateReportStatus = async (reportId, status) => {
  const { data } = await api.patch(
    OFFICER.REPORT_STATUS(reportId),
    { status },
    { headers: getOfficerHeaders() }
  );
  return data;
};

export const rejectReport = async (reportId, reason) => {
  const { data } = await api.post(
    OFFICER.REPORT_REJECT(reportId),
    { rejectionReason: reason },
    { headers: getOfficerHeaders() }
  );
  return data;
};

/* ─── Emergencies ─── */
export const getOfficerEmergencies = async (params = {}) => {
  const { data } = await api.get(OFFICER.EMERGENCIES, {
    params,
    headers: getOfficerHeaders(),
  });
  return data;
};

/* ─── Profile ─── */
export const getOfficerProfile = async () => {
  const { data } = await api.get(OFFICER.PROFILE,{
    headers: getOfficerHeaders(),
  });
  return data;
};

export const updateOfficerProfile = async (profileData) => {
  const formData = new FormData();

  Object.keys(profileData).forEach((key) => {
    if (key !== 'profileImage' && profileData[key] !== undefined && profileData[key] !== null) {
      formData.append(key, profileData[key]);
    }
  });

  if (profileData.profileImage instanceof File) {
    formData.append('profileImage', profileData.profileImage);
  }

  const { data } = await api.put(OFFICER.PROFILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};