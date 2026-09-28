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
  Typography,
  useTheme,
} from '@mui/material'
import {
  AssignmentOutlined,
  AttachFileOutlined,
  CheckCircleOutline,
  CommentOutlined,
  DeleteOutline,
  EditOutlined,
  FolderOutlined,
  GroupAddOutlined,
  ManageAccountsOutlined,
  NotificationsNone,
  PersonAddOutlined,
  PersonRemoveOutlined,
  TaskAltOutlined,
} from '@mui/icons-material'

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../api/services/notificationService'

import type { Notification } from '../api/services/notificationService'

import { getTasks } from '../api/services/taskService'
import type { Task } from '../api/services/taskService'

import { getProjects } from '../api/services/projectService'
import type { Project } from '../api/services/projectService'

import { usePageView } from '../api/hooks/usePageView'

function Notifications() {

usePageView('Notifications')

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [notifications, setNotifications] = useState<Notification[]>(
    []
  )

  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [markingAsRead, setMarkingAsRead] = useState<string | null>(
    null
  )

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deletingNotification, setDeletingNotification] =
    useState<Notification | null>(null)

  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        notificationData,
        taskData,
        projectData,
      ] = await Promise.all([
        getNotifications(),
        getTasks(),
        getProjects(),
      ])

      setNotifications(notificationData)
      setTasks(taskData)
      setProjects(projectData)
    } catch (err) {
      console.error('Failed to load notifications:', err)

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Failed to load notifications.'
        )
      } else {
        setError('Failed to load notifications.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      setMarkingAsRead(id)
      setError('')

      await markNotificationAsRead(id)

      await loadNotifications()
    } catch (err) {
      console.error('Failed to mark notification as read:', err)

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Failed to mark notification as read.'
        )
      } else {
        setError('Failed to mark notification as read.')
      }
    } finally {
      setMarkingAsRead(null)
    }
  }

  const handleDeleteClick = (notification: Notification) => {
    setDeletingNotification(notification)
    setOpenDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingNotification) return

    try {
      setDeleting(true)
      setError('')

      await deleteNotification(deletingNotification.id)

      setOpenDeleteDialog(false)
      setDeletingNotification(null)

      await loadNotifications()
    } catch (err) {
      console.error('Failed to delete notification:', err)

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Failed to delete notification.'
        )
      } else {
        setError('Failed to delete notification.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    if (deleting) return

    setOpenDeleteDialog(false)
    setDeletingNotification(null)
  }

  const isRead = (notification: Notification) =>
    notification.readAt !== null &&
    notification.readAt !== undefined

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const getNotificationIcon = (
  notification: Notification
) => {
  switch (notification.type.toUpperCase()) {
    case 'TASK_ASSIGNED':
      return <AssignmentOutlined />

    case 'TASK_UPDATED':
      return <TaskAltOutlined />

    case 'TASK_COMPLETED':
      return <CheckCircleOutline />

    case 'PROJECT_ASSIGNED_TO_TEAM':
      return <FolderOutlined />

    case 'PROJECT_MEMBER_ADDED':
      return <PersonAddOutlined />

    case 'PROJECT_UPDATED':
    case 'PROJECT_CREATED':
      return <EditOutlined />

    case 'TASK_COMMENT':
    case 'COMMENT_ADDED':
    case 'COMMENT_REPLY':
      return <CommentOutlined />

    case 'TASK_ATTACHMENT':
    case 'COMMENT_ATTACHMENT':
      return <AttachFileOutlined />

    case 'TEAM_MEMBER_ADDED':
      return <GroupAddOutlined />

    case 'TEAM_MEMBER_REMOVED':
      return <PersonRemoveOutlined />

    case 'TEAM_ROLE_CHANGED':
      return <ManageAccountsOutlined />

    case 'TEAM_UPDATED':
      return <GroupAddOutlined />

    default:
      return <NotificationsNone />
  }
}

  const getNotificationTitle = (
  notification: Notification
) => {
  switch (notification.type.toUpperCase()) {
    case 'TASK_ASSIGNED':
      return 'New task assigned'

    case 'TASK_UPDATED':
      return 'Task updated'

    case 'TASK_COMPLETED':
      return 'Task completed'

    case 'PROJECT_ASSIGNED_TO_TEAM':
      return 'Project assigned to your team'

    case 'PROJECT_MEMBER_ADDED':
      return 'You were added to a project'

    case 'PROJECT_UPDATED':
      return 'Project updated'

    case 'PROJECT_CREATED':
      return 'New project created'

    case 'TEAM_UPDATED':
      return 'Team updated'

    case 'TEAM_MEMBER_ADDED':
      return 'New team member'

    case 'TEAM_MEMBER_REMOVED':
      return 'Team member removed'

    case 'TEAM_ROLE_CHANGED':
      return 'Team role changed'

    case 'TASK_COMMENT':
      return 'New task comment'

    case 'COMMENT_ADDED':
      return 'New comment'

    case 'COMMENT_REPLY':
      return 'New comment reply'

    case 'TASK_ATTACHMENT':
      return 'New task attachment'

    case 'COMMENT_ATTACHMENT':
      return 'New comment attachment'

    default:
      return notification.type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
  }
}

  const getTaskAssignmentDetails = (
    notification: Notification
  ) => {
    if (
      notification.type.toUpperCase() !== 'TASK_ASSIGNED' ||
      !notification.resourceId
    ) {
      return null
    }

    const task = tasks.find(
      (item) => item.id === notification.resourceId
    )

    if (!task) {
      return null
    }

    const project = projects.find(
      (item) => item.id === task.projectId
    )

    return {
      taskTitle: task.title,
      projectTitle: project?.name || 'Unknown project',
    }
  }

  const getNotificationMessage = (
  notification: Notification
) => {
  const taskDetails = getTaskAssignmentDetails(notification)

  if (taskDetails) {
    return (
      <Box
        sx={{
          mt: 0.8,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.35,
        }}
      >
        <Typography
          component="div"
          sx={{
            color: isDark ? '#f3f4f6' : '#172033',
            fontSize: '0.9rem',
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {taskDetails.taskTitle}
        </Typography>

        <Typography
          component="div"
          sx={{
            color: isDark ? '#aab4c3' : '#7a8494',
            fontSize: '0.82rem',
            lineHeight: 1.5,
          }}
        >
          {taskDetails.projectTitle}
        </Typography>
      </Box>
    )
  }

  let parsedData: any = null

  if (notification.data) {
    try {
      parsedData = JSON.parse(notification.data)
    } catch {
      parsedData = null
    }
  }

  const projectName =
    parsedData?.projectName || 'the project'

  const teamName =
    parsedData?.teamName || 'your team'

  const taskTitle =
    parsedData?.taskTitle || 'the task'

  switch (notification.type.toUpperCase()) {
    case 'PROJECT_ASSIGNED_TO_TEAM':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {projectName}
          </Box>{' '}
          was assigned to{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {teamName}
          </Box>
          .
        </Typography>
      )

    case 'PROJECT_MEMBER_ADDED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          You were added to{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {projectName}
          </Box>
          .
        </Typography>
      )

    case 'PROJECT_UPDATED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {projectName}
          </Box>{' '}
          has been updated.
        </Typography>
      )

    case 'TASK_UPDATED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {taskTitle}
          </Box>{' '}
          has been updated.
        </Typography>
      )

    case 'TASK_COMPLETED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {taskTitle}
          </Box>{' '}
          has been completed.
        </Typography>
      )

    case 'TASK_COMMENT':
    case 'COMMENT_ADDED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          A new comment was added to{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {taskTitle}
          </Box>
          .
        </Typography>
      )

    case 'COMMENT_REPLY':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          Someone replied to your comment on{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {taskTitle}
          </Box>
          .
        </Typography>
      )

    case 'TASK_ATTACHMENT':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          A new attachment was added to{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {taskTitle}
          </Box>
          .
        </Typography>
      )

    case 'COMMENT_ATTACHMENT':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          A new attachment was added to a comment on{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {taskTitle}
          </Box>
          .
        </Typography>
      )

    case 'TEAM_MEMBER_ADDED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          A new member was added to{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {teamName}
          </Box>
          .
        </Typography>
      )

    case 'TEAM_MEMBER_REMOVED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          A member was removed from{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {teamName}
          </Box>
          .
        </Typography>
      )

    case 'TEAM_ROLE_CHANGED':
      return (
        <Typography
          sx={{
            mt: 0.8,
            color: bodyText,
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          A team member's role was changed in{' '}
          <Box
            component="span"
            sx={{ fontWeight: 700 }}
          >
            {teamName}
          </Box>
          .
        </Typography>
      )

    default:
      if (parsedData?.message) {
        return parsedData.message
      }

      if (parsedData?.description) {
        return parsedData.description
      }

      if (typeof parsedData === 'string') {
        return parsedData
      }

      return 'You have a new notification.'
  }
}

  const unreadCount = notifications.filter(
    (notification) => !isRead(notification)
  ).length

  const pageBackground = isDark ? '#101522' : '#f5f7fb'
  const cardBackground = isDark ? '#182033' : '#ffffff'
  const borderColor = isDark ? '#2b3548' : '#e8eaf0'
  const primaryText = isDark ? '#f3f4f6' : '#172033'
  const secondaryText = isDark ? '#aab4c3' : '#7a8494'
  const bodyText = isDark ? '#e5e7eb' : '#4b5563'
  const mutedText = isDark ? '#8f9bad' : '#8a94a6'
  const dividerColor = isDark ? '#2b3548' : '#edf0f4'

  const notificationReadBackground = isDark
    ? '#182033'
    : '#ffffff'

  const notificationUnreadBackground = isDark
    ? '#1b2437'
    : '#fafbff'

  const notificationReadHover = isDark
    ? '#202a3d'
    : '#fafbff'

  const notificationUnreadHover = isDark
    ? '#202a3d'
    : '#f5f7ff'

  const iconReadBackground = isDark
    ? '#263043'
    : '#f1f3f6'

  const iconUnreadBackground = isDark
    ? 'rgba(63,81,255,0.16)'
    : '#eef0ff'

  const unreadChipBackground = isDark
    ? 'rgba(63,81,255,0.16)'
    : '#eef0ff'

  const unreadChipText = isDark
    ? '#8fa0ff'
    : '#3f51ff'

  const deleteHoverBackground = isDark
    ? 'rgba(211,67,67,0.12)'
    : '#fff1f1'

  const dialogBackground = isDark
    ? '#182033'
    : '#ffffff'

  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: pageBackground,
        py: { xs: 3, sm: 4, md: 5 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1200,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: '1.8rem',
                  sm: '2.1rem',
                },
                fontWeight: 800,
                color: primaryText,
                lineHeight: 1.2,
              }}
            >
              Notifications
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: secondaryText,
                fontSize: '0.95rem',
              }}
            >
              Stay updated with activity from your workspace.
            </Typography>
          </Box>

          {unreadCount > 0 && (
            <Chip
  label={`${unreadCount} unread`}
  size="small"
  sx={{
    height: 30,
    px: 0.5,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: '0.76rem',
    color: unreadChipText,
    backgroundColor: unreadChipBackground,
  }}
/>
          )}
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: isDark
                ? 'rgba(220,38,38,0.12)'
                : undefined,
              color: isDark ? '#fca5a5' : undefined,
              border: isDark
                ? '1px solid rgba(248,113,113,0.35)'
                : undefined,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Card
            elevation={0}
            sx={{
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
                py: 6,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  color: secondaryText,
                }}
              >
                Loading notifications...
              </Typography>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          /* Empty state */
          <Card
            elevation={0}
            sx={{
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
                py: 8,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(66,165,245,0.16), rgba(124,77,255,0.16))'
                    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)',
                }}
              >
                <NotificationsNone
                  sx={{
                    fontSize: 32,
                    color: '#3f51ff',
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: primaryText,
                  mb: 0.8,
                }}
              >
                No notifications
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  fontSize: '0.9rem',
                }}
              >
                You're all caught up.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          /* Compact notification feed */
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
            {notifications.map((notification, index) => {
              const notificationIsRead =
                isRead(notification)

              return (
                <Box
                  key={notification.id}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: {
  xs: 1.5,
  sm: 2.5,
},
px: {
  xs: 2,
  sm: 3,
},
py: {
  xs: 2.25,
  sm: 2.75,
},
                    backgroundColor:
                      notificationIsRead
                        ? notificationReadBackground
                        : notificationUnreadBackground,
                    transition:
  'background-color 0.2s ease, transform 0.2s ease',
                    '&:hover': {
  backgroundColor:
    notificationIsRead
      ? notificationReadHover
      : notificationUnreadHover,
  transform: 'translateY(-1px)',
},
                    '&::before': !notificationIsRead
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 3,
                          background:
                            'linear-gradient(180deg, #3f51ff, #7c4dff)',
                        }
                      : undefined,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: {
                        xs: 40,
                        sm: 44,
                      },
                      height: {
                        xs: 40,
                        sm: 44,
                      },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        notificationIsRead
                          ? iconReadBackground
                          : iconUnreadBackground,
                    }}
                  >
                    <Box
  sx={{
    color: notificationIsRead
      ? isDark
        ? '#8f9bad'
        : '#8a94a6'
      : '#3f51ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
  fontSize: {
    xs: 20,
    sm: 22,
  },
},
  }}
>
  {getNotificationIcon(notification)}
</Box>
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: {
                          xs: 'flex-start',
                          sm: 'center',
                        },
                        justifyContent:
                          'space-between',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        sx={{
                          color: notificationIsRead
                            ? bodyText
                            : primaryText,
                          fontSize: {
  xs: '0.94rem',
  sm: '0.98rem',
},
                          fontWeight:
                            notificationIsRead
                              ? 500
                              : 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {getNotificationTitle(
                          notification
                        )}
                      </Typography>

                      {!notificationIsRead && (
                        <Chip
                          label="Unread"
                          size="small"
                          sx={{
                            height: 24,
                            borderRadius: 1.5,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: unreadChipText,
                            backgroundColor:
                              unreadChipBackground,
                          }}
                        />
                      )}
                    </Box>

                    {getNotificationMessage(
                      notification
                    )}

                    {/* Created date */}
                    <Typography
                      sx={{
                        mt: 1,
                        color: mutedText,
                        fontSize: '0.78rem',
                      }}
                    >
                      {formatDate(
                        notification.createdAt
                      )}
                    </Typography>

                    {/* Read timestamp */}
                    {notificationIsRead &&
                      notification.readAt && (
                        <Typography
                          sx={{
                            mt: 0.3,
                            color: isDark
  ? '#8f9bad'
  : '#929baa',
fontSize: '0.75rem',
                          }}
                        >
                          Read{' '}
                          {formatDate(
                            notification.readAt
                          )}
                        </Typography>
                      )}

                    {/* Actions */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1.6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {!notificationIsRead && (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={
                            <CheckCircleOutline fontSize="small" />
                          }
                          onClick={() =>
                            handleMarkAsRead(
                              notification.id
                            )
                          }
                          disabled={
                            markingAsRead ===
                            notification.id
                          }
                          sx={{
                            minWidth: 'auto',
                           px: 1.25,
py: 0.6,
borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: unreadChipText,
                            '&:hover': {
                              backgroundColor:
                                unreadChipBackground,
                            },
                          }}
                        >
                          {markingAsRead ===
                          notification.id
                            ? 'Marking...'
                            : 'Mark as Read'}
                        </Button>
                      )}

                      <Button
                        variant="text"
                        size="small"
                        startIcon={
                          <DeleteOutline fontSize="small" />
                        }
                        onClick={() =>
                          handleDeleteClick(
                            notification
                          )
                        }
                        sx={{
                          minWidth: 'auto',
                          px: 1.25,
py: 0.6,
borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: isDark
                            ? '#f87171'
                            : '#d14343',
                          '&:hover': {
                            backgroundColor:
                              deleteHoverBackground,
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>

                  {/* Divider */}
                  {index <
                    notifications.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: {
  xs: 60,
  sm: 76,
},
                        right: 0,
                        bottom: 0,
                        height: '1px',
                        backgroundColor:
                          dividerColor,
                      }}
                    />
                  )}
                </Box>
              )
            })}
          </Card>
        )}

        {/* Delete confirmation */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              boxShadow: isDark
                ? '0 20px 50px rgba(0,0,0,0.45)'
                : '0 20px 50px rgba(23,32,51,0.15)',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              color: primaryText,
            }}
          >
            Delete notification?
          </DialogTitle>

          <DialogContent>
            <Typography
              sx={{
                color: isDark
                  ? '#aab4c3'
                  : '#667085',
                lineHeight: 1.6,
              }}
            >
              This notification will be permanently
              removed. This action cannot be undone.
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
              onClick={handleDeleteCancel}
              disabled={deleting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: isDark
                  ? '#aab4c3'
                  : '#4b5563',
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              disabled={deleting}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                backgroundColor: '#d14343',
                '&:hover': {
                  backgroundColor: '#b83232',
                },
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Notifications