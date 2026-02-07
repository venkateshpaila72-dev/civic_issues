import React, { useState, useRef } from 'react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { ERROR } from '../../constants/messages';
import { isValidPhone } from '../../utils/validation';
import { createPreviewURL, revokePreviewURL } from '../../utils/fileUtils';

/**
 * Profile edit form for citizens.
 * Handles fullName, phoneNumber, address, and profile image upload.
 */
const ProfileForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address?.street || '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.profileImage || null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, profileImage: 'Please select an image file' }));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profileImage: 'Image must be less than 10MB' }));
      return;
    }

    // Revoke old preview URL
    if (imagePreview && imagePreview.startsWith('blob:')) {
      revokePreviewURL(imagePreview);
    }

    // Set new image and preview
    setProfileImage(file);
    const preview = createPreviewURL(file);
    setImagePreview(preview);
    setErrors((prev) => ({ ...prev, profileImage: '' }));
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      revokePreviewURL(imagePreview);
    }
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = ERROR.REQUIRED('Full name');
    }

    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = ERROR.PHONE_INVALID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim() || null,
      address: formData.address.trim() || null,
    };

    if (profileImage) {
      payload.profileImage = profileImage;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <div>
        <label className="input-label">Profile Image</label>
        <div className="flex items-center gap-4">
          {/* Avatar preview */}
          <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                {formData.fullName.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image-input"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Image
              </Button>
              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              )}
            </div>
            {errors.profileImage && (
              <p className="text-xs text-red-500 mt-1">{errors.profileImage}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WEBP. Max 10MB.</p>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        required
      />

      {/* Email (read-only) */}
      <Input
        label="Email"
        value={initialData?.email || ''}
        disabled
        hint="Email cannot be changed"
      />

      {/* Phone Number */}
      <Input
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        placeholder="9876543210"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        hint="10-15 digits"
      />

      {/* Address */}
      <TextArea
        label="Address"
        name="address"
        placeholder="Enter your address"
        value={formData.address}
        onChange={handleChange}
        rows={3}
      />

      {/* Submit */}
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Save Changes
      </Button>
    </form>
  );
};

export default ProfileForm;