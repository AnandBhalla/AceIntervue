
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>AceIntervue</h3>
            <p>
              AI-powered mock interviews to help you land your dream job.
              Practice, get feedback, and improve with AceIntervue.
            </p>
          </div>

          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/interview">AI Interview</Link></li>
              <li><Link to="/preparation">Preparation</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>
              <span>Email: </span>
              <a href="mailto:info@aceintervue.com">info@aceintervue.com</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AceIntervue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
