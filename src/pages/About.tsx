import {
  Dashboard,
  Info,
  Security,
} from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material'

import { usePageView } from '../api/hooks/usePageView'


function About() {

  usePageView('About')
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          About the System
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Learn more about the Project Management System and the
          technology behind it.
        </Typography>

        {/* System Overview */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Info color="primary" />

              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  System Overview
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  A centralized platform for project management.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography>
              The Project Management System is designed to help
              organizations manage projects, tasks, teams, users,
              notifications, and related activities from a single
              platform.
            </Typography>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Dashboard color="primary" />

              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Key Features
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Core capabilities available in the system.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Chip
                  label="Project Management"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Chip
                  label="Task Management"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Chip
                  label="Team Management"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Chip
                  label="User Management"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Chip
                  label="Notifications"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Chip
                  label="Authentication & Security"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        
        {/* Security */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Security color="primary" />

              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Security
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Authentication and account protection.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography>
              The system uses password authentication, OTP
              verification, JWT-based authentication, protected
              routes, and role-based authorization.
            </Typography>
          </CardContent>
        </Card>

    
      </Box>
    </Container>
  )
}

export default About