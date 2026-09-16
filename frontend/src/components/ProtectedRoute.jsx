import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import useAuth from '../context/useAuth'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner label="Checking your session" />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />

  return children
}

export default ProtectedRoute
