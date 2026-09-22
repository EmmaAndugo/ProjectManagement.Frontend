import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Add,
  DeleteOutline,
  EditOutlined,
  PersonOutline,
  Search,
} from '@mui/icons-material'
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../api/services/userService'
import type { User } from '../api/services/userService'

import { usePageView } from '../api/hooks/usePageView'

function Users() {
  usePageView('Users')
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createValidationError, setCreateValidationError] = useState('')

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValidationError, setEditValidationError] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    passwordHash: '',
    fullName: '',
    avatarUrl: '',
    isActive: true,
  })

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Failed to load users:', error)
        setError('Failed to load users.')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleCreateUser = async () => {
    setCreateValidationError('')

    if (!newUser.fullName.trim()) {
      setCreateValidationError('Full Name is required.')
      return
    }

    if (!newUser.username.trim()) {
      setCreateValidationError('Username is required.')
      return
    }

    if (!newUser.email.trim()) {
      setCreateValidationError('Email is required.')
      return
    }

    if (!newUser.email.includes('@')) {
      setCreateValidationError(
        'Please enter a valid email address.'
      )
      return
    }

    if (!newUser.passwordHash.trim()) {
      setCreateValidationError('Password is required.')
      return
    }

    setCreating(true)
    setError('')

    try {
      await createUser({
        email: newUser.email,
        username: newUser.username,
        passwordHash: newUser.passwordHash,
        fullName: newUser.fullName,
        avatarUrl: newUser.avatarUrl || null,
        isActive: newUser.isActive,
      })

      setOpenCreateDialog(false)

      setNewUser({
        email: '',
        username: '',
        passwordHash: '',
        fullName: '',
        avatarUrl: '',
        isActive: true,
      })

      const updatedUsers = await getUsers()
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Failed to create user:', error)

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message

        setError(message || 'Failed to create user.')
      } else {
        setError('Failed to create user.')
      }
    } finally {
      setCreating(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    setEditValidationError('')

    if (!selectedUser.fullName.trim()) {
      setEditValidationError('Full Name is required.')
      return
    }

    if (!selectedUser.username.trim()) {
      setEditValidationError('Username is required.')
      return
    }

    if (!selectedUser.email.trim()) {
      setEditValidationError('Email is required.')
      return
    }

    if (!selectedUser.email.includes('@')) {
      setEditValidationError(
        'Please enter a valid email address.'
      )
      return
    }

    setEditing(true)
    setError('')

    try {
      await updateUser(selectedUser.id, {
        email: selectedUser.email,
        username: selectedUser.username,
        fullName: selectedUser.fullName,
        avatarUrl: selectedUser.avatarUrl || null,
        isActive: selectedUser.isActive,
      })

      setOpenEditDialog(false)
      setSelectedUser(null)

      const updatedUsers = await getUsers()
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Failed to update user:', error)

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message

        setError(message || 'Failed to update user.')
      } else {
        setError('Failed to update user.')
      }
    } finally {
      setEditing(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setDeleting(true)
    setError('')

    try {
      await deleteUser(selectedUser.id)

      setOpenDeleteDialog(false)
      setSelectedUser(null)

      const updatedUsers = await getUsers()
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Failed to delete user:', error)

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message

        setError(message || 'Failed to delete user.')
      } else {
        setError('Failed to delete user.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()

    return (
      user.fullName.toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  })

  const pageBackground = isDark ? '#101522' : '#f5f7fb'
  const cardBackground = isDark ? '#182033' : '#ffffff'
  const borderColor = isDark ? '#2b3548' : '#e8eaf0'
  const primaryText = isDark ? '#f3f4f6' : '#172033'
  const secondaryText = isDark ? '#aab4c3' : '#7a8494'
  const bodyText = isDark ? '#e5e7eb' : '#4b5563'
  const mutedText = isDark ? '#8f9bad' : '#9ca3af'
  const inputBorder = isDark ? '#4b5563' : '#9ca3af'
  const inputBackground = isDark ? '#141b2a' : '#fafbfe'
  const hoverBackground = isDark ? '#202a3d' : '#fafbfe'
  const dividerColor = isDark ? '#2b3548' : '#eef0f4'

  const dialogBackground = isDark
    ? '#182033'
    : '#ffffff'

  const inputSx = {
    '& .MuiInputLabel-root': {
      color: secondaryText,
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: isDark ? '#8fa0ff' : '#173f6b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: inputBackground,
      '& fieldset': {
        borderColor: inputBorder,
        borderWidth: 1.5,
      },
      '&:hover fieldset': {
        borderColor: isDark ? '#8fa0ff' : '#173f6b',
      },
      '&.Mui-focused fieldset': {
        borderColor: isDark ? '#8fa0ff' : '#173f6b',
        borderWidth: 2,
      },
    },
    '& .MuiInputBase-input': {
      color: primaryText,
      fontWeight: 500,
    },
    '& .MuiInputBase-input::placeholder': {
      color: mutedText,
      opacity: 1,
    },
  }

  const selectSx = {
    '& .MuiInputLabel-root': {
      color: secondaryText,
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: isDark ? '#8fa0ff' : '#173f6b',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: inputBackground,
      '& fieldset': {
        borderColor: inputBorder,
        borderWidth: 1.5,
      },
      '&:hover fieldset': {
        borderColor: isDark ? '#8fa0ff' : '#173f6b',
      },
      '&.Mui-focused fieldset': {
        borderColor: isDark ? '#8fa0ff' : '#173f6b',
        borderWidth: 2,
      },
    },
    '& .MuiSelect-select': {
      color: primaryText,
      fontWeight: 500,
    },
    '& .MuiSvgIcon-root': {
      color: secondaryText,
    },
  }

  const dialogPaperSx = {
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: dialogBackground,
    backgroundImage: 'none',
    boxShadow: isDark
      ? '0 18px 45px rgba(0,0,0,0.40)'
      : '0 18px 45px rgba(23,32,51,0.14)',
  }

  const errorAlertSx = {
    mb: 3,
    borderRadius: 2,
    ...(isDark
      ? {
          backgroundColor: 'rgba(220,38,38,0.12)',
          color: '#fca5a5',
          border: '1px solid rgba(248,113,113,0.35)',
        }
      : {}),
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: pageBackground,
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
            alignItems: {
              xs: 'stretch',
              sm: 'center',
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: '1.9rem',
                  sm: '2.2rem',
                },
                fontWeight: 800,
                color: primaryText,
                lineHeight: 1.2,
                mb: 0.7,
              }}
            >
              Users
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: '0.95rem',
              }}
            >
              View and manage system users.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setCreateValidationError('')
              setError('')
              setOpenCreateDialog(true)
            }}
            sx={{
              alignSelf: {
                xs: 'stretch',
                sm: 'auto',
              },
              minWidth: {
                sm: 150,
              },
              py: 1.25,
              px: 2.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              background:
                'linear-gradient(135deg, #3f51ff, #7c4dff)',
              boxShadow:
                '0 6px 16px rgba(63,81,255,0.22)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #3445e8, #6d3fe8)',
                boxShadow:
                  '0 9px 20px rgba(63,81,255,0.28)',
              },
            }}
          >
            Create User
          </Button>
        </Box>

        {/* Search */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${borderColor}`,
            backgroundColor: cardBackground,
            boxShadow: isDark
              ? '0 4px 14px rgba(0,0,0,0.20)'
              : '0 4px 14px rgba(23,32,51,0.05)',
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.5 },
            }}
          >
            <TextField
              fullWidth
              label="Search users"
              placeholder="Search by name, username, or email"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <Search
                    sx={{
                      mr: 1,
                      color: secondaryText,
                    }}
                  />
                ),
              }}
              sx={{
                ...inputSx,
                '& .MuiOutlinedInput-root': {
                  ...inputSx[
                    '& .MuiOutlinedInput-root'
                  ],
                  backgroundColor: inputBackground,
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={errorAlertSx}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBackground,
              boxShadow: isDark
                ? '0 4px 14px rgba(0,0,0,0.20)'
                : undefined,
            }}
          >
            <CardContent
              sx={{
                py: 5,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  color: secondaryText,
                }}
              >
                Loading users...
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Empty database */}
        {!loading && !error && users.length === 0 && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBackground,
              boxShadow: isDark
                ? '0 4px 14px rgba(0,0,0,0.20)'
                : undefined,
            }}
          >
            <CardContent
              sx={{
                py: 7,
                textAlign: 'center',
              }}
            >
              <PersonOutline
                sx={{
                  fontSize: 48,
                  color: mutedText,
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  fontWeight: 600,
                  color: primaryText,
                }}
              >
                No users found
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* User list */}
        {!loading && users.length > 0 && (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBackground,
              boxShadow: isDark
                ? '0 4px 14px rgba(0,0,0,0.20)'
                : '0 4px 14px rgba(23,32,51,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* List header */}
            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'grid',
                },
                gridTemplateColumns:
                  '2fr 1.3fr 2fr 1fr 180px',
                alignItems: 'center',
                px: 3,
                py: 1.8,
                backgroundColor: inputBackground,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {[
                'USER',
                'USERNAME',
                'EMAIL',
                'STATUS',
                'ACTIONS',
              ].map((heading) => (
                <Typography
                  key={heading}
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: secondaryText,
                    letterSpacing: 0.5,
                  }}
                >
                  {heading}
                </Typography>
              ))}
            </Box>

            {/* Users */}
            {filteredUsers.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  px: 3,
                  textAlign: 'center',
                }}
              >
                <Search
                  sx={{
                    fontSize: 42,
                    color: mutedText,
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 600,
                    color: primaryText,
                    mb: 0.5,
                  }}
                >
                  No matching users
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: secondaryText,
                  }}
                >
                  Try a different name, username, or email.
                </Typography>
              </Box>
            ) : (
              filteredUsers.map((user, index) => (
                <Box
                  key={user.id}
                  sx={{
                    display: {
                      xs: 'flex',
                      md: 'grid',
                    },
                    flexDirection: {
                      xs: 'column',
                      md: 'unset',
                    },
                    gridTemplateColumns:
                      '2fr 1.3fr 2fr 1fr 180px',
                    alignItems: {
                      xs: 'stretch',
                      md: 'center',
                    },
                    gap: {
                      xs: 2,
                      md: 0,
                    },
                    px: {
                      xs: 2,
                      sm: 3,
                    },
                    py: {
                      xs: 2.5,
                      md: 2,
                    },
                    borderBottom:
                      index !==
                      filteredUsers.length - 1
                        ? `1px solid ${dividerColor}`
                        : 'none',
                    transition:
                      'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: hoverBackground,
                    },
                  }}
                >
                  {/* User */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background:
                          'linear-gradient(135deg, #42a5f5, #7c4dff)',
                        color: '#ffffff',
                        fontWeight: 700,
                      }}
                    >
                      {user.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: primaryText,
                          fontSize: '0.95rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.fullName}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          display: {
                            xs: 'block',
                            md: 'none',
                          },
                          color: secondaryText,
                          mt: 0.3,
                        }}
                      >
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Username */}
                  <Typography
                    variant="body2"
                    sx={{
                      display: {
                        xs: 'none',
                        md: 'block',
                      },
                      color: bodyText,
                      fontWeight: 500,
                    }}
                  >
                    @{user.username}
                  </Typography>

                  {/* Email */}
                  <Box
                    sx={{
                      display: {
                        xs: 'flex',
                        md: 'block',
                      },
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: {
                          xs: 'block',
                          md: 'none',
                        },
                        color: mutedText,
                        fontWeight: 700,
                        mb: 0.3,
                      }}
                    >
                      EMAIL
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: bodyText,
                        wordBreak: 'break-word',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: {
                          xs: 'block',
                          md: 'none',
                        },
                        color: mutedText,
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      STATUS
                    </Typography>

                    <Chip
                      size="small"
                      label={
                        user.isActive
                          ? 'Active'
                          : 'Inactive'
                      }
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1.5,
                        backgroundColor: user.isActive
                          ? isDark
                            ? 'rgba(46,125,50,0.18)'
                            : '#e8f5e9'
                          : isDark
                            ? 'rgba(198,40,40,0.18)'
                            : '#ffebee',
                        color: user.isActive
                          ? isDark
                            ? '#81c784'
                            : '#2e7d32'
                          : isDark
                            ? '#ef9a9a'
                            : '#c62828',
                      }}
                    />
                  </Box>

                  {/* Actions */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: {
                        xs: 'flex-start',
                        md: 'flex-end',
                      },
                      pt: {
                        xs: 0.5,
                        md: 0,
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditOutlined />}
                      onClick={() => {
                        setSelectedUser(user)
                        setEditValidationError('')
                        setError('')
                        setOpenEditDialog(true)
                      }}
                      sx={{
                        borderRadius: 1.8,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: isDark
                          ? '#6f7fff'
                          : '#3f51ff',
                        color: isDark
                          ? '#8fa0ff'
                          : '#3f51ff',
                        px: 1.5,
                        '&:hover': {
                          borderColor: isDark
                            ? '#8fa0ff'
                            : '#3445e8',
                          backgroundColor:
                            'rgba(63,81,255,0.08)',
                        },
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteOutline />}
                      onClick={() => {
                        setSelectedUser(user)
                        setError('')
                        setOpenDeleteDialog(true)
                      }}
                      sx={{
                        borderRadius: 1.8,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: isDark
                          ? '#ef5350'
                          : '#d32f2f',
                        color: isDark
                          ? '#f87171'
                          : '#d32f2f',
                        px: 1.5,
                        '&:hover': {
                          borderColor: isDark
                            ? '#f87171'
                            : '#b71c1c',
                          backgroundColor:
                            'rgba(211,47,47,0.08)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Card>
        )}

        {/* Create User Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => {
            if (!creating) {
              setOpenCreateDialog(false)
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: dialogPaperSx,
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: primaryText,
              pb: 1,
            }}
          >
            Create User
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: secondaryText,
                mb: 1.5,
              }}
            >
              Add a new user to the project management
              system.
            </Typography>

            {createValidationError && (
              <Alert
                severity="error"
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  ...(isDark
                    ? {
                        backgroundColor:
                          'rgba(220,38,38,0.12)',
                        color: '#fca5a5',
                      }
                    : {}),
                }}
              >
                {createValidationError}
              </Alert>
            )}

            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={newUser.fullName}
              onChange={(event) =>
                setNewUser({
                  ...newUser,
                  fullName: event.target.value,
                })
              }
              sx={inputSx}
            />

            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={newUser.username}
              onChange={(event) =>
                setNewUser({
                  ...newUser,
                  username: event.target.value,
                })
              }
              sx={inputSx}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={newUser.email}
              onChange={(event) =>
                setNewUser({
                  ...newUser,
                  email: event.target.value,
                })
              }
              sx={inputSx}
            />

            <TextField
              label="Password Hash"
              type="password"
              fullWidth
              margin="normal"
              value={newUser.passwordHash}
              onChange={(event) =>
                setNewUser({
                  ...newUser,
                  passwordHash: event.target.value,
                })
              }
              sx={inputSx}
            />

            <TextField
              label="Avatar URL"
              fullWidth
              margin="normal"
              value={newUser.avatarUrl}
              onChange={(event) =>
                setNewUser({
                  ...newUser,
                  avatarUrl: event.target.value,
                })
              }
              sx={inputSx}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2.5,
              pt: 1,
              gap: 1,
            }}
          >
            <Button
              onClick={() =>
                setOpenCreateDialog(false)
              }
              disabled={creating}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: secondaryText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleCreateUser}
              disabled={creating}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3445e8, #6d3fe8)',
                },
              }}
            >
              {creating
                ? 'Creating...'
                : 'Create User'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => {
            if (!editing) {
              setOpenEditDialog(false)
              setSelectedUser(null)
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: dialogPaperSx,
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: primaryText,
              pb: 1,
            }}
          >
            Edit User
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: secondaryText,
                mb: 1.5,
              }}
            >
              Update this user's account information and
              status.
            </Typography>

            {editValidationError && (
              <Alert
                severity="error"
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  ...(isDark
                    ? {
                        backgroundColor:
                          'rgba(220,38,38,0.12)',
                        color: '#fca5a5',
                      }
                    : {}),
                }}
              >
                {editValidationError}
              </Alert>
            )}

            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={selectedUser?.fullName || ''}
              onChange={(event) =>
                setSelectedUser(
                  selectedUser
                    ? {
                        ...selectedUser,
                        fullName:
                          event.target.value,
                      }
                    : null
                )
              }
              sx={inputSx}
            />

            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={selectedUser?.username || ''}
              onChange={(event) =>
                setSelectedUser(
                  selectedUser
                    ? {
                        ...selectedUser,
                        username:
                          event.target.value,
                      }
                    : null
                )
              }
              sx={inputSx}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={selectedUser?.email || ''}
              onChange={(event) =>
                setSelectedUser(
                  selectedUser
                    ? {
                        ...selectedUser,
                        email:
                          event.target.value,
                      }
                    : null
                )
              }
              sx={inputSx}
            />

            <TextField
              label="Avatar URL"
              fullWidth
              margin="normal"
              value={selectedUser?.avatarUrl || ''}
              onChange={(event) =>
                setSelectedUser(
                  selectedUser
                    ? {
                        ...selectedUser,
                        avatarUrl:
                          event.target.value,
                      }
                    : null
                )
              }
              sx={inputSx}
            />

            <FormControl
              fullWidth
              margin="normal"
              sx={selectSx}
            >
              <InputLabel>Status</InputLabel>

              <Select
                label="Status"
                value={
                  selectedUser?.isActive
                    ? 'active'
                    : 'inactive'
                }
                onChange={(event) =>
                  setSelectedUser(
                    selectedUser
                      ? {
                          ...selectedUser,
                          isActive:
                            event.target.value ===
                            'active',
                        }
                      : null
                  )
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor:
                        dialogBackground,
                      color: primaryText,
                      border: `1px solid ${borderColor}`,
                    },
                  },
                }}
              >
                <MenuItem value="active">
                  Active
                </MenuItem>

                <MenuItem value="inactive">
                  Inactive
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2.5,
              pt: 1,
              gap: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenEditDialog(false)
                setSelectedUser(null)
              }}
              disabled={editing}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: secondaryText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleEditUser}
              disabled={editing}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3445e8, #6d3fe8)',
                },
              }}
            >
              {editing
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => {
            if (!deleting) {
              setOpenDeleteDialog(false)
              setSelectedUser(null)
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: dialogPaperSx,
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: primaryText,
            }}
          >
            Delete User
          </DialogTitle>

          <DialogContent>
            <Typography
              sx={{
                color: primaryText,
              }}
            >
              Are you sure you want to delete{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                }}
              >
                {selectedUser?.fullName}
              </Box>
              ?
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: secondaryText,
              }}
            >
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 2.5,
              pt: 1,
              gap: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenDeleteDialog(false)
                setSelectedUser(null)
              }}
              disabled={deleting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: secondaryText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteOutline />}
              onClick={handleDeleteUser}
              disabled={deleting}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              {deleting
                ? 'Deleting...'
                : 'Delete User'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Users