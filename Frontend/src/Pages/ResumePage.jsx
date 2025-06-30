import React, { useState } from 'react';
import '../styles/ResumePage.css';

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState('builder');

  const resumeFeatures = {
    builder: {
      title: "Resume Builder",
      description: "Create professional resumes with our AI-powered builder that helps you craft compelling content and choose the perfect format.",
      features: [
        "20+ Professional Templates",
        "AI-Powered Content Suggestions",
        "Real-time Preview",
        "ATS-Friendly Formats",
        "Custom Sections",
        "Export to PDF/Word"
      ],
      icon: "📝"
    },
    analyzer: {
      title: "Resume Analyzer",
      description: "Get detailed analysis of your existing resume with actionable insights to improve your chances of getting hired.",
      features: [
        "ATS Compatibility Check",
        "Keyword Optimization",
        "Content Quality Analysis",
        "Industry-Specific Feedback",
        "Scoring & Recommendations",
        "Competitor Comparison"
      ],
      icon: "📊"
    },
    customizer: {
      title: "Resume Customizer",
      description: "Tailor your resume for specific job applications with our intelligent customization engine.",
      features: [
        "Job-Specific Optimization",
        "Skill Matching",
        "Industry Customization",
        "Company Research Integration",
        "Multiple Versions Management",
        "A/B Testing Support"
      ],
      icon: "🎯"
    }
  };

  return (
    <div className="resume-page">
      {/* Hero Section */}
      <section className="resume-hero">
        <div className="container">
          <h1>Professional Resume Tools</h1>
          <p>Build, analyze, and customize your resume with AI-powered precision</p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="resume-tabs-section">
        <div className="container">
          <div className="tabs-navigation">
            {Object.keys(resumeFeatures).map(key => (
              <button
                key={key}
                className={`tab-nav-btn ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <span className="tab-icon">{resumeFeatures[key].icon}</span>
                <span className="tab-title">{resumeFeatures[key].title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="tab-content-section">
        <div className="container">
          <div className="tab-content">
            {Object.keys(resumeFeatures).map(key => (
              <div
                key={key}
                className={`tab-panel ${activeTab === key ? 'active' : ''}`}
              >
                <div className="tab-panel-content">
                  <div className="content-left">
                    <div className="feature-header">
                      <div className="feature-icon">{resumeFeatures[key].icon}</div>
                      <div>
                        <h2>{resumeFeatures[key].title}</h2>
                        <p className="feature-description">
                          {resumeFeatures[key].description}
                        </p>
                      </div>
                    </div>

                    <div className="features-list">
                      <h3>Key Features:</h3>
                      <ul>
                        {resumeFeatures[key].features.map((feature, index) => (
                          <li key={index}>
                            <span className="check-icon">✅</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="cta-buttons">
                      <button className="btn primary-btn">
                        Get Started with {resumeFeatures[key].title}
                      </button>
                      <button className="btn secondary-btn">
                        Learn More
                      </button>
                    </div>
                  </div>

                  <div className="content-right">
                    <div className="feature-preview">
                      {activeTab === 'builder' && (
                        <div className="builder-preview">
                          <div className="template-showcase">
                            <div className="template-card">
                              <div className="template-header">Professional Template</div>
                              <div className="template-body">
                                <div className="template-line long"></div>
                                <div className="template-line medium"></div>
                                <div className="template-line short"></div>
                                <div className="template-section">
                                  <div className="template-line full"></div>
                                  <div className="template-line medium"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'analyzer' && (
                        <div className="analyzer-preview">
                          <div className="analysis-card">
                            <div className="analysis-header">Resume Analysis</div>
                            <div className="score-circle">
                              <div className="score">85</div>
                              <div className="score-label">Score</div>
                            </div>
                            <div className="analysis-metrics">
                              <div className="metric">
                                <span className="metric-label">ATS Compatible</span>
                                <span className="metric-value good">✓</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Keywords</span>
                                <span className="metric-value warning">⚠️</span>
                              </div>
                              <div className="metric">
                                <span className="metric-label">Format</span>
                                <span className="metric-value good">✓</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'customizer' && (
                        <div className="customizer-preview">
                          <div className="job-match-card">
                            <div className="job-header">Job Match Analysis</div>
                            <div className="match-percentage">
                              <div className="percentage-circle">
                                <span className="percentage">92%</span>
                              </div>
                              <span className="match-label">Match</span>
                            </div>
                            <div className="suggestions">
                              <div className="suggestion-item">
                                <span className="suggestion-icon">+</span>
                                Add "React.js" to skills
                              </div>
                              <div className="suggestion-item">
                                <span className="suggestion-icon">✏️</span>
                                Emphasize team leadership
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Resumes Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">ATS Pass Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3x</div>
              <div className="stat-label">More Interview Calls</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="resume-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Build Your Dream Resume?</h2>
            <p>Join thousands of professionals who have successfully landed their dream jobs</p>
            <button className="btn cta-btn">Start Building Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumePage;
