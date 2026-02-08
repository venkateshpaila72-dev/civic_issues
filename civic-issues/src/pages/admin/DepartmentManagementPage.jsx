import React, { useState, useEffect, useCallback } from 'react';
import { getAllDepartments } from '../../api/services/departmentService';
import { createDepartment, updateDepartment, deleteDepartment, toggleDepartmentStatus } from '../../api/services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import useNotification from '../../hooks/useNotification';
import PageContainer from '../../components/layout/PageContainer';
import DepartmentCard from '../../components/admin/DepartmentCard';
import DepartmentForm from '../../components/admin/DepartmentForm';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { SUCCESS } from '../../constants/messages';

const DepartmentManagementPage = () => {
  const { success, error: showError } = useNotification();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllDepartments();
      if (response?.success && response?.data?.departments) {
        setDepartments(response.data.departments);
      } else {
        throw new Error('Failed to load departments');
      }
    } catch (err) {
      console.error('Departments fetch error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      const response = await createDepartment(data);
      if (response?.success) {
        success(SUCCESS.DEPARTMENT_CREATED);
        setShowCreateModal(false);
        fetchDepartments();
      } else {
        throw new Error('Failed to create department');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!editingDepartment) return;

    setSubmitting(true);
    try {
      const response = await updateDepartment(editingDepartment._id, data);
      if (response?.success) {
        success(SUCCESS.DEPARTMENT_UPDATED);
        setEditingDepartment(null);
        fetchDepartments();
      } else {
        throw new Error('Failed to update department');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (department) => {
    try {
      const response = await toggleDepartmentStatus(department._id);
      if (response?.success) {
        success(
          department.isActive
            ? SUCCESS.DEPARTMENT_DEACTIVATED
            : SUCCESS.DEPARTMENT_ACTIVATED
        );
        fetchDepartments();
      } else {
        throw new Error('Failed to toggle status');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deletingDepartment) return;

    try {
      const response = await deleteDepartment(deletingDepartment._id);
      if (response?.success) {
        success(SUCCESS.DEPARTMENT_DELETED);
        setDeletingDepartment(null);
        fetchDepartments();
      } else {
        throw new Error('Failed to delete department');
      }
    } catch (err) {
      showError(getErrorMessage(err));
      setDeletingDepartment(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <PageContainer
      title="Department Management"
      subtitle={`${departments.length} total department${departments.length !== 1 ? 's' : ''}`}
      actions={
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Department
        </Button>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {departments.length === 0 ? (
        <EmptyState
          title="No departments yet"
          message="Create your first department to get started"
          action="Create Department"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept._id}
              department={dept}
              onEdit={() => setEditingDepartment(dept)}
              onToggleStatus={() => handleToggleStatus(dept)}
              onDelete={() => setDeletingDepartment(dept)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Department"
      >
        <DepartmentForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        title="Edit Department"
      >
        <DepartmentForm
          initialData={editingDepartment}
          onSubmit={handleUpdate}
          onCancel={() => setEditingDepartment(null)}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${deletingDepartment?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </PageContainer>
  );
};

export default DepartmentManagementPage;