import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Account from './pages/Account'
import CandidateDashboard from './pages/CandidateDashboard'
import Home from './pages/Home'
import JobDetails from './pages/JobDetails'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import Register from './pages/Register'
import RecruiterApplicants from './pages/RecruiterApplicants'
import RecruiterDashboard from './pages/RecruiterDashboard'
import RecruiterJobForm from './pages/RecruiterJobForm'
import RecruiterJobs from './pages/RecruiterJobs'
import AdminApplications from './pages/AdminApplications'
import AdminDashboard from './pages/AdminDashboard'
import AdminJobs from './pages/AdminJobs'
import AdminUsers from './pages/AdminUsers'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/candidate/dashboard" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterJobs /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/new" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterJobForm /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:jobId/edit" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterJobForm /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterApplicants /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/recruiters" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['admin']}><AdminApplications /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
