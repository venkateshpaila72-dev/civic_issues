import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getSelectedDept,
  setSelectedDept as saveSelectedDept,
  removeSelectedDept,
} from '../utils/storage';
import useAuth from '../hooks/useAuth';
import { USER_ROLES } from '../constants/roles';
import api from '../api/axios';
import { DEPARTMENTS } from '../api/endpoints';

const DepartmentContext = createContext(null);

export const DepartmentProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─── Initialize department data ─── */
  useEffect(() => {
    const init = async () => {
      // Wait for auth to finish
      if (authLoading) return;

      // Only officers need departments
      if (user?.role !== USER_ROLES.OFFICER) {
        setLoading(false);
        return;
      }

      try {
        // Restore selected department from storage
        const storedDept = getSelectedDept();
        if (storedDept) {
          setSelectedDepartmentId(storedDept);
        }

        // Fetch active departments
        const { data } = await api.get(DEPARTMENTS.ACTIVE);
        if (data?.success && data?.data?.departments) {
          setDepartments(data.data.departments);
        }
      } catch (error) {
        console.error('Failed to initialize departments:', error);
      } finally {
        setLoading(false); // ✅ only after everything
      }
    };

    init();
  }, [user, authLoading]);

  /* ─── Select department ─── */
  const selectDepartment = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    saveSelectedDept(departmentId);
  };

  /* ─── Clear department ─── */
  const clearDepartment = () => {
    setSelectedDepartmentId(null);
    removeSelectedDept();
  };

  const value = {
    departments,
    selectedDepartmentId,
    selectDepartment,
    clearDepartment,
    loading,
    hasSelectedDepartment: Boolean(selectedDepartmentId),
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

/* ─── Hook ─── */
export const useDepartmentContext = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartmentContext must be used within DepartmentProvider');
  }
  return context;
};

export default DepartmentContext;
