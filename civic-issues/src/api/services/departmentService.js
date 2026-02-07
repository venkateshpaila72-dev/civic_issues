import api from '../axios';
import { DEPARTMENTS } from '../endpoints';

/**
 * Get all active departments (for citizen/officer dropdowns)
 */
export const getActiveDepartments = async () => {
  const { data } = await api.get(DEPARTMENTS.ACTIVE);
  return data;
};

/**
 * Get all departments (admin only, includes inactive)
 */
export const getAllDepartments = async (params = {}) => {
  const { data } = await api.get(DEPARTMENTS.LIST, { params });
  return data;
};

/**
 * Get department by ID
 */
export const getDepartmentById = async (id) => {
  const { data } = await api.get(DEPARTMENTS.BY_ID(id));
  return data;
};