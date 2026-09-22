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
import { verifyOtp } from '../api/services/authService'

interface ResetPasswordOtpProps {
  email: string
}

function ResetPasswordOtp({
  email,
}: ResetPasswordOtpProps) {
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setError('')

    if (!code.trim()) {
      setError('OTP is required.')
      return
    }

    if (!/^\d{6}$/.test(code)) {
      setError('OTP must be exactly 6 digits.')
      return
    }

    setLoading(true)

    try {
      const response = await verifyOtp({
        usernameOrEmail: email,
        code,
        purpose: 'RESET_PASSWORD',
      })

      navigate('/reset-password', {
        state: {
          verificationToken:
            response.verificationToken,
        },
      })
    } catch (err) {
      console.error(
        'Password reset OTP verification failed:',
        err
      )

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message

        if (message) {
          setError(message)
        } else {
          setError('Invalid or expired OTP.')
        }
      } else {
        setError('Invalid or expired OTP.')
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
            Verify Password Reset
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
            Enter the 6-digit OTP sent to your email
            to continue resetting your password.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="OTP"
              value={code}
              onChange={(event) => {
                setCode(
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6)
                )
                setError('')
              }}
              sx={{
                ...fieldStyles,
                '& .MuiInputBase-input': {
                  color: '#172b4d',
                  fontWeight: 600,
                  textAlign: 'center',
                  letterSpacing: '0.35em',
                  fontSize: '1.25rem',
                },
              }}
              required
              autoComplete="one-time-code"
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
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
                ? 'Verifying...'
                : 'Verify OTP'}
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

export default ResetPasswordOtp