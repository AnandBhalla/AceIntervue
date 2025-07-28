import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/InterviewDetailPage.css';
import USM from '../assets/USM.png';
import USW from '../assets/USW.png';
import INM from '../assets/INM.png';
import INW from '../assets/INW.png';
import { showToast } from '../utils/toast';
import { getDomains } from '../services/api';

const InterviewDetailPage = () => {
  const navigate = useNavigate();

  const [domain, setDomain] = useState('');
  const [techStacks, setTechStacks] = useState([]);
  const [interviewMode, setInterviewMode] = useState('audio');
  const [interviewType, setInterviewType] = useState('qna');
  const [interviewer, setInterviewer] = useState('USM');
  const [questionCount, setQuestionCount] = useState(3);

  const [availableDomains, setAvailableDomains] = useState([]);
  const [loadingDomains, setLoadingDomains] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await getDomains(); 
        setAvailableDomains(res.data);
      } catch (err) {
        showToast('Failed to load domains', 'error');
      } finally {
        setLoadingDomains(false);
      }
    };
    fetchDomains();
  }, []);

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
      showToast('Please select a domain', 'error');
      return;
    }

    if (techStacks.length === 0) {
      showToast('Please select at least one tech stack', 'error');
      return;
    }

    const interviewDetails = {
      domain,
      techStacks,
      interviewMode,
      interviewType,
      interviewer,
      questionCount
    };

    showToast('Starting Interview', 'info');
    navigate('/interview-session', { state: { interviewDetails } });
  };

  return (
    <div className="interview-detail-page">
      <div className="interview-form-container">
        <h1>Interview Details</h1>
        <p className="form-subtitle">
          Set up your mock interview by selecting your domain, technologies, and preferences.
        </p>

        <form className="interview-form" onSubmit={handleSubmit}>

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
                <option value="">Select Domain</option>
                {availableDomains.map(d => (
                  <option key={d.domain} value={d.domain}>
                    {d.domain}
                  </option>
                ))}
              </select>
            )}
          </div>

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

          <div className="form-group">
            <label className="form-label">Mode</label>
            <div className="tab-group">
              <button 
                type="button"
                className={`tab-button ${interviewMode === 'audio' ? 'active' : ''}`}
                onClick={() => setInterviewMode('audio')}
              >
                Audio
              </button>
              <button 
                type="button"
                className={`tab-button ${interviewMode === 'video' ? 'active' : ''}`}
                onClick={() => setInterviewMode('video')}
                disabled
              >
                Video
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="tab-group">
              <button 
                type="button"
                className={`tab-button ${interviewType === 'coding' ? 'active' : ''}`}
                onClick={() => setInterviewType('coding')}
                disabled
              >
                Coding
              </button>
              <button 
                type="button"
                className={`tab-button ${interviewType === 'qna' ? 'active' : ''}`}
                onClick={() => setInterviewType('qna')}
              >
                Q&A
              </button>
              <button 
                type="button"
                className={`tab-button ${interviewType === 'hr' ? 'active' : ''}`}
                onClick={() => setInterviewType('hr')}
                disabled
              >
                HR
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Choose Interviewer</label>
            <div className="interviewer-tabs">
              <button
                type="button"
                className={`interviewer-tab ${interviewer === 'USM' ? 'active' : ''}`}
                onClick={() => setInterviewer('USM')}
              >
                <img src={USM} alt="John Doe" className="interviewer-avatar" />
                <span>John Doe </span>
              </button>
              <button
                type="button"
                className={`interviewer-tab ${interviewer === 'USW' ? 'active' : ''}`}
                onClick={() => setInterviewer('USW')}
              >
                <img src={USW} alt="Jane Doe" className="interviewer-avatar" />
                <span>Jane Doe </span>
              </button>
              <button
  type="button"
  className={`interviewer-tab ${interviewer === 'INM' ? 'active' : ''}`}
  onClick={() => setInterviewer('INM')}
>
  <img src={INM} alt="Deepak " className="interviewer-avatar" />
  <span>Deepak </span>
</button>

<button
  type="button"
  className={`interviewer-tab ${interviewer === 'INW' ? 'active' : ''}`}
  onClick={() => setInterviewer('INW')}
>
  <img src={INW} alt="Deepika " className="interviewer-avatar" />
  <span>Deepika </span>
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
                onClick={() => setQuestionCount(5)}
                disabled
              >
                5 Questions (25 mins)
              </button>
              <button
                type="button"
                className={`count-tab ${questionCount === 10 ? 'active' : ''}`}
                onClick={() => setQuestionCount(10)}
                disabled
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