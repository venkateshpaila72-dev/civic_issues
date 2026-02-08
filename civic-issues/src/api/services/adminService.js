import api from '../axios';
import { ADMIN, DEPARTMENTS } from '../endpoints';

/* ─── Dashboard ─── */
export const getAdminDashboard = async () => {
  const { data } = await api.get(ADMIN.DASHBOARD);
  return data;
};

/* ─── Department Management ─── */
export const createDepartment = async (departmentData) => {
  const { data } = await api.post(DEPARTMENTS.LIST, departmentData);
  return data;
};

export const updateDepartment = async (id, departmentData) => {
  const { data } = await api.put(DEPARTMENTS.BY_ID(id), departmentData);
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(DEPARTMENTS.BY_ID(id));
  return data;
};

export const toggleDepartmentStatus = async (id) => {
  const { data } = await api.patch(DEPARTMENTS.TOGGLE_STATUS(id));
  return data;
};

export const getDepartmentStats = async (id) => {
  const { data } = await api.get(DEPARTMENTS.STATS(id));
  return data;
};

/* ─── Officer Management ─── */
export const getOfficers = async (params = {}) => {
  const { data } = await api.get(ADMIN.LIST_OFFICERS, { params });
  return data;
};

export const getOfficerById = async (id) => {
  const { data } = await api.get(ADMIN.OFFICER_BY_ID(id));
  return data;
};

export const createOfficer = async (officerData) => {
  const { data } = await api.post(ADMIN.CREATE_OFFICER, officerData);
  return data;
};

export const updateOfficer = async (id, officerData) => {
  const { data } = await api.put(ADMIN.OFFICER_BY_ID(id), officerData);
  return data;
};

export const toggleOfficerStatus = async (id, accountStatus) => {
  const { data } = await api.patch(
    ADMIN.OFFICER_STATUS(id),
    { accountStatus }
  );
  return data;
};

/* ─── Department Assignments ─── */
export const assignDepartment = async (officerId, departmentId) => {
  const { data } = await api.post(ADMIN.ASSIGN_DEPARTMENT(officerId), { departmentId });
  return data;
};

export const removeDepartment = async (officerId, departmentId) => {
  const { data } = await api.delete(ADMIN.REMOVE_DEPARTMENT(officerId, departmentId));
  return data;
};

/* ─── Reports Audit ─── */
export const getAllReports = async (params = {}) => {
  const { data } = await api.get(ADMIN.REPORTS_AUDIT, { params });
  return data;
};

/* ─── Emergency Oversight ─── */
export const getAllEmergencies = async (params = {}) => {
  const { data } = await api.get(ADMIN.EMERGENCY_OVR, { params });
  return data;
};