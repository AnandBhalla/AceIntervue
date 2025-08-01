import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../Styles/ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;
  const evaluationReport = location.state?.evaluationReport;
  const qna = location.state?.qna;

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

  // Calculate average scores from arrays
  const calculateAverage = (scores) => {
    if (!scores || scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 10);
  };

  // Extract scores correctly from evaluation report
  const accuracy_avg = calculateAverage(evaluationReport?.accuracy_scores);
  const grammar_avg = calculateAverage(evaluationReport?.grammar_scores);
  const repetition_avg = calculateAverage(evaluationReport?.repetition_scores);
  const filler_avg = calculateAverage(evaluationReport?.filler_scores);
  const moral_avg = calculateAverage(evaluationReport?.moral_scores);
  const softskills_avg = calculateAverage(evaluationReport?.softskils_scores);

  // Calculate overall score
  const overall_score = Math.round((accuracy_avg + grammar_avg + repetition_avg + filler_avg + moral_avg + softskills_avg) / 6);

  const questions = qna?.questions || [];
  const ai_answers = qna?.answers || [];
  const candidateAnswers = qna?.candidateAnswers || [];

  const categories = [
    { name: 'Technical Knowledge', score: accuracy_avg },
    { name: 'Communication', score: grammar_avg },
    { name: 'Confidence', score: repetition_avg },
    { name: 'Content Quality', score: filler_avg },
    { name: 'Moral Score', score: moral_avg },
    { name: 'Soft Skills', score: softskills_avg },
  ];

  // Build evaluation array with individual question scores
  const evaluation = [];
  const questionCount = Math.min(
    questions.length, 
    ai_answers.length, 
    candidateAnswers.length,
    evaluationReport?.question_scores?.length || 0
  );

  for (let i = 0; i < questionCount; i++) {
    const questionScore = evaluationReport?.question_scores?.[i];
    evaluation.push({
      question: questions[i],
      ai_answer: ai_answers[i],
      candidate_answer: candidateAnswers[i],
      accuracy: questionScore?.accuracy * 10 || 0,
      grammar: questionScore?.grammar * 10 || 0,
      repetition: questionScore?.repetition * 10 || 0,
      filler: questionScore?.filler_words * 10 || 0,
      moral: questionScore?.moral_score * 10 || 0,
      softskills: questionScore?.soft_skill_score * 10 || 0,
      ai_suggestion: questionScore?.ai_suggestion || ''
    });
  }

  // Extract improvement tips from question advices
  const improvementTips = evaluationReport?.question_advices || [];

  // Circle component for individual scores
  const ScoreCircle = ({ score, label, size = 50 }) => (
    <div className="score-circle-small" style={{ width: size, height: size }}>
      <div className="score-number-small">{score}</div>
      <div className="score-label-small">{label}</div>
    </div>
  );

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
            <div className="score-circle" style={{ '--score': overall_score }}>
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

          <div className="answers-analysis">
            <h2>Answer Analysis</h2>
            <div className="answers-list">
              {evaluation.map((details, index) => (
                <div className="answer-item" key={index}>
                  <div className="answer-header">
                    <h3>Question {index + 1}</h3>
                  </div>
                  
                  <div className="question-text">{details.question}</div>
                  
                  <div className="analysis-text">
                    <strong>AI Answer:</strong> {details.ai_answer}
                  </div>
                  
                  <div className="analysis-text">
                    <strong>Your Answer:</strong> {details.candidate_answer}
                  </div>

                  <div className="scores-section">
                    <h4>Performance Metrics:</h4>
                    <div className="scores-grid">
                      <ScoreCircle score={details.accuracy} label="Accuracy" />
                      <ScoreCircle score={details.grammar} label="Grammar" />
                      <ScoreCircle score={details.repetition} label="Repetition" />
                      <ScoreCircle score={details.filler} label="Filler" />
                      <ScoreCircle score={details.moral} label="Moral" />
                      <ScoreCircle score={details.softskills} label="Soft Skills" />
                    </div>
                  </div>

                  {details.ai_suggestion && (
                    <div className="ai-advice">
                      <strong>AI Suggestion:</strong> {details.ai_suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {improvementTips.length > 0 && (
            <div className="improvement-plan">
              <h2>Improvement Plan</h2>
              <ul className="improvement-list">
                {improvementTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

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

// Helper function to get color based on score
const getScoreColor = (score) => {
  if (score >= 90) return '#4CAF50';  // Green
  if (score >= 70) return '#2196F3';  // Blue
  if (score >= 50) return '#FF9800';  // Orange
  return '#F44336';  // Red
};

export default ResultsPage;