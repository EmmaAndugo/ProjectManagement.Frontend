import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SecurityIcon from '@mui/icons-material/Security'
import { usePageView } from '../api/hooks/usePageView'
import axiosClient from '../api/axiosClient'

interface SystemLog {
  id: string
  userId: string | null
  username: string | null
  fullName: string | null
  action: string
  entityType: string | null
  entityId: string | null
  description: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

function SystemLogs() {
  usePageView('System Logs')

  const [logs, setLogs] = useState<SystemLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await axiosClient.get<SystemLog[]>(
            '/api/SystemLogs'
          )

        setLogs(response.data)
      } catch (err) {
        console.error(
          'Failed to load system logs:',
          err
        )

        setError(
          'Unable to load system logs.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase()

    if (!search) {
      return logs
    }

    return logs.filter((log) =>
      [
        log.username,
        log.fullName,
        log.action,
        log.entityType,
        log.description,
        log.ipAddress,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(search)
        )
    )
  }, [logs, searchTerm])

  const getActionColor = (
    action: string
  ) => {
    switch (action) {
      case 'CREATE':
      case 'UPLOAD':
        return 'success'

      case 'UPDATE':
        return 'info'

      case 'DELETE':
        return 'error'

      case 'LOGIN':
      case 'LOGOUT':
        return 'primary'

      case 'PASSWORD_CHANGE':
        return 'warning'

      case 'AI_ANALYSIS':
        return 'secondary'

      case 'PAGE_VIEW':
        return 'default'

      default:
        return 'default'
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              mb: 0.75,
            }}
          >
            <SecurityIcon
              sx={{
                color: '#3f51ff',
                fontSize: 28,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
              }}
            >
              System Logs
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
          >
            Review application activity and
            security events.
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: '100%',
              sm: 300,
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  mr: 1,
                  color: 'text.secondary',
                }}
              />
            ),
          }}
        />
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredLogs.length === 0 ? (
          <Box
            sx={{
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
            }}
          >
            <Typography
              color="text.secondary"
            >
              No system logs found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              overflowX: 'auto',
            }}
          >
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse:
                  'collapse',
                minWidth: 900,
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  {[
                    'User',
                    'Action',
                    'Entity',
                    'Description',
                    'IP Address',
                    'Date',
                  ].map((heading) => (
                    <Box
                      component="th"
                      key={heading}
                      sx={{
                        textAlign: 'left',
                        px: 2,
                        py: 1.75,
                        backgroundColor:
                          'background.default',
                        color:
                          'text.secondary',
                        fontSize:
                          '0.78rem',
                        fontWeight: 700,
                        textTransform:
                          'uppercase',
                        letterSpacing:
                          '0.04em',
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        whiteSpace:
                          'nowrap',
                      }}
                    >
                      {heading}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box component="tbody">
                {filteredLogs.map((log) => (
                  <Box
                    component="tr"
                    key={log.id}
                    sx={{
                      '&:hover': {
                        backgroundColor:
                          'action.hover',
                      },
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        verticalAlign:
                          'top',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color:
                            'text.primary',
                        }}
                      >
                        {log.fullName ||
                          log.username ||
                          'System'}
                      </Typography>

                      {log.fullName &&
                        log.username && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            @{log.username}
                          </Typography>
                        )}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        verticalAlign:
                          'top',
                      }}
                    >
                      <Chip
                        label={log.action}
                        size="small"
                        color={getActionColor(
                          log.action
                        ) as
                          | 'default'
                          | 'primary'
                          | 'secondary'
                          | 'error'
                          | 'info'
                          | 'success'
                          | 'warning'}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 1.5,
                        }}
                      />
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        verticalAlign:
                          'top',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            'text.primary',
                        }}
                      >
                        {log.entityType ||
                          '—'}
                      </Typography>

                      {log.entityId && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mt: 0.25,
                          }}
                        >
                          {log.entityId}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        verticalAlign:
                          'top',
                        minWidth: 280,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            'text.primary',
                          lineHeight: 1.5,
                        }}
                      >
                        {log.description}
                      </Typography>
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        verticalAlign:
                          'top',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {log.ipAddress ||
                          '—'}
                      </Typography>
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        px: 2,
                        py: 1.75,
                        borderBottom:
                          '1px solid',
                        borderColor:
                          'divider',
                        verticalAlign:
                          'top',
                        whiteSpace:
                          'nowrap',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            'text.primary',
                        }}
                      >
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {!loading && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.5 }}
        >
          Showing {filteredLogs.length} of{' '}
          {logs.length} log
          {logs.length === 1 ? '' : 's'}.
        </Typography>
      )}
    </Box>
  )
}

export default SystemLogs