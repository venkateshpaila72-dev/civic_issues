import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Department selector for officers.
 * Shows assigned departments as cards to choose from.
 */
const DepartmentSelector = ({ departments = [], selectedId, onSelect, loading }) => {
    console.log(
        'Departments received:',
        departments.map((d, i) => ({
            index: i,
            type: typeof d,
            value: d,
            _id: d?._id,
        }))
    );

    if (departments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Departments Assigned</h3>
                <p className="text-gray-500">Please contact an administrator to assign you to a department.</p>
            </div>

        );

    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
                <Card
                    key={dept._id}
                    className={`cursor-pointer transition-all ${selectedId === dept._id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:shadow-lg hover:border-blue-200'
                        }`}
                    onClick={() => onSelect(dept._id)}
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{dept.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{dept.code}</p>

                        {dept.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dept.description}</p>
                        )}

                        {selectedId === dept._id && (
                            <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Selected
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DepartmentSelector;