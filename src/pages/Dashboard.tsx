import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Divider,
  useTheme,
} from '@mui/material'

import {
  Folder,
  Task,
  Groups,
  Notifications,
  Add,
  ArrowForward,
  Schedule,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material'

import { useNavigate } from 'react-router-dom'

import { usePageView } from '../api/hooks/usePageView'

import { getProjects } from '../api/services/projectService'
import { getTasks } from '../api/services/taskService'
import { getTeams } from '../api/services/teamService'
import { getNotifications } from '../api/services/notificationService'

function Dashboard() {

  usePageView('Dashboard')
  
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const storedUser = localStorage.getItem('user')

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null

  const currentUserId = currentUser?.id

  const [projectCount, setProjectCount] = useState(0)

  const [projects, setProjects] = useState<
    Awaited<ReturnType<typeof getProjects>>
  >([])

  const [taskCount, setTaskCount] = useState(0)

  const [tasks, setTasks] = useState<
    Awaited<ReturnType<typeof getTasks>>
  >([])

  const [teamCount, setTeamCount] = useState(0)

  const [notificationCount, setNotificationCount] =
    useState(0)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          projects,
          tasks,
          teams,
          notifications,
        ] = await Promise.all([
          getProjects(),
          getTasks(),
          getTeams(),
          getNotifications(),
        ])

        setProjectCount(projects.length)
        setProjects(projects)

        setTaskCount(tasks.length)

        const myTasks = tasks.filter(
          (task) =>
            task.assigneeId === currentUserId
        )

        setTasks(myTasks)

        setTeamCount(teams.length)

        const unreadNotifications =
          notifications.filter(
            (notification) => !notification.readAt
          )

        setNotificationCount(
          unreadNotifications.length
        )
      } catch (error) {
        console.error(
          'Failed to load dashboard data:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  /* -----------------------------------------
     Theme-aware visual styles
  ----------------------------------------- */

  const pageBackground = isDark
    ? '#101522'
    : '#f5f7fb'

  const cardBackground = isDark
    ? '#172033'
    : '#ffffff'

  const primaryText = isDark
    ? '#f8fafc'
    : '#172033'

  const headingText = isDark
    ? '#f8fafc'
    : '#273142'

  const secondaryText = isDark
    ? '#aeb7c6'
    : '#7a8494'

  const mutedText = isDark
    ? '#8994a7'
    : '#667085'

  const borderColor = isDark
    ? 'rgba(255,255,255,0.10)'
    : '#e8eaf0'

  const dividerColor = isDark
    ? 'rgba(255,255,255,0.10)'
    : '#e8eaf0'

  

  const progressTrack = isDark
    ? '#2b3548'
    : '#e8edf5'

  const iconBackground = isDark
    ? 'linear-gradient(135deg, rgba(66,165,245,0.18), rgba(124,77,255,0.20))'
    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)'

  const statusBackground = isDark
    ? 'rgba(63,81,255,0.16)'
    : '#eef6ff'

  const taskCountBackground = isDark
    ? 'rgba(255,255,255,0.07)'
    : '#f1f3f7'

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
        ? '0 10px 24px rgba(0,0,0,0.28)'
        : '0 10px 24px rgba(23,32,51,0.10)',
    },
  }

  const gradient =
    'linear-gradient(90deg, #42a5f5, #7c4dff)'

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

  const sectionButtonStyle = {
    color: '#6d7cff',
    fontWeight: 700,
    textTransform: 'none' as const,
    borderRadius: 2,
    '&:hover': {
      backgroundColor: isDark
        ? 'rgba(63,81,255,0.14)'
        : 'rgba(63,81,255,0.06)',
    },
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
        transition:
          'background-color 0.25s ease',
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
        {/* =====================================
            Dashboard Header
        ===================================== */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
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
                letterSpacing: '-0.8px',
                lineHeight: 1.2,
              }}
            >
              Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: secondaryText,
                fontSize: {
                  xs: '0.85rem',
                  sm: '0.95rem',
                },
              }}
            >
              Welcome back,{' '}
              <Box
                component="span"
                sx={{
                  color: primaryText,
                  fontWeight: 700,
                }}
              >
                {currentUser?.fullName || 'User'}
              </Box>
              . Here's an overview of your
              projects and tasks.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/projects')}
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

        {/* =====================================
            Statistics
        ===================================== */}

        <Grid container spacing={2}>

          {/* Projects */}

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 2.75,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Projects
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: primaryText,
                        fontSize: '2rem',
                        lineHeight: 1,
                        fontWeight: 800,
                      }}
                    >
                      {loading
                        ? '...'
                        : projectCount}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      color: '#6d7cff',
                    }}
                  >
                    <Folder />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: secondaryText,
                    fontSize: '0.72rem',
                  }}
                >
                  Total projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tasks */}

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 2.75,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Tasks
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: primaryText,
                        fontSize: '2rem',
                        lineHeight: 1,
                        fontWeight: 800,
                      }}
                    >
                      {loading
                        ? '...'
                        : taskCount}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      color: '#6d7cff',
                    }}
                  >
                    <Task />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: secondaryText,
                    fontSize: '0.72rem',
                  }}
                >
                  Total tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Teams */}

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 2.75,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Teams
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: primaryText,
                        fontSize: '2rem',
                        lineHeight: 1,
                        fontWeight: 800,
                      }}
                    >
                      {loading
                        ? '...'
                        : teamCount}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      color: '#6d7cff',
                    }}
                  >
                    <Groups />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: secondaryText,
                    fontSize: '0.72rem',
                  }}
                >
                  Total teams
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 2.75,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      Notifications
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        color: primaryText,
                        fontSize: '2rem',
                        lineHeight: 1,
                        fontWeight: 800,
                      }}
                    >
                      {loading
                        ? '...'
                        : notificationCount}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBackground,
                      color: '#6d7cff',
                    }}
                  >
                    <Notifications />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: secondaryText,
                    fontSize: '0.72rem',
                  }}
                >
                  Unread notifications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* =====================================
            My Workspace
        ===================================== */}

        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: primaryText,
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                Active Projects
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: secondaryText,
                  fontSize: '0.82rem',
                }}
              >
                Your projects and their current
                workload
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<ArrowForward />}
              onClick={() =>
                navigate('/projects')
              }
              sx={sectionButtonStyle}
            >
              View all projects
            </Button>
          </Box>

          {projects.length === 0 ? (
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    color: primaryText,
                    fontWeight: 700,
                  }}
                >
                  No projects yet
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: secondaryText,
                    fontSize: '0.85rem',
                  }}
                >
                  Create a project to start
                  managing your workspace.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {projects
                .slice(0, 6)
                .map((project) => {
                  const projectTasks =
                    tasks.filter(
                      (task) =>
                        task.projectId ===
                        project.id
                    )

                  const completedTasks =
                    projectTasks.filter(
                      (task) =>
                        String(
                          task.status
                        ).toLowerCase() ===
                        'completed'
                    ).length

                  const progress =
                    projectTasks.length > 0
                      ? Math.round(
                          (completedTasks /
                            projectTasks.length) *
                            100
                        )
                      : 0

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={project.id}
                    >
                      <Card
                        sx={{
                          ...cardStyle,
                          overflow: 'hidden',
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 2.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent:
                                'space-between',
                              alignItems:
                                'flex-start',
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                color: headingText,
                                fontWeight: 800,
                                fontSize:
                                  '0.95rem',
                                wordBreak:
                                  'break-word',
                              }}
                            >
                              {project.name}
                            </Typography>

                            <Typography
                              sx={{
                                color:
                                  '#6d7cff',
                                fontWeight: 800,
                                fontSize:
                                  '0.72rem',
                                flexShrink: 0,
                              }}
                            >
                              {progress}%
                            </Typography>
                          </Box>

                          {/* Progress bar */}

                          <Box
                            sx={{
                              mt: 1.5,
                              height: 6,
                              borderRadius: 5,
                              backgroundColor:
                                progressTrack,
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${progress}%`,
                                height: '100%',
                                borderRadius: 5,
                                background:
                                  gradient,
                                transition:
                                  'width 0.4s ease',
                              }}
                            />
                          </Box>

                          <Typography
                            sx={{
                              mt: 0.8,
                              color: secondaryText,
                              fontSize:
                                '0.72rem',
                              lineHeight: 1.5,
                              display:
                                '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient:
                                'vertical',
                              overflow:
                                'hidden',
                              minHeight: 34,
                            }}
                          >
                            {project.description ||
                              'No description provided.'}
                          </Typography>

                          <Box
                            sx={{
                              display:
                                'flex',
                              gap: 1,
                              flexWrap:
                                'wrap',
                              mt: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius:
                                  1.5,
                                backgroundColor:
                                  statusBackground,
                              }}
                            >
                              <Typography
                                sx={{
                                  color:
                                    '#6d7cff',
                                  fontSize:
                                    '0.68rem',
                                  fontWeight:
                                    700,
                                }}
                              >
                                {
                                  project.status
                                }
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius:
                                  1.5,
                                backgroundColor:
                                  taskCountBackground,
                              }}
                            >
                              <Typography
                                sx={{
                                  color:
                                    mutedText,
                                  fontSize:
                                    '0.68rem',
                                  fontWeight:
                                    700,
                                }}
                              >
                                {
                                  projectTasks.length
                                }{' '}
                                {projectTasks.length ===
                                1
                                  ? 'task'
                                  : 'tasks'}
                              </Typography>
                            </Box>
                          </Box>

                          {project.dueDate && (
                            <Typography
                              sx={{
                                display:
                                  'block',
                                mt: 1.5,
                                color:
                                  secondaryText,
                                fontSize:
                                  '0.7rem',
                              }}
                            >
                              Due:{' '}
                              {new Date(
                                project.dueDate
                              ).toLocaleDateString()}
                            </Typography>
                          )}

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
                              mt: 2,
                              py: 1,
                              fontSize:
                                '0.82rem',
                              boxShadow:
                                'none',
                            }}
                          >
                            Open Workspace
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
            </Grid>
          )}
        </Box>

        {/* =====================================
            Recent Tasks
        ===================================== */}

        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
              justifyContent:
                'space-between',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: primaryText,
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                Recent Tasks
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: secondaryText,
                  fontSize: '0.82rem',
                }}
              >
                Tasks currently assigned to you
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/tasks')}
              sx={sectionButtonStyle}
            >
              View all tasks
            </Button>
          </Box>

          <Card
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
            {loading ? (
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    color: secondaryText,
                  }}
                >
                  Loading tasks...
                </Typography>
              </CardContent>
            ) : tasks.length === 0 ? (
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    color: primaryText,
                    fontWeight: 700,
                  }}
                >
                  No tasks yet
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: secondaryText,
                    fontSize: '0.85rem',
                  }}
                >
                  Tasks assigned to you will
                  appear here.
                </Typography>
              </CardContent>
            ) : (
              tasks
                .slice(0, 5)
                .map((task, index) => (
                  <Box key={task.id}>
                    <CardContent
                      onClick={() =>
                        navigate('/tasks')
                      }
                      sx={{
                        px: {
                          xs: 2,
                          sm: 2.5,
                        },
                        py: 2,
                        cursor: 'pointer',
                        transition:
                          'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor:
                            isDark
                              ? 'rgba(255,255,255,0.04)'
                              : '#f8faff',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems:
                            'center',
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1.8,
                            display: 'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                            background:
                              iconBackground,
                            color: '#6d7cff',
                            flexShrink: 0,
                          }}
                        >
                          {String(
                            task.status
                          ).toLowerCase() ===
                          'completed' ? (
                            <CheckCircle />
                          ) : (
                            <Task />
                          )}
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
                                headingText,
                              fontWeight: 700,
                              fontSize:
                                '0.9rem',
                              wordBreak:
                                'break-word',
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Box
                            sx={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: 1,
                              mt: 0.6,
                              flexWrap:
                                'wrap',
                            }}
                          >
                            <Box
                              sx={{
                                px: 0.9,
                                py: 0.35,
                                borderRadius:
                                  1,
                                backgroundColor:
                                  statusBackground,
                              }}
                            >
                              <Typography
                                sx={{
                                  color:
                                    '#6d7cff',
                                  fontSize:
                                    '0.65rem',
                                  fontWeight:
                                    700,
                                }}
                              >
                                {
                                  task.status
                                }
                              </Typography>
                            </Box>

                            {task.dueDate && (
                              <Box
                                sx={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap: 0.4,
                                }}
                              >
                                <Schedule
                                  sx={{
                                    fontSize: 14,
                                    color:
                                      secondaryText,
                                  }}
                                />

                                <Typography
                                  sx={{
                                    color:
                                      secondaryText,
                                    fontSize:
                                      '0.68rem',
                                  }}
                                >
                                  Due{' '}
                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>

                        <ArrowForward
                          sx={{
                            color: isDark
                              ? '#667085'
                              : '#b0b7c3',
                            fontSize: 19,
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                    </CardContent>

                    {index <
                      Math.min(
                        tasks.length,
                        5
                      ) -
                        1 && (
                      <Divider
                        sx={{
                          borderColor:
                            dividerColor,
                        }}
                      />
                    )}
                  </Box>
                ))
            )}
          </Card>
        </Box>

        {/* =====================================
            Recent Activity
        ===================================== */}

        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: {
                xs: 'flex-start',
                sm: 'center',
              },
              justifyContent:
                'space-between',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: primaryText,
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                Recent Activity
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: secondaryText,
                  fontSize: '0.82rem',
                }}
              >
                Recent activity from your tasks
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/tasks')}
              sx={sectionButtonStyle}
            >
              View all tasks
            </Button>
          </Box>

          <Card
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
            {tasks.length === 0 ? (
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    color: primaryText,
                    fontWeight: 700,
                  }}
                >
                  No recent activity
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: secondaryText,
                    fontSize: '0.85rem',
                  }}
                >
                  Activity from your tasks will
                  appear here.
                </Typography>
              </CardContent>
            ) : (
              tasks
                .slice(0, 5)
                .map((task, index) => (
                  <Box key={task.id}>
                    <CardContent
                      onClick={() =>
                        navigate('/tasks')
                      }
                      sx={{
                        px: {
                          xs: 2,
                          sm: 2.5,
                        },
                        py: 2,
                        cursor: 'pointer',
                        transition:
                          'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor:
                            isDark
                              ? 'rgba(255,255,255,0.04)'
                              : '#f8faff',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems:
                            'flex-start',
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1.8,
                            display: 'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                            background:
                              iconBackground,
                            color: '#6d7cff',
                            flexShrink: 0,
                          }}
                        >
                          <AccessTime />
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
                                headingText,
                              fontWeight: 700,
                              fontSize:
                                '0.9rem',
                              wordBreak:
                                'break-word',
                            }}
                          >
                            {task.title}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.4,
                              color:
                                secondaryText,
                              fontSize:
                                '0.72rem',
                            }}
                          >
                            Task status:{' '}
                            <Box
                              component="span"
                              sx={{
                                color:
                                  '#6d7cff',
                                fontWeight:
                                  700,
                              }}
                            >
                              {task.status}
                            </Box>
                          </Typography>

                          <Box
                            sx={{
                              display:
                                'flex',
                              gap: 2,
                              flexWrap:
                                'wrap',
                              mt: 0.8,
                            }}
                          >
                            {task.startDate && (
                              <Typography
                                sx={{
                                  color:
                                    secondaryText,
                                  fontSize:
                                    '0.68rem',
                                }}
                              >
                                Start:{' '}
                                {new Date(
                                  task.startDate
                                ).toLocaleDateString()}
                              </Typography>
                            )}

                            {task.dueDate && (
                              <Typography
                                sx={{
                                  color:
                                    secondaryText,
                                  fontSize:
                                    '0.68rem',
                                }}
                              >
                                Due:{' '}
                                {new Date(
                                  task.dueDate
                                ).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>

                    {index <
                      Math.min(
                        tasks.length,
                        5
                      ) -
                        1 && (
                      <Divider
                        sx={{
                          borderColor:
                            dividerColor,
                        }}
                      />
                    )}
                  </Box>
                ))
            )}
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default Dashboard