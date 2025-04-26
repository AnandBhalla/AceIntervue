
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import '../Styles/InterviewSessionPage.css';

const InterviewSessionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewDetails = location.state?.interviewDetails;
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(interviewDetails?.interviewType === 'video');
  const [isMicOn, setIsMicOn] = useState(true);
  const [subtitle, setSubtitle] = useState('');

  // Mock questions based on domain
  const questions = [
    "Tell me about your experience in this field.",
    "How do you handle challenging situations in your work?",
    // `Can you explain your experience with ${interviewDetails?.techStack[0] || 'relevant technologies'}?`,
    "Describe a project you worked on that you're particularly proud of.",
    "How do you stay updated with the latest developments in your field?",
    "What are your strengths and weaknesses related to this role?",
    "Where do you see yourself in 5 years?",
    "Describe a time when you had to work with a difficult team member.",
    "What motivates you in your professional work?",
    "Do you have any questions for me about the role or company?"
  ].slice(0, interviewDetails?.numberOfQuestions || 5);

  // Mock interviewer subtitles
  const interviewer = interviewDetails?.interviewer === 'female' ? 'Jane' : 'John';
  
  useEffect(() => {
    if (!interviewDetails) {
      navigate('/interview');
      return;
    }
    
    // Simulate interviewer speaking for each question
    setSubtitle(`${interviewer}: ${questions[currentQuestion - 1]}`);
  }, [currentQuestion, interviewer, questions, interviewDetails, navigate]);

  const handleSpeakClick = () => {
    setIsSpeaking(!isSpeaking);
    
    // Simulate candidate response and next question
    if (!isSpeaking) {
      setSubtitle(`You: [Speaking...]`);
      
      // Simulate end of candidate response after 5 seconds
      setTimeout(() => {
        if (currentQuestion < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setIsSpeaking(false);
        } else {
          // Interview complete
          navigate('/results', { state: { interviewDetails } });
        }
      }, 5000);
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  if (!interviewDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="interview-session-page">
      <div className="container">
        <div className="interview-header">
          <h1>Interview Session</h1>
          <div className="interview-info">
            <span className="info-item">Domain: {domains[interviewDetails.domain] || interviewDetails.domain}</span>
            <span className="info-item">Question: {currentQuestion}/{questions.length}</span>
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
                className={`speak-btn ${isSpeaking ? 'speaking' : ''}`} 
                onClick={handleSpeakClick}
                disabled={!isMicOn}
              >
                {isSpeaking ? 'End Response' : 'Speak Now'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="subtitle-area">
          <p className="subtitle-text">{subtitle}</p>
        </div>
        
        <div className="interview-actions">
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
            End Interview
          </button>
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

export default InterviewSessionPage;
