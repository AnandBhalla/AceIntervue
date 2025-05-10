import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/InterviewSessionPage.css';
import { speak, cancelSpeech } from '../utils/speechSynthesis';
import { initializeRecognition } from '../utils/speechRecognition';
import Loader from "../Components/Loader";

const InterviewSessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [subtitle, setSubtitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [candidateAnswers, setCandidateAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [candSpeaking, setCandSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiCalledRef = useRef(false);
  const recognitionRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // User and interview details
  const user = localStorage.getItem('user');
  const domain = interviewDetails?.domain;
  const techStack = interviewDetails?.techStacks;
  const questionCount = interviewDetails?.questionCount;
  const interviewType = interviewDetails?.interviewType;
  const interviewMode = interviewDetails?.interviewMode;
  const interviewerName = interviewDetails?.interviewer;
  
  // Function to handle speaking by the AI interviewer
  const askQuestion = async (question) => {
    setAiSpeaking(true);
    setSubtitle(`${interviewerName}: ${question}`);
    await speak(question);
    setAiSpeaking(false);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small pause after speaking
  };
  
  // Function to record candidate's answer
  const getAnswer = async () => {
    setCandSpeaking(true);
    setSubtitle("You: [Listening...]");
    
    try {
      const transcript = await new Promise((resolve, reject) => {
        recognitionRef.current.onresult = (event) => {
          resolve(event.results[0][0].transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          reject(new Error(`Speech recognition error: ${event.error}`));
        };
        
        recognitionRef.current.start();
      });
      
      const newAnswers = [...candidateAnswers];
      newAnswers[currentQuestionIndex] = transcript;
      setCandidateAnswers(newAnswers);
      setSubtitle(`You: ${transcript}`);
      return transcript;
    } catch (err) {
      setError(`Failed to record answer: ${err.message}`);
      return "";
    } finally {
      setCandSpeaking(false);
    }
  };
  
  // Main interview flow controller
  const runInterviewFlow = async () => {
    if (questions.length === 0) return;
    
    for (let i = 0; i < questions.length; i++) {
      setCurrentQuestionIndex(i);
      await askQuestion(questions[i]);
      await getAnswer();
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second pause between Q&A
    }
    
    await submitInterview();
  };
  
  // Submit interview results for evaluation
  const submitInterview = async () => {
    console.log(candidateAnswers)
    setLoading(true);
    const payload = {
      questions,
      answers,
      candidateAnswers,
      domain,
      techStack
    };
    
    try {
      const response = await fetch(`${backendUrl}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const evaluationData = await response.json();
        navigate('/results', {
          state: { interviewDetails, evaluationReport: evaluationData }
        });
      } else {
        setError('Failed to evaluate interview. Please try again.');
      }
    } catch (err) {
      setError(`Error during evaluation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // End the interview early
  const handleEndInterview = () => {
    cancelSpeech();
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    navigate('/dashboard');
  };
  
  // Initial data loading and cleanup
  useEffect(() => {
    if (!interviewDetails) {
      navigate('/interview');
      return;
    }
    
    // Initialize speech recognition
    recognitionRef.current = initializeRecognition();
    
    // Fetch questions and answers only once
    const fetchQuestionsAndAnswers = async () => {
      if (apiCalledRef.current) return;
      apiCalledRef.current = true;
      setLoading(true);
      try {
        const payload = {
          domain,
          techStack,
          questionCount,
          interviewMode,
          interviewerName,
          user,
          interviewType
        };
        
        const response = await fetch(`${backendUrl}/generate-qna`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
          setAnswers(data.answers);
          setCandidateAnswers(new Array(data.questions.length).fill(''));
          setLoading(false);
        } else {
          throw new Error('Failed to fetch interview questions');
        }
      } catch (err) {
        setError(`Error fetching interview data: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchQuestionsAndAnswers();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      cancelSpeech();
    };
  }, [interviewDetails]);
  
  // Start the interview flow after questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      runInterviewFlow();
    }
  }, [questions]);
  
  // Get the appropriate video URL based on state
  const getInterviewerVideo = () => {
    const state = aiSpeaking ? 'speaking' : 'listening';
    return `https://example.com/${state}.mp4`;
  };
  
  // Render error state
  if (error) {
    return (
      <div className="interview-session-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Render loading state
  if (loading) {
    return <Loader />;
  }
  
  // Render main interview UI
  return (
    <div className="interview-session-page">
      <div className="container">
        <div className="interview-header">
          <h1>Interview Session</h1>
          <div className="interview-info">
            <span className="info-item">Domain: {domain}</span>
            <span className="info-item">Question: {currentQuestionIndex + 1}/{questions.length}</span>
            <span className="info-item">Interviewer: {interviewerName}</span>
          </div>
        </div>
        
        <div className="video-container">
          <div className="video-box interviewer">
            <div className="video-feed">
              <video
                src={getInterviewerVideo()}
                autoPlay
                loop
                muted
                alt={`${interviewerName} - Interviewer`}
              />
            </div>
            <div className="video-label">Interviewer: {interviewerName}</div>
          </div>
          
          <div className="video-box candidate">
            <div className="video-feed">
              <div className="camera-placeholder">
                <span>Your camera view</span>
              </div>
            </div>
            <div className="video-label">You</div>
          </div>
        </div>
        
        <div className="subtitle-area">
          <p className="subtitle-text">{subtitle}</p>
        </div>
        
        <div className="interview-actions">
          <button className="btn btn-outline" onClick={handleEndInterview}>
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
