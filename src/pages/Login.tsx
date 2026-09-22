import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from '@mui/icons-material'
import {
  loginUser,
  completeLogin,
} from '../api/services/authService'
import VerifyOtp from './VerifyOtp'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpRequired, setOtpRequired] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setError('')

    if (!usernameOrEmail.trim()) {
      setError('Username or email is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    setLoading(true)

    try {
      const response = await loginUser({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      })

      if (response.requiresOtp) {
        setOtpRequired(true)
      }
    } catch (err) {
      console.error('Login failed:', err)
      setError('Invalid username/email or password.')
    } finally {
      setLoading(false)
    }
  }

  if (otpRequired) {
    return (
      <VerifyOtp
        usernameOrEmail={usernameOrEmail}
        onVerified={async (verificationToken) => {
          try {
            const response = await completeLogin({
              verificationToken,
            })

           localStorage.setItem('token', response.token)

localStorage.setItem(
  'user',
  JSON.stringify(response.user)
)

            console.log(response.message)
            console.log('JWT token and user information stored')

            onLogin()
            navigate('/dashboard')
          } catch (err) {
            console.error('Complete login failed:', err)
            setError('Unable to complete login.')
          }
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fb',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            minHeight: '100vh',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Left visual section */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              minHeight: { xs: 300, md: '100vh' },
              background:
                'linear-gradient(135deg, #0f2747 0%, #173f6b 55%, #20558a 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 4, sm: 6, md: 8 },
              py: { xs: 6, md: 8 },
            }}
          >
            <Box sx={{ maxWidth: 520, width: '100%' }}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 2,
                  opacity: 0.8,
                }}
              >
                PROJECT MANAGEMENT
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mt: 2,
                  mb: 3,
                }}
              >
                Welcome back.
                <br />
                Let's get things done.
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  lineHeight: 1.7,
                  opacity: 0.85,
                  maxWidth: 470,
                  mb: 4,
                }}
              >
                Plan smarter, collaborate better, and keep every
                project moving forward from one central workspace.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {[
                  'Manage projects from one place',
                  'Track tasks and deadlines',
                  'Collaborate with your teams',
                ].map((feature) => (
                  <Box
                    key={feature}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <CheckCircleOutline
                      sx={{
                        fontSize: 22,
                        opacity: 0.9,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: '0.98rem',
                        fontWeight: 500,
                        opacity: 0.9,
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Right login section */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 3, sm: 5, md: 7 },
              py: { xs: 5, md: 6 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: 480,
                p: { xs: 3, sm: 5 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(15, 39, 71, 0.08)',
                backgroundColor: 'white',
              }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2rem' },
                  fontWeight: 700,
                  color: '#172b4d',
                  mb: 1,
                }}
              >
                Welcome back
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 3.5,
                  lineHeight: 1.6,
                }}
              >
                Sign in to continue to your project workspace.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
  fullWidth
  label="Username or Email"
  value={usernameOrEmail}
  onChange={(event) => {
    setUsernameOrEmail(event.target.value)
    setError('')
  }}
  margin="normal"
  required
  autoComplete="username"
  sx={{
    '& .MuiInputLabel-root': {
      color: '#4b5563',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#173f6b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      color: '#172b4d',
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: '#9ca3af',
        borderWidth: 1.5,
      },
      '&:hover fieldset': {
        borderColor: '#173f6b',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#173f6b',
        borderWidth: 2,
      },
    },
    '& .MuiInputBase-input': {
      color: '#172b4d',
      fontWeight: 500,
    },
  }}
/>

               <TextField
  fullWidth
  label="Password"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(event) => {
    setPassword(event.target.value)
    setError('')
  }}
  margin="normal"
  required
  autoComplete="current-password"
  sx={{
    '& .MuiInputLabel-root': {
      color: '#4b5563',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#173f6b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      color: '#172b4d',
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: '#9ca3af',
        borderWidth: 1.5,
      },
      '&:hover fieldset': {
        borderColor: '#173f6b',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#173f6b',
        borderWidth: 2,
      },
    },
    '& .MuiInputBase-input': {
      color: '#172b4d',
      fontWeight: 500,
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() =>
            setShowPassword((previous) => !previous)
          }
          edge="end"
          aria-label={
            showPassword
              ? 'Hide password'
              : 'Show password'
          }
          sx={{
            color: '#4b5563',
            '&:hover': {
              color: '#173f6b',
            },
          }}
        >
          {showPassword ? (
            <VisibilityOff />
          ) : (
            <Visibility />
          )}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 1,
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/forgot-password')}
                    disabled={loading}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    backgroundColor: '#173f6b',
                    '&:hover': {
                      backgroundColor: '#0f2747',
                    },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    my: 3,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    OR
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/signup')}
                  disabled={loading}
                  sx={{
                    py: 1.35,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#173f6b',
                    color: '#173f6b',
                    '&:hover': {
                      borderColor: '#0f2747',
                      backgroundColor: 'rgba(23, 63, 107, 0.04)',
                    },
                  }}
                >
                  Don't have an account? Sign Up
                </Button>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{
                  mt: 4,
                  lineHeight: 1.6,
                }}
              >
                Secure access to your project management workspace.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Login