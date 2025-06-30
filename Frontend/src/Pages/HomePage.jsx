import React from 'react';
import '../Styles/HomePage.css';
import home from '../assets/home.png'

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
              <a href="#learn"><button className="btn btn-outline">Learn More</button></a>
              
            </div>
          </div>
          <div className="hero-image">
            <img src={home} alt="" />
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
          <h2 className="section-title" id='learn'>How It Works</h2>
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
              <h3>Resume Enhancement</h3>
              <p>Get AI-driven feedback on your resume to ensure it aligns with your target job roles and highlights your strengths effectively.</p>
            </div>
            <div className="benefit">
              <h3>Affordable Preparation</h3>
              <p>Quickly create professional, job-ready resumes using our AI-assisted builder — tailored to your industry, experience level, and goals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="upcoming-features">
        <div className="container">
          <h2 className="section-title">Coming Soon</h2>
          <div className="upcoming-grid">
            <div className="upcoming-feature">
              <h3>Company-Specific Questions</h3>
              <p>Practice with the most frequently asked questions from top companies like Google, Amazon, TCS, and more — updated regularly.</p>
            </div>
            <div className="upcoming-feature">
              <h3>Full Interview Rounds</h3>
              <p>Simulate complete interview rounds including coding challenges, technical deep-dives, and HR questions for end-to-end preparation.</p>
            </div>
            <div className="upcoming-feature">
              <h3>Preparation Modules & Materials</h3>
              <p>Access structured prep tracks, curated study material, and role-specific learning resources to sharpen your skills and boost your confidence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
<div className="faq-item">
  <div className="faq-question">How does AceIntervue help me prepare for interviews?</div>
  <div className="faq-answer">
    <p>AceIntervue offers AI-powered mock interviews tailored to your role and industry, providing detailed feedback on your answers, communication, and confidence.</p>
  </div>
</div>

<div className="faq-item">
  <div className="faq-question">What kind of feedback do I receive after an interview?</div>
  <div className="faq-answer">
    <p>You receive comprehensive feedback on communication, content accuracy, facial expressions, Authenticity  and an overall score with tips to improve.</p>
  </div>
</div>

<div className="faq-item">
  <div className="faq-question">Can I track my performance over time?</div>
  <div className="faq-answer">
    <p>Yes, AceIntervue tracks your interview performance history so you can monitor progress and focus on areas needing improvement.</p>
  </div>
</div>

<div className="faq-item">
  <div className="faq-question">Does AceIntervue help with resumes?</div>
  <div className="faq-answer">
    <p>Yes, we offer AI-powered resume analysis and a resume builder to help you create professional, targeted resumes aligned with your job goals.</p>
  </div>
</div>

<div className="faq-item">
  <div className="faq-question">Is AceIntervue suitable for both students and professionals?</div>
  <div className="faq-answer">
    <p>Absolutely. Whether you're a fresher or an experienced candidate, AceIntervue adapts to your background and customizes interviews accordingly.</p>
  </div>
</div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
