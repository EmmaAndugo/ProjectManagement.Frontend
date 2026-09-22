import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
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
  Grid,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import {
  Folder,
  Add,
  ArrowForward,
  Edit,
  DeleteOutline,
  Visibility,
  CalendarToday,
} from '@mui/icons-material'

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../api/services/projectService'

import type { Project } from '../api/services/projectService'

import { getTeams } from '../api/services/teamService'
import { getUsers } from '../api/services/userService'

import type { User } from '../api/services/userService'
import type { Team } from '../api/services/teamService'

import { usePageView } from '../api/hooks/usePageView'

function Projects() {

  usePageView('Projects')
  
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [openCreateDialog, setOpenCreateDialog] =
    useState(false)

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] =
    useState('')
  const [ownerId, setOwnerId] = useState('')
  const [teamId, setTeamId] = useState('')
  const [creating, setCreating] = useState(false)

  const [users, setUsers] = useState<User[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  const [openEditDialog, setOpenEditDialog] =
    useState(false)

  const [editingProject, setEditingProject] =
    useState<Project | null>(null)

  const [editProjectName, setEditProjectName] =
    useState('')

  const [
    editProjectDescription,
    setEditProjectDescription,
  ] = useState('')

  const [editOwnerId, setEditOwnerId] =
    useState('')

  const [editTeamId, setEditTeamId] =
    useState('')

  const [editStatus, setEditStatus] =
    useState('')

  const [editVisibility, setEditVisibility] =
    useState('')

  const [updating, setUpdating] = useState(false)

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false)

  const [deletingProject, setDeletingProject] =
    useState<Project | null>(null)

  /* -----------------------------------------
     Theme-aware colors
  ----------------------------------------- */

  const pageBackground = isDark
    ? '#101522'
    : '#f5f7fb'

  const cardBackground = isDark
    ? '#182033'
    : '#ffffff'

  const borderColor = isDark
    ? '#2b3548'
    : '#e8eaf0'

  const primaryText = isDark
    ? '#f3f4f6'
    : '#172033'

  const secondaryText = isDark
    ? '#aab4c3'
    : '#7a8494'

  const bodyText = isDark
    ? '#e5e7eb'
    : '#273142'

  const mutedText = isDark
    ? '#8f9bad'
    : '#9aa3b1'

  const neutralText = isDark
    ? '#aab4c3'
    : '#667085'

  const inputBorder = isDark
    ? '#4b5563'
    : '#9ca3af'

   

  const mutedChipBackground = isDark
    ? '#263043'
    : '#f1f3f7'

  const statusChipBackground = isDark
    ? 'rgba(63,81,255,0.16)'
    : '#eef6ff'

  const completedChipBackground = isDark
    ? 'rgba(21,128,61,0.18)'
    : '#ecfdf3'

  const progressIconBackground = isDark
    ? 'linear-gradient(135deg, rgba(66,165,245,0.16), rgba(124,77,255,0.16))'
    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)'

  const dialogBackground = isDark
    ? '#182033'
    : '#ffffff'

  const errorBackground = isDark
    ? 'rgba(220,38,38,0.12)'
    : '#fff7f7'

  const errorBorder = isDark
    ? 'rgba(248,113,113,0.35)'
    : '#fecaca'

  const errorText = isDark
    ? '#fca5a5'
    : '#b91c1c'

  /* -----------------------------------------
     Shared visual styles
  ----------------------------------------- */

  const primaryButton = {
    background:
      'linear-gradient(135deg, #3f51ff, #7c4dff)',
    borderRadius: 2,
    fontWeight: 700,
    textTransform: 'none' as const,
    boxShadow:
      '0 8px 20px rgba(63,81,255,0.22)',

    '&:hover': {
      background:
        'linear-gradient(135deg, #3045e8, #6a3fe8)',
      boxShadow:
        '0 10px 25px rgba(63,81,255,0.30)',
    },
  }

  const secondaryButton = {
    borderRadius: 2,
    fontWeight: 700,
    textTransform: 'none' as const,
    borderColor: '#3f51ff',
    color: '#3f51ff',

    '&:hover': {
      borderColor: '#3045e8',
      backgroundColor: isDark
        ? 'rgba(63,81,255,0.12)'
        : 'rgba(63,81,255,0.06)',
    },
  }

  const cardStyle = {
    height: '100%',
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: cardBackground,
    boxShadow: isDark
      ? '0 4px 14px rgba(0,0,0,0.20)'
      : '0 4px 14px rgba(23,32,51,0.05)',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease',

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: isDark
        ? '0 10px 24px rgba(0,0,0,0.30)'
        : '0 10px 24px rgba(23,32,51,0.10)',
    },
  }

  const fieldSx = {
    '& .MuiInputLabel-root': {
      color: secondaryText,
      fontWeight: 500,
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: isDark
        ? '#90caf9'
        : '#173f6b',
    },

    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      color: primaryText,

      '& fieldset': {
        borderColor: inputBorder,
        borderWidth: 1.5,
      },

      '&:hover fieldset': {
        borderColor: isDark
          ? '#90caf9'
          : '#173f6b',
      },

      '&.Mui-focused fieldset': {
        borderColor: isDark
          ? '#90caf9'
          : '#173f6b',
        borderWidth: 2,
      },

      '& input': {
        color: primaryText,
      },

      '& textarea': {
        color: primaryText,
      },

      '& select': {
        color: primaryText,
        backgroundColor: 'transparent',
      },
    },
  }

  /* -----------------------------------------
     Project actions
  ----------------------------------------- */

  const handleDeleteProject = (
    project: Project
  ) => {
    setDeletingProject(project)
    setOpenDeleteDialog(true)
  }

  const confirmDeleteProject = async () => {
    if (!deletingProject) {
      return
    }

    try {
      await deleteProject(deletingProject.id)

      setOpenDeleteDialog(false)
      setDeletingProject(null)

      const updatedProjects = await getProjects()
      setProjects(updatedProjects)
    } catch (error) {
      console.error(
        'Failed to delete project:',
        error
      )

      setError('Failed to delete project.')
    }
  }

  const handleEditProject = (
    project: Project
  ) => {
    setEditingProject(project)

    setEditProjectName(project.name)
    setEditProjectDescription(
      project.description || ''
    )
    setEditOwnerId(project.ownerId)
    setEditTeamId(project.teamId || '')
    setEditStatus(project.status)
    setEditVisibility(project.visibility)

    setOpenEditDialog(true)
  }

  const handleUpdateProject = async () => {
    if (!editingProject) {
      return
    }

    setUpdating(true)
    setError('')

    try {
      await updateProject(
        editingProject.id,
        {
          name: editProjectName,
          ownerId: editOwnerId,
          teamId:
            editTeamId || undefined,
          description:
            editProjectDescription ||
            undefined,
          status:
            editStatus || undefined,
          visibility:
            editVisibility || undefined,
        }
      )

      setOpenEditDialog(false)
      setEditingProject(null)

      const updatedProjects =
        await getProjects()

      setProjects(updatedProjects)
    } catch (error) {
      console.error(
        'Failed to update project:',
        error
      )

      setError('Failed to update project.')
    } finally {
      setUpdating(false)
    }
  }

  const handleCreateProject = async () => {
    setCreating(true)
    setError('')

    try {
      await createProject({
        name: projectName,
        ownerId,
        teamId:
          teamId || undefined,
        description:
          projectDescription ||
          undefined,
      })

      setProjectName('')
      setProjectDescription('')
      setOwnerId('')
      setTeamId('')

      setOpenCreateDialog(false)

      const updatedProjects =
        await getProjects()

      setProjects(updatedProjects)
    } catch (error) {
      console.error(
        'Failed to create project:',
        error
      )

      setError('Failed to create project.')
    } finally {
      setCreating(false)
    }
  }

  /* -----------------------------------------
     Load page data
  ----------------------------------------- */

  useEffect(() => {
    const loadProjectsFormData =
      async () => {
        try {
          const [
            projectData,
            userData,
            teamData,
          ] = await Promise.all([
            getProjects(),
            getUsers(),
            getTeams(),
          ])

          setProjects(projectData)
          setUsers(userData)
          setTeams(teamData)
        } catch (error) {
          console.error(
            'Failed to load projects form data:',
            error
          )

          setError(
            'Failed to load projects data.'
          )
        } finally {
          setLoading(false)
        }
      }

    loadProjectsFormData()
  }, [])

  /* -----------------------------------------
     Status chip helper
  ----------------------------------------- */

  const getStatusChip = (
    status: string
  ) => {
    const normalizedStatus =
      String(status).toUpperCase()

    if (
      normalizedStatus === 'ACTIVE'
    ) {
      return {
        backgroundColor:
          statusChipBackground,
        color: isDark
          ? '#90caf9'
          : '#3f51ff',
      }
    }

    if (
      normalizedStatus === 'COMPLETED'
    ) {
      return {
        backgroundColor:
          completedChipBackground,
        color: isDark
          ? '#86efac'
          : '#15803d',
      }
    }

    if (
      normalizedStatus === 'ARCHIVED'
    ) {
      return {
        backgroundColor:
          mutedChipBackground,
        color: neutralText,
      }
    }

    return {
      backgroundColor:
        mutedChipBackground,
      color: neutralText,
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: pageBackground,
        py: {
          xs: 2.5,
          sm: 3.5,
          md: 4,
          lg: 5,
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
          },
        }}
      >
        {/* Header */}

        <Box
          sx={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            gap: 2,
            mb: {
              xs: 3,
              sm: 4,
            },
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                color: primaryText,
                fontWeight: 800,
                fontSize: {
                  xs: '1.8rem',
                  sm: '2.1rem',
                  md: '2.4rem',
                },
                letterSpacing:
                  '-0.8px',
                lineHeight: 1.2,
              }}
            >
              Projects
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: secondaryText,
                fontSize: {
                  xs: '0.85rem',
                  sm: '0.95rem',
                },
                lineHeight: 1.6,
              }}
            >
              Manage your projects,
              teams, and project
              progress.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              setOpenCreateDialog(true)
            }
            sx={{
              ...primaryButton,
              px: 2.5,
              py: 1.3,
              whiteSpace: 'nowrap',
            }}
          >
            Create Project
          </Button>
        </Box>

        {/* Error */}

        {error && (
          <Card
            sx={{
              mb: 3,
              borderRadius: 2.5,
              border:
                `1px solid ${errorBorder}`,
              backgroundColor:
                errorBackground,
              boxShadow: 'none',
            }}
          >
            <CardContent
              sx={{
                py: 1.5,
                '&:last-child': {
                  pb: 1.5,
                },
              }}
            >
              <Typography
                sx={{
                  color: errorText,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Loading */}

        {loading && (
          <Card sx={cardStyle}>
            <CardContent
              sx={{
                py: 6,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  color: secondaryText,
                }}
              >
                Loading projects...
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  py: 7,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    background:
                      progressIconBackground,
                    color: '#3f51ff',
                  }}
                >
                  <Folder
                    sx={{ fontSize: 32 }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: primaryText,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                  }}
                >
                  No projects found
                </Typography>

                <Typography
                  sx={{
                    mt: 0.6,
                    color: secondaryText,
                    fontSize: '0.85rem',
                  }}
                >
                  Create your first
                  project to get started.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() =>
                    setOpenCreateDialog(true)
                  }
                  sx={{
                    ...primaryButton,
                    mt: 2.5,
                  }}
                >
                  Create Project
                </Button>
              </CardContent>
            </Card>
          )}

        {/* Project cards */}

        {!loading &&
          projects.length > 0 && (
            <Grid
              container
              spacing={{
                xs: 2,
                sm: 2.5,
                md: 3,
              }}
            >
              {projects.map(
                (project) => {
                  const statusStyle =
                    getStatusChip(
                      project.status
                    )

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={4}
                      key={project.id}
                    >
                      <Card
                        sx={{
                          ...cardStyle,
                          overflow:
                            'hidden',
                        }}
                      >
                        <CardContent
                          sx={{
                            display: 'flex',
                            flexDirection:
                              'column',
                            height: '100%',
                            p: {
                              xs: 2.25,
                              sm: 2.5,
                              md: 2.75,
                            },
                          }}
                        >
                          {/* Project heading */}

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems:
                                'flex-start',
                              gap: 1.5,
                              mb: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                flexShrink: 0,
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                background:
                                  progressIconBackground,
                                color:
                                  '#3f51ff',
                              }}
                            >
                              <Folder />
                            </Box>

                            <Box
                              sx={{
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  color:
                                    primaryText,
                                  fontWeight:
                                    800,
                                  fontSize:
                                    '1rem',
                                  lineHeight:
                                    1.3,
                                  wordBreak:
                                    'break-word',
                                }}
                              >
                                {
                                  project.name
                                }
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.4,
                                  color:
                                    mutedText,
                                  fontSize:
                                    '0.7rem',
                                  overflow:
                                    'hidden',
                                  textOverflow:
                                    'ellipsis',
                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                {
                                  project.slug
                                }
                              </Typography>
                            </Box>
                          </Box>

                          {/* Description */}

                          <Typography
                            sx={{
                              color:
                                secondaryText,
                              fontSize:
                                '0.82rem',
                              lineHeight:
                                1.6,
                              mb: 2,
                              minHeight: 40,
                              display:
                                '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient:
                                'vertical',
                              overflow:
                                'hidden',
                            }}
                          >
                            {project.description ||
                              'No description provided.'}
                          </Typography>

                          {/* Status */}

                          <Box
                            sx={{
                              display:
                                'flex',
                              gap: 1,
                              flexWrap:
                                'wrap',
                              mb: 2,
                            }}
                          >
                            <Chip
                              label={
                                project.status
                              }
                              size="small"
                              sx={{
                                backgroundColor:
                                  statusStyle.backgroundColor,
                                color:
                                  statusStyle.color,
                                fontWeight:
                                  700,
                                fontSize:
                                  '0.68rem',
                                borderRadius:
                                  1.5,
                              }}
                            />

                            <Chip
                              icon={
                                <Visibility
                                  sx={{
                                    fontSize:
                                      15,
                                  }}
                                />
                              }
                              label={
                                project.visibility
                              }
                              size="small"
                              variant="outlined"
                              sx={{
                                color:
                                  neutralText,
                                borderColor:
                                  isDark
                                    ? '#3b4659'
                                    : '#d9dde5',
                                fontWeight:
                                  700,
                                fontSize:
                                  '0.68rem',
                                borderRadius:
                                  1.5,
                              }}
                            />
                          </Box>

                          {/* Project metadata */}

                          <Box
                            sx={{
                              display:
                                'flex',
                              flexDirection:
                                'column',
                              gap: 0.8,
                              mb: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                color:
                                  secondaryText,
                                fontSize:
                                  '0.75rem',
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  color:
                                    bodyText,
                                  fontWeight:
                                    700,
                                }}
                              >
                                Slug:
                              </Box>{' '}
                              {
                                project.slug
                              }
                            </Typography>

                            {project.startDate && (
                              <Typography
                                sx={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap: 0.6,
                                  color:
                                    secondaryText,
                                  fontSize:
                                    '0.75rem',
                                }}
                              >
                                <CalendarToday
                                  sx={{
                                    fontSize:
                                      14,
                                  }}
                                />

                                <Box
                                  component="span"
                                >
                                  Start:{' '}
                                  {new Date(
                                    project.startDate
                                  ).toLocaleDateString()}
                                </Box>
                              </Typography>
                            )}

                            {project.dueDate && (
                              <Typography
                                sx={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap: 0.6,
                                  color:
                                    secondaryText,
                                  fontSize:
                                    '0.75rem',
                                }}
                              >
                                <CalendarToday
                                  sx={{
                                    fontSize:
                                      14,
                                  }}
                                />

                                <Box
                                  component="span"
                                >
                                  Due:{' '}
                                  {new Date(
                                    project.dueDate
                                  ).toLocaleDateString()}
                                </Box>
                              </Typography>
                            )}
                          </Box>

                          {/* Actions */}

                          <Box
                            sx={{
                              mt: 'auto',
                              pt: 1,
                            }}
                          >
                            <Button
                              fullWidth
                              variant="contained"
                              endIcon={
                                <ArrowForward />
                              }
                              onClick={() =>
                                navigate(
                                  `/projects/${project.id}`
                                )
                              }
                              sx={{
                                ...primaryButton,
                                py: 1.1,
                                fontSize:
                                  '0.85rem',
                                boxShadow:
                                  'none',
                              }}
                            >
                              Open Project
                            </Button>

                            <Box
                              sx={{
                                display:
                                  'flex',
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              <Button
                                fullWidth
                                variant="outlined"
                                startIcon={
                                  <Edit />
                                }
                                onClick={() =>
                                  handleEditProject(
                                    project
                                  )
                                }
                                sx={{
                                  ...secondaryButton,
                                  py: 0.9,
                                  fontSize:
                                    '0.8rem',
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                fullWidth
                                variant="outlined"
                                startIcon={
                                  <DeleteOutline />
                                }
                                onClick={() =>
                                  handleDeleteProject(
                                    project
                                  )
                                }
                                sx={{
                                  py: 0.9,
                                  borderRadius: 2,
                                  fontWeight:
                                    700,
                                  textTransform:
                                    'none',
                                  borderColor:
                                    '#ef4444',
                                  color:
                                    isDark
                                      ? '#f87171'
                                      : '#dc2626',

                                  '&:hover': {
                                    borderColor:
                                      '#dc2626',
                                    backgroundColor:
                                      isDark
                                        ? 'rgba(220,38,38,0.12)'
                                        : 'rgba(220,38,38,0.05)',
                                  },
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                }
              )}
            </Grid>
          )}

        {/* -----------------------------------------
            Create Project Dialog
        ----------------------------------------- */}

        <Dialog
          open={openCreateDialog}
          onClose={() =>
            setOpenCreateDialog(false)
          }
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor:
                dialogBackground,
              backgroundImage: 'none',
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 800,
              pb: 1,
            }}
          >
            Create Project
          </DialogTitle>

          <DialogContent
            sx={{ pt: '8px !important' }}
          >
            <Typography
              sx={{
                color: secondaryText,
                fontSize: '0.85rem',
                mb: 1,
              }}
            >
              Create a new project and
              assign an owner and team.
            </Typography>

            <TextField
              fullWidth
              label="Project Name"
              value={projectName}
              onChange={(event) =>
                setProjectName(
                  event.target.value
                )
              }
              margin="normal"
              required
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Description"
              value={projectDescription}
              onChange={(event) =>
                setProjectDescription(
                  event.target.value
                )
              }
              margin="normal"
              multiline
              rows={3}
              sx={fieldSx}
            />

            <TextField
              select
              fullWidth
              label="Owner"
              value={ownerId}
              onChange={(event) =>
                setOwnerId(
                  event.target.value
                )
              }
              margin="normal"
              required
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldSx}
            >
              <option value="">
                Select an owner
              </option>

              {users
                .filter(
                  (user) =>
                    user.isActive
                )
                .map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.fullName} (
                    {user.username})
                  </option>
                ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Team"
              value={teamId}
              onChange={(event) =>
                setTeamId(
                  event.target.value
                )
              }
              margin="normal"
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldSx}
            >
              <option value="">
                No team
              </option>

              {teams.map((team) => (
                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))}
            </TextField>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
              gap: 1,
            }}
          >
            <Button
              onClick={() =>
                setOpenCreateDialog(false)
              }
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform:
                  'none',
                color: neutralText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={
                handleCreateProject
              }
              disabled={
                creating ||
                !projectName ||
                !ownerId
              }
              sx={{
                ...primaryButton,
                minWidth: 140,
              }}
            >
              {creating
                ? 'Creating...'
                : 'Create Project'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* -----------------------------------------
            Edit Project Dialog
        ----------------------------------------- */}

        <Dialog
          open={openEditDialog}
          onClose={() =>
            setOpenEditDialog(false)
          }
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor:
                dialogBackground,
              backgroundImage: 'none',
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 800,
              pb: 1,
            }}
          >
            Edit Project
          </DialogTitle>

          <DialogContent
            sx={{ pt: '8px !important' }}
          >
            <Typography
              sx={{
                color: secondaryText,
                fontSize: '0.85rem',
                mb: 1,
              }}
            >
              Update the project's
              information and settings.
            </Typography>

            <TextField
              fullWidth
              label="Project Name"
              value={editProjectName}
              onChange={(event) =>
                setEditProjectName(
                  event.target.value
                )
              }
              margin="normal"
              required
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Description"
              value={
                editProjectDescription
              }
              onChange={(event) =>
                setEditProjectDescription(
                  event.target.value
                )
              }
              margin="normal"
              multiline
              rows={3}
              sx={fieldSx}
            />

            <TextField
              select
              fullWidth
              label="Owner"
              value={editOwnerId}
              onChange={(event) =>
                setEditOwnerId(
                  event.target.value
                )
              }
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                native: true,
              }}
              sx={fieldSx}
            >
              <option value="">
                Select an owner
              </option>

              {users
                .filter(
                  (user) =>
                    user.isActive
                )
                .map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.fullName} (
                    {user.username})
                  </option>
                ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Team"
              value={editTeamId}
              onChange={(event) =>
                setEditTeamId(
                  event.target.value
                )
              }
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                native: true,
              }}
              sx={fieldSx}
            >
              <option value="">
                No team
              </option>

              {teams.map((team) => (
                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Status"
              value={editStatus}
              onChange={(event) =>
                setEditStatus(
                  event.target.value
                )
              }
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                native: true,
              }}
              sx={fieldSx}
            >
              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="COMPLETED">
                COMPLETED
              </option>

              <option value="ARCHIVED">
                ARCHIVED
              </option>
            </TextField>

            <TextField
              select
              fullWidth
              label="Visibility"
              value={editVisibility}
              onChange={(event) =>
                setEditVisibility(
                  event.target.value
                )
              }
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              SelectProps={{
                native: true,
              }}
              sx={fieldSx}
            >
              <option value="PRIVATE">
                PRIVATE
              </option>

              <option value="PUBLIC">
                PUBLIC
              </option>
            </TextField>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
              gap: 1,
            }}
          >
            <Button
              onClick={() =>
                setOpenEditDialog(false)
              }
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform:
                  'none',
                color: neutralText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={
                handleUpdateProject
              }
              disabled={
                updating ||
                !editProjectName ||
                !editOwnerId
              }
              sx={{
                ...primaryButton,
                minWidth: 140,
              }}
            >
              {updating
                ? 'Updating...'
                : 'Update Project'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* -----------------------------------------
            Delete Project Dialog
        ----------------------------------------- */}

        <Dialog
          open={openDeleteDialog}
          onClose={() =>
            setOpenDeleteDialog(false)
          }
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor:
                dialogBackground,
              backgroundImage: 'none',
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 800,
            }}
          >
            Delete Project
          </DialogTitle>

          <DialogContent>
            <Typography
              sx={{
                color: bodyText,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to
              delete{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 800,
                }}
              >
                {deletingProject?.name}
              </Box>
              ?
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                color: secondaryText,
                fontSize: '0.85rem',
              }}
            >
              This action cannot be
              undone.
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              gap: 1,
            }}
          >
            <Button
              onClick={() =>
                setOpenDeleteDialog(false)
              }
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform:
                  'none',
                color: neutralText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={
                <DeleteOutline />
              }
              onClick={
                confirmDeleteProject
              }
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform:
                  'none',
                backgroundColor:
                  '#dc2626',

                '&:hover': {
                  backgroundColor:
                    '#b91c1c',
                },
              }}
            >
              Delete Project
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Projects