import React from 'react';
import { motion } from 'framer-motion';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
    <div className="w-8 h-8 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const ProfilePictureUpload = ({ profilePicture, isUploading, fileInputRef, onImageUpload, onRemoveImage }) => {
  return (
    <div className="relative flex justify-center items-center mb-6 group">
      <div
        className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-green-500 transition-all duration-300"
        onClick={() => fileInputRef.current.click()}
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile Preview"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <CameraIcon />
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          className="hidden"
          disabled={isUploading}
          accept="image/*"
        />
        {isUploading && <LoadingSpinner />}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300">
          <p className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold">
            {profilePicture ? 'Change' : 'Upload'}
          </p>
        </div>
      </div>
      {profilePicture && !isUploading && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onRemoveImage}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition"
          title="Remove Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default ProfilePictureUpload;