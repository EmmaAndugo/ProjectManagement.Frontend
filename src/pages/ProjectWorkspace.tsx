import React, {
  useEffect,
  useState,
} from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  Paper,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'

import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

import { useNavigate, useParams } from 'react-router-dom'

import { getProjects } from '../api/services/projectService'
import type { Project } from '../api/services/projectService'

import { getUsers } from '../api/services/userService'
import type { User } from '../api/services/userService'

import { getTeams } from '../api/services/teamService'
import type { Team } from '../api/services/teamService'

import {
  createTask,
  getTasks,
  updateTask,
} from '../api/services/taskService'
import type { Task } from '../api/services/taskService'

import {
  getComments,
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api/services/CommentsService'

import type {
  Comment,
} from '../api/services/CommentsService'

import {
  getTaskAttachments,
  uploadAttachment,
  downloadAttachment,
  deleteAttachment,
} from '../api/services/AttachmentsService'

import type {
  Attachment,
} from '../api/services/AttachmentsService'

import { analyzeProject } from '../api/services/AIService'
import type { AIProjectAnalysis } from '../api/services/AIService'

function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [owner, setOwner] = useState<User | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('')
  const [newTaskStatus, setNewTaskStatus] = useState('TODO')
  const [newTaskStartDate, setNewTaskStartDate] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [newTaskEstimatedHours, setNewTaskEstimatedHours] = useState('')

  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const [selectedTask, setSelectedTask] =
  useState<Task | null>(null)

const [comments, setComments] =
  useState<Comment[]>([])

  const [commentCounts, setCommentCounts] =
  useState<Record<string, number>>({})

const [attachments, setAttachments] =
  useState<Attachment[]>([])

const [commentText, setCommentText] =
  useState('')

  const [replyingTo, setReplyingTo] =
  useState<Comment | null>(null)

const [commentLoading, setCommentLoading] =
  useState(false)

const [attachmentLoading, setAttachmentLoading] =
  useState(false)

const [commentError, setCommentError] =
  useState('')

const [attachmentError, setAttachmentError] =
  useState('')

const [openTaskDetails, setOpenTaskDetails] =
  useState(false)

const [selectedFile, setSelectedFile] =
  useState<File | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [aiAnalysis, setAiAnalysis] =
  useState<AIProjectAnalysis | null>(null)

const [aiLoading, setAiLoading] = useState(false)

const [aiError, setAiError] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      try {
       const [
  projects,
  users,
  teams,
  allTasks,
  allComments,
] = await Promise.all([
  getProjects(),
  getUsers(),
  getTeams(),
  getTasks(),
  getComments(),
])

        const selectedProject = projects.find(
          (item) => item.id === projectId
        )

        if (!selectedProject) {
          setError('Project not found.')
          return
        }

        setProject(selectedProject)

        const selectedOwner = users.find(
          (user) => user.id === selectedProject.ownerId
        )

        const selectedTeam = teams.find(
          (team) => team.id === selectedProject.teamId
        )

        setOwner(selectedOwner || null)
        setTeam(selectedTeam || null)
        setUsers(users)

        const projectTasks = allTasks.filter(
          (task) => task.projectId === selectedProject.id
        )

        setTasks(projectTasks)
        const counts: Record<string, number> = {}

allComments.forEach((comment) => {
  if (comment.deletedAt) {
    return
  }

  counts[comment.taskId] =
    (counts[comment.taskId] || 0) + 1
})

setCommentCounts(counts)
      } catch (error) {
        console.error('Failed to load project:', error)
        setError('Failed to load project.')
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  const resetTaskForm = () => {
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskAssigneeId('')
    setNewTaskStatus('TODO')
    setNewTaskStartDate('')
    setNewTaskDueDate('')
    setNewTaskEstimatedHours('')
  }

  const handleCreateTask = async () => {
    if (!project || !newTaskTitle.trim()) {
      return
    }

    try {
      const storedUser = localStorage.getItem('user')

      if (!storedUser) {
        return
      }

      

      const createdTask = await createTask({
        projectId: project.id,
        title: newTaskTitle.trim(),
        status: newTaskStatus,
        startDate: newTaskStartDate || undefined,
        dueDate: newTaskDueDate || undefined,
        estimatedHours:
          newTaskEstimatedHours !== ''
            ? Number(newTaskEstimatedHours)
            : undefined,
        description: newTaskDescription.trim() || undefined,
        assigneeId: newTaskAssigneeId || undefined,
        
      })

      setTasks((currentTasks) => [
        ...currentTasks,
        createdTask,
      ])

      resetTaskForm()
      setOpenTaskDialog(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleStatusChange = async (
    task: Task,
    newStatus: string
  ) => {
    try {
      const updatedTask = await updateTask(task.id, {
        projectId: task.projectId,
        title: task.title,
        status: newStatus,
        description: task.description,
        assigneeId: task.assigneeId,
        
        startDate: task.startDate,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        position: task.position,
      })

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? updatedTask
            : currentTask
        )
      )
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = async (newStatus: string) => {
    if (!draggedTask) {
      return
    }

    if (draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    await handleStatusChange(draggedTask, newStatus)
    setDraggedTask(null)
  }

  const handleOpenTaskDetails = async (task: Task) => {
  setSelectedTask(task)
  setOpenTaskDetails(true)

  setComments([])
  setAttachments([])
  setCommentError('')
  setAttachmentError('')

  try {
    const [taskComments, taskAttachments] =
      await Promise.all([
        getTaskComments(task.id),
        getTaskAttachments(task.id),
      ])

    setComments(taskComments)
    setAttachments(taskAttachments)
  } catch (error) {
    console.error(
      'Failed to load task comments and attachments:',
      error
    )

    setCommentError(
      'Unable to load comments for this task.'
    )

    setAttachmentError(
      'Unable to load attachments for this task.'
    )
  }
}

const handleCreateComment = async () => {
  if (!selectedTask || !commentText.trim()) {
    return
  }

  setCommentLoading(true)
  setCommentError('')

  try {
    const newComment = await createComment({
      taskId: selectedTask.id,
      parentId: replyingTo?.id ?? null,
      body: commentText.trim(),
    })

    setComments((previous) => [
      ...previous,
      newComment,
    ])

    setCommentText('')
    setReplyingTo(null)
  } catch (err) {
    console.error(
      'Failed to create comment:',
      err
    )

    setCommentError(
      'Unable to create the comment.'
    )
  } finally {
    setCommentLoading(false)
  }
}

const handleUploadAttachment = async () => {
  if (!selectedTask || !selectedFile) {
    return
  }

  try {
    setAttachmentLoading(true)
    setAttachmentError('')

    const uploadedAttachment =
      await uploadAttachment({
        taskId: selectedTask.id,
        file: selectedFile,
      })

    setAttachments((currentAttachments) => [
      uploadedAttachment,
      ...currentAttachments,
    ])

    setSelectedFile(null)
  } catch (error) {
    console.error(
      'Failed to upload attachment:',
      error
    )

    setAttachmentError(
      'Unable to upload this file.'
    )
  } finally {
    setAttachmentLoading(false)
  }
}

const handleDownloadAttachment = async (
  attachment: Attachment
) => {
  try {
    const blob = await downloadAttachment(
      attachment.id
    )

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = attachment.filename

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(
      'Failed to download attachment:',
      error
    )

    setAttachmentError(
      'Unable to download this file.'
    )
  }
}

const handleDeleteAttachment = async (
  attachment: Attachment
) => {
  try {
    await deleteAttachment(attachment.id)

    setAttachments((currentAttachments) =>
      currentAttachments.filter(
        (item) => item.id !== attachment.id
      )
    )
  } catch (error) {
    console.error(
      'Failed to delete attachment:',
      error
    )

    setAttachmentError(
      'Unable to delete this file.'
    )
  }
}

const handleEditComment = async (
  comment: Comment
) => {
  const newBody = window.prompt(
    'Edit your comment:',
    comment.body
  )

  if (
    newBody === null ||
    !newBody.trim()
  ) {
    return
  }

  try {
    const updatedComment =
      await updateComment(
        comment.id,
        {
          body: newBody.trim(),
        }
      )

    setComments((currentComments) =>
      currentComments.map((item) =>
        item.id === comment.id
          ? updatedComment
          : item
      )
    )
  } catch (error) {
    console.error(
      'Failed to update comment:',
      error
    )

    setCommentError(
      'Unable to update this comment.'
    )
  }
}

const handleDeleteComment = async (
  comment: Comment
) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this comment?'
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteComment(comment.id)

    setComments((currentComments) =>
      currentComments.filter(
        (item) => item.id !== comment.id
      )
    )
  } catch (error) {
    console.error(
      'Failed to delete comment:',
      error
    )

    setCommentError(
      'Unable to delete this comment.'
    )
  }
}

  const handleAnalyzeProject = async () => {
  if (!projectId) {
    return
  }

  setAiLoading(true)
  setAiError('')

  try {
    const analysis = await analyzeProject(projectId)

    setAiAnalysis(analysis)
  } catch (err) {
    console.error('AI project analysis failed:', err)

    setAiError(
      'Unable to analyze this project right now.'
    )
  } finally {
    setAiLoading(false)
  }
}

  const getStatusChipStyles = (status: string) => {
    if (status === 'ACTIVE') {
      return {
        backgroundColor: '#e8f1ff',
        color: '#3159c9',
        borderColor: '#c7d7ff',
      }
    }

    if (status === 'COMPLETED') {
      return {
        backgroundColor: '#e8f7ef',
        color: '#21874b',
        borderColor: '#bfe8ce',
      }
    }

    return {
      backgroundColor: '#f1f3f5',
      color: '#5f6b7a',
      borderColor: '#dfe3e8',
    }
  }

  const getTaskStatusColor = (status: string) => {
    if (status === 'DONE') {
      return '#2e9d61'
    }

    if (status === 'IN_PROGRESS') {
      return '#e39a25'
    }

    return '#42a5f5'
  }

  const cardStyle = {
    borderRadius: 3,
    border: '1px solid #e8eaf0',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 14px rgba(23,32,51,0.05)',
  }

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: '#9ca3af',
        borderWidth: 1.5,
      },
      '&:hover fieldset': {
        borderColor: '#173f6b',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#173f6b',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#4b5563',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#173f6b',
    },
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100%',
          backgroundColor: '#f5f7fb',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1440 }}
        >
          <Card sx={cardStyle}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography
                sx={{
                  color: '#172033',
                  fontWeight: 700,
                }}
              >
                Loading project...
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

  if (error || !project) {
    return (
      <Box
        sx={{
          minHeight: '100%',
          backgroundColor: '#f5f7fb',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1440,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/projects')}
            sx={{
              mb: 3,
              textTransform: 'none',
              fontWeight: 600,
              color: '#173f6b',
            }}
          >
            Back to Projects
          </Button>

         

          <Card sx={cardStyle}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  color: '#d32f2f',
                  fontWeight: 600,
                }}
              >
                {error || 'Project not found.'}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(
    (task) => task.status === 'DONE'
  ).length

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: '#f5f7fb',
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1440,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Back */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{
            mb: 3,
            textTransform: 'none',
            fontWeight: 600,
            color: '#173f6b',
            '&:hover': {
              backgroundColor: 'rgba(23,63,107,0.05)',
            },
          }}
        >
          Back to Projects
        </Button>

        {/* Project Header */}
        <Card
          sx={{
            ...cardStyle,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box
            sx={{
              height: 7,
              background:
                'linear-gradient(90deg, #42a5f5, #7c4dff)',
            }}
          />

          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ flex: 1, minWidth: 240 }}>
                <Typography
                  sx={{
                    color: '#172033',
                    fontSize: {
                      xs: '1.8rem',
                      sm: '2.2rem',
                      md: '2.5rem',
                    },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    mb: 1.5,
                  }}
                >
                  {project.name}
                </Typography>

                <Typography
                  sx={{
                    color: '#7a8494',
                    lineHeight: 1.7,
                    maxWidth: 850,
                  }}
                >
                  {project.description ||
                    'No description provided.'}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    mt: 2.5,
                  }}
                >
                  <Chip
                    label={project.status}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 1.5,
                      ...getStatusChipStyles(project.status),
                    }}
                  />

                  <Chip
                    label={project.visibility}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 1.5,
                      color: '#5f6b7a',
                      borderColor: '#d9dee7',
                      backgroundColor: '#fafbfc',
                    }}
                  />
                </Box>
              </Box>

                            <Button
                variant="contained"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleAnalyzeProject}
                disabled={aiLoading}
                sx={{
                  alignSelf: {
                    xs: 'stretch',
                    sm: 'flex-start',
                  },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1.1,
                  background:
                    'linear-gradient(135deg, #3f51ff, #7c4dff)',
                  boxShadow:
                    '0 6px 16px rgba(63,81,255,0.22)',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #3344e8, #6b3fe0)',
                    boxShadow:
                      '0 8px 20px rgba(63,81,255,0.30)',
                  },
                }}
              >
                {aiLoading
                  ? 'Analyzing...'
                  : 'Analyze with AI'}
              </Button>

              <Box
                sx={{
                  minWidth: { xs: '100%', sm: 220 },
                  maxWidth: 280,
                  p: 2.5,
                  borderRadius: 2.5,
                  background:
                    'linear-gradient(135deg, #f0f6ff, #f6f0ff)',
                  border: '1px solid #e5e8f2',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#7a8494',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  TASK PROGRESS
                </Typography>

                <Typography
                  sx={{
                    color: '#172033',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  {progress}%
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: '#e8edf5',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${progress}%`,
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
                    color: '#7a8494',
                    mt: 1,
                  }}
                >
                  {completedTasks} of {totalTasks} tasks completed
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

                {/* AI Project Analysis */}
        {(aiAnalysis || aiError || aiLoading) && (
          <Card
            sx={{
              ...cardStyle,
              mb: 3,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: 6,
                background:
                  'linear-gradient(90deg, #3f51ff, #7c4dff)',
              }}
            />

            <CardContent
              sx={{
                p: { xs: 3, md: 4 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <AutoAwesomeIcon
                  sx={{
                    color: '#7c4dff',
                    fontSize: 24,
                  }}
                />

                <Typography
                  sx={{
                    color: '#172033',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                  }}
                >
                  AI Project Analysis
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#7a8494',
                  mb: 3,
                }}
              >
                Automated analysis based on the current
                project and task data.
              </Typography>

              {aiLoading && (
                <Box
                  sx={{
                    py: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#7a8494',
                      fontWeight: 600,
                    }}
                  >
                    Analyzing project data...
                  </Typography>
                </Box>
              )}

              {aiError && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#fff7f7',
                    border: '1px solid #fecaca',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#b91c1c',
                      fontWeight: 600,
                    }}
                  >
                    {aiError}
                  </Typography>
                </Box>
              )}

              {aiAnalysis && !aiLoading && (
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2.5,
                  }}
                >
                  {/* Summary */}
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: '#f8faff',
                      border: '1px solid #e8eaf0',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#3f51ff',
                        fontWeight: 800,
                        letterSpacing: 0.5,
                      }}
                    >
                      SUMMARY
                    </Typography>

                    <Typography
                      sx={{
                        color: '#273142',
                        lineHeight: 1.7,
                        mt: 0.75,
                      }}
                    >
                      {aiAnalysis.summary}
                    </Typography>
                  </Box>

                  {/* Risks */}
                  <Box>
                    <Typography
                      sx={{
                        color: '#172033',
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Risks
                    </Typography>

                    {aiAnalysis.risks.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{ color: '#7a8494' }}
                      >
                        No risks identified.
                      </Typography>
                    ) : (
                      <Box
                        component="ul"
                        sx={{
                          m: 0,
                          pl: 3,
                          color: '#273142',
                        }}
                      >
                        {aiAnalysis.risks.map(
                          (risk, index) => (
                            <Box
                              component="li"
                              key={index}
                              sx={{ mb: 0.75 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#5f6b7a',
                                  lineHeight: 1.6,
                                }}
                              >
                                {risk}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  {/* Suggestions */}
                  <Box>
                    <Typography
                      sx={{
                        color: '#172033',
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Suggestions
                    </Typography>

                    {aiAnalysis.suggestions.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{ color: '#7a8494' }}
                      >
                        No suggestions available.
                      </Typography>
                    ) : (
                      <Box
                        component="ul"
                        sx={{
                          m: 0,
                          pl: 3,
                        }}
                      >
                        {aiAnalysis.suggestions.map(
                          (suggestion, index) => (
                            <Box
                              component="li"
                              key={index}
                              sx={{ mb: 0.75 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#5f6b7a',
                                  lineHeight: 1.6,
                                }}
                              >
                                {suggestion}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  {/* Recommended Actions */}
                  <Box>
                    <Typography
                      sx={{
                        color: '#172033',
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      Recommended Actions
                    </Typography>

                    {aiAnalysis.recommendedActions.length ===
                    0 ? (
                      <Typography
                        variant="body2"
                        sx={{ color: '#7a8494' }}
                      >
                        No recommended actions available.
                      </Typography>
                    ) : (
                      <Box
                        component="ol"
                        sx={{
                          m: 0,
                          pl: 3,
                        }}
                      >
                        {aiAnalysis.recommendedActions.map(
                          (action, index) => (
                            <Box
                              component="li"
                              key={index}
                              sx={{ mb: 0.75 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#5f6b7a',
                                  lineHeight: 1.6,
                                }}
                              >
                                {action}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Project Information */}
        <Card
          sx={{
            ...cardStyle,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fafbfc',
                  border: '1px solid #eef0f4',
                }}
              >
                <PersonOutlineIcon
                  sx={{
                    color: '#3f51ff',
                    fontSize: 21,
                    mb: 0.5,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#7a8494',
                    fontWeight: 600,
                  }}
                >
                  OWNER
                </Typography>

                <Typography
                  sx={{
                    color: '#172033',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {owner
                    ? owner.fullName
                    : 'Not assigned'}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fafbfc',
                  border: '1px solid #eef0f4',
                }}
              >
                <GroupsOutlinedIcon
                  sx={{
                    color: '#3f51ff',
                    fontSize: 21,
                    mb: 0.5,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#7a8494',
                    fontWeight: 600,
                  }}
                >
                  TEAM
                </Typography>

                <Typography
                  sx={{
                    color: '#172033',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {team
                    ? team.name
                    : 'No team assigned'}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fafbfc',
                  border: '1px solid #eef0f4',
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{
                    color: '#3f51ff',
                    fontSize: 21,
                    mb: 0.5,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#7a8494',
                    fontWeight: 600,
                  }}
                >
                  START DATE
                </Typography>

                <Typography
                  sx={{
                    color: '#172033',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {project.startDate
                    ? new Date(
                        project.startDate
                      ).toLocaleDateString()
                    : 'Not set'}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fafbfc',
                  border: '1px solid #eef0f4',
                }}
              >
                <FlagOutlinedIcon
                  sx={{
                    color: '#3f51ff',
                    fontSize: 21,
                    mb: 0.5,
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#7a8494',
                    fontWeight: 600,
                  }}
                >
                  DUE DATE
                </Typography>

                <Typography
                  sx={{
                    color: '#172033',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {project.dueDate
                    ? new Date(
                        project.dueDate
                      ).toLocaleDateString()
                    : 'Not set'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 3,
            p: 0.75,
            borderRadius: 2.5,
            backgroundColor: '#ffffff',
            border: '1px solid #e8eaf0',
            boxShadow:
              '0 2px 8px rgba(23,32,51,0.04)',
            overflowX: 'auto',
          }}
        >
          {[
            {
              key: 'overview',
              label: 'Overview',
              icon: <DashboardOutlinedIcon />,
            },
            {
              key: 'board',
              label: 'Board',
              icon: <ViewKanbanOutlinedIcon />,
            },
            {
              key: 'list',
              label: 'List',
              icon: <ViewListOutlinedIcon />,
            },
            {
              key: 'timeline',
              label: 'Timeline',
              icon: <TimelineOutlinedIcon />,
            },
          ].map((tab) => (
            <Button
              key={tab.key}
              startIcon={tab.icon}
              onClick={() => setActiveTab(tab.key)}
              sx={{
                flexShrink: 0,
                px: 2,
                py: 1,
                borderRadius: 1.8,
                textTransform: 'none',
                fontWeight: 700,
                color:
                  activeTab === tab.key
                    ? '#ffffff'
                    : '#5f6b7a',
                background:
                  activeTab === tab.key
                    ? 'linear-gradient(135deg, #3f51ff, #7c4dff)'
                    : 'transparent',
                '&:hover': {
                  background:
                    activeTab === tab.key
                      ? 'linear-gradient(135deg, #3344e8, #6d42e5)'
                      : 'rgba(63,81,255,0.06)',
                },
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Overview */}
        {activeTab === 'overview' && (
          <Card sx={cardStyle}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  color: '#172033',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                Project Overview
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#7a8494',
                  mb: 3,
                }}
              >
                Key information about this project.
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                  },
                  gap: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#7a8494',
                      fontWeight: 700,
                    }}
                  >
                    STATUS
                  </Typography>

                  <Box sx={{ mt: 0.75 }}>
                    <Chip
                      label={project.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 1.5,
                        ...getStatusChipStyles(
                          project.status
                        ),
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#7a8494',
                      fontWeight: 700,
                    }}
                  >
                    VISIBILITY
                  </Typography>

                  <Box sx={{ mt: 0.75 }}>
                    <Chip
                      label={project.visibility}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 1.5,
                        color: '#5f6b7a',
                        borderColor: '#d9dee7',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#7a8494',
                      fontWeight: 700,
                    }}
                  >
                    PROJECT SLUG
                  </Typography>

                  <Typography
                    sx={{
                      color: '#172033',
                      fontWeight: 600,
                      mt: 0.75,
                      wordBreak: 'break-word',
                    }}
                  >
                    {project.slug}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#7a8494',
                      fontWeight: 700,
                    }}
                  >
                    OWNER
                  </Typography>

                  <Typography
                    sx={{
                      color: '#172033',
                      fontWeight: 600,
                      mt: 0.75,
                    }}
                  >
                    {owner
                      ? `${owner.fullName} (${owner.username})`
                      : 'Not assigned'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* List */}
        {activeTab === 'list' && (
          <Card sx={cardStyle}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: '#172033',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                    }}
                  >
                    Project Tasks
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7a8494',
                      mt: 0.5,
                    }}
                  >
                    All tasks currently assigned to this
                    project.
                  </Typography>
                </Box>

                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  onClick={() => setOpenTaskDialog(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    background:
                      'linear-gradient(135deg, #3f51ff, #7c4dff)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #3344e8, #6d42e5)',
                    },
                  }}
                >
                  Add Task
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {tasks.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: 'center',
                    border: '1px dashed #d9dee7',
                    borderRadius: 2.5,
                    backgroundColor: '#fafbfc',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#172033',
                      fontWeight: 700,
                    }}
                  >
                    No tasks yet
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7a8494',
                      mt: 0.5,
                    }}
                  >
                    Add the first task to this project.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {tasks.map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e8eaf0',
                        backgroundColor: '#ffffff',
                        transition:
                          'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow:
                            '0 6px 16px rgba(23,32,51,0.07)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 2,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: '#172033',
                              fontWeight: 700,
                            }}
                          >
                            {task.title}
                          </Typography>

                          {task.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#7a8494',
                                mt: 0.5,
                              }}
                            >
                              {task.description}
                            </Typography>
                          )}
                        </Box>

                        <Chip
                          label={
                            task.status === 'IN_PROGRESS'
                              ? 'IN PROGRESS'
                              : task.status
                          }
                          size="small"
                          sx={{
                            flexShrink: 0,
                            fontWeight: 700,
                            borderRadius: 1.5,
                            backgroundColor:
                              task.status === 'DONE'
                                ? '#e8f7ef'
                                : task.status ===
                                    'IN_PROGRESS'
                                  ? '#fff4df'
                                  : '#e8f1ff',
                            color:
                              task.status === 'DONE'
                                ? '#21874b'
                                : task.status ===
                                    'IN_PROGRESS'
                                  ? '#a96b00'
                                  : '#3159c9',
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexWrap: 'wrap',
                          mt: 1.5,
                        }}
                      >
                        {task.startDate && (
                          <Typography
                            variant="caption"
                            sx={{ color: '#7a8494' }}
                          >
                            Start:{' '}
                            {new Date(
                              task.startDate
                            ).toLocaleDateString()}
                          </Typography>
                        )}

                        {task.dueDate && (
                          <Typography
                            variant="caption"
                            sx={{ color: '#7a8494' }}
                          >
                            Due:{' '}
                            {new Date(
                              task.dueDate
                            ).toLocaleDateString()}
                          </Typography>
                        )}

                        {task.estimatedHours !==
                          undefined && (
                          <Typography
                            variant="caption"
                            sx={{ color: '#7a8494' }}
                          >
                            Estimated:{' '}
                            {task.estimatedHours}{' '}
                            {task.estimatedHours === 1
                              ? 'hour'
                              : 'hours'}
                          </Typography>
                        )}
                      </Box>

                      
{(commentCounts[task.id] || 0) > 0 && (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      mt: 1.5,
      color: '#7c4dff',
    }}
  >
    <CommentOutlinedIcon
      sx={{
        fontSize: 18,
      }}
    />

    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
      }}
    >
      {commentCounts[task.id]}{' '}
      {commentCounts[task.id] === 1
        ? 'comment'
        : 'comments'}
    </Typography>
  </Box>
)}

<Button
  size="small"
  variant="outlined"
  startIcon={<CommentOutlinedIcon />}
  onClick={() => handleOpenTaskDetails(task)}
  sx={{
    mt: 1.5,
    borderRadius: 1.75,
    textTransform: 'none',
    fontWeight: 600,
    borderColor: '#d9dee7',
    color: '#5f6b7a',
    '&:hover': {
      borderColor: '#7c4dff',
      color: '#7c4d7ff',
      backgroundColor:
        'rgba(124,77,255,0.04)',
    },
  }}
>
  Comments & Files
</Button>


                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Board */}
        {activeTab === 'board' && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mb: 2.5,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: '#172033',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                  }}
                >
                  Project Board
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#7a8494',
                    mt: 0.5,
                  }}
                >
                  Drag tasks between columns to update
                  their status.
                </Typography>
              </Box>

              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setOpenTaskDialog(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg, #3f51ff, #7c4dff)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #3344e8, #6d42e5)',
                  },
                }}
              >
                Add Task
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
                alignItems: 'start',
              }}
            >
              {[
                { key: 'TODO', title: 'TODO' },
                {
                  key: 'IN_PROGRESS',
                  title: 'IN PROGRESS',
                },
                { key: 'DONE', title: 'DONE' },
              ].map((column) => {
                const columnTasks = tasks.filter(
                  (task) => task.status === column.key
                )

                const columnColor =
                  column.key === 'TODO'
                    ? '#42a5f5'
                    : column.key === 'IN_PROGRESS'
                      ? '#e39a25'
                      : '#2e9d61'

                return (
                  <Card
                    key={column.key}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(column.key)}
                    sx={{
                      ...cardStyle,
                      minHeight: 330,
                      borderTop: `4px solid ${columnColor}`,
                      backgroundColor:
                        draggedTask &&
                        draggedTask.status !== column.key
                          ? '#fbfcff'
                          : '#ffffff',
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#172033',
                            fontWeight: 800,
                          }}
                        >
                          {column.title}
                        </Typography>

                        <Chip
                          label={columnTasks.length}
                          size="small"
                          sx={{
                            minWidth: 32,
                            fontWeight: 700,
                            backgroundColor: `${columnColor}18`,
                            color: columnColor,
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {columnTasks.length === 0 ? (
                        <Box
                          sx={{
                            py: 5,
                            px: 2,
                            textAlign: 'center',
                            border:
                              '1px dashed #d9dee7',
                            borderRadius: 2,
                            backgroundColor:
                              '#fafbfc',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#7a8494',
                              fontWeight: 600,
                            }}
                          >
                            No tasks in this column
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: '#a0a8b4',
                              mt: 0.5,
                            }}
                          >
                            Drag a task here to move
                            it
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                          }}
                        >
                          {columnTasks.map((task) => {
                            const assignee =
                              users.find(
                                (user) =>
                                  user.id ===
                                  task.assigneeId
                              )

                            return (
                              <Card
                                key={task.id}
                                variant="outlined"
                                draggable
                                onDragStart={() =>
                                  handleDragStart(task)
                                }
                                onDragEnd={() =>
                                  setDraggedTask(null)
                                }
                                sx={{
                                  borderRadius: 2,
                                  cursor: 'grab',
                                  borderColor:
                                    '#e4e7ec',
                                  borderLeft: `4px solid ${getTaskStatusColor(
                                    task.status
                                  )}`,
                                  opacity:
                                    draggedTask?.id ===
                                    task.id
                                      ? 0.5
                                      : 1,
                                  transition:
                                    'transform 0.2s ease, box-shadow 0.2s ease',
                                  '&:hover': {
                                    boxShadow:
                                      '0 8px 18px rgba(23,32,51,0.08)',
                                    transform:
                                      'translateY(-2px)',
                                  },
                                  '&:active': {
                                    cursor: 'grabbing',
                                  },
                                }}
                              >
                                <CardContent
                                  sx={{ p: 2 }}
                                >
                                  <Typography
                                    sx={{
                                      color:
                                        '#172033',
                                      fontWeight: 700,
                                      mb: 0.75,
                                    }}
                                  >
                                    {task.title}
                                  </Typography>

                                  {task.description && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color:
                                          '#7a8494',
                                        mb: 1.5,
                                      }}
                                    >
                                      {task.description}
                                    </Typography>
                                  )}

                                  {assignee && (
                                    <Box
                                      sx={{
                                        display:
                                          'flex',
                                        alignItems:
                                          'center',
                                        gap: 0.75,
                                        mb: 1.5,
                                      }}
                                    >
                                      <PersonOutlineIcon
                                        sx={{
                                          fontSize: 17,
                                          color:
                                            '#7a8494',
                                        }}
                                      />

                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color:
                                            '#7a8494',
                                        }}
                                      >
                                        {
                                          assignee.fullName
                                        }
                                      </Typography>
                                    </Box>
                                  )}

                                  <FormControl
                                    fullWidth
                                    size="small"
                                    sx={{
                                      mt: 1,
                                      pt: 1.5,
                                      borderTop:
                                        '1px solid #eef0f4',
                                    }}
                                  >
                                    <InputLabel>
                                      Status
                                    </InputLabel>

                                    <Select
                                      value={
                                        task.status
                                      }
                                      label="Status"
                                      onChange={(
                                        event
                                      ) =>
                                        handleStatusChange(
                                          task,
                                          event.target
                                            .value
                                        )
                                      }
                                      sx={{
                                        borderRadius: 1.8,
                                      }}
                                    >
                                      <MenuItem value="TODO">
                                        TODO
                                      </MenuItem>

                                      <MenuItem value="IN_PROGRESS">
                                        IN PROGRESS
                                      </MenuItem>

                                      <MenuItem value="DONE">
                                        DONE
                                      </MenuItem>
                                    </Select>
                                  </FormControl>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 1,
                                      flexWrap: 'wrap',
                                      mt: 1.5,
                                    }}
                                  >
                                    {task.dueDate && (
                                      <Chip
                                        label={`Due: ${new Date(
                                          task.dueDate
                                        ).toLocaleDateString()}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          borderRadius: 1.5,
                                          fontWeight: 600,
                                          color:
                                            new Date(
                                              task.dueDate
                                            ) <
                                              new Date() &&
                                            task.status !==
                                              'DONE'
                                              ? '#d32f2f'
                                              : '#5f6b7a',
                                          borderColor:
                                            new Date(
                                              task.dueDate
                                            ) <
                                              new Date() &&
                                            task.status !==
                                              'DONE'
                                              ? '#ef9a9a'
                                              : '#d9dee7',
                                        }}
                                      />
                                    )}

                                    {task.estimatedHours !==
                                      undefined && (
                                      <Chip
                                        label={`Estimated: ${
                                          task.estimatedHours
                                        } ${
                                          task.estimatedHours ===
                                          1
                                            ? 'hour'
                                            : 'hours'
                                        }`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          borderRadius: 1.5,
                                          fontWeight: 600,
                                          color:
                                            '#5f6b7a',
                                          borderColor:
                                            '#d9dee7',
                                        }}
                                      />
                                    )}
                                  </Box>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Box>
        )}

        {/* Timeline */}
        {activeTab === 'timeline' && (
          <Card sx={cardStyle}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  color: '#172033',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                }}
              >
                Project Timeline
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#7a8494',
                  mt: 0.5,
                  mb: 3,
                }}
              >
                Tasks organized by their scheduled dates.
              </Typography>

              {tasks.filter(
                (task) =>
                  task.startDate || task.dueDate
              ).length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: 'center',
                    border: '1px dashed #d9dee7',
                    borderRadius: 2.5,
                    backgroundColor: '#fafbfc',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#172033',
                      fontWeight: 700,
                    }}
                  >
                    No scheduled tasks
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7a8494',
                      mt: 0.5,
                    }}
                  >
                    Tasks with start or due dates will
                    appear here.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {tasks
                    .filter(
                      (task) =>
                        task.startDate || task.dueDate
                    )
                    .sort((a, b) => {
                      const dateA = new Date(
                        a.startDate ||
                          a.dueDate ||
                          ''
                      ).getTime()

                      const dateB = new Date(
                        b.startDate ||
                          b.dueDate ||
                          ''
                      ).getTime()

                      return dateA - dateB
                    })
                    .map((task) => {
                      const assignee = users.find(
                        (user) =>
                          user.id === task.assigneeId
                      )

                      return (
                        <Card
                          key={task.id}
                          variant="outlined"
                          sx={{
                            borderRadius: 2.5,
                            borderColor:
                              '#e8eaf0',
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent:
                                  'space-between',
                                alignItems:
                                  'flex-start',
                                gap: 2,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Box>
                                <Typography
                                  sx={{
                                    color:
                                      '#172033',
                                    fontWeight: 700,
                                  }}
                                >
                                  {task.title}
                                </Typography>

                                {assignee && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        '#7a8494',
                                      mt: 0.5,
                                    }}
                                  >
                                    Assigned to:{' '}
                                    {
                                      assignee.fullName
                                    }
                                  </Typography>
                                )}
                              </Box>

                              <Chip
                                label={
                                  task.status ===
                                  'IN_PROGRESS'
                                    ? 'IN PROGRESS'
                                    : task.status
                                }
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  borderRadius: 1.5,
                                  backgroundColor:
                                    task.status ===
                                    'DONE'
                                      ? '#e8f7ef'
                                      : task.status ===
                                          'IN_PROGRESS'
                                        ? '#fff4df'
                                        : '#e8f1ff',
                                  color:
                                    task.status ===
                                    'DONE'
                                      ? '#21874b'
                                      : task.status ===
                                          'IN_PROGRESS'
                                        ? '#a96b00'
                                        : '#3159c9',
                                }}
                              />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns:
                                  {
                                    xs: '1fr',
                                    sm: 'repeat(3, 1fr)',
                                  },
                                gap: 2,
                              }}
                            >
                              {task.startDate && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems:
                                      'center',
                                    gap: 1,
                                  }}
                                >
                                  <CalendarTodayOutlinedIcon
                                    sx={{
                                      fontSize: 18,
                                      color:
                                        '#7a8494',
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        '#5f6b7a',
                                    }}
                                  >
                                    Start:{' '}
                                    {new Date(
                                      task.startDate
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              )}

                              {task.dueDate && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems:
                                      'center',
                                    gap: 1,
                                  }}
                                >
                                  <FlagOutlinedIcon
                                    sx={{
                                      fontSize: 18,
                                      color:
                                        '#7a8494',
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        '#5f6b7a',
                                    }}
                                  >
                                    Due:{' '}
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              )}

                              {task.estimatedHours !==
                                undefined && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems:
                                      'center',
                                    gap: 1,
                                  }}
                                >
                                  <AccessTimeOutlinedIcon
                                    sx={{
                                      fontSize: 18,
                                      color:
                                        '#7a8494',
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        '#5f6b7a',
                                    }}
                                  >
                                    Estimated:{' '}
                                    {
                                      task.estimatedHours
                                    }{' '}
                                    {task.estimatedHours ===
                                    1
                                      ? 'hour'
                                      : 'hours'}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      )
                    })}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

                {/* Task Details Dialog */}
        <Dialog
          open={openTaskDetails}
          onClose={() => {
            setOpenTaskDetails(false)
            setSelectedTask(null)
            setCommentText('')
            setSelectedFile(null)
          }}
          fullWidth
          maxWidth="md"
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: '1px solid #e8eaf0',
              boxShadow:
                '0 18px 50px rgba(23,32,51,0.16)',
            },
          }}
        >
          <DialogTitle
            sx={{
              color: '#172033',
              fontWeight: 800,
              fontSize: '1.4rem',
              px: { xs: 3, sm: 4 },
              pt: 3,
            }}
          >
            {selectedTask?.title || 'Task Details'}
          </DialogTitle>

          <DialogContent
  sx={{
    px: { xs: 3, sm: 4 },
    pb: 3,
    maxHeight: '70vh',
    overflowY: 'auto',
  }}
>
            {selectedTask && (
              <>
                {/* Task Information */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: '#f8faff',
                    border: '1px solid #e8eaf0',
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7a8494',
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedTask.description ||
                      'No description provided.'}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      flexWrap: 'wrap',
                      mt: 2,
                    }}
                  >
                    <Chip
                      label={
                        selectedTask.status ===
                        'IN_PROGRESS'
                          ? 'IN PROGRESS'
                          : selectedTask.status
                      }
                      size="small"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 1.5,
                        backgroundColor:
                          selectedTask.status ===
                          'DONE'
                            ? '#e8f7ef'
                            : selectedTask.status ===
                                'IN_PROGRESS'
                              ? '#fff4df'
                              : '#e8f1ff',
                        color:
                          selectedTask.status ===
                          'DONE'
                            ? '#21874b'
                            : selectedTask.status ===
                                'IN_PROGRESS'
                              ? '#a96b00'
                              : '#3159c9',
                      }}
                    />

                    {selectedTask.dueDate && (
                      <Chip
                        icon={
                          <FlagOutlinedIcon />
                        }
                        label={`Due: ${new Date(
                          selectedTask.dueDate
                        ).toLocaleDateString()}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1.5,
                          fontWeight: 600,
                          color: '#5f6b7a',
                          borderColor: '#d9dee7',
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Comments */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <CommentOutlinedIcon
                      sx={{
                        color: '#7c4dff',
                      }}
                    />

                    <Typography
                      sx={{
                        color: '#172033',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                      }}
                    >
                      Comments
                    </Typography>

                    <Chip
                      label={comments.length}
                      size="small"
                      sx={{
                        ml: 0.5,
                        fontWeight: 700,
                        backgroundColor:
                          '#f0edff',
                        color: '#6d42e5',
                      }}
                    />
                  </Box>

                  {commentError && (
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: '#fff7f7',
                        border:
                          '1px solid #fecaca',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#b91c1c',
                          fontWeight: 600,
                        }}
                      >
                        {commentError}
                      </Typography>
                    </Box>
                  )}

                  {comments.length === 0 ? (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: 'center',
                        border:
                          '1px dashed #d9dee7',
                        borderRadius: 2,
                        backgroundColor:
                          '#fafbfc',
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#172033',
                          fontWeight: 700,
                        }}
                      >
                        No comments yet
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#7a8494',
                          mt: 0.5,
                        }}
                      >
                        Start the conversation
                        about this task.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                     {comments
  .filter((comment) => !comment.parentId)
  .map((comment) => {
    const renderComment = (
      currentComment: Comment,
      depth = 0
    ): React.ReactNode => {
      const replies = comments.filter(
        (reply) =>
          reply.parentId === currentComment.id
      )

      return (
        <Box key={currentComment.id}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              backgroundColor:
                depth === 0
                  ? '#ffffff'
                  : '#f8f9fc',
              ml: {
                xs: depth === 0 ? 0 : 2,
                sm: depth === 0 ? 0 : 5,
              },
              mt: depth === 0 ? 0 : 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#172033',
                  }}
                >
                  {currentComment.author
                    ?.fullName ||
                    currentComment.author
                      ?.username ||
                    'User'}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#7a8494',
                  }}
                >
                  {new Date(
                    currentComment.createdAt
                  ).toLocaleString()}
                  {currentComment.isEdited &&
                    ' • Edited'}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                mt: 1.5,
                color: '#4b5563',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {currentComment.body}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 1.5,
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  setReplyingTo(
                    currentComment
                  )
                  setCommentText('')
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Reply
              </Button>

              <Button
                size="small"
                onClick={() =>
                  handleEditComment(
                    currentComment
                  )
                }
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Edit
              </Button>

              <Button
                size="small"
                color="error"
                onClick={() =>
                  handleDeleteComment(
                    currentComment
                  )
                }
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Delete
              </Button>
            </Box>
          </Paper>

          {replies.length > 0 && (
            <Box
              sx={{
                ml: {
                  xs: 1.5,
                  sm: 3,
                },
                pl: 2,
                borderLeft:
                  '3px solid #e0e3eb',
              }}
            >
              {replies.map((reply) =>
                renderComment(
                  reply,
                  depth + 1
                )
              )}
            </Box>
          )}
        </Box>
      )
    }

    return renderComment(comment)
  })}
                    </Box>
                  )}
{replyingTo && (
  <Box
    sx={{
      mb: 1.5,
      px: 1.5,
      py: 1,
      borderRadius: 1.5,
      backgroundColor: '#f3f4f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: '#5f6b7a',
        fontWeight: 600,
      }}
    >
      Replying to{' '}
      {replyingTo.author?.fullName ||
        replyingTo.author?.username ||
        'user'}
    </Typography>

    <Button
      size="small"
      onClick={() => {
        setReplyingTo(null)
        setCommentText('')
      }}
      sx={{
        minWidth: 'auto',
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Cancel
    </Button>
  </Box>
)}

<Box
  sx={{
    display: 'flex',
    gap: 1,
    alignItems: 'flex-end',
  }}
>
  <TextField
    fullWidth
    multiline
    maxRows={4}
    label={
      replyingTo
        ? 'Write a reply'
        : 'Add a comment'
    }
    value={commentText}
    onChange={(event) =>
      setCommentText(
        event.target.value
      )
    }
    sx={fieldSx}
  />

  <Button
    variant="contained"
    onClick={handleCreateComment}
    disabled={
      commentLoading ||
      !commentText.trim()
    }
    sx={{
      minWidth: 52,
      height: 52,
      borderRadius: 2,
      background:
        'linear-gradient(135deg, #3f51ff, #7c4dff)',
      '&:hover': {
        background:
          'linear-gradient(135deg, #3344e8, #6d42e5)',
      },
    }}
  >
    <SendOutlinedIcon />
  </Button>
</Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Attachments */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <AttachFileOutlinedIcon
                      sx={{
                        color: '#3f51ff',
                      }}
                    />

                    <Typography
                      sx={{
                        color: '#172033',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                      }}
                    >
                      Attachments
                    </Typography>

                    <Chip
                      label={attachments.length}
                      size="small"
                      sx={{
                        ml: 0.5,
                        fontWeight: 700,
                        backgroundColor:
                          '#e8f1ff',
                        color: '#3159c9',
                      }}
                    />
                  </Box>

                  {attachmentError && (
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: '#fff7f7',
                        border:
                          '1px solid #fecaca',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#b91c1c',
                          fontWeight: 600,
                        }}
                      >
                        {attachmentError}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        '#fafbfc',
                      border:
                        '1px dashed #d9dee7',
                      mb: 2,
                    }}
                  >
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={
                        <AttachFileOutlinedIcon />
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform:
                          'none',
                        fontWeight: 600,
                        borderColor:
                          '#d9dee7',
                        color: '#5f6b7a',
                      }}
                    >
                      Choose File

                      <input
                        type="file"
                        hidden
                        onChange={(event) => {
                          const file =
                            event.target
                              .files?.[0]

                          setSelectedFile(
                            file || null
                          )
                        }}
                      />
                    </Button>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#7a8494',
                        minWidth: 0,
                        wordBreak:
                          'break-word',
                      }}
                    >
                      {selectedFile
                        ? selectedFile.name
                        : 'No file selected'}
                    </Typography>

                    <Button
                      variant="contained"
                      disabled={
                        attachmentLoading ||
                        !selectedFile
                      }
                      onClick={
                        handleUploadAttachment
                      }
                      sx={{
                        ml: {
                          xs: 0,
                          sm: 'auto',
                        },
                        borderRadius: 2,
                        textTransform:
                          'none',
                        fontWeight: 700,
                        background:
                          'linear-gradient(135deg, #3f51ff, #7c4dff)',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #3344e8, #6d42e5)',
                        },
                      }}
                    >
                      {attachmentLoading
                        ? 'Uploading...'
                        : 'Upload'}
                    </Button>
                  </Box>

                  {attachments.length === 0 ? (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: 'center',
                        border:
                          '1px dashed #d9dee7',
                        borderRadius: 2,
                        backgroundColor:
                          '#fafbfc',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#172033',
                          fontWeight: 700,
                        }}
                      >
                        No attachments
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#7a8494',
                          mt: 0.5,
                        }}
                      >
                        Upload files related to
                        this task.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection:
                          'column',
                        gap: 1,
                      }}
                    >
                      {attachments.map(
                        (attachment) => (
                          <Box
                            key={
                              attachment.id
                            }
                            sx={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              border:
                                '1px solid #e8eaf0',
                              backgroundColor:
                                '#ffffff',
                            }}
                          >
                            <AttachFileOutlinedIcon
                              sx={{
                                color:
                                  '#3f51ff',
                                fontSize: 22,
                              }}
                            />

                            <Box
                              sx={{
                                flex: 1,
                                minWidth: 0,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    '#172033',
                                  fontWeight: 700,
                                  overflow:
                                    'hidden',
                                  textOverflow:
                                    'ellipsis',
                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                {
                                  attachment.filename
                                }
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    '#9aa3af',
                                }}
                              >
                                {attachment.sizeBytes
                                  ? `${(
                                      attachment.sizeBytes /
                                      1024 /
                                      1024
                                    ).toFixed(
                                      2
                                    )} MB`
                                  : 'Unknown size'}
                                {' · '}
                                {new Date(
                                  attachment.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>

                            <Button
                              size="small"
                              onClick={() =>
                                handleDownloadAttachment(
                                  attachment
                                )
                              }
                              sx={{
                                minWidth: 0,
                                px: 1,
                                color:
                                  '#3159c9',
                                textTransform:
                                  'none',
                              }}
                            >
                              <DownloadOutlinedIcon />
                            </Button>

                            <Button
                              size="small"
                              onClick={() =>
                                handleDeleteAttachment(
                                  attachment
                                )
                              }
                              sx={{
                                minWidth: 0,
                                px: 1,
                                color:
                                  '#d32f2f',
                                textTransform:
                                  'none',
                              }}
                            >
                              <DeleteOutlineIcon />
                            </Button>
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              px: { xs: 3, sm: 4 },
              pb: 3,
            }}
          >
            <Button
              onClick={() => {
                setOpenTaskDetails(false)
                setSelectedTask(null)
                setCommentText('')
                setSelectedFile(null)
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#5f6b7a',
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog
          open={openTaskDialog}
          onClose={() => {
            setOpenTaskDialog(false)
            resetTaskForm()
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: '1px solid #e8eaf0',
              boxShadow:
                '0 18px 50px rgba(23,32,51,0.16)',
            },
          }}
        >
          <DialogTitle
            sx={{
              color: '#172033',
              fontWeight: 800,
              fontSize: '1.4rem',
              px: { xs: 3, sm: 4 },
              pt: 3,
            }}
          >
            Add Task
          </DialogTitle>

          <DialogContent
            sx={{
              px: { xs: 3, sm: 4 },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#7a8494',
                mb: 1,
              }}
            >
              Create a new task for {project.name}.
            </Typography>

            <TextField
              autoFocus
              fullWidth
              label="Task title"
              value={newTaskTitle}
              onChange={(event) =>
                setNewTaskTitle(event.target.value)
              }
              margin="normal"
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Description"
              value={newTaskDescription}
              onChange={(event) =>
                setNewTaskDescription(event.target.value)
              }
              margin="normal"
              multiline
              rows={3}
              sx={fieldSx}
            />

            <FormControl
              fullWidth
              margin="normal"
              sx={fieldSx}
            >
              <InputLabel>Assignee</InputLabel>

              <Select
                value={newTaskAssigneeId}
                label="Assignee"
                onChange={(event) =>
                  setNewTaskAssigneeId(
                    event.target.value
                  )
                }
              >
                <MenuItem value="">
                  Unassigned
                </MenuItem>

                {users.map((user) => (
                  <MenuItem
                    key={user.id}
                    value={user.id}
                  >
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              sx={fieldSx}
            >
              <InputLabel>Status</InputLabel>

              <Select
                value={newTaskStatus}
                label="Status"
                onChange={(event) =>
                  setNewTaskStatus(
                    event.target.value
                  )
                }
              >
                <MenuItem value="TODO">
                  TODO
                </MenuItem>

                <MenuItem value="IN_PROGRESS">
                  IN PROGRESS
                </MenuItem>

                <MenuItem value="DONE">
                  DONE
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={newTaskStartDate}
              onChange={(event) =>
                setNewTaskStartDate(
                  event.target.value
                )
              }
              margin="normal"
              sx={fieldSx}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={newTaskDueDate}
              onChange={(event) =>
                setNewTaskDueDate(
                  event.target.value
                )
              }
              margin="normal"
              sx={fieldSx}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              fullWidth
              label="Estimated Hours"
              type="number"
              value={newTaskEstimatedHours}
              onChange={(event) =>
                setNewTaskEstimatedHours(
                  event.target.value
                )
              }
              margin="normal"
              sx={fieldSx}
              inputProps={{
                min: 0,
                step: 0.5,
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: { xs: 3, sm: 4 },
              pb: 3,
              gap: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenTaskDialog(false)
                resetTaskForm()
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#5f6b7a',
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={!newTaskTitle.trim()}
              onClick={handleCreateTask}
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
                    'linear-gradient(135deg, #3344e8, #6d42e5)',
                },
              }}
            >
              Create Task
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default ProjectWorkspace