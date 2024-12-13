import React from 'react';
import './Pocetna.css';
import { FaRocket, FaMoneyBillWave, FaCogs, FaPalette } from 'react-icons/fa';

const Pocetna = () => {
  return (
    <div className="pocetna-container">
      <header className="pocetna-header">
        <div className="header-content">
          <h1>Lets Get Started With Docbox</h1>
          <p>Pellen tesque in ipsum id orci porta dapibus. Sed porttitor lectus nibh.</p>
          <div className="search-bar">
            <input type="text" placeholder="Search the documentation" />
            <button>Search</button>
          </div>
        </div>
        <div className="header-image">
          {/* Ostavite prazno ili dodajte sliku po potrebi */}
        </div>
      </header>

      <section className="topics-section">
        <h2>All Topics</h2>
        <div className="topics-grid">
          <div className="topic-card">
            <FaRocket className="topic-icon" />
            <h3>Getting Started</h3>
            <p>Introductory information to help you get started.</p>
          </div>
          <div className="topic-card">
            <FaMoneyBillWave className="topic-icon" />
            <h3>Account Bill</h3>
            <p>Details on billing and managing your account.</p>
          </div>
          <div className="topic-card">
            <FaCogs className="topic-icon" />
            <h3>Our Features</h3>
            <p>Explore the features of our application.</p>
          </div>
          <div className="topic-card">
            <FaPalette className="topic-icon" />
            <h3>Theme Facility</h3>
            <p>Customize the appearance of your workspace.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pocetna;
