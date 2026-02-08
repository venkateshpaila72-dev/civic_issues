import React from 'react';

/**
 * Stats grid for officer dashboard.
 */
const DashboardStatsGrid = ({ stats }) => {
  const cards = [
    {
      label: 'Total Reports',
      value: stats?.total || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue',
    },
    {
      label: 'Pending',
      value: stats?.pending || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'amber',
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'orange',
    },
    {
      label: 'Resolved',
      value: stats?.resolved || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
    },
  ];

  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   text: 'text-blue-900' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  text: 'text-amber-900' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', text: 'text-orange-900' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  text: 'text-green-900' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const colorClasses = colors[card.color];
        
        return (
          <div key={card.label} className="card">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <div className={colorClasses.icon}>{card.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-3xl font-bold ${colorClasses.text}`}>{card.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatsGrid;