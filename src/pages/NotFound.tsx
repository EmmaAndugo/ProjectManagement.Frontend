import {
  ArrowBack,
  Home,
  SearchOff,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 5,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            borderRadius: 4,
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
          }}
        >
          <SearchOff
            color="primary"
            sx={{
              fontSize: 80,
              mb: 2,
            }}
          />

          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: '4rem',
                sm: '5rem',
              },
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            Page Not Found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              mb: 4,
            }}
          >
            Sorry, the page you are looking for does not exist
            or may have been moved.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default NotFound