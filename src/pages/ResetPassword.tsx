import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { resetPassword } from '../api/services/authService'

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()

  const verificationToken =
    location.state?.verificationToken

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!verificationToken) {
      setError(
        'Your password reset session is invalid or has expired.'
      )
      return
    }

    if (!newPassword) {
      setError('New password is required.')
      return
    }

    if (newPassword.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      )
      return
    }

    if (!confirmPassword) {
      setError('Please confirm your password.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await resetPassword({
        verificationToken,
        newPassword,
        confirmPassword,
      })

      setSuccess(response.message)

      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
  navigate('/login')
}, 1500)
    } catch (err) {
      console.error('Password reset failed:', err)

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message

        if (message) {
          setError(message)
        } else {
          setError(
            'Unable to reset your password.'
          )
        }
      } else {
        setError(
          'Unable to reset your password.'
        )
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
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            backgroundColor: '#ffffff',
            border: '1px solid rgba(15, 39, 71, 0.08)',
          }}
        >
          <Typography
            component="h1"
            align="center"
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
            Reset Password
          </Typography>

          <Typography
            align="center"
            sx={{
              color: '#4b5563',
              fontSize: {
                xs: '0.9rem',
                sm: '0.95rem',
              },
              lineHeight: 1.6,
              mb: 3.5,
            }}
          >
            Create a new password for your project
            management account.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value)
                setError('')
                setSuccess('')
              }}
              sx={fieldStyles}
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
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
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setError('')
                setSuccess('')
              }}
              sx={fieldStyles}
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
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
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: '#173f6b',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0f2747',
                },
              }}
            >
              {loading
                ? 'Resetting...'
                : 'Reset Password'}
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
                sx={{
                  color: '#9ca3af',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
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
              onClick={() => navigate('/login')}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: '#173f6b',
                color: '#173f6b',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#0f2747',
                  backgroundColor:
                    'rgba(23, 63, 107, 0.04)',
                },
              }}
            >
              Back to Login
            </Button>
          </Box>

          <Typography
            align="center"
            sx={{
              mt: 3,
              color: '#6b7280',
              fontSize: '0.8rem',
            }}
          >
            Secure password recovery for your project
            management workspace.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default ResetPassword