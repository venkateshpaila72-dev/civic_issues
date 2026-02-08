import React, { useState, useEffect, useCallback } from 'react';
import { getOfficers, createOfficer, updateOfficer, toggleOfficerStatus } from '../../api/services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import useNotification from '../../hooks/useNotification';
import PageContainer from '../../components/layout/PageContainer';
import OfficerCard from '../../components/admin/OfficerCard';
import OfficerForm from '../../components/admin/OfficerForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import { SUCCESS } from '../../constants/messages';

const OfficerManagementPage = () => {
  const { success, error: showError } = useNotification();

  const [officers, setOfficers] = useState([]);
  const [filteredOfficers, setFilteredOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOfficers();
      if (response?.success && response?.data?.officers) {
        setOfficers(response.data.officers);
        setFilteredOfficers(response.data.officers);
      } else {
        throw new Error('Failed to load officers');
      }
    } catch (err) {
      console.error('Officers fetch error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  // Apply filters
  useEffect(() => {
    let filtered = [...officers];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (officer) =>
          officer.fullName?.toLowerCase().includes(query) ||
          officer.email?.toLowerCase().includes(query) ||
          officer.badgeNumber?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((officer) => officer.accountStatus === statusFilter);
    }

    setFilteredOfficers(filtered);
  }, [officers, searchQuery, statusFilter]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      const response = await createOfficer(data);
      if (response?.success) {
        success(SUCCESS.OFFICER_CREATED);
        setShowCreateModal(false);
        fetchOfficers();
      } else {
        throw new Error('Failed to create officer');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!editingOfficer) return;

    setSubmitting(true);
    try {
      const response = await updateOfficer(editingOfficer._id, data);
      if (response?.success) {
        success(SUCCESS.OFFICER_UPDATED);
        setEditingOfficer(null);
        fetchOfficers();
      } else {
        throw new Error('Failed to update officer');
      }
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

 const handleToggleStatus = async (officer) => {
  try {
    const nextStatus =
      officer.accountStatus === 'active' ? 'inactive' : 'active';

    const response = await toggleOfficerStatus(officer._id, nextStatus);

    if (response?.success) {
      success(
        nextStatus === 'inactive'
          ? SUCCESS.OFFICER_DEACTIVATED
          : SUCCESS.OFFICER_ACTIVATED
      );
      fetchOfficers();
    } else {
      throw new Error('Failed to toggle status');
    }
  } catch (err) {
    showError(getErrorMessage(err));
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
      title="Officer Management"
      subtitle={`${officers.length} total officer${officers.length !== 1 ? 's' : ''}`}
      actions={
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Officer
        </Button>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Filters */}
      {officers.length > 0 && (
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Search</label>
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search by name, email, or badge number..."
              />
            </div>

            <Select
              label="Status"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
              ]}
            />
          </div>
        </div>
      )}

      {filteredOfficers.length === 0 ? (
        officers.length === 0 ? (
          <EmptyState
            title="No officers yet"
            message="Create your first officer to get started"
            action="Create Officer"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <EmptyState
            title="No officers found"
            message="Try adjusting your search filters"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfficers.map((officer) => (
            <OfficerCard
              key={officer._id}
              officer={officer}
              onEdit={() => setEditingOfficer(officer)}
              onToggleStatus={() => handleToggleStatus(officer)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Officer"
        size="lg"
      >
        <OfficerForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingOfficer}
        onClose={() => setEditingOfficer(null)}
        title="Edit Officer"
        size="lg"
      >
        <OfficerForm
          initialData={editingOfficer}
          onSubmit={handleUpdate}
          onCancel={() => setEditingOfficer(null)}
          loading={submitting}
        />
      </Modal>
    </PageContainer>
  );
};

export default OfficerManagementPage;