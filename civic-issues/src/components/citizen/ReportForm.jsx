import React, { useState } from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import DepartmentSelector from './DepartmentSelector';
import LocationPicker from './LocationPicker';
import MediaUploader from './MediaUploader';
import MediaPreview from './MediaPreview';
import useFileUpload from '../../hooks/useFileUpload';
import { ERROR } from '../../constants/messages';

/**
 * Report creation form.
 * Handles title, description, department, location, and media uploads.
 */
const ReportForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    location: null,
  });
  const [errors, setErrors] = useState({});

  // File upload hooks
  const images = useFileUpload('IMAGE');
  const videos = useFileUpload('VIDEO');
  const audio = useFileUpload('AUDIO');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({ ...prev, location }));
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = ERROR.REQUIRED('Title');
    }

    if (!formData.description.trim()) {
      newErrors.description = ERROR.REQUIRED('Description');
    }

    if (!formData.departmentId) {
      newErrors.departmentId = ERROR.REQUIRED('Department');
    }

    if (!formData.location) {
      newErrors.location = ERROR.LOCATION_REQUIRED;
    }

    if (images.files.length === 0) {
      newErrors.images = ERROR.IMAGE_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reportData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      departmentId: formData.departmentId,
      location: formData.location,
      images: images.files,
      videos: videos.files,
      audio: audio.files,
    };

    onSubmit(reportData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Report Title"
        name="title"
        placeholder="Brief description of the issue"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />

      {/* Description */}
      <TextArea
        label="Description"
        name="description"
        placeholder="Provide detailed information about the issue"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        rows={4}
        required
      />

      {/* Department */}
      <DepartmentSelector
        value={formData.departmentId}
        onChange={handleChange}
        error={errors.departmentId}
        required
      />

      {/* Location */}
      <div>
        <label className="input-label">
          Location <span className="text-red-500 ml-0.5">*</span>
        </label>
        <LocationPicker
          value={formData.location}
          onChange={handleLocationChange}
          error={errors.location}
        />
      </div>

      {/* Images (Required) */}
      <div>
        <label className="input-label">
          Images <span className="text-red-500 ml-0.5">*</span>
        </label>
        <MediaUploader
          type="IMAGE"
          files={images.files}
          onFilesAdd={images.addFiles}
          onFileRemove={images.removeFile}
          error={images.error || errors.images}
        />
        {images.files.length > 0 && (
          <div className="mt-4">
            <MediaPreview
              files={images.files}
              previews={images.previews}
              onRemove={images.removeFile}
              type="IMAGE"
            />
          </div>
        )}
      </div>

      {/* Videos (Optional) */}
      <div>
        <label className="input-label">Videos (Optional)</label>
        <MediaUploader
          type="VIDEO"
          files={videos.files}
          onFilesAdd={videos.addFiles}
          onFileRemove={videos.removeFile}
          error={videos.error}
        />
        {videos.files.length > 0 && (
          <div className="mt-4">
            <MediaPreview
              files={videos.files}
              previews={videos.previews}
              onRemove={videos.removeFile}
              type="VIDEO"
            />
          </div>
        )}
      </div>

      {/* Audio (Optional) */}
      <div>
        <label className="input-label">Audio (Optional)</label>
        <MediaUploader
          type="AUDIO"
          files={audio.files}
          onFilesAdd={audio.addFiles}
          onFileRemove={audio.removeFile}
          error={audio.error}
        />
        {audio.files.length > 0 && (
          <div className="mt-4">
            <MediaPreview
              files={audio.files}
              previews={audio.previews}
              onRemove={audio.removeFile}
              type="AUDIO"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Submit Report
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;