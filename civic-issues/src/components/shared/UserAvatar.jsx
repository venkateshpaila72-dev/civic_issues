import React from 'react';

/**
 * User avatar component — shows profile image or initials.
 */
const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const sizeClass = sizes[size] || sizes.md;

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.fullName || 'User'}
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600 ${className}`}>
      {initials}
    </div>
  );
};

export default UserAvatar;