import React from 'react';
import './Alert.css';

const Alert = ({ message, onClose, show }) => {
  if (!show) return null;

  return (
    <div className="alert">
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Alert;
