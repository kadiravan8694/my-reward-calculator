// src/App.js

import React, { useState } from 'react';
import './App.css';

// Import Font Awesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

function App() {
  // Constants
  //const POINTS_REQUIRED = 2500; // Minimum points to withdraw

  // Configuration State
  const [config, setConfig] = useState({
    baseAmount: 150, // Rs. 150
    onlineRate: 4,    // 4 Reward Points per baseAmount spent online
    normalRate: 2,    // 2 Reward Points per baseAmount spent normally
	minimumPoints: 2500,   // Minimum points to withdraw
	existingPoints: 0   // Existing Reward points balance
  });
  const POINTS_REQUIRED = (config.minimumPoints-config.existingPoints); // Minimum points to withdraw

  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  // User Spend Inputs
  const [spendInputs, setSpendInputs] = useState({
    onlineSpend: '',
    normalSpend: ''
  });

  // Calculation Results
  const [calculationResult, setCalculationResult] = useState(null);
  const [minimumSpendResult, setMinimumSpendResult] = useState(null);

  // Handlers for Configuration Inputs
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: parseFloat(value) || 0
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handlers for Spend Inputs
  const handleSpendChange = (e) => {
    const { name, value } = e.target;
    setSpendInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  // Calculate Reward Points based on user spends
  const handleCalculatePoints = () => {
    const online = parseFloat(spendInputs.onlineSpend) || 0;
    const normal = parseFloat(spendInputs.normalSpend) || 0;

    // Calculate points
    const pointsFromOnline = (config.onlineRate / config.baseAmount) * online;
    const pointsFromNormal = (config.normalRate / config.baseAmount) * normal;
    const totalPoints = pointsFromOnline + pointsFromNormal;

    setCalculationResult({
      onlineSpend: online,
      normalSpend: normal,
      pointsFromOnline: pointsFromOnline,
      pointsFromNormal: pointsFromNormal,
      totalPoints: totalPoints,
      meetsRequirement: totalPoints >= POINTS_REQUIRED
    });
  };

  // Calculate Minimum Spend required for online and normal separately
  const handleCalculateMinimumSpend = () => {
    const { baseAmount, onlineRate, normalRate } = config;

    // Minimum online spend to achieve POINTS_REQUIRED
    const minOnlineSpend = (POINTS_REQUIRED / (onlineRate / baseAmount)).toFixed(2);

    // Minimum normal spend to achieve POINTS_REQUIRED
    const minNormalSpend = (POINTS_REQUIRED / (normalRate / baseAmount)).toFixed(2);

    setMinimumSpendResult({
      minOnlineSpend: parseFloat(minOnlineSpend),
      minNormalSpend: parseFloat(minNormalSpend)
    });
  };

  // Clear All Inputs and Results
  const handleClear = () => {
    setSpendInputs({
      onlineSpend: '',
      normalSpend: ''
    });
    setCalculationResult(null);
    setMinimumSpendResult(null);
  };

  return (
    <div className="App">
      <header>
        <h1>Reward Points Calculator</h1>
      </header>
      <main>
        {/* Configuration Section */}
        <section className="config-section">
          <h2>Configure Reward Rates</h2>
          <div className="config-form">
            <div className="input-group medium">
              <label>Base Amount (Rs.):</label>
              <input
                type="number"
                name="baseAmount"
                value={config.baseAmount}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="1"
                step="1"
                className="medium-input"
              />
            </div>
            <div className="input-group medium">
              <label>Reward Points per Base Amount Online:</label>
              <input
                type="number"
                name="onlineRate"
                value={config.onlineRate}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="0"
                step="0.1"
                className="medium-input"
              />
            </div>
            <div className="input-group medium">
              <label>Reward Points per Base Amount Normally:</label>
              <input
                type="number"
                name="normalRate"
                value={config.normalRate}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="0"
                step="0.1"
                className="medium-input"
              />
            </div>
			<div className="input-group medium">
              <label>Minimum Reward Points Required:</label>
              <input
                type="number"
                name="minimumPoints"
                value={config.minimumPoints}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="0"
                step="0.1"
                className="medium-input"
              />
            </div>
			<div className="input-group medium">
              <label>Existing Reward Points:</label>
              <input
                type="number"
                name="existingPoints"
                value={config.existingPoints}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="0"
                step="0.1"
                className="medium-input"
              />
            </div>
            <div className="button-group">
              <button onClick={toggleEdit} className="edit-btn">
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </section>

        {/* Spend Inputs Section */}
        <section className="spend-section">
          <h2>Enter Your Spendings</h2>
          <div className="form">
            <div className="input-group medium">
              <label>Online Spend (Rs.):</label>
              <input
                type="number"
                name="onlineSpend"
                value={spendInputs.onlineSpend}
                onChange={handleSpendChange}
                placeholder="Enter amount spent online"
                min="0"
                className="medium-input"
              />
            </div>
            <div className="input-group medium">
              <label>Normal Spend (Rs.):</label>
              <input
                type="number"
                name="normalSpend"
                value={spendInputs.normalSpend}
                onChange={handleSpendChange}
                placeholder="Enter amount spent normally"
                min="0"
                className="medium-input"
              />
            </div>
            <div className="buttons">
              <button onClick={handleCalculatePoints} className="calculate-btn">
                Calculate Points
              </button>
              <button onClick={handleClear} className="clear-btn">
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Calculation Results Section */}
        {calculationResult && (
          <section className="result-section">
            <h2>Calculation Result</h2>
            <p>
              <strong>Online Spend:</strong> Rs. {calculationResult.onlineSpend.toFixed(2)}
            </p>
            <p>
              <strong>Normal Spend:</strong> Rs. {calculationResult.normalSpend.toFixed(2)}
            </p>
            <p>
              <strong>Points from Online Spend:</strong> {calculationResult.pointsFromOnline.toFixed(2)}
            </p>
            <p>
              <strong>Points from Normal Spend:</strong> {calculationResult.pointsFromNormal.toFixed(2)}
            </p>
            <p>
              <strong>Total Points:</strong> {calculationResult.totalPoints.toFixed(2)}{' '}
              {calculationResult.meetsRequirement ? (
                <span className="success">(Meets Requirement)</span>
              ) : (
                <span className="failure">(Does Not Meet Requirement)</span>
              )}
            </p>
          </section>
        )}

        {/* Minimum Spend Calculation Section */}
        <section className="minimum-spend-section">
          <h2>Minimum Spend to Achieve {POINTS_REQUIRED} Points</h2>
          <button onClick={handleCalculateMinimumSpend} className="min-btn">
            Calculate Minimum Spend
          </button>

          {minimumSpendResult && (
            <div className="minimum-results">
              <h3>Total Online Spend Required</h3>
              <p>
                <strong>Online Spend:</strong> Rs. {minimumSpendResult.minOnlineSpend.toFixed(2)}
              </p>

              <h3>Total Normal Spend Required</h3>
              <p>
                <strong>Normal Spend:</strong> Rs. {minimumSpendResult.minNormalSpend.toFixed(2)}
              </p>
            </div>
          )}
        </section>

        {/* Contact Us Section */}
        <section className="contact-section">
          <h2>Contact Us</h2>
          <div className="contact-details">
            {/* Stylized Name */}
            <p style={{ textAlign: 'center', fontSize: '20px', marginBottom: '15px' }}>
              <span style={{ color: 'red' }}>K</span>
              <span style={{ color: '#0b5394' }}>adiravan&nbsp;</span>
              <span style={{ color: 'red' }}>K</span>
              <span style={{ color: '#0b5394' }}>alidoss..!</span>
            </p>

            {/* Contact Items */}
            <div className="contact-item">
              <FontAwesomeIcon icon={faMobileAlt} className="icon" />
              <a href="tel:+919003264685" className="contact-link">+91-9003264685</a>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <a href="mailto:kadiravankalidoss@gmail.com" className="contact-link">kadiravankalidoss@gmail.com</a>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faLinkedin} className="icon" />
              <a href="https://www.linkedin.com/in/kadiravank" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faInstagram} className="icon" />
              <a href="https://www.instagram.com/jack.kadir/" target="_blank" rel="noopener noreferrer" className="contact-link">Instagram</a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Reward Points Calculator</p>
      </footer>
    </div>
  );
}

export default App;