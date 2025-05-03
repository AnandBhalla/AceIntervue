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
  const [AiSpeaking, setAiSpeaking] = useState(false);
  const [CandSpeaking, setCandSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  if (loading) return <Loader/>;

  const recognitionRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const user = localStorage.getItem('user');

  const domain = interviewDetails?.domain;
  const techStack = interviewDetails?.techStacks;
  const questionCount = interviewDetails?.questionCount;
  const interviewMode = interviewDetails?.interviewType;
  const interviewerGender = interviewDetails?.interviewer;
  const interviewerName = interviewerGender === 'female' ? 'Jane' : 'John';

  const askQuestion = async (question) => {
    setAiSpeaking(true);
    setSubtitle(`${interviewerName}: ${question}`);
    await speak(question);
    setAiSpeaking(false);
  };

  const getAnswer = async () => {
    setCandSpeaking(true);
    setSubtitle("You: [Listening...]");
    
    const transcript = await new Promise((resolve) => {
      recognitionRef.current.onresult = (event) => {
        resolve(event.results[0][0].transcript);
      };
      recognitionRef.current.start();
    });

    const newAnswers = [...candidateAnswers];
    newAnswers[currentQuestionIndex] = transcript;
    setCandidateAnswers(newAnswers);
    setSubtitle(`You: ${transcript}`);
    setCandSpeaking(false);
    return transcript;
  };

  const runInterviewFlow = async (questions) => {
    for (let i = 0; i < questions.length; i++) {
      setCurrentQuestionIndex(i);
      await askQuestion(questions[i]);
      await getAnswer();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await submitInterview();
  };

  const submitInterview = async () => {
    console.log(candidateAnswers)
    setLoading(true);
    const response = await fetch(`${backendUrl}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions,
        answers,
        candidateAnswers,
        domain,
        techStack,
        user
      }),
    });

    if (response.ok) {
      const evaluationData = await response.json();
      navigate('/results', { 
        state: { interviewDetails, evaluationReport: evaluationData } 
      });
    }
    setLoading(false);
  };

  const handleEndInterview = () => {
    cancelSpeech();
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!interviewDetails) {
      navigate('/interview');
      return;
    }

    recognitionRef.current = initializeRecognition();

    const fetchQuestionsAndAnswers = async () => {
      setLoading(true);
      const payload = {
        domain,
        techStack,
        questionCount,
        interviewMode,
        interviewer: interviewerGender,
        user
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
        runInterviewFlow(data.questions);
      }
      setLoading(false);
    };

    fetchQuestionsAndAnswers();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      cancelSpeech();
    };
  }, [interviewDetails]);

  const getInterviewerVideo = () => {
    const base = interviewerGender === 'female' ? 'female' : 'male';
    return AiSpeaking 
      ? `https://example.com/${base}-speaking.mp4` 
      : `https://example.com/${base}-listening.mp4`;
  };

  if (error) return <div className="interview-session-page">Error: {error}</div>;
  if (!interviewDetails) return <div className="interview-session-page">No interview details found</div>;

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