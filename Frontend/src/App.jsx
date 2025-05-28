import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import InterviewDetailPage from "./Pages/InterviewDetailPage";
import InterviewSessionPage from "./Pages/InterviewSessionPage";
import ResultsPage from "./Pages/ResultsPage";
import DashboardPage from "./Pages/DashboardPage";
import PreparationPage from "./Pages/PreparationPage";
import ResumePage from "./Pages/ResumePage";
import CVPage from "./Pages/CVPage";
import NotFound from "./Pages/NotFound";
import VerifyEmailPage from "./Pages/VerifyEmailPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewDetailPage /></ProtectedRoute>} />
        <Route path="/interview-session" element={<ProtectedRoute><InterviewSessionPage /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/preparation" element={<ProtectedRoute><PreparationPage /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
        <Route path="/cv" element={<ProtectedRoute><CVPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Layout>
  </BrowserRouter>
);

export default App;