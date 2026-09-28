import { useEffect, useState } from 'react'

import axiosClient from '../api/axiosClient'

import { getNotifications } from '../api/services/notificationService'

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'

import {
  Dashboard,
  Folder,
  Task,
  Groups,
  Notifications,
  People,
  AttachFile,
  AccountCircle,
  Settings,
  ContactSupport,
  Info,
  Logout,
  Menu,
} from '@mui/icons-material'

import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import SecurityIcon from '@mui/icons-material/Security'


const drawerWidth = 250

const sidebarGradient =
  'linear-gradient(135deg, #061633 0%, #0b1f47 55%, #102a5c 100%)'

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)

  const [hasUnreadNotifications, setHasUnreadNotifications] =
  useState(false)
  useEffect(() => {
  const loadUnreadNotifications = async () => {
    try {
      const notifications = await getNotifications()

      const hasUnread = notifications.some(
        (notification) => !notification.readAt
      )

      setHasUnreadNotifications(hasUnread)
    } catch (error) {
      console.error(
        'Failed to check unread notifications:',
        error
      )
    }
  }

  loadUnreadNotifications()

  const interval = setInterval(
    loadUnreadNotifications,
    10000
  )

  return () => clearInterval(interval)
}, [])
 const token = localStorage.getItem('token')
let isAdmin = false

if (token) {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1])
    )

    const role =
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ]

    isAdmin = role === 'Admin'
  } catch (error) {
    console.error(
      'Failed to read user role from token:',
      error
    )
  }
}



const mainNavItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Projects', path: '/projects', icon: <Folder /> },
  { label: 'Tasks', path: '/tasks', icon: <Task /> },
  { label: 'Teams', path: '/teams', icon: <Groups /> },
  { label: 'Notifications', path: '/notifications', icon: <Notifications /> },
  { label: 'Resources', path: '/resources', icon: <AttachFile /> },

  ...(isAdmin
    ? [
        {
          label: 'Users',
          path: '/users',
          icon: <People />,
        },
        {
          label: 'System Logs',
          path: '/system-logs',
          icon: <SecurityIcon />,
        },
      ]
    : []),
]

  const accountNavItems = [
    {
      label: 'Profile',
      path: '/profile',
      icon: <AccountCircle />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
    },
    {
      label: 'Contact & Help',
      path: '/contact',
      icon: <ContactSupport />,
    },
    {
      label: 'About',
      path: '/about',
      icon: <Info />,
    },
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

 const handleLogout = async () => {
  try {
    await axiosClient.post('/api/Auth/logout')
  } catch (error) {
    console.error('Logout logging failed:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/')
  }
}

  const renderNavItems = (
    items: {
      label: string
      path: string
      icon: React.ReactNode
    }[]
  ) =>
    items.map((item) => {
      const isActive =
        location.pathname === item.path

      return (
        <ListItemButton
          key={item.path}
          selected={isActive}
          onClick={() =>
            handleNavigation(item.path)
          }
          sx={{
            position: 'relative',
            mx: 1.5,
            mb: 0.5,
            minHeight: 46,
            borderRadius: 2,
            px: 1.5,
            color: isActive
              ? '#ffffff'
              : 'rgba(255,255,255,0.68)',

            '&.Mui-selected': {
              backgroundColor:
                'rgba(63,81,255,0.20)',
              color: '#ffffff',
              fontWeight: 'bold',
            },

            '&.Mui-selected:hover': {
              backgroundColor:
                'rgba(63,81,255,0.28)',
            },

            '&:hover': {
              backgroundColor:
                'rgba(255,255,255,0.06)',
            },
          }}
        >
          <ListItemIcon
  sx={{
    minWidth: 42,
    color: isActive
      ? '#ffffff'
      : 'rgba(255,255,255,0.68)',
  }}
>
  {item.path === '/notifications' ? (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
      }}
    >
      {item.icon}

      {hasUnreadNotifications && (
        <Box
          sx={{
            position: 'absolute',
            top: -3,
            right: -4,
            width: 9,
            height: 9,
            borderRadius: '50%',
            backgroundColor: '#ff5252',
            border: '2px solid #0b1f47',
            zIndex: 10,
          }}
        />
      )}
    </Box>
  ) : (
    item.icon
  )}
</ListItemIcon>

          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: isActive
                ? 'bold'
                : 'medium',
              color: 'inherit',
            }}
          />
        </ListItemButton>
      )
    })

  const navigationContent = (
    <>
      {/* Brand / Application Header */}
      <Box
        sx={{
          minHeight: 72,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          background: sidebarGradient,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: 'white',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Project Management
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            Workspace
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor:
            'rgba(255,255,255,0.08)',
        }}
      />

      {/* Navigation */}
      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          py: 2,
          backgroundColor: '#0b1f47',
        }}
      >
        {/* Workspace */}
        <Box
          sx={{
            px: 2.5,
            pb: 1,
          }}
        >
          <Typography
            variant="overline"
            fontWeight="bold"
            sx={{
              letterSpacing: 1,
              color:
                'rgba(255,255,255,0.45)',
            }}
          >
            WORKSPACE
          </Typography>
        </Box>

        <List disablePadding>
          {renderNavItems(mainNavItems)}
        </List>

        {/* Account */}
        <Box
          sx={{
            px: 2.5,
            pt: 3,
            pb: 1,
          }}
        >
          <Typography
            variant="overline"
            fontWeight="bold"
            sx={{
              letterSpacing: 1,
              color:
                'rgba(255,255,255,0.45)',
            }}
          >
            ACCOUNT
          </Typography>
        </Box>

        <List disablePadding>
          {renderNavItems(accountNavItems)}
        </List>

        {/* Logout */}
        <Box
          sx={{
            mt: 'auto',
            pt: 2,
          }}
        >
          <Divider
            sx={{
              mb: 1.5,
              borderColor:
                'rgba(255,255,255,0.08)',
            }}
          />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1.5,
              minHeight: 46,
              borderRadius: 2,
              px: 1.5,
              color:
                'rgba(255,255,255,0.68)',

              '&:hover': {
                backgroundColor:
                  'rgba(255,255,255,0.06)',
                color: '#ffffff',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 42,
                color: 'inherit',
              }}
            >
              <Logout />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 'medium',
                color: 'inherit',
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Desktop / Tablet Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },

          width: drawerWidth,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight:
              '1px solid rgba(255,255,255,0.06)',
            backgroundColor: '#0b1f47',
            color: 'white',
          },
        }}
      >
        {navigationContent}
      </Drawer>

      {/* Mobile Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
          background: sidebarGradient,
          borderBottom:
            '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            px: 1.5,
          }}
        >
          <IconButton
            color="inherit"
            edge="start"
            aria-label="open navigation menu"
            onClick={() => setMobileOpen(true)}
            sx={{
              mr: 1.5,
              borderRadius: 2,

              '&:hover': {
                backgroundColor:
                  'rgba(255,255,255,0.12)',
              },
            }}
          >
            <Menu />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.2,
              }}
              noWrap
            >
              Project Management
            </Typography>

            <Typography
              sx={{
                color:
                  'rgba(255,255,255,0.72)',
                fontSize: '0.7rem',
              }}
            >
              Workspace
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#0b1f47',
            color: 'white',
          },
        }}
      >
        {navigationContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: '100vh',
          backgroundColor:
            'background.default',

          pt: {
            xs: 8,
            md: 0,
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout