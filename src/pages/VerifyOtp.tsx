import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {
  requestOtp,
  verifyOtp,
} from '../api/services/authService'

interface VerifyOtpProps {
  usernameOrEmail: string
  onVerified: (verificationToken: string) => void
}

function VerifyOtp({
  usernameOrEmail,
  onVerified,
}: VerifyOtpProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)

  useEffect(() => {
    if (timeLeft <= 0) {
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formattedTime = `${minutes
    .toString()
    .padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (timeLeft <= 0) {
      setError(
        'OTP has expired. Please request a new OTP.'
      )
      return
    }

    if (code.length !== 6) {
      setError('Please enter the 6-digit OTP.')
      return
    }

    setLoading(true)

    try {
      const response = await verifyOtp({
        usernameOrEmail,
        code,
        purpose: 'LOGIN',
      })

      console.log(response.message)
      console.log('OTP verified successfully')

      onVerified(response.verificationToken)
    } catch (err) {
      console.error(
        'OTP verification failed:',
        err
      )
      setError('Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setSuccess('')
    setCode('')
    setResending(true)

    try {
      const response = await requestOtp({
        usernameOrEmail,
        purpose: 'LOGIN',
      })

      console.log(response.message)

      setTimeLeft(300)

      setSuccess(
        'A new OTP has been sent to your email.'
      )
    } catch (err) {
      console.error(
        'Failed to resend OTP:',
        err
      )

      setError(
        'Unable to resend the OTP. Please try again.'
      )
    } finally {
      setResending(false)
    }
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
            borderColor:
              'rgba(15, 39, 71, 0.08)',
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
              textAlign: 'center',
            }}
          >
            Verify OTP
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
              textAlign: 'center',
            }}
          >
            Enter the 6-digit OTP sent to
            your account.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="OTP"
              value={code}
              onChange={(event) => {
                const value =
                  event.target.value

                if (/^\d{0,6}$/.test(value)) {
                  setCode(value)
                  setError('')
                  setSuccess('')
                }
              }}
              margin="normal"
              required
              autoComplete="one-time-code"
              inputProps={{
                maxLength: 6,
                inputMode: 'numeric',
              }}
              sx={{
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
                  textAlign: 'center',
                  letterSpacing: '0.35em',
                  fontSize: '1.25rem',
                },
              }}
            />

            <Typography
              align="center"
              sx={{
                mt: 2,
                color:
                  timeLeft <= 60
                    ? '#d32f2f'
                    : '#4b5563',
                fontWeight: 600,
              }}
            >
              {timeLeft > 0
                ? `OTP expires in ${formattedTime}`
                : 'OTP has expired.'}
            </Typography>

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
              disabled={
                loading ||
                resending ||
                timeLeft <= 0
              }
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
              {loading
                ? 'Verifying...'
                : 'Verify OTP'}
            </Button>

            <Box
              sx={{
                mt: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#4b5563',
                  fontSize: '0.9rem',
                  mb: 1,
                }}
              >
                Didn't receive the code?
              </Typography>

              <Button
                type="button"
                variant="text"
                onClick={handleResend}
                disabled={
                  resending || loading
                }
                sx={{
                  color: '#173f6b',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',

                  '&:hover': {
                    backgroundColor:
                      'rgba(23, 63, 107, 0.04)',
                  },
                }}
              >
                {resending
                  ? 'Sending new OTP...'
                  : 'Resend OTP'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default VerifyOtp