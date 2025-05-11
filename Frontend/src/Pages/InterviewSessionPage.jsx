import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/InterviewSessionPage.css';
import { speak, cancelSpeech } from '../utils/speechSynthesis';
import { initializeRecognition } from '../utils/speechRecognition';
import Loader from "../Components/Loader";
import { Mic, MicOff } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
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
  // const candidateAnswers=Array(questionCount).fill("");
  
  // Check microphone permissions
  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionGranted(true);
      return true;
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
      setMicPermissionGranted(false);
      return false;
    }
  };

  // Function to handle speaking by the AI interviewer
  const askQuestion = async (question) => {
    setAiSpeaking(true);
    setSubtitle(`${interviewerName}: ${question}`);
    await speak(question);
    setAiSpeaking(false);
    await new Promise(resolve => setTimeout(resolve, 500));
  };
  
  // Toggle recording state
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      // Auto-proceed to next question or submit if last question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        await askQuestion(questions[currentQuestionIndex + 1]);
      } else {
        await submitInterview();
      }
    } else {
      startRecording();
    }
  };

  // Start recording answer
  const startRecording = async () => {
    if (!micPermissionGranted) {
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
    }

    setIsRecording(true);
    setSubtitle("You: [Listening... Speak now]");
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setSubtitle(`You: ${transcript}`);
      // candidateAnswers[currentQuestionIndex]=transcript;
      const updatedAnswers = [...candidateAnswers];
      updatedAnswers[currentQuestionIndex] = transcript;
      setCandidateAnswers(updatedAnswers);
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error("Recognition error:", event.error);
      if (event.error !== 'no-speech') {
        setSubtitle("You: [Recording error]");
      }
    };

    recognitionRef.current.start();
  };

  // Stop recording answer
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setSubtitle(prev => prev.includes("[Listening...") ? "You: [Answer submitted]" : prev);
  };

  // Submit interview results for evaluation
  const submitInterview = async () => {
    console.log(candidateAnswers);
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
    stopRecording();
    cancelSpeech();
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    submitInterview(); // Submit whatever answers we have
  };
  
  // Initial data loading and cleanup
  useEffect(() => {
    if (!interviewDetails) {
      navigate('/interview');
      return;
    }
    
    // Initialize speech recognition and check permissions
    const init = async () => {
      await checkMicrophonePermission();
      recognitionRef.current = initializeRecognition();
    };
    
    init();

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
          
          // Start with first question
          if (data.questions.length > 0) {
            askQuestion(data.questions[0]);
          }
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
      stopRecording();
      cancelSpeech();
    };
  }, [interviewDetails]);
  
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
                {isRecording && <div className="pulse-ring"></div>}
                <span>Your camera view</span>
              </div>
            </div>
            <div className="video-label">You</div>
          </div>
        </div>
        
        <div className="subtitle-area">
          <p className={`subtitle-text ${isRecording ? 'recording-active' : ''}`}>
            {subtitle}
          </p>
        </div>
        
        <div className="interview-actions">
          <button 
            className={`speak-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <MicOff size={18} /> End Answer
              </>
            ) : (
              <>
                <Mic size={18} /> Speak Answer
              </>
            )}
          </button>
          
          <button className="btn btn-outline" onClick={handleEndInterview}>
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;