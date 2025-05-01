import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import '../styles/InterviewDetailPage.css';

const InterviewDetailPage = () => {
  const navigate = useNavigate();
  
  const [domain, setDomain] = useState('');
  const [techStacks, setTechStacks] = useState([]);
  const [interviewType, setInterviewType] = useState('audio');
  const [interviewer, setInterviewer] = useState('john');
  const [questionCount, setQuestionCount] = useState(5);
  const [formError, setFormError] = useState('');

  const [availableDomains, setAvailableDomains] = useState([]); // New: fetched domains
  const [loadingDomains, setLoadingDomains] = useState(true);    // New: loading state
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await axios.get(`${backendUrl}/domain/`);
        setAvailableDomains(res.data); // Save the fetched domains
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setLoadingDomains(false);
      }
    };
    fetchDomains();
  }, [backendUrl]);

  const handleTechStackChange = (tech) => {
    if (techStacks.includes(tech)) {
      setTechStacks(techStacks.filter(item => item !== tech));
    } else {
      setTechStacks([...techStacks, tech]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!domain) {
      setFormError('Please select a domain');
      return;
    }

    if (techStacks.length === 0) {
      setFormError('Please select at least one tech stack');
      return;
    }

    const interviewDetails = {
      domain,
      techStacks,
      interviewType,
      interviewer,
      questionCount
    };

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
            {loadingDomains ? (
              <p>Loading domains...</p>
            ) : (
              <select 
                className="form-select" 
                value={domain} 
                onChange={(e) => {
                  setDomain(e.target.value);
                  setTechStacks([]);
                }}
              >
                <option value="">-- Select Domain --</option>
                {availableDomains.map(d => (
                  <option key={d.domain} value={d.domain}>
                    {d.domain}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tech Stack Selection */}
          {domain && availableDomains.find(d => d.domain === domain) && (
            <div className="form-group">
              <label className="form-label">Select Tech Stacks</label>
              <div className="tech-stack-tabs">
                {availableDomains.find(d => d.domain === domain)?.techStacks.map(tech => (
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

          {/* Interview Type, Interviewer, Question Count as before */}
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
                onClick={() => setQuestionCount(5)
                }
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
