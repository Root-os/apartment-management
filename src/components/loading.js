import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 dark:bg-base-900">
      {/* Spinner container */}
      <div className="relative flex items-center justify-center w-48 h-48 border-8 border-primary rounded-full animate-spin">
        {/* Home Icon inside the spinner */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-16 h-16 text-gray-800 dark:text-gray-200"
        >
          <path
            d="M3 9l9-7 9 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M9 22V12h6v10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingComponent;
