import React from "react";

const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 rounded-md py-2 font-semibold text-white text-lg cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
