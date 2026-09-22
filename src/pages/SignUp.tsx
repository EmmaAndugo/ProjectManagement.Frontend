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
} from '@mui/icons-material'
import axios from 'axios'
import { registerUser } from '../api/services/authService'

function SignUp() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!fullName.trim()) {
      setError('Full Name is required.')
      return
    }

    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (!confirmPassword) {
      setError('Please confirm your password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await registerUser({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      })

      setSuccess(response.message)

      setFullName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      console.error('Registration failed:', err)

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message

        if (message) {
          setError(message)
        } else {
          setError('Registration failed. Please try again.')
        }
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fieldStyles = {
    mt: 1.5,
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
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fb',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          px: {
            xs: 2,
            sm: 3,
          },
          py: {
            xs: 3,
            sm: 5,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'rgba(15, 39, 71, 0.08)',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: '1.8rem',
                sm: '2rem',
              },
              fontWeight: 700,
              color: '#172b4d',
              mb: 1,
            }}
          >
            Create Account
          </Typography>

          <Typography
  sx={{
    mb: 3.5,
    color: '#4b5563',
    fontSize: {
      xs: '0.9rem',
      sm: '0.95rem',
    },
    lineHeight: 1.6,
  }}
>
  Create your account to get started with your project workspace.
</Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value)
                setError('')
              }}
              margin="normal"
              required
              autoComplete="name"
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value)
                setError('')
              }}
              margin="normal"
              required
              autoComplete="username"
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              margin="normal"
              required
              autoComplete="email"
              sx={fieldStyles}
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
              autoComplete="new-password"
              sx={fieldStyles}
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

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setError('')
              }}
              margin="normal"
              required
              autoComplete="new-password"
              sx={fieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      edge="end"
                      aria-label={
                        showConfirmPassword
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
                      {showConfirmPassword ? (
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

            {success && (
              <Alert
                severity="success"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                }}
              >
                {success}
              </Alert>
            )}

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
              {loading ? 'Creating Account...' : 'Sign Up'}
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
              onClick={() => navigate('/login')}
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
              Already have an account? Login
            </Button>

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
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SignUp