import { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material'

import {
  Dashboard,
  Folder,
  Task,
  Groups,
  Notifications,
  People,
  AccountCircle,
  Settings,
  ContactSupport,
  Info,
  Logout,
  Menu,
} from '@mui/icons-material'

import {
  Link,
  useLocation,
} from 'react-router-dom'



console.log('NAVBAR FILE LOADED')

import { getNotifications } from '../api/services/notificationService'

function Navbar() {

  console.log('NAVBAR IS RUNNING')

  const location = useLocation()

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

console.log('Navbar notifications:', notifications)
console.log('Has unread notifications:', hasUnread)

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
  }

  const handleMobileClose = () => {
    setMobileOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard fontSize="small" />,
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: <Folder fontSize="small" />,
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: <Task fontSize="small" />,
    },
    {
      label: 'Teams',
      path: '/teams',
      icon: <Groups fontSize="small" />,
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: <Notifications fontSize="small" />,
    },
    {
      label: 'Users',
      path: '/users',
      icon: <People fontSize="small" />,
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: <AccountCircle fontSize="small" />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings fontSize="small" />,
    },
    {
      label: 'Contact & Help',
      path: '/contact',
      icon: <ContactSupport fontSize="small" />,
    },
    {
      label: 'About',
      path: '/about',
      icon: <Info fontSize="small" />,
    },
  ]

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            'linear-gradient(135deg, #0f2747 0%, #173f6b 55%, #20558a 100%)',
          borderBottom:
            '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, sm: 72 },
            px: { xs: 1.5, sm: 3 },
            gap: 2,
          }}
        >
          {/* Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              flexShrink: 0,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: {
                xs: '1rem',
                sm: '1.15rem',
              },
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            Project Management System
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              overflowX: 'auto',
              overflowY: 'hidden',
              gap: 0.5,
              pb: 0.5,
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                height: 5,
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: 10,
                backgroundColor:
                  'rgba(255,255,255,0.35)',
              },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
                startIcon={
  item.path === '/notifications' ? (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
      }}
    >
      {item.icon}

      {true && (
        <Box
  sx={{
    position: 'absolute',
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#ff0000',
    border: '2px solid white',
    zIndex: 10,
  }}
/>
      )}
    </Box>
  ) : (
    item.icon
  )
}
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  minWidth: 'auto',
                  px: { md: 1, lg: 1.5 },
                  py: 1,
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                  fontSize: {
                    md: '0.78rem',
                    lg: '0.875rem',
                  },
                  fontWeight: isActive(item.path)
                    ? 700
                    : 500,

                  backgroundColor: isActive(
                    item.path
                  )
                    ? 'rgba(255,255,255,0.16)'
                    : 'transparent',

                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 2,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor:
                      isActive(item.path)
                        ? 'rgba(255,255,255,0.9)'
                        : 'transparent',
                  },

                  '&:hover': {
                    backgroundColor:
                      'rgba(255,255,255,0.12)',
                    transform:
                      'translateY(-1px)',
                  },

                  transition:
                    'background-color 0.2s ease, transform 0.2s ease',
                }}
              >
               {item.path === '/notifications'
  ? 'TEST NOTIFICATIONS'
  : item.label}
              </Button>
            ))}

            {/* Desktop Logout */}
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={
                <Logout fontSize="small" />
              }
              sx={{
                flexShrink: 0,
                minWidth: 'auto',
                px: { md: 1, lg: 1.5 },
                py: 1,
                borderRadius: 2,
                whiteSpace: 'nowrap',
                fontSize: {
                  md: '0.78rem',
                  lg: '0.875rem',
                },
                fontWeight: 500,
                '&:hover': {
                  backgroundColor:
                    'rgba(255,255,255,0.12)',
                  transform:
                    'translateY(-1px)',
                },
                transition:
                  'background-color 0.2s ease, transform 0.2s ease',
              }}
            >
              Logout
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open navigation menu"
            onClick={() => setMobileOpen(true)}
            sx={{
              display: {
                xs: 'flex',
                md: 'none',
              },
              marginLeft: 'auto',
              borderRadius: 2,
              '&:hover': {
                backgroundColor:
                  'rgba(255,255,255,0.12)',
              },
            }}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileClose}
        PaperProps={{
          sx: {
            width: {
              xs: '82%',
              sm: 320,
            },
            maxWidth: 360,
            backgroundColor: '#f5f7fb',
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            color: 'white',
            background:
              'linear-gradient(135deg, #0f2747 0%, #173f6b 55%, #20558a 100%)',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
            }}
          >
            Project Management System
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: '0.8rem',
              opacity: 0.8,
            }}
          >
            Navigation
          </Typography>
        </Box>

        <Divider />

        {/* Mobile Menu Items */}
        <List
          sx={{
            px: 1,
            py: 1.5,
          }}
        >
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileClose}
              selected={isActive(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: '#172b4d',

                '& .MuiListItemIcon-root': {
                  minWidth: 42,
                  color: isActive(item.path)
                    ? '#173f6b'
                    : '#4b5563',
                },

                '& .MuiListItemText-primary': {
                  fontWeight: isActive(item.path)
                    ? 700
                    : 500,
                },

                '&.Mui-selected': {
                  backgroundColor:
                    'rgba(23,63,107,0.10)',
                  color: '#173f6b',
                },

                '&.Mui-selected:hover': {
                  backgroundColor:
                    'rgba(23,63,107,0.14)',
                },

                '&:hover': {
                  backgroundColor:
                    'rgba(23,63,107,0.06)',
                },
              }}
            >
              <ListItemIcon>
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
            top: -2,
            right: -3,
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#ff5252',
            border: '2px solid #173f6b',
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
              />
            </ListItemButton>
          ))}

          <Divider
            sx={{
              my: 1.5,
            }}
          />

          {/* Mobile Logout */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: '#172b4d',

              '& .MuiListItemIcon-root': {
                minWidth: 42,
                color: '#4b5563',
              },

              '&:hover': {
                backgroundColor:
                  'rgba(23,63,107,0.06)',
              },
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              slotProps={{
                primary: {
                  fontWeight: 500,
                },
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  )
}

export default Navbar