import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InterviewDetailPage.css';

const InterviewDetailPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [domain, setDomain] = useState('');
  const [techStacks, setTechStacks] = useState([]);
  const [interviewType, setInterviewType] = useState('audio');
  const [interviewer, setInterviewer] = useState('john');
  const [questionCount, setQuestionCount] = useState(5);
  const [formError, setFormError] = useState('');
  
  // Domain-specific tech stacks
  const techStackOptions = {
    'web-dev': ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'MongoDB', 'GraphQL'],
    'data-science': ['Python', 'R', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'SQL'],
    'mobile-dev': ['React Native', 'Flutter', 'iOS/Swift', 'Android/Kotlin', 'Xamarin'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform'],
    'cyber-security': ['Network Security', 'Penetration Testing', 'Security Auditing', 'Cryptography']
  };
  
  const handleTechStackChange = (tech) => {
    if (techStacks.includes(tech)) {
      setTechStacks(techStacks.filter(item => item !== tech));
    } else {
      setTechStacks([...techStacks, tech]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!domain) {
      setFormError('Please select a domain');
      return;
    }
    
    if (techStacks.length === 0) {
      setFormError('Please select at least one tech stack');
      return;
    }
    
    // Prepare interview details
    const interviewDetails = {
      domain,
      techStacks,
      interviewType,
      interviewer,
      questionCount
    };
    
    // Navigate to interview session with interview details
    navigate('/interview-session', { state: { interviewDetails } });
  };

  return (
    <div className="interview-detail-page">
      <div className="interview-form-container">
        <h1>Configure Your Interview</h1>
        <p className="form-subtitle">
          Set up your mock interview by selecting your domain, technologies, and preferences.
        </p>
        
        {formError && <div className="error-message">{formError}</div>}
        
        <form className="interview-form" onSubmit={handleSubmit}>
          {/* Domain Selection */}
          <div className="form-group">
            <label className="form-label">Select Domain</label>
            <select 
              className="form-select" 
              value={domain} 
              onChange={(e) => {
                setDomain(e.target.value);
                setTechStacks([]);
              }}
            >
              <option value="">-- Select Domain --</option>
              <option value="web-dev">Web Development</option>
              <option value="data-science">Data Science</option>
              <option value="mobile-dev">Mobile Development</option>
              <option value="devops">DevOps</option>
              <option value="cyber-security">Cyber Security</option>
            </select>
          </div>
          
          {/* Tech Stack Selection */}
          {domain && (
            <div className="form-group">
              <label className="form-label">Select Tech Stacks</label>
              <div className="tech-stack-tabs">
                {techStackOptions[domain].map(tech => (
                  <button
                    key={tech}
                    type="button"
                    className={`tech-stack-tab ${techStacks.includes(tech) ? 'active' : ''}`}
                    onClick={() => handleTechStackChange(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <div className="tech-selection-hint">
                {techStacks.length > 0 ? 
                  `Selected: ${techStacks.length} ${techStacks.length === 1 ? 'technology' : 'technologies'}` : 
                  'Please select at least one technology'}
              </div>
            </div>
          )}
          
          {/* Interview Type Tabs */}
          <div className="form-group">
            <label className="form-label">Interview Type</label>
            <div className="tab-group">
              <button 
                type="button"
                className={`tab-button ${interviewType === 'audio' ? 'active' : ''}`}
                onClick={() => setInterviewType('audio')}
              >
                Audio
              </button>
              <button 
                type="button"
                className={`tab-button ${interviewType === 'video' ? 'active' : ''}`}
                onClick={() => setInterviewType('video')}
              >
                Video
              </button>
            </div>
          </div>
          
          {/* Interviewer Selection Tabs */}
          <div className="form-group">
            <label className="form-label">Choose Interviewer</label>
            <div className="interviewer-tabs">
              <button
                type="button"
                className={`interviewer-tab ${interviewer === 'john' ? 'active' : ''}`}
                onClick={() => setInterviewer('john')}
              >
                <div className="interviewer-avatar john"></div>
                <span>John Doe (Male)</span>
              </button>
              <button
                type="button"
                className={`interviewer-tab ${interviewer === 'jane' ? 'active' : ''}`}
                onClick={() => setInterviewer('jane')}
              >
                <div className="interviewer-avatar jane"></div>
                <span>Jane Doe (Female)</span>
              </button>
            </div>
          </div>
          
          {/* Number of Questions Tabs */}
          <div className="form-group">
            <label className="form-label">Number of Questions</label>
            <div className="question-count-tabs">
              <button
                type="button"
                className={`count-tab ${questionCount === 3 ? 'active' : ''}`}
                onClick={() => setQuestionCount(3)}
              >
                3 Questions (15 mins)
              </button>
              <button
                type="button"
                className={`count-tab ${questionCount === 5 ? 'active' : ''}`}
                onClick={() => setQuestionCount(5)}
              >
                5 Questions (25 mins)
              </button>
              <button
                type="button"
                className={`count-tab ${questionCount === 10 ? 'active' : ''}`}
                onClick={() => setQuestionCount(10)}
              >
                10 Questions (45 mins)
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary start-interview-btn">
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewDetailPage;