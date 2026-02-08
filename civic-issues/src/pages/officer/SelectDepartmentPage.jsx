import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useDepartmentContext } from '../../context/DepartmentContext';
import { selectDepartment as selectDepartmentAPI } from '../../api/services/officerService';
import { getErrorMessage } from '../../utils/errorHandler';
import useNotification from '../../hooks/useNotification';
import DepartmentSelector from '../../components/officer/DepartmentSelector';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { SUCCESS } from '../../constants/messages';



const SelectDepartmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectDepartment, departments } = useDepartmentContext();
    const { success, error: showError } = useNotification();

    const [selectedId, setSelectedId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const assignedDepartments = departments.filter(dept =>
        user?.assignedDepartments?.includes(dept._id)
    );


    const handleSubmit = async () => {
        if (!selectedId) {
            showError('Please select a department');
            return;
        }

        setSubmitting(true);
        try {
            const response = await selectDepartmentAPI(selectedId);

            if (response?.success) {
                // Store in context and localStorage
                selectDepartment(selectedId);

                success(SUCCESS.DEPARTMENT_SELECTED);

                // Redirect to officer dashboard
                navigate('/officer/dashboard', { replace: true });
            } else {
                throw new Error('Failed to select department');
            }
        } catch (err) {
            showError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Department</h1>
                    <p className="text-gray-600">
                        Choose which department you'll be working with today
                    </p>
                </div>

                {/* Department cards */}
                <DepartmentSelector
                    departments={assignedDepartments}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    loading={submitting}
                />

                {/* Submit button */}
                {assignedDepartments.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleSubmit}
                            loading={submitting}
                            disabled={!selectedId}
                            className="min-w-[200px]"
                        >
                            Continue to Dashboard
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectDepartmentPage;