// src/App.js

import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

// Import Font Awesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

function App() {
  // Initialize config from Local Storage or use default values
  const [config, setConfig] = useState(() => {
    try {
      const savedConfig = localStorage.getItem('rewardConfig');
      const parsedConfig = savedConfig ? JSON.parse(savedConfig) : null;
      
      // Validate the parsedConfig
      if (
        parsedConfig &&
        typeof parsedConfig.baseAmount === 'number' &&
        typeof parsedConfig.onlineRate === 'number' &&
        typeof parsedConfig.normalRate === 'number' &&
        typeof parsedConfig.minimumPoints === 'number' &&
        typeof parsedConfig.existingPoints === 'number'
      ) {
        return parsedConfig;
      } else {
        throw new Error('Invalid config structure');
      }
    } catch (error) {
      console.warn('Failed to load config from Local Storage:', error);
      return {
        baseAmount: 150, // Rs. 150
        onlineRate: 4,    // 4 Reward Points per baseAmount spent online
        normalRate: 2,    // 2 Reward Points per baseAmount spent normally
        minimumPoints: 2500,   // Minimum points to withdraw
        existingPoints: 0,     // Existing Reward points balance
      };
    }
  });

  // Save config to Local Storage whenever it changes
  useEffect(() => {
    localStorage.setItem('rewardConfig', JSON.stringify(config));
  }, [config]);

  const POINTS_REQUIRED = useMemo(() => {
    return Math.max(config.minimumPoints - config.existingPoints, 0);
  }, [config.minimumPoints, config.existingPoints]);

  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  // User Spend Inputs
  const [spendInputs, setSpendInputs] = useState({
    onlineSpend: '',
    normalSpend: '',
  });

  // Calculation Results
  const [calculationResult, setCalculationResult] = useState(null);
  const [minimumSpendResult, setMinimumSpendResult] = useState(null);

  // Handlers for Configuration Inputs
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: numericValue >= 0 ? numericValue : 0,
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Optionally, add feedback when saving configurations
      // alert('Configurations saved successfully!');
    }
    setIsEditing(!isEditing);
  };

  // Handlers for Spend Inputs
  const handleSpendChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    setSpendInputs(prevInputs => ({
      ...prevInputs,
      [name]: numericValue >= 0 ? numericValue : 0,
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
      meetsRequirement: totalPoints >= POINTS_REQUIRED,
    });
  };

  // Calculate Minimum Spend required for online and normal separately
  const handleCalculateMinimumSpend = () => {
    const { baseAmount, onlineRate, normalRate } = config;

    if (onlineRate === 0 && normalRate === 0) {
      alert('Both online and normal rates cannot be zero.');
      return;
    }

    const minOnlineSpend = onlineRate > 0
      ? (POINTS_REQUIRED / (onlineRate / baseAmount)).toFixed(2)
      : 'N/A';

    const minNormalSpend = normalRate > 0
      ? (POINTS_REQUIRED / (normalRate / baseAmount)).toFixed(2)
      : 'N/A';

    setMinimumSpendResult({
      minOnlineSpend: minOnlineSpend !== 'N/A' ? parseFloat(minOnlineSpend) : minOnlineSpend,
      minNormalSpend: minNormalSpend !== 'N/A' ? parseFloat(minNormalSpend) : minNormalSpend,
    });
  };

  // Clear All Inputs and Results
  const handleClear = () => {
    setSpendInputs({
      onlineSpend: '',
      normalSpend: '',
    });
    setCalculationResult(null);
    setMinimumSpendResult(null);
  };

  // Handler to reset configuration to default (Optional)
  const handleResetConfig = () => {
    const defaultConfig = {
      baseAmount: 150,
      onlineRate: 4,
      normalRate: 2,
      minimumPoints: 2500,
      existingPoints: 0,
    };
    setConfig(defaultConfig);
    // Saving to Local Storage is handled by useEffect
    alert('Configurations have been reset to default values.');
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
              <label htmlFor="baseAmount">Base Amount (Rs.):</label>
              <input
                type="number"
                id="baseAmount"
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
              <label htmlFor="onlineRate">Reward Points per Base Amount Online:</label>
              <input
                type="number"
                id="onlineRate"
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
              <label htmlFor="normalRate">Reward Points per Base Amount Normally:</label>
              <input
                type="number"
                id="normalRate"
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
              <label htmlFor="minimumPoints">Minimum Reward Points Required:</label>
              <input
                type="number"
                id="minimumPoints"
                name="minimumPoints"
                value={config.minimumPoints}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="0"
                step="1"
                className="medium-input"
              />
            </div>
            <div className="input-group medium">
              <label htmlFor="existingPoints">Existing Reward Points:</label>
              <input
                type="number"
                id="existingPoints"
                name="existingPoints"
                value={config.existingPoints}
                onChange={handleConfigChange}
                disabled={!isEditing}
                min="0"
                step="1"
                className="medium-input"
              />
            </div>
            <div className="button-group">
              <button onClick={toggleEdit} className="edit-btn" aria-label={isEditing ? 'Save configurations' : 'Edit configurations'}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
              <button onClick={handleResetConfig} className="reset-btn">
                Reset to Default
              </button>
            </div>
          </div>
        </section>

        {/* Spend Inputs Section */}
        <section className="spend-section">
          <h2>Enter Your Spendings</h2>
          <div className="form">
            <div className="input-group medium">
              <label htmlFor="onlineSpend">Online Spend (Rs.):</label>
              <input
                type="number"
                id="onlineSpend"
                name="onlineSpend"
                value={spendInputs.onlineSpend}
                onChange={handleSpendChange}
                placeholder="Enter amount spent online"
                min="0"
                className="medium-input"
              />
            </div>
            <div className="input-group medium">
              <label htmlFor="normalSpend">Normal Spend (Rs.):</label>
              <input
                type="number"
                id="normalSpend"
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
          {POINTS_REQUIRED === 0 ? (
            <p>You have already met the minimum points required for withdrawal.</p>
          ) : (
            <>
              <button onClick={handleCalculateMinimumSpend} className="min-btn">
                Calculate Minimum Spend
              </button>

              {minimumSpendResult && (
                <div className="minimum-results">
                  <h3>Total Online Spend Required</h3>
                  <p>
                    <strong>Online Spend:</strong>{' '}
                    {minimumSpendResult.minOnlineSpend !== 'N/A'
                      ? `Rs. ${minimumSpendResult.minOnlineSpend.toFixed(2)}`
                      : 'N/A'}
                  </p>

                  <h3>Total Normal Spend Required</h3>
                  <p>
                    <strong>Normal Spend:</strong>{' '}
                    {minimumSpendResult.minNormalSpend !== 'N/A'
                      ? `Rs. ${minimumSpendResult.minNormalSpend.toFixed(2)}`
                      : 'N/A'}
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Contact Us Section */}
        <section className="contact-section">
          <h2>Get in Touch with Us for Support, Sales, or General Inquiries!</h2>
          <div className="contact-details">
            {/* Stylized Name */}
            <p className="stylized-name">
              <span className="red">K</span>
              <span className="blue">adiravan&nbsp;</span>
              <span className="red">K</span>
              <span className="blue">alidoss..!</span>
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