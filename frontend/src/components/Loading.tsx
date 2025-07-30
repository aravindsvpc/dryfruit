import React from 'react';
import logo from './logo.png'; // Adjust the path as necessary

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-amber-50">
      <img src={logo} alt="Logo" className="w-32 h-32 slow-3d rounded-full border-2 border-amber-300 shadow-lg logo-3d-y" />
      <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;