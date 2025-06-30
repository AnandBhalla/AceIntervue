import React from 'react';
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About AceIntervue</h1>
          <p>Empowering careers through AI-powered interview preparation</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="who-we-are">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>Who We Are</h2>
              <p>
                AceIntervue is a cutting-edge platform that leverages artificial intelligence 
                to revolutionize interview preparation. We believe that everyone deserves the 
                opportunity to showcase their true potential during job interviews.
              </p>
              <p>
                Our mission is to bridge the gap between talent and opportunity by providing 
                personalized, AI-driven mock interviews that simulate real-world scenarios 
                and provide actionable feedback.
              </p>
            </div>
            <div className="content-image">
              <img src="/placeholder.svg" alt="About Us" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously evolve our AI technology to provide the most realistic and helpful interview experience.</p>
            </div>
            <div className="value-card">
              <h3>Accessibility</h3>
              <p>Quality interview preparation should be available to everyone, regardless of their background or location.</p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>We strive for perfection in every aspect of our platform to help you achieve your career goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="privacy-section">
        <div className="container">
          <h2 className="section-title">Privacy Policy</h2>
          <div className="privacy-content">
            <div className="privacy-item">
              <h3>Data Collection</h3>
              <p>
                We collect only the necessary information to provide you with personalized 
                interview experiences. This includes your profile information, interview 
                recordings (stored securely), and performance analytics.
              </p>
            </div>
            <div className="privacy-item">
              <h3>Data Security</h3>
              <p>
                Your data is encrypted and stored using industry-standard security measures. 
                We never share your personal information or interview recordings with third parties 
                without your explicit consent.
              </p>
            </div>
            <div className="privacy-item">
              <h3>Data Usage</h3>
              <p>
                We use your data solely to improve your interview preparation experience 
                and provide personalized feedback. You have full control over your data 
                and can request deletion at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><strong>Email:</strong> info@aceintervue.com</p>
              <p><strong>Support:</strong> support@aceintervue.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" className="form-input"></textarea>
                </div>
                <button type="submit" className="btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
