import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
} from '@mui/material'
import {
  Folder,
  Task,
  Groups,
  Notifications,
  ArrowForward,
  CheckCircle,
  Menu,
  Close,
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()
const [mobileMenuOpen, setMobileMenuOpen] = 
      useState(false)

  return (
    <Box
  sx={{
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    overflowX: 'hidden',
  }}
>
      {/* Navigation */}

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
         <Box
  sx={{
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: {
      xs: 0,
      sm: 1,
    },
  }}
>
            {/* Logo */}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
              }}
            >
              <Box
  sx={{
    width: 40,
    height: 40,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #42a5f5, #7c4dff)',
    transform: 'skew(-10deg)',
    boxShadow: '0 8px 20px rgba(66,165,245,0.25)',
  }}
>
                <Typography
                  fontWeight="bold"
                  sx={{
                    color: '#ffffff',
                    fontSize: 18,
                    transform: 'skew(10deg)',
                  }}
                >
                  PM
                </Typography>
              </Box>

              <Typography
  variant="h6"
  fontWeight="bold"
  sx={{
    color: '#ffffff',
    fontSize: {
      xs: '1rem',
      sm: '1.1rem',
    },
    letterSpacing: '-0.2px',
  }}
>
  Project Management
</Typography>
            </Box>

            {/* Navigation links */}

            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Typography
  onClick={() =>
    document
      .getElementById('home')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
  sx={{
    color: '#ffffff',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#90caf9',
    },
  }}
>
  Home
</Typography>

<Typography
  onClick={() =>
    document
      .getElementById('features')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
  sx={{
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#ffffff',
    },
  }}
>
  Features
</Typography>

<Typography
  onClick={() =>
    document
      .getElementById('about')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
  sx={{
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#ffffff',
    },
  }}
>
  About
</Typography>

<Typography
  onClick={() =>
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
  sx={{
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#ffffff',
    },
  }}
>
  Contact
</Typography>
            </Box>

{/* Auth buttons */}

<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  }}
>
  {/* Mobile menu button */}

  <IconButton
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    sx={{
      display: {
        xs: 'flex',
        md: 'none',
      },
      color: '#ffffff',
    }}
  >
    {mobileMenuOpen ? <Close /> : <Menu />}
  </IconButton>

  {/* Desktop authentication buttons */}

  <Box
    sx={{
      display: {
        xs: 'none',
        md: 'flex',
      },
      alignItems: 'center',
      gap: 1.5,
    }}
  >
    <Button
      variant="outlined"
      onClick={() => navigate('/login')}
      sx={{
        color: '#ffffff',
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: 2,
        px: 2.5,
        '&:hover': {
          borderColor: '#ffffff',
          backgroundColor:
            'rgba(255,255,255,0.08)',
        },
      }}
    >
      Sign In
    </Button>

    <Button
      variant="contained"
      onClick={() => navigate('/signup')}
      sx={{
        borderRadius: 2,
        px: 2.5,
        background:
          'linear-gradient(135deg, #3f51ff, #7c4dff)',
        boxShadow: 'none',
        '&:hover': {
          background:
            'linear-gradient(135deg, #3045e8, #6a3fe8)',
          boxShadow:
            '0 8px 20px rgba(63,81,255,0.3)',
        },
      }}
    >
      Get Started
    </Button>
  </Box>
</Box>
          </Box>
        </Container>
      </Box>

      {mobileMenuOpen && (
  <Box
    sx={{
      display: {
        xs: 'block',
        md: 'none',
      },
      position: 'absolute',
      top: 78,
      left: 16,
      right: 16,
      zIndex: 20,
      backgroundColor: '#ffffff',
      borderRadius: 2,
      boxShadow: 6,
      overflow: 'hidden',
    }}
  >
    {[
      { label: 'Home', id: 'home' },
      { label: 'Features', id: 'features' },
      { label: 'About', id: 'about' },
      { label: 'Contact', id: 'contact' },
    ].map((item) => (
      <Typography
        key={item.id}
        onClick={() => {
          document
            .getElementById(item.id)
            ?.scrollIntoView({ behavior: 'smooth' })

          setMobileMenuOpen(false)
        }}
        sx={{
          px: 3,
          py: 2,
          color: '#172033',
          fontWeight: 600,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f3f6fb',
            color: '#3f51ff',
          },
        }}
      >
        {item.label}
      </Typography>
    ))}
  </Box>
)}

      {/* Hero */}

      <Box
  id="home"
  sx={{
    minHeight: {
      xs: 680,
      md: 650,
    },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #061633 0%, #0b2a63 55%, #182b70 100%)',
        }}
      >
        {/* Decorative background shapes */}

        <Box
  sx={{
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(66,165,245,0.22), transparent 70%)',
    top: -180,
    right: -100,
  }}
/>

        <Box
          sx={{
            position: 'absolute',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124,77,255,0.2), transparent 70%)',
            bottom: -220,
            left: -150,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            transform: 'rotate(25deg)',
            right: '38%',
            top: '20%',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 2,
            pt: {
              xs: 12,
              md: 8,
            },
          }}
        >
          <Grid
  container
  spacing={6}
  alignItems="center"
  sx={{
    width: '100%',
    margin: 0,
  }}
>
            {/* Hero text */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <Box
                sx={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  px: {
    xs: 1.4,
    sm: 2,
  },
  py: {
    xs: 0.7,
    sm: 0.8,
  },
  mb: {
    xs: 2.5,
    md: 3,
  },
  maxWidth: '100%',
  borderRadius: 5,
  border: '1px solid rgba(66,165,245,0.4)',
  backgroundColor:
    'rgba(66,165,245,0.08)',
}}
              >
                <CheckCircle
                  sx={{
                    fontSize: 17,
                    color: '#64b5f6',
                  }}
                />

                <Typography
  variant="caption"
  fontWeight="bold"
  sx={{
    color: '#90caf9',
    letterSpacing: {
      xs: 0.6,
      sm: 1,
    },
    fontSize: {
      xs: '0.62rem',
      sm: '0.75rem',
    },
    lineHeight: 1.3,
  }}
>
                  YOUR ALL-IN-ONE PROJECT MANAGEMENT SOLUTION
                </Typography>
              </Box>

              <Typography
                variant="h1"
                fontWeight="800"
                sx={{
  color: '#ffffff',
  fontSize: {
    xs: '2.25rem',
    sm: '3.5rem',
    md: '4.2rem',
  },
  lineHeight: {
    xs: 1.1,
    md: 1.08,
  },
  letterSpacing: {
    xs: '-1.2px',
    md: '-2px',
  },
}}
              >
                Plan smarter.
                <br />
                Work together.
                <br />

                <Box
                  component="span"
                  sx={{
                    background:
                      'linear-gradient(90deg, #42a5f5, #7c4dff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Deliver better.
                </Box>
              </Typography>

              <Typography
  variant="h6"
  sx={{
    mt: {
      xs: 2.5,
      md: 3,
    },
    maxWidth: 580,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: 400,
    lineHeight: 1.7,
    fontSize: {
  xs: '0.98rem',
  sm: '1.1rem',
  md: '1.2rem',
},
  }}
>
                Manage projects, organize tasks, collaborate
                with your team, and stay on top of important
                deadlines — all in one place.
              </Typography>

              <Box
  sx={{
    display: 'flex',
    gap: 1.5,
    mt: {
  xs: 3.5,
  md: 4,
},
    flexWrap: 'wrap',
    width: {
      xs: '100%',
      sm: 'auto',
    },
  }}
>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: {
  xs: 2.2,
  sm: 3.5,
},
py: {
  xs: 1.35,
  sm: 1.5,
},
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background:
                      'linear-gradient(135deg, #3f51ff, #7c4dff)',
                    boxShadow:
                      '0 10px 30px rgba(63,81,255,0.3)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #3045e8, #6a3fe8)',
                    },
                  }}
                >
                  Get Started Free
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                   px: {
  xs: 2.5,
  sm: 3.5,
},
py: 1.5,
                    borderRadius: 2,
                    color: '#ffffff',
                    borderColor:
                      'rgba(255,255,255,0.45)',
                    '&:hover': {
                      borderColor: '#ffffff',
                      backgroundColor:
                        'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>

            {/* Dashboard preview */}

            <Grid
              item
              xs={12}
              md={6}
            >
              <Box
                sx={{
                  position: 'relative',
                  mt: {
  xs: 5,
  md: 0,
},
                }}
              >
                {/* Main preview */}

               <Box
  sx={{
    width: '100%',
    maxWidth: '100%',
    borderRadius: {
      xs: 2.5,
      sm: 3,
    },
    p: {
      xs: 0.6,
      sm: 1,
    },
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
    boxShadow:
      '0 30px 70px rgba(0,0,0,0.35)',
    transform: {
      xs: 'none',
      md: 'perspective(1200px) rotateY(-6deg) rotateX(2deg)',
    },
  }}
>
                  <Box
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Preview top bar */}

                    <Box
  sx={{
    height: {
      xs: 40,
      sm: 48,
    },
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: {
      xs: 1.5,
      sm: 2,
    },
                        borderBottom:
                          '1px solid #e8eaf0',
                      }}
                    >
                      <Box
                        sx={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          backgroundColor: '#ef5350',
                        }}
                      />

                      <Box
                        sx={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          backgroundColor: '#ffca28',
                        }}
                      />

                      <Box
                        sx={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          backgroundColor: '#66bb6a',
                        }}
                      />
                    </Box>

                    <Box
  sx={{
    display: 'flex',
    minHeight: 310,
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
  }}
>
                      {/* Preview sidebar */}

                      <Box
  sx={{
    width: 125,
    flexShrink: 0,
    backgroundColor: '#0b1f47',
                          p: 2,
                          display: {
                            xs: 'none',
                            sm: 'block',
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight="bold"
                          sx={{
                            color: '#ffffff',
                          }}
                        >
                          PROJECT
                        </Typography>

                        {[
                          'Dashboard',
                          'Projects',
                          'Tasks',
                          'Teams',
                          'Notifications',
                        ].map((item, index) => (
                          <Box
                            key={item}
                            sx={{
                              mt: 1.5,
                              px: 1,
                              py: 0.8,
                              borderRadius: 1,
                              backgroundColor:
                                index === 0
                                  ? 'rgba(66,165,245,0.2)'
                                  : 'transparent',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  index === 0
                                    ? '#64b5f6'
                                    : 'rgba(255,255,255,0.65)',
                              }}
                            >
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

     {/* Preview content */}

<Box
  sx={{
    flex: 1,
    minWidth: 0,
    p: {
      xs: 1.5,
      sm: 3,
    },
    backgroundColor: '#f5f7fb',
  }}
>
  {/* Dashboard heading */}

  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
    }}
  >
    <Box>
      <Typography
  variant="h6"
  fontWeight="bold"
  sx={{
    color: '#172033',
    fontSize: {
      xs: '0.95rem',
      sm: '1.25rem',
    },
  }}
>
  Dashboard
</Typography>

      <Typography
        variant="caption"
        sx={{
          color: '#7a8494',
        }}
      >
        Overview of your projects and tasks
      </Typography>
    </Box>

    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #42a5f5, #7c4dff)',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
      }}
    >
      PM
    </Box>
  </Box>

  {/* Statistics */}

  <Grid
    container
    spacing={1}
    sx={{ mb: 2 }}
  >
    {[
      {
        label: 'Projects',
        value: '12',
      },
      {
        label: 'Tasks',
        value: '48',
      },
      {
        label: 'Team',
        value: '16',
      },
    ].map((stat) => (
      <Grid
        item
        xs={4}
        key={stat.label}
      >
        <Box
  sx={{
    p: {
      xs: 0.9,
      sm: 1.2,
    },
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    border: '1px solid #e8eaf0',
    boxShadow: '0 2px 8px rgba(23,32,51,0.04)',
  }}
>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#7a8494',
              fontSize: 9,
            }}
          >
            {stat.label}
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 18,
              fontWeight: 800,
              color: '#172033',
            }}
          >
            {stat.value}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>

  {/* Projects */}

  <Typography
    variant="subtitle2"
    fontWeight="bold"
    sx={{
      mb: 1,
      color: '#172033',
    }}
  >
    Active Projects
  </Typography>

  {[
    {
      name: 'Website Redesign',
      progress: 82,
      status: 'On Track',
    },
    {
      name: 'Mobile App',
      progress: 64,
      status: 'In Progress',
    },
    {
      name: 'Marketing Campaign',
      progress: 45,
      status: 'Planning',
    },
  ].map((project) => (
    <Box
  key={project.name}
  sx={{
    mb: 1,
    p: {
      xs: 1.1,
      sm: 1.4,
    },
    borderRadius: 1.8,
    backgroundColor: '#ffffff',
    border: '1px solid #e8eaf0',
    boxShadow: '0 2px 8px rgba(23,32,51,0.04)',
  }}
>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0.8,
        }}
      >
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{
            color: '#273142',
          }}
        >
          {project.name}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#3f51ff',
            fontWeight: 'bold',
            fontSize: 9,
          }}
        >
          {project.progress}%
        </Typography>
      </Box>

      <Box
        sx={{
          height: 6,
          borderRadius: 5,
          backgroundColor: '#e8edf5',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${project.progress}%`,
            height: '100%',
            borderRadius: 5,
            background:
              'linear-gradient(90deg, #42a5f5, #7c4dff)',
          }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 0.7,
          color:
            project.status === 'On Track'
              ? '#388e3c'
              : '#667085',
          fontSize: 9,
        }}
      >
        {project.status}
      </Typography>
    </Box>
  ))}

  {/* Recent tasks */}

  <Typography
    variant="subtitle2"
    fontWeight="bold"
    sx={{
      mt: 2,
      mb: 1,
      color: '#172033',
    }}
  >
    Recent Tasks
  </Typography>

  {[
    'Design homepage',
    'API integration',
  ].map((task) => (
    <Box
      key={task}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        mb: 0.7,
      }}
    >
      <CheckCircle
        sx={{
          fontSize: 15,
          color: '#42a5f5',
        }}
      />

      <Typography
        variant="caption"
        sx={{
          color: '#566174',
          fontSize: 10,
        }}
      >
        {task}
      </Typography>
    </Box>
  ))}
</Box>
                    </Box>
                  </Box>
                </Box>

                {/* Floating activity card */}

                <Box
                  sx={{
                    position: 'absolute',
                    right: {
                      xs: -5,
                      md: -35,
                    },
                    bottom: {
                      xs: -25,
                      md: -35,
                    },
                    width: 190,
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    boxShadow:
                      '0 15px 40px rgba(0,0,0,0.25)',
                    display: {
                      xs: 'none',
                      sm: 'block',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: '#172033' }}
                  >
                    Team Activity
                  </Typography>

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 1,
                      color: '#667085',
                    }}
                  >
                    ✓ Task completed
                  </Typography>

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 0.8,
                      color: '#667085',
                    }}
                  >
                    ✓ Project updated
                  </Typography>

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 0.8,
                      color: '#667085',
                    }}
                  >
                    ✓ New notification
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

     {/* Features */}

<Box
  id="features"
  sx={{
    py: {
      xs: 6,
      sm: 8,
      md: 9,
    },
    backgroundColor: '#ffffff',
  }}
>
  <Container maxWidth="lg">
    <Box
      sx={{
        textAlign: 'center',
        mb: 6,
      }}
    >
      <Typography
  variant="h4"
  fontWeight="bold"
  sx={{
    color: '#172033',
    fontSize: {
      xs: '2rem',
      sm: '2.5rem',
      md: '3rem',
    },
    lineHeight: 1.2,
  }}
>
  Everything your team needs
</Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mt: 1.5,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        Bring projects, tasks, teams, and communication
        together in one organized workspace.
      </Typography>
    </Box>

    <Grid
  container
  spacing={3}
  sx={{
    width: '100%',
    maxWidth: '100%',
    margin: 0,
  }}
>
      {[
        {
          icon: <Folder />,
          title: 'Project Tracking',
          text: 'Keep projects organized, visible, and on schedule.',
        },
        {
          icon: <Task />,
          title: 'Task Management',
          text: 'Create, prioritize, track, and complete tasks with ease.',
        },
        {
          icon: <Groups />,
          title: 'Team Collaboration',
          text: 'Work together and keep everyone aligned.',
        },
        {
          icon: <Notifications />,
          title: 'Notifications',
          text: 'Stay informed about important updates and deadlines.',
        },
      ].map((feature) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={feature.title}
        >
          <Box
  sx={{
  height: '100%',
  p: {
    xs: 2.5,
    sm: 3,
  },
  textAlign: 'center',
  borderRadius: 3,
  border: '1px solid #e8eaf0',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 14px rgba(23,32,51,0.05)',
  transition:
    'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 24px rgba(23,32,51,0.10)',
  },
}}
          >
            {/* Feature Icon */}

            <Box
  sx={{
    width: 64,
    height: 64,
    mx: 'auto',
    borderRadius: 2.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #e3f2fd, #ede7f6)',
    boxShadow:
      '0 6px 16px rgba(63,81,255,0.10)',
    transition: 'transform 0.2s ease',
    '.MuiBox-root:hover &': {
      transform: 'scale(1.05)',
    },
  }}
>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3f51ff',
                  '& svg': {
                    fontSize: 32,
                  },
                }}
              >
                {feature.icon}
              </Box>
            </Box>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mt: 2,
                color: '#172033',
              }}
            >
              {feature.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                lineHeight: 1.7,
              }}
            >
              {feature.text}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>
      {/* Bottom CTA */}

      <Box
  id="about"
  sx={{
    py: {
      xs: 6,
      sm: 7,
      md: 8,
    },
    px: {
      xs: 2,
      sm: 0,
    },
    background:
      'linear-gradient(135deg, #071936, #142d68)',
  }}
>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography
  variant="h4"
  fontWeight="bold"
  sx={{
    color: '#ffffff',
    fontSize: {
      xs: '2rem',
      sm: '2.5rem',
      md: '3rem',
    },
    lineHeight: 1.2,
  }}
>
  Ready to manage your projects better?
</Typography>

            <Typography
  sx={{
    mt: 1.5,
    px: {
      xs: 1,
      sm: 0,
    },
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.7,
    fontSize: {
      xs: '0.95rem',
      sm: '1rem',
    },
  }}
>
              Create your account and start organizing your
              work today.
            </Typography>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/signup')}
              sx={{
  mt: 3,
  px: {
    xs: 3,
    sm: 4,
  },
  py: 1.5,
  borderRadius: 2,
  fontWeight: 'bold',
  background:
    'linear-gradient(135deg, #3f51ff, #7c4dff)',
  boxShadow:
    '0 10px 30px rgba(63,81,255,0.30)',
  transition:
    'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    background:
      'linear-gradient(135deg, #3045e8, #6a3fe8)',
    transform: 'translateY(-2px)',
    boxShadow:
      '0 14px 34px rgba(63,81,255,0.38)',
  },
}}
            >
              Create Your Account
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}

      <Box
  id="contact"
 sx={{
  py: {
    xs: 2.5,
    sm: 3,
  },
  px: 2,
  backgroundColor: '#06142f',
  borderTop: '1px solid rgba(255,255,255,0.06)',
}}
>
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{
  textAlign: 'center',
  color: 'rgba(255,255,255,0.5)',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
  },
  lineHeight: 1.6,
}}
          >
            © {new Date().getFullYear()} Project Management.
            All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage