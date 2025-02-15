import React from "react";
import { Link } from "react-router-dom";
import "./Extras.css";

const Extras = () => {
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all app data? This action cannot be undone.")) {
      localStorage.clear();
      alert("All app data has been cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="extras-container">
      <h2>Extras</h2>

      <div className="extras-section">
        <h3>About</h3>
        <p>Priorify helps you set, track, and accomplish your daily goals while unlocking achievements along the way.</p>
      </div>

      <div className="extras-section">
        <h3>Contact Us</h3>
        <p>Have feedback or suggestions? Reach out at <a href="mailto:abiodun0j0453@gmail.com">support@priorify.com</a></p>
      </div>

      <div className="extras-section">
        <h3>Rate the App</h3>
        <button className="disabled-btn" disabled>Coming Soon</button>
      </div>

      <div className="extras-section">
        <h3>Privacy Policy</h3>
        <Link to="/extras/privacy-policy">View Privacy Policy</Link>
      </div>

      <div className="extras-section">
        <h3>Terms of Use</h3>
        <Link to="/extras/terms-of-use">View Terms of Use</Link>
      </div>

      <div className="extras-section">
        <h3>Version Info</h3>
        <p>Current Version: 1.0.0</p>
      </div>

      <div className="extras-section">
        <h3>Clear Data</h3>
        <button className="clear-btn" onClick={handleClearData}>Clear All Data</button>
      </div>
    </div>
  );
};

export default Extras;
