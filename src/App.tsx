import { useMemo, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPasswordOtp from './pages/ResetPasswordOtp'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Contact from './pages/Contact'
import About from './pages/About'
import ProjectWorkspace from './pages/ProjectWorkspace'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import ResetPassword from './pages/ResetPassword'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Teams from './pages/Teams'
import Notifications from './pages/Notifications'
import Users from './pages/Users'
import Resources from './pages/Resources'
import SystemLogs from './pages/SystemLogs'

import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material'

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  )

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  )

  const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',

        ...(darkMode
          ? {
              background: {
                default: '#101522',
                paper: '#172033',
              },
              text: {
                primary: '#f8fafc',
                secondary: '#aeb7c6',
              },
              divider: 'rgba(255,255,255,0.10)',
            }
          : {
              background: {
                default: '#f5f7fb',
                paper: '#ffffff',
              },
              text: {
                primary: '#172033',
                secondary: '#7a8494',
              },
              divider: '#e8eaf0',
            }),
      },
    }),
  [darkMode]
)

  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled)
    localStorage.setItem('darkMode', String(enabled))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>

          {/* Public Routes */}

          <Route
  path="/"
  element={
    token ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <LandingPage />
    )
  }
/>

<Route
  path="/login"
  element={
    token ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Login
        onLogin={() =>
          setToken(localStorage.getItem('token'))
        }
      />
    )
  }
/>

          <Route
            path="/signup"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <SignUp />
              )
            }
          />

          <Route
            path="/forgot-password"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ForgotPassword />
              )
            }
          />

          <Route
            path="/reset-password-otp"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ResetPasswordOtp email="" />
              )
            }
          />

          <Route
            path="/reset-password"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ResetPassword />
              )
            }
          />

          {/* Protected Application */}

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/teams"
              element={<Teams />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

           <Route
  path="/users"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <Users />
    </ProtectedRoute>
  }
/>

            <Route
  path="/resources"
  element={<Resources />}
/>
<Route
  path="/system-logs"
  element={
    <ProtectedRoute allowedRoles={['Admin']}>
      <SystemLogs />
    </ProtectedRoute>
  }
/>

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={
                <Settings
                  darkMode={darkMode}
                  onDarkModeChange={handleDarkModeChange}
                />
              }
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="*"
              element={<NotFound />}
            />

            <Route
  path="/projects/:projectId"
  element={<ProjectWorkspace />}
/>
          </Route>

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App