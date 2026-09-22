import { useState } from 'react'
import {
  AccountCircle,
  DarkMode,
  Notifications,
  Security,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  useTheme,
} from '@mui/material'

interface SettingsProps {
  darkMode: boolean
  onDarkModeChange: (enabled: boolean) => void
}

import { usePageView } from '../api/hooks/usePageView'

function Settings({
  darkMode,
  onDarkModeChange,
}: SettingsProps) {

  usePageView('Settings')
  
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

  const [emailNotifications, setEmailNotifications] =
    useState(true)

  const [systemNotifications, setSystemNotifications] =
    useState(true)

  const cardStyle = {
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: cardBackground,
    boxShadow: isDark
      ? '0 4px 14px rgba(0,0,0,0.20)'
      : '0 4px 14px rgba(23,32,51,0.05)',
  }

  const switchSx = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#3f51ff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#3f51ff',
        opacity: 0.7,
      },
    },
    '& .MuiSwitch-track': {
      backgroundColor: isDark
        ? '#4b5563'
        : '#b8c0cc',
    },
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
          maxWidth: 1100,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
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
              }}
            >
              <SettingsIcon
                sx={{
                  color: isDark
                    ? '#90caf9'
                    : '#3f51ff',
                }}
              />
            </Box>

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
              Settings
            </Typography>
          </Box>

          <Typography
            sx={{
              color: secondaryText,
              fontSize: '0.98rem',
              lineHeight: 1.6,
            }}
          >
            Manage your notification preferences,
            appearance, and account settings.
          </Typography>
        </Box>

        {/* Notification Settings */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4 },
            }}
          >
            {/* Section Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
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
                <Notifications
                  sx={{
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  Notifications
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.85rem',
                    color: secondaryText,
                  }}
                >
                  Choose how you want to receive
                  notifications.
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: dividerColor,
                mb: 1,
              }}
            />

            {/* Email Notifications */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: bodyText,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  Email notifications
                </Typography>

                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: '0.82rem',
                    mt: 0.35,
                    lineHeight: 1.5,
                  }}
                >
                  Receive important project updates
                  by email.
                </Typography>
              </Box>

              <FormControlLabel
                label=""
                sx={{ m: 0 }}
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(event) =>
                      setEmailNotifications(
                        event.target.checked
                      )
                    }
                    sx={switchSx}
                  />
                }
              />
            </Box>

            <Divider
              sx={{
                borderColor: dividerColor,
              }}
            />

            {/* System Notifications */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: bodyText,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  System notifications
                </Typography>

                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: '0.82rem',
                    mt: 0.35,
                    lineHeight: 1.5,
                  }}
                >
                  Show notifications and updates
                  inside the application.
                </Typography>
              </Box>

              <FormControlLabel
                label=""
                sx={{ m: 0 }}
                control={
                  <Switch
                    checked={systemNotifications}
                    onChange={(event) =>
                      setSystemNotifications(
                        event.target.checked
                      )
                    }
                    sx={switchSx}
                  />
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
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
                <DarkMode
                  sx={{
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  Appearance
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.85rem',
                    color: secondaryText,
                  }}
                >
                  Customize how the application
                  looks.
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: dividerColor,
                mb: 1,
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: bodyText,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  Dark mode
                </Typography>

                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: '0.82rem',
                    mt: 0.35,
                    lineHeight: 1.5,
                  }}
                >
                  Use a darker color scheme throughout
                  the application.
                </Typography>
              </Box>

              <FormControlLabel
                label=""
                sx={{ m: 0 }}
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(event) =>
                      onDarkModeChange(
                        event.target.checked
                      )
                    }
                    sx={switchSx}
                  />
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* Account & Security */}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
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
                <Security
                  sx={{
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  Account & Security
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.85rem',
                    color: secondaryText,
                  }}
                >
                  Information about your account
                  and security.
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: dividerColor,
                mb: 1,
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2,
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
                  sx={{
                    color: bodyText,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  Account settings
                </Typography>

                <Typography
                  sx={{
                    color: mutedText,
                    fontSize: '0.82rem',
                    mt: 0.35,
                    lineHeight: 1.5,
                  }}
                >
                  Manage your profile information
                  from the Profile page.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Settings