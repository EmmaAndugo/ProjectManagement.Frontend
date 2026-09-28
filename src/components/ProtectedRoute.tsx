import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  // User is not authenticated
  if (!token) {
    return <Navigate to="/" replace />
  }

  // No role restriction on this route
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>
  }

  let userRole = ''

  try {
    const user = storedUser ? JSON.parse(storedUser) : null
    userRole = user?.role || ''
  } catch {
    userRole = ''
  }

  // User has no role or their role is not allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute