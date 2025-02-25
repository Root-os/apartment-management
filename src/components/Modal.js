import React from 'react';

const Modal = ({ isOpen, onClose, messageType, message }) => {
  if (!isOpen) return null;

  const modalStyles = messageType === 'success' 
    ? 'bg-green-100 text-green-800 border-green-300'
    : 'bg-red-100 text-red-800 border-red-300';

  return (
    <div className="fixed inset-0 flex justify-center items-center  z-50">
      <div  className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6 border-2 ${modalStyles}`}>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl">{messageType === 'success' ? 'Success' : 'Error'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-center text-lg">{message}</p>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={onClose} 
            className={`px-4 py-2 rounded-lg ${messageType === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
