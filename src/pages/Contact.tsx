import { useState } from 'react'
import {
  DeleteOutline,
  Email,
  Info,
  Psychology,
  Send,
  SupportAgent,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Container,
  Typography,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface ChatMessage {
  id: number
  sender: 'user' | 'ai'
  text: string
}

import { usePageView } from '../api/hooks/usePageView'

function Contact() {
  usePageView('Contact & Help')
  
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text:
        'Hi! I’m your Project Management AI Assistant. Ask me anything about projects, tasks, teams, notifications, or using the system.',
    },
  ])

  const pageBackground = isDark ? '#101522' : '#f5f7fb'
  const cardBackground = isDark ? '#182033' : '#ffffff'
  const borderColor = isDark ? '#2b3548' : '#e8eaf0'
  const primaryText = isDark ? '#f3f4f6' : '#172033'
  const secondaryText = isDark ? '#aab4c3' : '#7a8494'
  const bodyText = isDark ? '#e5e7eb' : '#344054'
  const mutedText = isDark ? '#8f9bad' : '#667085'
  const dividerColor = isDark ? '#2b3548' : '#eef0f4'

  const iconBackground = isDark
    ? 'linear-gradient(135deg, rgba(66,165,245,0.16), rgba(124,77,255,0.16))'
    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)'

  const inputBackground = isDark ? '#141b2a' : '#fafbfc'

  const cardStyle = {
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: cardBackground,
    boxShadow: isDark
      ? '0 4px 14px rgba(0,0,0,0.20)'
      : '0 4px 14px rgba(23,32,51,0.05)',
  }

  const iconColor = isDark ? '#90caf9' : '#3f51ff'

  const suggestedQuestions = [
    'How do I create a project?',
    'How do I create a task?',
    'How do I add a team member?',
    'How do I manage notifications?',
  ]

  const getLocalResponse = (question: string) => {
    const normalizedQuestion = question.toLowerCase()

    if (
      normalizedQuestion.includes('create') &&
      normalizedQuestion.includes('project')
    ) {
      return 'To create a project, open Projects from the navigation menu and select the option to create a new project. Enter the project details, assign the relevant owner or team, and save the project.'
    }

    if (
      normalizedQuestion.includes('task') &&
      (normalizedQuestion.includes('create') ||
        normalizedQuestion.includes('add'))
    ) {
      return 'You can create tasks from the Tasks section or from a project workspace. Enter the task title, description, status, assignee, dates, and estimated hours, then save it.'
    }

    if (
      normalizedQuestion.includes('team member') ||
      normalizedQuestion.includes('add member')
    ) {
      return 'Open Teams, select the relevant team, and use the team member controls to add a user. You can also assign a role to the team member.'
    }

    if (normalizedQuestion.includes('notification')) {
      return 'Notifications can be viewed from the Notifications section. You can mark unread notifications as read or delete notifications you no longer need.'
    }

    if (
      normalizedQuestion.includes('password') ||
      normalizedQuestion.includes('reset')
    ) {
      return 'If you forgot your password, use the Forgot Password option on the login page. You will receive an OTP that can be used to verify your identity and reset your password.'
    }

    if (
      normalizedQuestion.includes('project') ||
      normalizedQuestion.includes('projects')
    ) {
      return 'The Projects section lets you create, view, update, and manage your projects. You can also open a project workspace to manage its tasks and related information.'
    }

    if (
      normalizedQuestion.includes('team') ||
      normalizedQuestion.includes('teams')
    ) {
      return 'The Teams section allows you to manage teams and their members. You can add members, remove members, and assign roles to team members.'
    }

    return 'I can help you with projects, tasks, teams, notifications, users, account access, and other features of the Project Management System. Try asking me a specific question about one of these areas.'
  }

  const handleSendMessage = (text?: string) => {
    const question = (text ?? message).trim()

    if (!question || isTyping) {
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
    }

    setMessages((previous) => [...previous, userMessage])
    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: getLocalResponse(question),
      }

      setMessages((previous) => [...previous, aiMessage])
      setIsTyping(false)
    }, 900)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text:
          'Hi! I’m your Project Management AI Assistant. Ask me anything about projects, tasks, teams, notifications, or using the system.',
      },
    ])
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: pageBackground,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1100,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: iconBackground,
              }}
            >
              <SupportAgent
                sx={{
                  color: iconColor,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: '1.8rem',
                  sm: '2.2rem',
                },
                fontWeight: 800,
                color: primaryText,
              }}
            >
              Contact & Help
            </Typography>
          </Box>

          <Typography
            sx={{
              color: secondaryText,
              fontSize: '0.98rem',
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Get help with your account, projects,
            tasks, and other features of the Project
            Management System.
          </Typography>
        </Box>

        {/* AI Project Assistant */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent
            sx={{
              p: 0,
            }}
          >
            {/* Chat Header */}
            <Box
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                background:
                  'linear-gradient(135deg, #061633 0%, #0b2a63 55%, #182b70 100%)',
                color: 'white',
              }}
            >
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
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'linear-gradient(135deg, #42a5f5, #7c4dff)',
                    flexShrink: 0,
                  }}
                >
                  <Psychology
                    sx={{
                      color: 'white',
                      fontSize: 25,
                    }}
                  />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    AI Project Assistant
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: '0.82rem',
                      color: 'rgba(255,255,255,0.72)',
                    }}
                  >
                    Your intelligent system guide
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={clearChat}
                aria-label="Clear chat"
                sx={{
                  color: 'rgba(255,255,255,0.75)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor:
                      'rgba(255,255,255,0.10)',
                  },
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Box>

            {/* Chat Body */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 3,
              }}
            >
              {/* Suggested Questions */}
              {messages.length === 1 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: mutedText,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      mb: 1.5,
                      textTransform: 'uppercase',
                      letterSpacing: 0.7,
                    }}
                  >
                    Suggested questions
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {suggestedQuestions.map(
                      (question) => (
                        <Button
                          key={question}
                          variant="outlined"
                          onClick={() =>
                            handleSendMessage(question)
                          }
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            borderColor: isDark
                              ? '#39455c'
                              : '#d9deea',
                            color: bodyText,
                            '&:hover': {
                              borderColor: '#3f51ff',
                              color: isDark
                                ? '#90caf9'
                                : '#3f51ff',
                              backgroundColor:
                                'rgba(63,81,255,0.06)',
                            },
                          }}
                        >
                          {question}
                        </Button>
                      )
                    )}
                  </Box>
                </Box>
              )}

              {/* Messages */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: 430,
                  overflowY: 'auto',
                  pr: 0.5,
                  mb: 2,
                  '&::-webkit-scrollbar': {
                    width: 6,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: isDark
                      ? '#3a465c'
                      : '#d4d9e2',
                    borderRadius: 10,
                  },
                }}
              >
                {messages.map((chatMessage) => {
                  const isUser =
                    chatMessage.sender === 'user'

                  return (
                    <Box
                      key={chatMessage.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isUser
                          ? 'flex-end'
                          : 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: 1,
                          maxWidth: {
                            xs: '88%',
                            sm: '75%',
                          },
                          flexDirection: isUser
                            ? 'row-reverse'
                            : 'row',
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            background: isUser
                              ? 'linear-gradient(135deg, #3f51ff, #7c4dff)'
                              : iconBackground,
                          }}
                        >
                          {isUser ? (
                            <Typography
                              sx={{
                                color: 'white',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}
                            >
                              You
                            </Typography>
                          ) : (
                            <Psychology
                              sx={{
                                color: iconColor,
                                fontSize: 18,
                              }}
                            />
                          )}
                        </Box>

                        <Box
                          sx={{
                            px: 2,
                            py: 1.35,
                            borderRadius: isUser
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                            backgroundColor: isUser
                              ? '#3f51ff'
                              : isDark
                                ? '#202a3d'
                                : '#f1f4f9',
                            color: isUser
                              ? 'white'
                              : bodyText,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {chatMessage.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}

                {isTyping && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: iconBackground,
                      }}
                    >
                      <Psychology
                        sx={{
                          color: iconColor,
                          fontSize: 18,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        px: 2,
                        py: 1.35,
                        borderRadius:
                          '16px 16px 16px 4px',
                        backgroundColor: isDark
                          ? '#202a3d'
                          : '#f1f4f9',
                      }}
                    >
                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: '0.85rem',
                        }}
                      >
                        AI is typing...
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider
                sx={{
                  borderColor: dividerColor,
                  mb: 2,
                }}
              />

              {/* Message Input */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask the AI assistant a question..."
                  disabled={isTyping}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: inputBackground,
                      color: bodyText,
                      '& fieldset': {
                        borderColor: isDark
                          ? '#4b5563'
                          : '#d0d5dd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#3f51ff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3f51ff',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: mutedText,
                      opacity: 1,
                    },
                  }}
                />

                <IconButton
                  onClick={() => handleSendMessage()}
                  disabled={
                    !message.trim() || isTyping
                  }
                  aria-label="Send message"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    color: 'white',
                    background:
                      'linear-gradient(135deg, #3f51ff, #7c4dff)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #3043e8, #693fe0)',
                    },
                    '&.Mui-disabled': {
                      color: isDark
                        ? '#687286'
                        : '#aeb5c2',
                      background: isDark
                        ? '#252e40'
                        : '#eef0f4',
                    },
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </Box>

              <Typography
                sx={{
                  mt: 1,
                  color: mutedText,
                  fontSize: '0.72rem',
                  textAlign: 'center',
                }}
              >
                Press Enter to send • Shift + Enter for
                a new line
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: iconBackground,
                  flexShrink: 0,
                }}
              >
                <SupportAgent
                  sx={{ color: iconColor }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  Contact Support
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.85rem',
                    color: secondaryText,
                  }}
                >
                  Need additional assistance? Contact
                  the support team.
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: dividerColor,
                mb: 3,
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: iconBackground,
                  flexShrink: 0,
                }}
              >
                <Email
                  sx={{ color: iconColor }}
                />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: mutedText,
                    display: 'block',
                  }}
                >
                  Support Email
                </Typography>

                <Typography
                  sx={{
                    color: primaryText,
                    fontWeight: 600,
                    mt: 0.25,
                    wordBreak: 'break-word',
                  }}
                >
                  worksyncltd@gmail.com
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Email />}
              href="mailto:worksyncltd@gmail.com"
              sx={{
                borderRadius: 2,
                px: 2.5,
                py: 1.2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                boxShadow:
                  '0 6px 16px rgba(63,81,255,0.20)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3043e8, #693fe0)',
                  boxShadow:
                    '0 8px 20px rgba(63,81,255,0.28)',
                },
              }}
            >
              Email Support
            </Button>
          </CardContent>
        </Card>

        {/* About the System */}
        <Card
          elevation={0}
          sx={{
            ...cardStyle,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: iconBackground,
                  flexShrink: 0,
                }}
              >
                <Info
                  sx={{ color: iconColor }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: primaryText,
                  }}
                >
                  About the System
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.85rem',
                    color: secondaryText,
                  }}
                >
                  Learn more about this project
                  management application.
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                borderColor: dividerColor,
                mb: 2.5,
              }}
            />

            <Typography
              sx={{
                color: bodyText,
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              This Project Management System provides
              tools for managing projects, tasks, teams,
              users, and notifications from a single
              application.
            </Typography>

            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              sx={{
                borderRadius: 2,
                px: 2.5,
                py: 1.15,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: isDark
                  ? '#4b5563'
                  : '#d0d5dd',
                color: bodyText,
                '&:hover': {
                  borderColor: '#3f51ff',
                  color: isDark
                    ? '#90caf9'
                    : '#3f51ff',
                  backgroundColor:
                    'rgba(63,81,255,0.06)',
                },
              }}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Contact