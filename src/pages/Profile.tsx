import { useRef, useState } from 'react'
import {
  AccountCircle,
  CameraAlt,
  Email,
  Person,
  VerifiedUser,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import { uploadProfilePicture } from '../api/services/profileService'

interface StoredUser {
  id: string
  email: string
  username: string
  fullName: string
  avatarUrl?: string | null
  isActive: boolean
}

import { usePageView } from '../api/hooks/usePageView'

function Profile() {

  usePageView('Profile')

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const pageBackground = isDark ? '#101522' : '#f5f7fb'
  const cardBackground = isDark ? '#182033' : '#ffffff'
  const borderColor = isDark ? '#2b3548' : '#e8eaf0'
  const primaryText = isDark ? '#f3f4f6' : '#172033'
  const secondaryText = isDark ? '#aab4c3' : '#7a8494'
  const bodyText = isDark ? '#e5e7eb' : '#344054'
  const mutedText = isDark ? '#8f9bad' : '#667085'
  const dividerColor = isDark ? '#2b3548' : '#eef0f4'
  const iconBackground = isDark
    ? 'linear-gradient(135deg, rgba(66,165,245,0.16), rgba(124,77,255,0.16))'
    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)'

  const cardStyle = {
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: cardBackground,
    boxShadow: isDark
      ? '0 4px 14px rgba(0,0,0,0.20)'
      : '0 4px 14px rgba(23,32,51,0.05)',
  }

  const storedUser = localStorage.getItem('user')

  const user: StoredUser | null = storedUser
    ? JSON.parse(storedUser)
    : null

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || ''
  )

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100%',
          backgroundColor: pageBackground,
          py: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1440,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Card
            elevation={0}
            sx={{
              ...cardStyle,
              p: { xs: 3, sm: 5 },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: primaryText }}
            >
              Profile
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: secondaryText,
              }}
            >
              User information is not available.
            </Typography>
          </Card>
        </Container>
      </Box>
    )
  }

  const getInitials = (fullName: string) => {
    const names = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)

    if (names.length >= 2) {
      return (
        names[0].charAt(0) +
        names[1].charAt(0)
      ).toUpperCase()
    }

    return (
      names[0]?.charAt(0) || '?'
    ).toUpperCase()
  }

  const initials = getInitials(user.fullName)

  const handleChoosePicture = () => {
    setUploadError('')
    setUploadSuccess('')

    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setUploadError('')
    setUploadSuccess('')

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        'Please select a JPG, PNG, or WEBP image.'
      )

      event.target.value = ''
      return
    }

    const maxFileSize = 5 * 1024 * 1024

    if (file.size > maxFileSize) {
      setUploadError(
        'Profile picture must be 5 MB or smaller.'
      )

      event.target.value = ''
      return
    }

    setUploading(true)

    try {
      const response = await uploadProfilePicture(file)

      const newAvatarUrl = response.avatarUrl

      setAvatarUrl(newAvatarUrl)

      const updatedUser: StoredUser = {
        ...user,
        avatarUrl: newAvatarUrl,
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      setUploadSuccess(
        'Profile picture updated successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to upload profile picture:',
        error
      )

      setUploadError(
        'Failed to upload profile picture. Please try again.'
      )
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: pageBackground,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1440,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: {
                xs: '1.8rem',
                sm: '2.2rem',
              },
              fontWeight: 800,
              color: primaryText,
            }}
          >
            My Profile
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              color: secondaryText,
              fontSize: '0.98rem',
            }}
          >
            View your account information and
            manage your profile.
          </Typography>
        </Box>

        {/* Profile Header */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          {/* Top Accent Area */}
          <Box
            sx={{
              position: 'relative',
              height: {
                xs: 120,
                sm: 145,
              },
              background: isDark
                ? 'linear-gradient(135deg, #17284a 0%, #202b59 55%, #2b2350 100%)'
                : 'linear-gradient(135deg, #e8f3ff 0%, #eef0ff 55%, #f3edff 100%)',
              overflow: 'hidden',
            }}
          >
            {/* Blue Glow */}
            <Box
              sx={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(66,165,245,0.20), transparent 70%)',
                top: -180,
                right: -20,
              }}
            />

            {/* Purple Glow */}
            <Box
              sx={{
                position: 'absolute',
                width: 240,
                height: 240,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(124,77,255,0.16), transparent 70%)',
                bottom: -190,
                left: 80,
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                left: { xs: 24, sm: 40 },
                top: { xs: 24, sm: 30 },
              }}
            >
              <Typography
                sx={{
                  color: isDark
                    ? '#90caf9'
                    : '#3f51ff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                }}
              >
                Account Profile
              </Typography>

              <Typography
                sx={{
                  color: isDark
                    ? '#d7def0'
                    : '#344054',
                  fontSize: {
                    xs: '1rem',
                    sm: '1.15rem',
                  },
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                Manage your workspace identity
              </Typography>
            </Box>
          </Box>

          {/* Profile Identity */}
          <Box
            sx={{
              position: 'relative',
              px: { xs: 3, sm: 5 },
              pb: { xs: 4, sm: 5 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                alignItems: {
                  xs: 'center',
                  sm: 'flex-end',
                },
                gap: {
                  xs: 2.5,
                  sm: 3,
                },
                mt: {
                  xs: -6,
                  sm: -7,
                },
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={
                    avatarUrl
                      ? `https://localhost:7175${avatarUrl}`
                      : undefined
                  }
                  sx={{
                    width: {
                      xs: 120,
                      sm: 138,
                    },
                    height: {
                      xs: 120,
                      sm: 138,
                    },
                    fontSize: {
                      xs: '2.5rem',
                      sm: '3rem',
                    },
                    fontWeight: 700,
                    color: 'white',
                    background:
                      'linear-gradient(135deg, #42a5f5, #7c4dff)',
                    border: `6px solid ${cardBackground}`,
                    boxShadow: isDark
                      ? '0 8px 24px rgba(0,0,0,0.35)'
                      : '0 8px 24px rgba(23,32,51,0.14)',
                  }}
                >
                  {!avatarUrl && initials}
                </Avatar>

                {/* Camera Button */}
                <Button
                  onClick={handleChoosePicture}
                  disabled={uploading}
                  aria-label="Change profile picture"
                  sx={{
                    position: 'absolute',
                    right: -3,
                    bottom: -3,
                    minWidth: 42,
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    p: 0,
                    color: 'white',
                    background:
                      'linear-gradient(135deg, #3f51ff, #7c4dff)',
                    border: `3px solid ${cardBackground}`,
                    boxShadow: isDark
                      ? '0 4px 12px rgba(0,0,0,0.35)'
                      : '0 4px 12px rgba(23,32,51,0.18)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #3043e8, #693fe0)',
                    },
                  }}
                >
                  <CameraAlt fontSize="small" />
                </Button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleFileChange}
                />
              </Box>

              {/* User Identity */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: {
                    xs: 'center',
                    sm: 'left',
                  },
                  pb: {
                    xs: 0,
                    sm: 1,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: '1.55rem',
                      sm: '1.85rem',
                    },
                    fontWeight: 800,
                    color: primaryText,
                    lineHeight: 1.2,
                  }}
                >
                  {user.fullName}
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    mt: 0.5,
                    fontSize: '0.95rem',
                  }}
                >
                  @{user.username}
                </Typography>

                <Box
                  sx={{
                    mt: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: {
                      xs: 'center',
                      sm: 'flex-start',
                    },
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    label={
                      user.isActive
                        ? 'Active Account'
                        : 'Inactive Account'
                    }
                    icon={<VerifiedUser />}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: user.isActive
                        ? isDark
                          ? 'rgba(46,125,50,0.18)'
                          : '#e8f5e9'
                        : isDark
                          ? '#263043'
                          : '#f1f3f5',
                      color: user.isActive
                        ? isDark
                          ? '#81c784'
                          : '#2e7d32'
                        : mutedText,
                      '& .MuiChip-icon': {
                        color: user.isActive
                          ? isDark
                            ? '#81c784'
                            : '#2e7d32'
                          : mutedText,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Profile Picture Action */}
              <Box
                sx={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: {
                    xs: 'center',
                    sm: 'flex-end',
                  },
                  gap: 0.75,
                }}
              >
                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Profile Picture
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<CameraAlt />}
                  onClick={handleChoosePicture}
                  disabled={uploading}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: isDark
                      ? '#4b5563'
                      : '#d0d5dd',
                    color: bodyText,
                    px: 2,
                    '&:hover': {
                      borderColor: '#3f51ff',
                      color: isDark
                        ? '#90caf9'
                        : '#3f51ff',
                      backgroundColor:
                        'rgba(63,81,255,0.08)',
                    },
                  }}
                >
                  {uploading
                    ? 'Uploading...'
                    : 'Change Picture'}
                </Button>
              </Box>
            </Box>

            {/* Upload Status */}
            {(uploadError || uploadSuccess) && (
              <Box
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: `1px solid ${dividerColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: {
                    xs: 'center',
                    sm: 'flex-start',
                  },
                  gap: 0.5,
                }}
              >
                {uploadError && (
                  <Typography
                    sx={{
                      color: isDark
                        ? '#fca5a5'
                        : '#d32f2f',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {uploadError}
                  </Typography>
                )}

                {uploadSuccess && (
                  <Typography
                    sx={{
                      color: isDark
                        ? '#86efac'
                        : '#2e7d32',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {uploadSuccess}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Card>

        {/* Account Information */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4 },
            }}
          >
            <Typography
              sx={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: primaryText,
                mb: 3,
              }}
            >
              Account Information
            </Typography>

            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      flexShrink: 0,
                    }}
                  >
                    <AccountCircle
                      sx={{
                        color: isDark
                          ? '#90caf9'
                          : '#3f51ff',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: secondaryText }}
                    >
                      Full Name
                    </Typography>

                    <Typography
                      sx={{
                        color: primaryText,
                        fontWeight: 600,
                        mt: 0.25,
                      }}
                    >
                      {user.fullName}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Username */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      flexShrink: 0,
                    }}
                  >
                    <Person
                      sx={{
                        color: isDark
                          ? '#90caf9'
                          : '#3f51ff',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: secondaryText }}
                    >
                      Username
                    </Typography>

                    <Typography
                      sx={{
                        color: primaryText,
                        fontWeight: 600,
                        mt: 0.25,
                      }}
                    >
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      flexShrink: 0,
                    }}
                  >
                    <Email
                      sx={{
                        color: isDark
                          ? '#90caf9'
                          : '#3f51ff',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: secondaryText }}
                    >
                      Email Address
                    </Typography>

                    <Typography
                      sx={{
                        color: primaryText,
                        fontWeight: 600,
                        mt: 0.25,
                        wordBreak: 'break-word',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Account Status */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      flexShrink: 0,
                    }}
                  >
                    <VerifiedUser
                      sx={{
                        color: isDark
                          ? '#90caf9'
                          : '#3f51ff',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: secondaryText }}
                    >
                      Account Status
                    </Typography>

                    <Typography
                      sx={{
                        color: primaryText,
                        fontWeight: 600,
                        mt: 0.25,
                      }}
                    >
                      {user.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Profile