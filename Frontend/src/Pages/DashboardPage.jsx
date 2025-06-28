
import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../Styles/DashboardPage.css';
import axios from 'axios';

const DashboardPage = () => {
  // Mock data for previous interviews
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const user = localStorage.getItem('user');
  // console.log(user)
  const [interviews, setInterviews] = useState([])
  const [loadingInterviews, setloadingInterviews] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/profile/${user}`);
        setInterviews(res.data)
      }  
      finally {
        setloadingInterviews(false);
      }
    };
    fetchInterviews();
  }, [backendUrl]);


// console.log(interviews)

  const previousInterviews=[]



  // Calculate average score
  const scores = interviews
  .map(interview => interview.result?.overall_score) 

  // console.log(scores)

const averageScore = scores.length
  ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
  : 0;

  // console.log(averageScore)

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Your Dashboard</h1>
          <Link to="/interview" className="btn">Take New Interview</Link>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card summary-card">
            <h2>Interview Summary</h2>
            <div className="summary-stats">
              <div className="stat-item">
                <div className="stat-value">{interviews.length}</div>
                <div className="stat-label">Interviews</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{averageScore}</div>
                <div className="stat-label">Avg. Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.max(...scores)}
                </div>
                <div className="stat-label">Best Score</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card progress-card">
            <h2>Your Progress</h2>
            <div className="progress-chart">
              <div className="chart-placeholder">
                Progress chart visualization would be here
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card interviews-card">
          <div className="card-header">
            <h2>Previous Interviews</h2>
          </div>
          <div className="interviews-table-container">
            <table className="interviews-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Domain</th>
                  <th className="hide-mobile">Technologies</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>{new Date(interview.date).toLocaleDateString()}</td>
                    <td>{interview.domain}</td>
                    <td className="hide-mobile">
                      <div className="tech-stack-tags">
                        {interview.techStack.map((tech, index) => (
                          <span key={index} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div 
                        className="score-badge" 
                        style={{ backgroundColor: getScoreColor(interview.result.overall_score) }}
                      >
                        {interview.result.overall_score}%
                      </div>
                    </td>
                    <td>
                      <Link to={`/results/${interview.id}`} className="btn btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card recommendations-card">
            <h2>Recommended Practice</h2>
            <ul className="recommendations-list">
              <li>
                <div className="recommendation-title">Technical Communication</div>
                <div className="recommendation-desc">Practice explaining complex concepts more clearly</div>
              </li>
              <li>
                <div className="recommendation-title">Problem Solving</div>
                <div className="recommendation-desc">Work on verbalizing your thought process</div>
              </li>
              <li>
                <div className="recommendation-title">STAR Method</div>
                <div className="recommendation-desc">Practice structuring your answers more effectively</div>
              </li>
            </ul>
          </div>

          <div className="dashboard-card upcoming-card">
            <h2>Upcoming Features</h2>
            <ul className="upcoming-list">
              <li>
                <div className="upcoming-icon">🎯</div>
                <div className="upcoming-info">
                  <div className="upcoming-title">Custom Interview Scenarios</div>
                  <div className="upcoming-desc">Create your own interview questions and scenarios</div>
                </div>
              </li>
              <li>
                <div className="upcoming-icon">📊</div>
                <div className="upcoming-info">
                  <div className="upcoming-title">Advanced Analytics</div>
                  <div className="upcoming-desc">Get deeper insights into your interview performance</div>
                </div>
              </li>
              <li>
                <div className="upcoming-icon">🏆</div>
                <div className="upcoming-info">
                  <div className="upcoming-title">Interview Competitions</div>
                  <div className="upcoming-desc">Compare your scores with other users</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on score
const getScoreColor = (score) => {
  if (score >= 90) return '#4CAF50';  // Green
  if (score >= 80) return '#2196F3';  // Blue
  if (score >= 70) return '#FF9800';  // Orange
  return '#F44336';  // Red
};

export default DashboardPage;
