import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const ServerErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Server Error</h1>
        <p className="mt-2 text-gray-600 max-w-md">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;