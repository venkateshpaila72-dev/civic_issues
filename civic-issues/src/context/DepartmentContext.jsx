import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSelectedDept, setSelectedDept as saveSelectedDept, removeSelectedDept } from '../utils/storage';
import useAuth from '../hooks/useAuth';
import { USER_ROLES } from '../constants/roles';
import api from '../api/axios';
import { DEPARTMENTS } from '../api/endpoints';


const DepartmentContext = createContext(null);

export const DepartmentProvider = ({ children }) => {
    const { user } = useAuth();
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);


    // Initialize from localStorage on mount
    useEffect(() => {
        if (user?.role === USER_ROLES.OFFICER) {
            const fetchDepartments = async () => {
                try {
                    const { data } = await api.get(DEPARTMENTS.ACTIVE);
                    if (data?.success && data?.data?.departments) {
                        setDepartments(data.data.departments);
                    }
                } catch (error) {
                    console.error('Failed to fetch departments:', error);
                }
            };

            fetchDepartments();
        }
        setLoading(false);
    }, [user]);


    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await api.get(DEPARTMENTS.ACTIVE);
                if (data?.success && data?.data?.departments) {
                    setDepartments(data.data.departments);
                }
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };

        fetchDepartments();
    }, []);



    const selectDepartment = (departmentId) => {
        setSelectedDepartmentId(departmentId);
        saveSelectedDept(departmentId);
    };

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