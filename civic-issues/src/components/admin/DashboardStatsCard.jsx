import React from 'react';

/**
 * Dashboard stat card for admin.
 */
const DashboardStatsCard = ({ icon, count, label, color = 'blue', trend }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   text: 'text-blue-900' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  text: 'text-green-900' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  text: 'text-amber-900' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    text: 'text-red-900' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-900' },
  };

  const colorClasses = colors[color] || colors.blue;

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <div className={colorClasses.icon}>{icon}</div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-3xl font-bold ${colorClasses.text}`}>{count ?? '—'}</p>
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          {trend && (
            <p className="text-xs text-gray-400 mt-1">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCard;