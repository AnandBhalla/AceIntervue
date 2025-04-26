import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import InterviewDetailPage from "./pages/InterviewDetailPage";
import InterviewSessionPage from "./pages/InterviewSessionPage";
import ResultsPage from "./pages/ResultsPage";
import DashboardPage from "./pages/DashboardPage";
import PreparationPage from "./pages/PreparationPage";
import ResumePage from "./pages/ResumePage";
import CVPage from "./pages/CVPage";
import NotFound from "./pages/NotFound";
import VerifyEmailPage from "./Pages/VerifyEmailPage";


const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/interview" element={<InterviewDetailPage />} />
        <Route path="/interview-session" element={<InterviewSessionPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/preparation" element={<PreparationPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/cv" element={<CVPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;