import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { speak, cancelSpeech } from '../utils/speechSynthesis';
import { initializeRecognition } from '../utils/speechRecognition';
import Loader from "../Components/Loader";
import { fetchQuestionsAndAnswersFromAPI } from '../services/InterviewServices';
import '../Styles/InterviewSessionPage.css';
import USM from '../assets/USM.png';
import USW from '../assets/USW.png';
import INM from '../assets/INM.png';
import INW from '../assets/INW.png';
import cand from '../assets/candidate.png';

const InterviewSessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [candidateAnswers, setCandidateAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [subtitle, setSubtitle] = useState('');
  const [error, setError] = useState(null);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  const apiCalledRef = useRef(false);
  const recognitionRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const user = localStorage.getItem('user');
  const domain = interviewDetails?.domain;
  const techStack = interviewDetails?.techStacks;
  const questionCount = interviewDetails?.questionCount;
  const interviewType = interviewDetails?.interviewType;
  const interviewMode = interviewDetails?.interviewMode;
  const interviewerCode = interviewDetails?.interviewer;

  const interviewerDetails = {
    USM: { name: "John", image: USM },
    USW: { name: "Jane", image: USW },
    INM: { name: "Deepak", image: INM },
    INW: { name: "Deepika", image: INW },
  };

  const interviewerImage = interviewerDetails[interviewerCode]?.image;
  const interviewerName = interviewerDetails[interviewerCode]?.name;



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

  const askQuestion = async (question) => {
    setAiSpeaking(true);
    setSubtitle(`${interviewerName}: ${question}`);
    await speak(question, interviewerCode);
    setAiSpeaking(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

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

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setSubtitle((prev) => (prev.includes("[Listening...") ? "You: [Answer submitted]" : prev));
  };

  const submitInterview = async () => {
    setLoading(true);
    const payload = {
      questions,
      answers,
      candidateAnswers,
      domain,
      techStack,
      user,
    };
    const qna = { questions, answers, candidateAnswers };

    try {
      const response = await fetch(`${backendUrl}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const evaluationData = await response.json();
        navigate('/results', {
          state: { interviewDetails, evaluationReport: evaluationData.results, qna },
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

  const handleEndInterview = () => {
    stopRecording();
    cancelSpeech();
    if (recognitionRef.current) recognitionRef.current.abort();
    const handleEndInterview = async () => {
      stopRecording();
      cancelSpeech();
      if (recognitionRef.current) recognitionRef.current.abort();
      submitInterview();
    };
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        await askQuestion(questions[nextIndex]);
      } else {
        await submitInterview();
      }
    } else {
      startRecording();
    }
  };

  if (interviewMode === "video") {
    const videoElement = document.getElementById('userCamera');

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
      });
  }

  const TakeInterview = async () => {
    await checkMicrophonePermission();

    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }

    if (apiCalledRef.current) return;
    apiCalledRef.current = true;

    setLoading(true);
    const payload = {
      domain,
      techStack,
      questionCount,
      interviewMode,
      interviewerName,
      user,
      interviewType,
    };

    const data = await fetchQuestionsAndAnswersFromAPI(payload, backendUrl);
    setQuestions(data.questions);
    setAnswers(data.answers);
    setCandidateAnswers(new Array(data.questions.length).fill(''));
    setLoading(false);

    if (data.questions.length > 0) {
      await askQuestion(data.questions[0]);
    }
  };

  useEffect(() => {
    if (!interviewDetails) {
      navigate('/interview');
      return;
    }

    TakeInterview();

    return () => {
      stopRecording();
      cancelSpeech();
    };
  }, [interviewDetails]);

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

  if (loading) return <Loader />;

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
              <div className="camera-placeholder">
                <img src={interviewerImage} alt={`Interviewer: ${interviewerName}`} />
              </div>
            </div>
            <div className="video-label">Interviewer: {interviewerName}</div>
          </div>

          <div className="video-box candidate">
            <div className="video-feed">
              <div className="camera-placeholder">
                {interviewMode === "audio" ? (
                  <img src={cand} alt="Candidate" />
                ) : (
                  <video id="userCamera" autoPlay playsInline muted></video>
                )}
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
            {isRecording ? "End Answer" : "Speak Answer"}
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
