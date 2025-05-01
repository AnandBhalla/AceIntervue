import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import '../Styles/InterviewSessionPage.css';
import { speak, cancelSpeech } from '../utils/speechSynthesis';
import { initializeRecognition, startListening } from '../utils/speechRecognition';

const InterviewSessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(interviewDetails?.interviewType === 'video');
  const [isMicOn, setIsMicOn] = useState(true);
  const [subtitle, setSubtitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [candidateAnswers, setCandidateAnswers] = useState([]);
  const [AiSpeaking, setAiSpeaking] = useState(false);
  const [CandSpeaking, setCandSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (!interviewDetails) {
      navigate('/interview');
      return;
    }
  
    const fetchQuestionsAndAnswers = async () => {
      setLoading(true);
      setError(null);
  
      const payload = {
        domain: interviewDetails.domain,
        techStack: interviewDetails.techStacks,
        questionCount: interviewDetails.numberOfQuestions || 5,
        interviewMode: interviewDetails.interviewType || 'audio',
        user: user
      };
  
      const response = await fetch(`${backendUrl}/generate-qna`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        setError('Failed to load interview questions');
        setLoading(false);
        return;
      }
  
      const data = await response.json();
  
      const questions = Array.isArray(data.questions)
        ? data.questions
        : data.questions.split("\n").filter(q => q.trim());
      
      const answers = Array.isArray(data.answers)
        ? data.answers
        : data.answers.split("\n").filter(a => a.trim());
  
      setQuestions(questions);
      setAnswers(answers);
      setCandidateAnswers(new Array(questions.length).fill(''));
  
      if (questions.length > 0) {
        const interviewer = interviewDetails?.interviewer === 'female' ? 'Jane' : 'John';
        setSubtitle(`${interviewer}: ${questions[0]}`);
        speakQuestion(questions[0], interviewer);
      }
  
      setLoading(false);
    };
  
    fetchQuestionsAndAnswers();
  }, [interviewDetails, navigate, backendUrl, user]);

  useEffect(() => {
    recognitionRef.current = initializeRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      cancelSpeech();
    };
  }, []);
  
  const handleSpeechEnd = () => {
    setAiSpeaking(false);
  };

  const speakQuestion = async (text, speaker) => {
    cancelSpeech();
    setAiSpeaking(true);
    await speak(text);
    setAiSpeaking(false);
    startCandidateResponse();
  };

  const startCandidateResponse = async () => {
    if (isMicOn && recognitionRef.current) {
      setCandSpeaking(true);
      setSubtitle("You: [Speaking...]");
      
      const transcript = await startListening(recognitionRef.current);
      
      const newAnswers = [...candidateAnswers];
      newAnswers[currentQuestionIndex] = transcript;
      setCandidateAnswers(newAnswers);
      
      setSubtitle(`You: ${transcript}`);
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          moveToNextQuestion();
        } else {
          submitInterview();
        }
      }, 1000);
    }
  };

  const stopCandidateResponse = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setCandSpeaking(false);
  };

  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    if (nextIndex < questions.length) {
      const interviewer = interviewDetails?.interviewer === 'female' ? 'Jane' : 'John';
      setSubtitle(`${interviewer}: ${questions[nextIndex]}`);
      speakQuestion(questions[nextIndex], interviewer);
    }
  };

  const submitInterview = async () => {
    setLoading(true);
    const response = await fetch(`${backendUrl}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions,
        modelAnswers: answers,
        candidateAnswers,
        domain: interviewDetails.domain,
        tech_stack: interviewDetails.techStack
      }),
    });

    if (response.ok) {
      const evaluationData = await response.json();
      navigate('/results', { 
        state: { 
          interviewDetails,
          evaluationReport: evaluationData 
        } 
      });
    } else {
      setError('Failed to submit interview');
    }
    setLoading(false);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (!isMicOn && CandSpeaking) {
      startCandidateResponse();
    } else if (isMicOn && CandSpeaking) {
      stopCandidateResponse();
    }
  };

  const handleSpeakButtonClick = () => {
    if (CandSpeaking) {
      stopCandidateResponse();
    } else {
      startCandidateResponse();
    }
  };

  const handleEndInterview = () => {
    cancelSpeech();
    stopCandidateResponse();
    navigate('/dashboard');
  };

  if (loading && questions.length === 0) {
    return <div className="interview-session-page">Loading interview questions...</div>;
  }

  if (error) {
    return <div className="interview-session-page">Error: {error}</div>;
  }

  if (!interviewDetails) {
    return <div className="interview-session-page">No interview details found</div>;
  }

  const domains = {
    webdev: 'Web Development',
    datascience: 'Data Science',
    mobile: 'Mobile Development',
    devops: 'DevOps',
    pm: 'Product Management',
  };

  const interviewer = interviewDetails?.interviewer === 'female' ? 'Jane' : 'John';

  return (
    <div className="interview-session-page">
      <div className="container">
        <div className="interview-header">
          <h1>Interview Session</h1>
          <div className="interview-info">
            <span className="info-item">Domain: {domains[interviewDetails.domain] || interviewDetails.domain}</span>
            <span className="info-item">Question: {currentQuestionIndex + 1}/{questions.length}</span>
            <span className="info-item">Interviewer: {interviewer}</span>
          </div>
        </div>

        <div className="video-container">
          <div className="video-box interviewer">
            <div className="video-feed">
              <img
                src={
                  interviewDetails.interviewer === 'female'
                    ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8YnVzaW5lc3MgcGVyc29uIGZlbWFsZXx8fHx8fDE2MTYxODExMjA&ixlib=rb-1.2.1&q=80&w=300"
                    : "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8YnVzaW5lc3MgcGVyc29uIG1hbGV8fHx8fHwxNjE2MTgxMTIw&ixlib=rb-1.2.1&q=80&w=300"
                }
                alt={`${interviewer} - Interviewer`}
              />
            </div>
            <div className="video-label">
              Interviewer: {interviewer}
            </div>
          </div>

          <div className="video-box candidate">
            <div className="video-feed">
              {isVideoOn ? (
                <div className="camera-placeholder">
                  <span>Your camera view</span>
                </div>
              ) : (
                <div className="video-off-placeholder">
                  <VideoOff size={40} />
                  <span>Camera Off</span>
                </div>
              )}
            </div>
            <div className="video-label">
              You
            </div>
            <div className="video-controls">
              <button className={`control-btn ${isVideoOn ? 'active' : ''}`} onClick={toggleVideo}>
                {isVideoOn ? <Video /> : <VideoOff />}
              </button>
              <button className={`control-btn ${isMicOn ? 'active' : ''}`} onClick={toggleMic}>
                {isMicOn ? <Mic /> : <MicOff />}
              </button>
              <button
                className={`speak-btn ${CandSpeaking ? 'speaking' : ''}`}
                onClick={handleSpeakButtonClick}
                disabled={!isMicOn || AiSpeaking}
              >
                {CandSpeaking ? 'End Response' : 'Speak Now'}
              </button>
            </div>
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