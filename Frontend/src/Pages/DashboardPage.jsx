
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/DashboardPage.css';

const DashboardPage = () => {
  // Mock data for previous interviews
  const previousInterviews = [
    {
      id: 1,
      date: '2025-04-15',
      domain: 'Web Development',
      score: 85,
      techStack: ['JavaScript', 'React', 'Node.js'],
    },
    {
      id: 2,
      date: '2025-04-10',
      domain: 'Data Science',
      score: 78,
      techStack: ['Python', 'TensorFlow', 'SQL'],
    },
    {
      id: 3,
      date: '2025-04-05',
      domain: 'Web Development',
      score: 92,
      techStack: ['JavaScript', 'Angular', 'Node.js'],
    },
    {
      id: 4,
      date: '2025-03-28',
      domain: 'DevOps',
      score: 81,
      techStack: ['Docker', 'Kubernetes', 'AWS'],
    },
  ];

  // Calculate average score
  const averageScore = Math.round(
    previousInterviews.reduce((acc, interview) => acc + interview.score, 0) / previousInterviews.length
  );

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
                <div className="stat-value">{previousInterviews.length}</div>
                <div className="stat-label">Interviews</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{averageScore}</div>
                <div className="stat-label">Avg. Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {previousInterviews.reduce((max, interview) => Math.max(max, interview.score), 0)}
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
                {previousInterviews.map((interview) => (
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
                        style={{ backgroundColor: getScoreColor(interview.score) }}
                      >
                        {interview.score}%
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
