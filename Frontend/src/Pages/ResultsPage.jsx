
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../Styles/ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;

  if (!interviewDetails) {
    return (
      <div className="container">
        <div className="no-data">
          <h1>No Interview Data Found</h1>
          <p>Please start a new interview.</p>
          <Link to="/interview" className="btn">Start New Interview</Link>
        </div>
      </div>
    );
  }

  // Mock data for interview results
  const overallScore = 85;
  const categories = [
    { name: 'Technical Knowledge', score: 82 },
    { name: 'Communication', score: 88 },
    { name: 'Confidence', score: 85 },
    { name: 'Problem Solving', score: 80 },
    { name: 'Culture Fit', score: 90 },
  ];

  const answers = [
    {
      question: "Tell me about your experience in this field.",
      analysis: "Your answer demonstrated good experience, but could be more specific with examples. Try to quantify your achievements.",
      score: 80,
    },
    {
      question: "How do you handle challenging situations in your work?",
      analysis: "Great response with clear examples and problem-solving approach. Well structured answer.",
      score: 90,
    },
    {
      question: "Can you explain your experience with relevant technologies?",
      analysis: "Good technical knowledge shown, but could elaborate more on practical applications and specific projects.",
      score: 78,
    },
    {
      question: "Describe a project you worked on that you're particularly proud of.",
      analysis: "Excellent description with clear outcomes and your specific contributions. Good storytelling.",
      score: 92,
    },
    {
      question: "How do you stay updated with the latest developments in your field?",
      analysis: "Strong answer showing commitment to continuous learning. Perhaps mention more specific resources.",
      score: 85,
    },
  ].slice(0, interviewDetails.numberOfQuestions);

  const improvementTips = [
    "Use more specific examples when describing your experience",
    "Practice speaking more concisely while still being thorough",
    "Improve technical terminology usage for your domain",
    "Consider preparing additional examples of problem-solving scenarios",
    "Maintain consistent eye contact during video interviews"
  ];

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header">
          <h1>Interview Results</h1>
          <div className="interview-meta">
            <span>Domain: {domains[interviewDetails.domain] || interviewDetails.domain}</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="results-container">
          <div className="overall-score-section">
            <div className="score-circle">
              <div className="score-number">{overallScore}</div>
              <div className="score-label">Overall Score</div>
            </div>
          </div>

          <div className="performance-graph">
            <h2>Performance By Category</h2>
            <div className="graph-container">
              {categories.map((category) => (
                <div className="graph-item" key={category.name}>
                  <div className="graph-label">{category.name}</div>
                  <div className="graph-bar-container">
                    <div 
                      className="graph-bar" 
                      style={{ width: `${category.score}%`, backgroundColor: getScoreColor(category.score) }}
                    ></div>
                    <span className="graph-value">{category.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="insights-section">
            <h2>Key Insights</h2>
            <div className="insights-content">
              <p>
                You demonstrated strong communication skills and technical knowledge. 
                Your responses were generally well-structured, with good examples to 
                support your points. Focus on being more specific with your achievements
                and technical implementations to further improve your interview performance.
              </p>
            </div>
          </div>

          <div className="answers-analysis">
            <h2>Answer Analysis</h2>
            <div className="answers-list">
              {answers.map((answer, index) => (
                <div className="answer-item" key={index}>
                  <div className="answer-header">
                    <h3>Question {index + 1}</h3>
                    <div className="answer-score" style={{ backgroundColor: getScoreColor(answer.score) }}>
                      {answer.score}%
                    </div>
                  </div>
                  <div className="question-text">{answer.question}</div>
                  <div className="analysis-text">
                    <strong>Analysis:</strong> {answer.analysis}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="improvement-plan">
            <h2>Improvement Plan</h2>
            <ul className="improvement-list">
              {improvementTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="results-actions">
            <button className="btn" onClick={() => navigate('/interview')}>
              New Interview
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Domain labels for display
const domains = {
  webdev: 'Web Development',
  datascience: 'Data Science',
  mobile: 'Mobile Development',
  devops: 'DevOps',
  pm: 'Product Management',
};

// Helper function to get color based on score
const getScoreColor = (score) => {
  if (score >= 90) return '#4CAF50';  // Green
  if (score >= 80) return '#2196F3';  // Blue
  if (score >= 70) return '#FF9800';  // Orange
  return '#F44336';  // Red
};

export default ResultsPage;
