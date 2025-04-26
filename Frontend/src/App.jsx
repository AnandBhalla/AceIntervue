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
import ProtectedRoute from "./Components/ProtectedRoute"; // <--- added

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes start here */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute>
            <InterviewDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/interview-session" element={
          <ProtectedRoute>
            <InterviewSessionPage />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        <Route path="/results/:id" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        <Route path="/preparation" element={
          <ProtectedRoute>
            <PreparationPage />
          </ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        } />
        <Route path="/cv" element={
          <ProtectedRoute>
            <CVPage />
          </ProtectedRoute>
        } />
        {/* Protected Routes end */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
