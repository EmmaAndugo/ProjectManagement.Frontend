import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { forgotPassword } from '../api/services/authService'
import ResetPasswordOtp from './ResetPasswordOtp'

function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpStage, setOtpStage] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      const response = await forgotPassword({
        email: email.trim(),
      })

      setSuccess(response.message)
      setOtpStage(true)
    } catch (err) {
      console.error('Forgot password failed:', err)

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message

        if (message) {
          setError(message)
        } else {
          setError('Unable to process your request.')
        }
      } else {
        setError('Unable to process your request.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (otpStage) {
    return <ResetPasswordOtp email={email} />
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
            Forgot Password
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
            Enter your email address and we'll send you a
            password reset OTP.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
                setSuccess('')
              }}
              sx={fieldStyles}
              required
              autoComplete="email"
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
                ? 'Sending...'
                : 'Send Password Reset OTP'}
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
                  backgroundColor: 'rgba(23, 63, 107, 0.04)',
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

export default ForgotPassword