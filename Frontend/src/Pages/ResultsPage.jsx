
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../Styles/ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;
  const evaluationReport = location.state?.evaluationReport;
  const qna = location.state?.qna;
  // console.log(evaluationReport)

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
  const overall_score = evaluationReport?.overall_score
  const grammar_score = evaluationReport?.grammar_score
  const filler_words_score = evaluationReport?.filler_words_score
  const repetition_score = evaluationReport?.repetition_score
  const content_accuracy_score = evaluationReport?.content_accuracy_score
  const ai_advice=evaluationReport?.ai_advice
  const tips=evaluationReport?.tips

  const questions=qna?.questions
  const ai_answers=qna?.answers
  const candidateAnswers=qna?.candidateAnswers

  // console.log(overall_score)
  const categories = [
    { name: 'Technical Knowledge', score: content_accuracy_score },
    { name: 'Communication', score: grammar_score },
    { name: 'Confidence', score: filler_words_score},
    { name: 'Content', score: repetition_score },
    // { name: 'Problem Solving', score: 80 },
    // { name: 'Culture Fit', score: 90 },
  ];

  const evaluation=[];

  for(var i=0;i<interviewDetails.questionCount;i++){
    evaluation.push({
      "question":questions[i],
      "ai_answer":ai_answers[i],
      "candidate_answer":candidateAnswers[i],
    })
  }

  console.log(tips)
  const improvementTips = tips

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header">
          <h1>Interview Results</h1>
          <div className="interview-meta">
            <span>Domain: {interviewDetails.domain}</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="results-container">
          <div className="overall-score-section">
            <div className="score-circle">
              <div className="score-number">{overall_score}</div>
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
                {ai_advice}
              </p>
            </div>
          </div>

          <div className="answers-analysis">
            <h2>Answer Analysis</h2>
            <div className="answers-list">
              {evaluation.map((details, index) => (
                <div className="answer-item" key={index}>
                  <div className="answer-header">
                    <h3>Question {index + 1}</h3>
                    <div className="answer-score" style={{ backgroundColor: getScoreColor(10) }}>
                      {/* {answer.score}% */}
                      00
                    </div>
                  </div>
                  <div className="question-text">{details.question}</div>
                  <div className="analysis-text">
                    <strong>Ai Answer:</strong> {details.ai_answer}
                  </div>
                  <div className="analysis-text">
                    <strong>Your Answer:</strong> {details.candidate_answer}
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
// const domains = {
//   webdev: 'Web Development',
//   datascience: 'Data Science',
//   mobile: 'Mobile Development',
//   devops: 'DevOps',
//   pm: 'Product Management',
// };

// Helper function to get color based on score
const getScoreColor = (score) => {
  if (score >= 90) return '#4CAF50';  // Green
  if (score >= 70) return '#2196F3';  // Blue
  if (score >= 50) return '#FF9800';  // Orange
  return '#F44336';  // Red
};

export default ResultsPage;
