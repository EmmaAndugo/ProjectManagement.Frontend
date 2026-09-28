import { useEffect, useMemo, useState } from 'react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import axios from 'axios'
import {
  Alert,
  Avatar,
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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Add,
  Assignment,
  CalendarToday,
  DeleteOutline,
  EditOutlined,
  PersonOutline,
  Search,
  Schedule,
} from '@mui/icons-material'

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../api/services/taskService'

import type { Task } from '../api/services/taskService'

import {
  getProjects,
} from '../api/services/projectService'

import type { Project } from '../api/services/projectService'

import { getAssignableUsers } from '../api/services/userService'
import type { AssignableUser } from '../api/services/userService'

import {
  analyzeTask,
} from '../api/services/AIService'

import type {
  AITaskAnalysis,
} from '../api/services/AIService'

const STATUS_OPTIONS = [
  {
    value: 'TODO',
    label: 'To Do',
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
  },
  {
    value: 'DONE',
    label: 'Done',
  },
]


const getStatusLabel = (status: string) => {
  const option = STATUS_OPTIONS.find(
    (item) => item.value === status
  )

  return option?.label ?? status
}


const getStatusChipSx = (
  status: string,
  isDark: boolean
) => {
  switch (status) {
    case 'DONE':
      return {
        backgroundColor: isDark
          ? 'rgba(46,125,50,0.18)'
          : '#e8f5e9',
        color: isDark
          ? '#81c784'
          : '#2e7d32',
        border: isDark
          ? '1px solid rgba(129,199,132,0.30)'
          : '1px solid #c8e6c9',
      }

    case 'IN_PROGRESS':
      return {
        backgroundColor: isDark
          ? 'rgba(21,101,192,0.18)'
          : '#e3f2fd',
        color: isDark
          ? '#90caf9'
          : '#1565c0',
        border: isDark
          ? '1px solid rgba(144,202,249,0.30)'
          : '1px solid #bbdefb',
      }

    case 'TODO':
    default:
      return {
        backgroundColor: isDark
          ? 'rgba(94,53,177,0.18)'
          : '#ede7f6',
        color: isDark
          ? '#b39ddb'
          : '#5e35b1',
        border: isDark
          ? '1px solid rgba(179,157,219,0.30)'
          : '1px solid #d1c4e9',
      }
  }
}


const formatDate = (date?: string) => {
  if (!date) {
    return 'Not set'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Not set'
  }

  return parsedDate.toLocaleDateString()
}

import { usePageView } from '../api/hooks/usePageView'


function Tasks() {
  usePageView('Tasks')
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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
    : '#394150'

  const mutedText = isDark
    ? '#8f9bad'
    : '#5f6877'

  const inputBorder = isDark
    ? '#4b5563'
    : '#e1e5eb'

  const inputBackground = isDark
    ? '#141b2a'
    : '#fafbfc'

  const hoverBackground = isDark
    ? '#202a3d'
    : '#fafbff'

  const tableHeaderBackground = isDark
    ? '#141b2a'
    : '#fafbfc'

  const dividerColor = isDark
    ? '#2b3548'
    : '#eef0f4'

  const iconBackground = isDark
    ? 'linear-gradient(135deg, rgba(66,165,245,0.16), rgba(124,77,255,0.16))'
    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)'

  const dialogBackground = isDark
    ? '#182033'
    : '#ffffff'

  const errorBackground = isDark
    ? 'rgba(220,38,38,0.12)'
    : undefined

  const errorBorder = isDark
    ? 'rgba(248,113,113,0.35)'
    : undefined

  const errorText = isDark
    ? '#fca5a5'
    : undefined

  const cardStyle = {
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: cardBackground,
    boxShadow: isDark
      ? '0 4px 14px rgba(0,0,0,0.20)'
      : '0 4px 14px rgba(23,32,51,0.05)',
    transition:
      'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
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
        : '#3f51ff',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      color: primaryText,
      backgroundColor: isDark
        ? '#141b2a'
        : '#ffffff',
      '& input': {
        color: primaryText,
      },
      '& textarea': {
        color: primaryText,
      },
      '& fieldset': {
        borderColor: isDark
          ? '#4b5563'
          : '#9ca3af',
      },
      '&:hover fieldset': {
        borderColor: isDark
          ? '#6b7280'
          : '#9ca3af',
      },
      '&.Mui-focused fieldset': {
        borderColor: isDark
          ? '#90caf9'
          : '#3f51ff',
        borderWidth: 2,
      },
    },
  }

  const selectSx = {
    borderRadius: 2,
    color: primaryText,
    backgroundColor: isDark
      ? '#141b2a'
      : '#ffffff',
    '& .MuiSelect-select': {
      color: primaryText,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: isDark
        ? '#4b5563'
        : '#9ca3af',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: isDark
        ? '#6b7280'
        : '#9ca3af',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: isDark
        ? '#90caf9'
        : '#3f51ff',
      borderWidth: 2,
    },
  }

  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<AssignableUser[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Create dialog
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskProjectId, setTaskProjectId] = useState('')
  const [taskStatus, setTaskStatus] = useState('TODO')
  
  const [taskAssigneeId, setTaskAssigneeId] = useState('')
  const [taskStartDate, setTaskStartDate] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskEstimatedHours, setTaskEstimatedHours] = useState('')

  // Edit dialog
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editError, setEditError] = useState('')

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [editTaskTitle, setEditTaskTitle] = useState('')
  const [editTaskDescription, setEditTaskDescription] = useState('')
  const [editTaskProjectId, setEditTaskProjectId] = useState('')
  const [editTaskStatus, setEditTaskStatus] = useState('TODO')
  
  const [editTaskAssigneeId, setEditTaskAssigneeId] = useState('')
  const [editTaskStartDate, setEditTaskStartDate] = useState('')
  const [editTaskDueDate, setEditTaskDueDate] = useState('')
  const [editTaskEstimatedHours, setEditTaskEstimatedHours] = useState('')

  // Delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  // AI Task Analysis
  const [aiAnalysis, setAiAnalysis] =
    useState<AITaskAnalysis | null>(null)

  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [openAiDialog, setOpenAiDialog] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        tasksData,
        projectsData,
        usersData,
      ] = await Promise.all([
        getTasks(),
        getProjects(),
        getAssignableUsers(),
      ])

      setTasks(tasksData)
      setProjects(projectsData)
      setUsers(usersData)
    } catch (err) {
      console.error('Failed to load tasks:', err)
      setError('Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    loadData()
  }, [])


  const getProjectName = (projectId: string) => {
    const project = projects.find(
      (item) => item.id === projectId
    )

    return project?.name ?? 'Unknown project'
  }


  const getUserName = (userId?: string) => {
    if (!userId) {
      return 'Unassigned'
    }

    const user = users.find(
      (item) => item.id === userId
    )

    return user?.fullName ?? user?.username ?? 'Unknown user'
  }


  const activeUsers = useMemo(
    () => users.filter((user) => user.isActive),
    [users]
  )


  const filteredTasks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search) ||
        (task.description ?? '').toLowerCase().includes(search) ||
        getProjectName(task.projectId)
          .toLowerCase()
          .includes(search) ||
        getUserName(task.assigneeId)
          .toLowerCase()
          .includes(search)

      const matchesStatus =
        statusFilter === 'ALL' ||
        task.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [
    tasks,
    searchTerm,
    statusFilter,
    projects,
    users,
  ])


  const resetCreateForm = () => {
    setTaskTitle('')
    setTaskDescription('')
    setTaskProjectId('')
    setTaskStatus('TODO')
    
    setTaskAssigneeId('')
    setTaskStartDate('')
    setTaskDueDate('')
    setTaskEstimatedHours('')
    setCreateError('')
  }


  const handleOpenCreateDialog = () => {
    resetCreateForm()
    setOpenCreateDialog(true)
  }


  const handleCloseCreateDialog = () => {
    if (creating) {
      return
    }

    setOpenCreateDialog(false)
    resetCreateForm()
  }


  const handleCreateTask = async () => {
    setCreateError('')

    if (!taskTitle.trim()) {
      setCreateError('Task title is required.')
      return
    }

    if (!taskProjectId) {
      setCreateError('Project is required.')
      return
    }

  

    try {
      setCreating(true)

      await createTask({
        projectId: taskProjectId,
        title: taskTitle.trim(),
        status: taskStatus,
        description: taskDescription.trim() || undefined,
        assigneeId: taskAssigneeId || undefined,
        
        startDate: taskStartDate || undefined,
        dueDate: taskDueDate || undefined,
        estimatedHours: taskEstimatedHours
          ? Number(taskEstimatedHours)
          : undefined,
      })

      await loadData()

      setOpenCreateDialog(false)
      resetCreateForm()
    } catch (err) {
      console.error('Failed to create task:', err)

      if (axios.isAxiosError(err)) {
        setCreateError(
          err.response?.data?.message ??
          'Failed to create task.'
        )
      } else {
        setCreateError('Failed to create task.')
      }
    } finally {
      setCreating(false)
    }
  }


  const handleOpenEditDialog = (task: Task) => {
    setEditingTask(task)

    setEditTaskTitle(task.title)
    setEditTaskDescription(task.description ?? '')
    setEditTaskProjectId(task.projectId)
    setEditTaskStatus(task.status || 'TODO')
    
    setEditTaskAssigneeId(task.assigneeId ?? '')
    setEditTaskStartDate(
      task.startDate
        ? task.startDate.substring(0, 10)
        : ''
    )
    setEditTaskDueDate(
      task.dueDate
        ? task.dueDate.substring(0, 10)
        : ''
    )
    setEditTaskEstimatedHours(
      task.estimatedHours !== undefined &&
      task.estimatedHours !== null
        ? String(task.estimatedHours)
        : ''
    )

    setEditError('')
    setOpenEditDialog(true)
  }


  const handleCloseEditDialog = () => {
    if (updating) {
      return
    }

    setOpenEditDialog(false)
    setEditingTask(null)
    setEditError('')
  }


  const handleUpdateTask = async () => {
    if (!editingTask) {
      return
    }

    setEditError('')

    if (!editTaskTitle.trim()) {
      setEditError('Task title is required.')
      return
    }

    if (!editTaskProjectId) {
      setEditError('Project is required.')
      return
    }

    

    try {
      setUpdating(true)

      await updateTask(editingTask.id, {
        projectId: editTaskProjectId,
        title: editTaskTitle.trim(),
        status: editTaskStatus,
        description:
          editTaskDescription.trim() || undefined,
        assigneeId:
          editTaskAssigneeId || undefined,
        
        startDate:
          editTaskStartDate || undefined,
        dueDate:
          editTaskDueDate || undefined,
        estimatedHours:
          editTaskEstimatedHours
            ? Number(editTaskEstimatedHours)
            : undefined,
      })

      await loadData()

      setOpenEditDialog(false)
      setEditingTask(null)
    } catch (err) {
      console.error('Failed to update task:', err)

      if (axios.isAxiosError(err)) {
        setEditError(
          err.response?.data?.message ??
          'Failed to update task.'
        )
      } else {
        setEditError('Failed to update task.')
      }
    } finally {
      setUpdating(false)
    }
  }


  const handleOpenDeleteDialog = (task: Task) => {
    setDeletingTask(task)
    setOpenDeleteDialog(true)
  }


  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return
    }

    setOpenDeleteDialog(false)
    setDeletingTask(null)
  }


  const handleDeleteTask = async () => {
    if (!deletingTask) {
      return
    }

    try {
      setDeleting(true)

      await deleteTask(deletingTask.id)
      await loadData()

      setOpenDeleteDialog(false)
      setDeletingTask(null)
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError('Failed to delete task.')
    } finally {
      setDeleting(false)
    }
  }

    const handleAnalyzeTask = async (task: Task) => {
    try {
      setAiLoading(true)
      setAiError('')
      setAiAnalysis(null)
      setOpenAiDialog(true)

      const analysis = await analyzeTask(task.id)

      setAiAnalysis(analysis)
    } catch (err) {
      console.error('Failed to analyze task:', err)

      if (axios.isAxiosError(err)) {
        setAiError(
          err.response?.data?.message ??
          'Unable to analyze this task right now.'
        )
      } else {
        setAiError(
          'Unable to analyze this task right now.'
        )
      }
    } finally {
      setAiLoading(false)
    }
  }


  const handleCloseAiDialog = () => {
    if (aiLoading) {
      return
    }

    setOpenAiDialog(false)
    setAiAnalysis(null)
    setAiError('')
  }


  const totalTasks = tasks.length

  const todoTasks = tasks.filter(
    (task) => task.status === 'TODO'
  ).length

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'IN_PROGRESS'
  ).length

  const completedTasks = tasks.filter(
    (task) => task.status === 'DONE'
  ).length


  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: pageBackground,
        py: { xs: 3, md: 5 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1440,
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
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                color: primaryText,
                fontSize: {
                  xs: '2rem',
                  md: '2.4rem',
                },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 0.75,
              }}
            >
              Tasks
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                fontSize: '0.98rem',
              }}
            >
              Create, organize, and track project tasks.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
            sx={{
              width: {
                xs: '100%',
                sm: 'auto',
              },
              px: 2.5,
              py: 1.25,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              background:
                'linear-gradient(135deg, #3f51ff, #7c4dff)',
              boxShadow:
                '0 6px 16px rgba(63,81,255,0.22)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #3445e8, #6a3ee8)',
                boxShadow:
                  '0 8px 20px rgba(63,81,255,0.28)',
              },
            }}
          >
            Create Task
          </Button>
        </Box>


        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              ...(isDark && {
                backgroundColor: errorBackground,
                border: `1px solid ${errorBorder}`,
                color: errorText,
              }),
            }}
          >
            {error}
          </Alert>
        )}


        {/* Statistics */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 2.5 }}>
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
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        mb: 0.75,
                      }}
                    >
                      Total Tasks
                    </Typography>

                    <Typography
                      sx={{
                        color: primaryText,
                        fontSize: '1.8rem',
                        fontWeight: 800,
                      }}
                    >
                      {totalTasks}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: iconBackground,
                      color: '#3f51ff',
                    }}
                  >
                    <Assignment />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 2.5 }}>
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
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        mb: 0.75,
                      }}
                    >
                      To Do
                    </Typography>

                    <Typography
                      sx={{
                        color: isDark
                          ? '#b39ddb'
                          : '#5e35b1',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                      }}
                    >
                      {todoTasks}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: isDark
                        ? 'rgba(94,53,177,0.18)'
                        : '#ede7f6',
                      color: isDark
                        ? '#b39ddb'
                        : '#5e35b1',
                    }}
                  >
                    <Schedule />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 2.5 }}>
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
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        mb: 0.75,
                      }}
                    >
                      In Progress
                    </Typography>

                    <Typography
                      sx={{
                        color: isDark
                          ? '#90caf9'
                          : '#1565c0',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                      }}
                    >
                      {inProgressTasks}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: isDark
                        ? 'rgba(21,101,192,0.18)'
                        : '#e3f2fd',
                      color: isDark
                        ? '#90caf9'
                        : '#1565c0',
                    }}
                  >
                    <Schedule />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 2.5 }}>
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
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        mb: 0.75,
                      }}
                    >
                      Completed
                    </Typography>

                    <Typography
                      sx={{
                        color: isDark
                          ? '#81c784'
                          : '#2e7d32',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                      }}
                    >
                      {completedTasks}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: isDark
                        ? 'rgba(46,125,50,0.18)'
                        : '#e8f5e9',
                      color: isDark
                        ? '#81c784'
                        : '#2e7d32',
                    }}
                  >
                    <Assignment />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


        {/* Search and filters */}
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
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search tasks, projects, descriptions, or assignees..."
                  InputProps={{
                    startAdornment: (
                      <Search
                        sx={{
                          color: secondaryText,
                          mr: 1,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: primaryText,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: secondaryText,
                      opacity: 1,
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: inputBackground,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: inputBorder,
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: isDark
                          ? '#6b7280'
                          : '#9ca3af',
                      },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                      {
                        borderColor: isDark
                          ? '#90caf9'
                          : '#3f51ff',
                      },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      color: secondaryText,
                      '&.Mui-focused': {
                        color: isDark
                          ? '#90caf9'
                          : '#3f51ff',
                      },
                    }}
                  >
                    Status
                  </InputLabel>

                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    sx={selectSx}
                  >
                    <MenuItem value="ALL">
                      All statuses
                    </MenuItem>

                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>


        {/* Task list */}
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
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'grid',
              },
              gridTemplateColumns:
                '2fr 1.2fr 1.2fr 1fr 1.2fr',
              gap: 2,
              px: 3,
              py: 1.75,
              backgroundColor: tableHeaderBackground,
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            {[
              'TASK',
              'PROJECT',
              'ASSIGNEE',
              'STATUS',
              'ACTIONS',
            ].map((heading) => (
              <Typography
                key={heading}
                sx={{
                  color: secondaryText,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: 0.7,
                }}
              >
                {heading}
              </Typography>
            ))}
          </Box>


          {loading ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  color: secondaryText,
                }}
              >
                Loading tasks...
              </Typography>
            </Box>
          ) : filteredTasks.length === 0 ? (
            <Box
              sx={{
                py: 8,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Assignment
                sx={{
                  fontSize: 46,
                  color: isDark
                    ? '#4b5563'
                    : '#c5cad3',
                  mb: 1,
                }}
              />

              <Typography
                sx={{
                  color: primaryText,
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                No tasks found
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  fontSize: '0.9rem',
                }}
              >
                Try changing your search or status filter.
              </Typography>
            </Box>
          ) : (
            filteredTasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  display: {
                    xs: 'block',
                    md: 'grid',
                  },
                  gridTemplateColumns:
                    '2fr 1.2fr 1.2fr 1fr 1.2fr',
                  gap: 2,
                  alignItems: 'center',
                  px: { xs: 2, md: 3 },
                  py: 2.25,
                  borderBottom:
                    `1px solid ${dividerColor}`,
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                  '&:hover': {
                    backgroundColor: hoverBackground,
                  },
                }}
              >
                {/* Task */}
                <Box sx={{ mb: { xs: 2, md: 0 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        background: iconBackground,
                        color: '#3f51ff',
                        fontSize: '1rem',
                      }}
                    >
                      <Assignment fontSize="small" />
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: primaryText,
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          wordBreak: 'break-word',
                        }}
                      >
                        {task.title}
                      </Typography>

                      {task.description && (
                        <Typography
                          sx={{
                            color: secondaryText,
                            fontSize: '0.82rem',
                            mt: 0.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: {
                            xs: 'flex',
                            md: 'none',
                          },
                          gap: 1,
                          flexWrap: 'wrap',
                          mt: 1,
                        }}
                      >
                        <Chip
                          label={getStatusLabel(task.status)}
                          size="small"
                          sx={{
                            ...getStatusChipSx(
                              task.status,
                              isDark
                            ),
                            fontWeight: 700,
                            fontSize: '0.72rem',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>


                {/* Project */}
                <Box
                  sx={{
                    mb: { xs: 1.5, md: 0 },
                  }}
                >
                  <Typography
                    sx={{
                      display: {
                        xs: 'block',
                        md: 'none',
                      },
                      color: secondaryText,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      mb: 0.4,
                      letterSpacing: 0.5,
                    }}
                  >
                    PROJECT
                  </Typography>

                  <Typography
                    sx={{
                      color: bodyText,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}
                  >
                    {getProjectName(task.projectId)}
                  </Typography>
                </Box>


                {/* Assignee */}
                <Box
                  sx={{
                    mb: { xs: 1.5, md: 0 },
                  }}
                >
                  <Typography
                    sx={{
                      display: {
                        xs: 'block',
                        md: 'none',
                      },
                      color: secondaryText,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      mb: 0.4,
                      letterSpacing: 0.5,
                    }}
                  >
                    ASSIGNEE
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <PersonOutline
                      sx={{
                        color: secondaryText,
                        fontSize: 19,
                      }}
                    />

                    <Typography
                      sx={{
                        color: bodyText,
                        fontSize: '0.88rem',
                        fontWeight: 500,
                      }}
                    >
                      {getUserName(task.assigneeId)}
                    </Typography>
                  </Box>
                </Box>


                {/* Status */}
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'block',
                    },
                  }}
                >
                  <Chip
                    label={getStatusLabel(task.status)}
                    size="small"
                    sx={{
                      ...getStatusChipSx(
                        task.status,
                        isDark
                      ),
                      fontWeight: 700,
                      fontSize: '0.74rem',
                    }}
                  />
                </Box>

                


                {/* Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                                    <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={() =>
                      handleAnalyzeTask(task)
                    }
                    disabled={aiLoading}
                    sx={{
                      borderRadius: 1.75,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: isDark
                        ? '#9575cd'
                        : '#7c4dff',
                      color: isDark
                        ? '#b39ddb'
                        : '#7c4dff',
                      '&:hover': {
                        borderColor: isDark
                          ? '#b39ddb'
                          : '#6a3ee8',
                        backgroundColor:
                          isDark
                            ? 'rgba(179,157,219,0.08)'
                            : 'rgba(124,77,255,0.04)',
                      },
                    }}
                  >
                    Analyze
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditOutlined />}
                    onClick={() =>
                      handleOpenEditDialog(task)
                    }
                    sx={{
                      borderRadius: 1.75,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: isDark
                        ? '#90caf9'
                        : '#3f51ff',
                      color: isDark
                        ? '#90caf9'
                        : '#3f51ff',
                      '&:hover': {
                        borderColor: isDark
                          ? '#bbdefb'
                          : '#3445e8',
                        backgroundColor:
                          isDark
                            ? 'rgba(144,202,249,0.08)'
                            : 'rgba(63,81,255,0.04)',
                      },
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteOutline />}
                    onClick={() =>
                      handleOpenDeleteDialog(task)
                    }
                    sx={{
                      borderRadius: 1.75,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: isDark
                        ? '#ef9a9a'
                        : '#d32f2f',
                      color: isDark
                        ? '#ef9a9a'
                        : '#d32f2f',
                      '&:hover': {
                        borderColor: isDark
                          ? '#ffcdd2'
                          : '#b71c1c',
                        backgroundColor:
                          isDark
                            ? 'rgba(239,154,154,0.08)'
                            : 'rgba(211,47,47,0.04)',
                      },
                    }}
                  >
                    Delete
                  </Button>
                </Box>


                {/* Mobile dates */}
                <Box
                  sx={{
                    display: {
                      xs: 'flex',
                      md: 'none',
                    },
                    gap: 2,
                    flexWrap: 'wrap',
                    mt: 1.5,
                    pt: 1.5,
                    borderTop:
                      `1px solid ${dividerColor}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <CalendarToday
                      sx={{
                        fontSize: 15,
                        color: secondaryText,
                      }}
                    />

                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: '0.76rem',
                      }}
                    >
                      Start: {formatDate(task.startDate)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <CalendarToday
                      sx={{
                        fontSize: 15,
                        color: secondaryText,
                      }}
                    />

                    <Typography
                      sx={{
                        color: secondaryText,
                        fontSize: '0.76rem',
                      }}
                    >
                      Due: {formatDate(task.dueDate)}
                    </Typography>
                  </Box>

                  {task.estimatedHours !== undefined &&
                    task.estimatedHours !== null && (
                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: '0.76rem',
                        }}
                      >
                        {task.estimatedHours} hrs
                      </Typography>
                    )}
                </Box>
              </Box>
            ))
          )}
        </Card>
      </Container>


      {/* CREATE TASK DIALOG */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: dialogBackground,
            backgroundImage: 'none',
            color: primaryText,
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
          Create Task
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            borderColor: borderColor,
          }}
        >
          {createError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                ...(isDark && {
                  backgroundColor: errorBackground,
                  border: `1px solid ${errorBorder}`,
                  color: errorText,
                }),
              }}
            >
              {createError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Task Title"
            value={taskTitle}
            onChange={(event) =>
              setTaskTitle(event.target.value)
            }
            margin="normal"
            required
            sx={fieldSx}
          />

          <TextField
            fullWidth
            label="Description"
            value={taskDescription}
            onChange={(event) =>
              setTaskDescription(event.target.value)
            }
            margin="normal"
            multiline
            minRows={3}
            sx={fieldSx}
          />

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: secondaryText,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  },
                }}
              >
                <InputLabel>Project</InputLabel>

                <Select
                  value={taskProjectId}
                  label="Project"
                  onChange={(event) =>
                    setTaskProjectId(event.target.value)
                  }
                  sx={selectSx}
                >
                  {projects.map((project) => (
                    <MenuItem
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: secondaryText,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  },
                }}
              >
                <InputLabel>Status</InputLabel>

                <Select
                  value={taskStatus}
                  label="Status"
                  onChange={(event) =>
                    setTaskStatus(event.target.value)
                  }
                  sx={selectSx}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: secondaryText,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  },
                }}
              >
                <InputLabel>Assignee</InputLabel>

                <Select
                  value={taskAssigneeId}
                  label="Assignee"
                  onChange={(event) =>
                    setTaskAssigneeId(event.target.value)
                  }
                  sx={selectSx}
                >
                  <MenuItem value="">
                    Unassigned
                  </MenuItem>

                  {activeUsers.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName ||
                        user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={taskStartDate}
                onChange={(event) =>
                  setTaskStartDate(event.target.value)
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldSx}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={taskDueDate}
                onChange={(event) =>
                  setTaskDueDate(event.target.value)
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldSx}
              />
            </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={taskEstimatedHours}
                onChange={(event) =>
                  setTaskEstimatedHours(
                    event.target.value
                  )
                }
                margin="normal"
                inputProps={{
                  min: 0,
                }}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <Button
            onClick={handleCloseCreateDialog}
            disabled={creating}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: mutedText,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateTask}
            disabled={creating}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              background:
                'linear-gradient(135deg, #3f51ff, #7c4dff)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #3445e8, #6a3ee8)',
              },
            }}
          >
            {creating ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>


      {/* EDIT TASK DIALOG */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: dialogBackground,
            backgroundImage: 'none',
            color: primaryText,
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
          Edit Task
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            borderColor: borderColor,
          }}
        >
          {editError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
                ...(isDark && {
                  backgroundColor: errorBackground,
                  border: `1px solid ${errorBorder}`,
                  color: errorText,
                }),
              }}
            >
              {editError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Task Title"
            value={editTaskTitle}
            onChange={(event) =>
              setEditTaskTitle(event.target.value)
            }
            margin="normal"
            required
            sx={fieldSx}
          />

          <TextField
            fullWidth
            label="Description"
            value={editTaskDescription}
            onChange={(event) =>
              setEditTaskDescription(
                event.target.value
              )
            }
            margin="normal"
            multiline
            minRows={3}
            sx={fieldSx}
          />

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: secondaryText,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  },
                }}
              >
                <InputLabel>Project</InputLabel>

                <Select
                  value={editTaskProjectId}
                  label="Project"
                  onChange={(event) =>
                    setEditTaskProjectId(
                      event.target.value
                    )
                  }
                  sx={selectSx}
                >
                  {projects.map((project) => (
                    <MenuItem
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: secondaryText,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  },
                }}
              >
                <InputLabel>Status</InputLabel>

                <Select
                  value={editTaskStatus}
                  label="Status"
                  onChange={(event) =>
                    setEditTaskStatus(
                      event.target.value
                    )
                  }
                  sx={selectSx}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: secondaryText,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: isDark
                      ? '#90caf9'
                      : '#3f51ff',
                  },
                }}
              >
                <InputLabel>Assignee</InputLabel>

                <Select
                  value={editTaskAssigneeId}
                  label="Assignee"
                  onChange={(event) =>
                    setEditTaskAssigneeId(
                      event.target.value
                    )
                  }
                  sx={selectSx}
                >
                  <MenuItem value="">
                    Unassigned
                  </MenuItem>

                  {activeUsers.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName ||
                        user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={editTaskStartDate}
                onChange={(event) =>
                  setEditTaskStartDate(
                    event.target.value
                  )
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldSx}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={editTaskDueDate}
                onChange={(event) =>
                  setEditTaskDueDate(
                    event.target.value
                  )
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={fieldSx}
              />
            </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={editTaskEstimatedHours}
                onChange={(event) =>
                  setEditTaskEstimatedHours(
                    event.target.value
                  )
                }
                margin="normal"
                inputProps={{
                  min: 0,
                }}
                sx={fieldSx}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <Button
            onClick={handleCloseEditDialog}
            disabled={updating}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: mutedText,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateTask}
            disabled={updating}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              background:
                'linear-gradient(135deg, #3f51ff, #7c4dff)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #3445e8, #6a3ee8)',
              },
            }}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

            {/* AI TASK ANALYSIS DIALOG */}
      <Dialog
        open={openAiDialog}
        onClose={handleCloseAiDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: dialogBackground,
            backgroundImage: 'none',
            color: primaryText,
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            background:
              'linear-gradient(135deg, #061633 0%, #0b2a63 55%, #182b70 100%)',
            color: '#ffffff',
            px: { xs: 2.5, sm: 3.5 },
            py: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                background:
                  'linear-gradient(135deg, #42a5f5, #7c4dff)',
              }}
            >
              <AutoAwesomeIcon />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                }}
              >
                AI Task Analysis
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.82rem',
                  opacity: 0.75,
                }}
              >
                Intelligent insights based on the current task data
              </Typography>
            </Box>
          </Box>
        </Box>

        <DialogContent
          dividers
          sx={{
            borderColor: borderColor,
            p: { xs: 2, sm: 3 },
          }}
        >
          {aiLoading && (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
              }}
            >
              <AutoAwesomeIcon
                sx={{
                  fontSize: 42,
                  color: '#7c4dff',
                  mb: 1.5,
                }}
              />

              <Typography
                sx={{
                  color: primaryText,
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Analyzing task...
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  fontSize: '0.9rem',
                }}
              >
                Reviewing the task status, deadlines,
                ownership, and estimated effort.
              </Typography>
            </Box>
          )}

          {aiError && !aiLoading && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                ...(isDark && {
                  backgroundColor: errorBackground,
                  border: `1px solid ${errorBorder}`,
                  color: errorText,
                }),
              }}
            >
              {aiError}
            </Alert>
          )}

          {aiAnalysis && !aiLoading && (
            <Box>
              {/* Summary */}
              <Card
                elevation={0}
                sx={{
                  mb: 2.5,
                  borderRadius: 2.5,
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark
                    ? '#141b2a'
                    : '#fafbfc',
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    sx={{
                      color: primaryText,
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    {aiAnalysis.taskTitle}
                  </Typography>

                  <Typography
                    sx={{
                      color: bodyText,
                      fontSize: '0.92rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {aiAnalysis.summary}
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={2}>
                {/* Risks */}
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 2.5,
                      border: `1px solid ${borderColor}`,
                      backgroundColor: cardBackground,
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography
                        sx={{
                          color: isDark
                            ? '#ef9a9a'
                            : '#c62828',
                          fontWeight: 800,
                          mb: 1.5,
                        }}
                      >
                        Risks
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.25,
                        }}
                      >
                        {aiAnalysis.risks.map(
                          (risk, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'flex-start',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  backgroundColor:
                                    isDark
                                      ? '#ef9a9a'
                                      : '#d32f2f',
                                  mt: 0.8,
                                  flexShrink: 0,
                                }}
                              />

                              <Typography
                                sx={{
                                  color: bodyText,
                                  fontSize: '0.84rem',
                                  lineHeight: 1.55,
                                }}
                              >
                                {risk}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Suggestions */}
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 2.5,
                      border: `1px solid ${borderColor}`,
                      backgroundColor: cardBackground,
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography
                        sx={{
                          color: isDark
                            ? '#90caf9'
                            : '#1565c0',
                          fontWeight: 800,
                          mb: 1.5,
                        }}
                      >
                        Suggestions
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.25,
                        }}
                      >
                        {aiAnalysis.suggestions.map(
                          (suggestion, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'flex-start',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  backgroundColor:
                                    isDark
                                      ? '#90caf9'
                                      : '#1976d2',
                                  mt: 0.8,
                                  flexShrink: 0,
                                }}
                              />

                              <Typography
                                sx={{
                                  color: bodyText,
                                  fontSize: '0.84rem',
                                  lineHeight: 1.55,
                                }}
                              >
                                {suggestion}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recommended Actions */}
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 2.5,
                      border: `1px solid ${borderColor}`,
                      backgroundColor: cardBackground,
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography
                        sx={{
                          color: isDark
                            ? '#b39ddb'
                            : '#6a1b9a',
                          fontWeight: 800,
                          mb: 1.5,
                        }}
                      >
                        Recommended Actions
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.25,
                        }}
                      >
                        {aiAnalysis.recommendedActions.map(
                          (action, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'flex-start',
                              }}
                            >
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background:
                                    'linear-gradient(135deg, #3f51ff, #7c4dff)',
                                  color: '#ffffff',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  flexShrink: 0,
                                }}
                              >
                                {index + 1}
                              </Box>

                              <Typography
                                sx={{
                                  color: bodyText,
                                  fontSize: '0.84rem',
                                  lineHeight: 1.55,
                                }}
                              >
                                {action}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <Button
            onClick={handleCloseAiDialog}
            disabled={aiLoading}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              color: mutedText,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* DELETE TASK DIALOG */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: dialogBackground,
            backgroundImage: 'none',
            color: primaryText,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: primaryText,
            fontWeight: 800,
          }}
        >
          Delete Task
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: mutedText,
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete{' '}
            <strong
              style={{
                color: primaryText,
              }}
            >
              {deletingTask?.title}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: mutedText,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleDeleteTask}
            disabled={deleting}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Tasks