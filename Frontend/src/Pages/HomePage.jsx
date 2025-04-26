
import React from 'react';
import '../Styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Master Your Interview Skills with AI</h1>
            <p>Get personalized interview preparation and feedback to land your dream job</p>
            <div className="hero-buttons">
              <a href="/interview"><button className="btn" >Start Practicing Now</button></a>
              
              <button className="btn btn-outline">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1551038247-3d9af20df552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMzc0NjN8MHwxfHNlYXJjaHwzfHxibHVlJTIwYnVzaW5lc3N8ZW58MHx8fHwxNzEzMjY4NDg3fDA&ixlib=rb-4.0.3&q=80&w=400" alt="AI Interview" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>AI-Powered Interviews</h3>
              <p>Practice with realistic AI interviewers tailored to your industry and role</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analysis</h3>
              <p>Get comprehensive feedback on your answers, communication skills, and body language</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Performance Tracking</h3>
              <p>Monitor your progress over time and identify areas for improvement</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Your Interview</h3>
              <p>Select your industry, role, and preferred interview format</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Practice With AI</h3>
              <p>Engage in a realistic interview simulation with our AI interviewer</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Feedback</h3>
              <p>Receive detailed analysis and actionable improvement suggestions</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Track Progress</h3>
              <p>Monitor your improvement over time and practice until perfect</p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why Choose AceIntervue</h2>
          <div className="benefits-container">
            <div className="benefit">
              <h3>Practice Anytime, Anywhere</h3>
              <p>No scheduling constraints - practice at your convenience from any device</p>
            </div>
            <div className="benefit">
              <h3>Industry-Specific Questions</h3>
              <p>Our AI generates relevant questions based on your field and experience level</p>
            </div>
            <div className="benefit">
              <h3>Unbiased Feedback</h3>
              <p>Get objective analysis of your performance without human judgment</p>
            </div>
            <div className="benefit">
              <h3>Affordable Preparation</h3>
              <p>Save money compared to hiring interview coaches while getting similar benefits</p>
            </div>
            <div className="benefit">
              <h3>Unbiased Feedback</h3>
              <p>Get objective analysis of your performance without human judgment</p>
            </div>
            <div className="benefit">
              <h3>Affordable Preparation</h3>
              <p>Save money compared to hiring interview coaches while getting similar benefits</p>
            </div>
          </div>
        </div>
      </section>

      <section className="upcoming-features">
        <div className="container">
          <h2 className="section-title">Coming Soon</h2>
          <div className="upcoming-grid">
            <div className="upcoming-feature">
              <h3>Industry Expert Mode</h3>
              <p>Practice with AI modeled after top professionals in your field</p>
            </div>
            <div className="upcoming-feature">
              <h3>Multilingual Support</h3>
              <p>Practice interviews in multiple languages to prepare for global opportunities</p>
            </div>
            <div className="upcoming-feature">
              <h3>Custom Scenario Builder</h3>
              <p>Create your own interview scenarios and questions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            <div className="faq-item">
              <div className="faq-question">How accurate is the AI interviewer?</div>
              <div className="faq-answer">
                <p>Our AI interviewer is trained on thousands of real interview scenarios and updated regularly to ensure the most realistic experience possible.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">How is my performance evaluated?</div>
              <div className="faq-answer">
                <p>Your performance is evaluated across multiple dimensions including content quality, delivery, confidence, and relevance to the question.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
