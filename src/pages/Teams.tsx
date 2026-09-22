import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
  DeleteOutline,
  EditOutlined,
  GroupsOutlined,
  PersonOutline,
  PersonRemoveOutlined,
} from '@mui/icons-material'
import {
  createTeam,
  deleteTeam,
  getTeams,
  updateTeam,
} from '../api/services/teamService'
import type { Team } from '../api/services/teamService'
import { getUsers } from '../api/services/userService'
import type { User } from '../api/services/userService'
import {
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
} from '../api/services/teamMemberService'
import type { TeamMember } from '../api/services/teamMemberService'
import { getRoles } from '../api/services/roleService'
import type { Role } from '../api/services/roleService'

import { usePageView } from '../api/hooks/usePageView'

function Teams() {
  usePageView('Teams')
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [teams, setTeams] = useState<Team[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [teamMembers, setTeamMembers] = useState<
    Record<string, TeamMember[]>
  >({})

  const [openAddMemberDialog, setOpenAddMemberDialog] =
    useState(false)

  const [selectedTeam, setSelectedTeam] =
    useState<Team | null>(null)

  const [selectedMemberUserId, setSelectedMemberUserId] =
    useState('')

  const [selectedMemberRoleId, setSelectedMemberRoleId] =
    useState('')

  const [addingMember, setAddingMember] = useState(false)

  const [openRemoveMemberDialog, setOpenRemoveMemberDialog] =
    useState(false)

  const [memberToRemove, setMemberToRemove] =
    useState<TeamMember | null>(null)

  const [teamForRemoval, setTeamForRemoval] =
    useState<Team | null>(null)

  const [removingMember, setRemovingMember] =
    useState(false)

  const [openEditRoleDialog, setOpenEditRoleDialog] =
    useState(false)

  const [memberToEdit, setMemberToEdit] =
    useState<TeamMember | null>(null)

  const [teamForRoleEdit, setTeamForRoleEdit] =
    useState<Team | null>(null)

  const [selectedRoleId, setSelectedRoleId] =
    useState('')

  const [updatingRole, setUpdatingRole] =
    useState(false)

  const [openCreateDialog, setOpenCreateDialog] =
    useState(false)

  const [teamName, setTeamName] = useState('')
  const [teamSlug, setTeamSlug] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [teamOwnerId, setTeamOwnerId] = useState('')
  const [teamAvatarUrl, setTeamAvatarUrl] = useState('')
  const [creating, setCreating] = useState(false)

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  const [editTeamName, setEditTeamName] = useState('')
  const [editTeamSlug, setEditTeamSlug] = useState('')
  const [editTeamDescription, setEditTeamDescription] = useState('')
  const [editTeamOwnerId, setEditTeamOwnerId] = useState('')
  const [editTeamAvatarUrl, setEditTeamAvatarUrl] = useState('')
  const [updating, setUpdating] = useState(false)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null)
  const [deleting, setDeleting] = useState(false)

  const pageBackground = isDark ? '#101522' : '#f5f7fb'
  const cardBackground = isDark ? '#182033' : '#ffffff'
  const borderColor = isDark ? '#2b3548' : '#e8eaf0'

  const primaryText = isDark ? '#f3f4f6' : '#172033'
  const secondaryText = isDark ? '#aab4c3' : '#7a8494'
  const bodyText = isDark ? '#e5e7eb' : '#596579'
  const mutedText = isDark ? '#8f9bad' : '#8a94a6'

  const inputBorder = isDark ? '#4b5563' : '#9ca3af'

  const sectionBackground = isDark
    ? '#202a3d'
    : '#f8f9fc'

  const sectionBorder = isDark
    ? '#303b50'
    : '#edf0f5'

  const memberBackground = isDark
    ? '#1c2638'
    : '#ffffff'

  const memberBorder = isDark
    ? '#303b50'
    : '#eef0f4'

  const iconBoxBackground = isDark
    ? 'linear-gradient(135deg, rgba(66,165,245,0.16), rgba(124,77,255,0.16))'
    : 'linear-gradient(135deg, #e3f2fd, #ede7f6)'

  const countBackground = isDark
    ? 'rgba(63,81,255,0.18)'
    : '#e8eafc'

  const dialogBackground = isDark
    ? '#182033'
    : '#ffffff'

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true)
        setError('')

        const [teamData, userData, roleData] =
          await Promise.all([
            getTeams(),
            getUsers(),
            getRoles(),
          ])

        setTeams(teamData)
        setUsers(userData)
        setRoles(roleData)

        const memberResults = await Promise.all(
          teamData.map(async (team) => {
            const members = await getTeamMembers(team.id)

            return {
              teamId: team.id,
              members,
            }
          })
        )

        const membersByTeam: Record<string, TeamMember[]> = {}

        memberResults.forEach(({ teamId, members }) => {
          membersByTeam[teamId] = members
        })

        setTeamMembers(membersByTeam)
      } catch (error) {
        console.error('Failed to load teams:', error)
        setError('Failed to load teams.')
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [])

  const getUserName = (userId: string) => {
    const user = users.find((user) => user.id === userId)

    return user?.fullName || user?.username || userId
  }

  const handleOpenAddMember = (team: Team) => {
    setSelectedTeam(team)
    setSelectedMemberUserId('')
    setSelectedMemberRoleId('')
    setError('')
    setOpenAddMemberDialog(true)
  }

  const handleAddMember = async () => {
    if (!selectedTeam || !selectedMemberUserId) {
      return
    }

    setAddingMember(true)
    setError('')

    try {
      const newMember = await addTeamMember(
        selectedTeam.id,
        {
          userId: selectedMemberUserId,
          roleId: selectedMemberRoleId || null,
        }
      )

      setTeamMembers((current) => ({
        ...current,
        [selectedTeam.id]: [
          ...(current[selectedTeam.id] || []),
          newMember,
        ],
      }))

      setSelectedMemberUserId('')
      setSelectedMemberRoleId('')
      setOpenAddMemberDialog(false)
      setSelectedTeam(null)
    } catch (error: any) {
      console.error('Failed to add team member:', error)

      if (error.response?.status === 409) {
        setError(
          'This user is already a member of this team.'
        )
      } else {
        setError('Failed to add team member.')
      }
    } finally {
      setAddingMember(false)
    }
  }

  const handleOpenRemoveMember = (
    team: Team,
    member: TeamMember
  ) => {
    setTeamForRemoval(team)
    setMemberToRemove(member)
    setOpenRemoveMemberDialog(true)
    setError('')
  }

  const handleRemoveMember = async () => {
    if (!teamForRemoval || !memberToRemove) {
      return
    }

    setRemovingMember(true)
    setError('')

    try {
      await removeTeamMember(
        teamForRemoval.id,
        memberToRemove.userId
      )

      setTeamMembers((current) => ({
        ...current,
        [teamForRemoval.id]: (
          current[teamForRemoval.id] || []
        ).filter(
          (member) =>
            member.userId !== memberToRemove.userId
        ),
      }))

      setOpenRemoveMemberDialog(false)
      setMemberToRemove(null)
      setTeamForRemoval(null)
    } catch (error) {
      console.error(
        'Failed to remove team member:',
        error
      )

      setError('Failed to remove team member.')
    } finally {
      setRemovingMember(false)
    }
  }

  const handleOpenEditRole = (
    team: Team,
    member: TeamMember
  ) => {
    setTeamForRoleEdit(team)
    setMemberToEdit(member)
    setSelectedRoleId(member.roleId || '')
    setOpenEditRoleDialog(true)
    setError('')
  }

  const handleUpdateRole = async () => {
    if (!teamForRoleEdit || !memberToEdit) {
      return
    }

    setUpdatingRole(true)
    setError('')

    try {
      const updatedMember = await updateTeamMember(
        teamForRoleEdit.id,
        memberToEdit.userId,
        selectedRoleId || null
      )

      setTeamMembers((current) => ({
        ...current,
        [teamForRoleEdit.id]: (
          current[teamForRoleEdit.id] || []
        ).map((member) =>
          member.id === updatedMember.id
            ? updatedMember
            : member
        ),
      }))

      setOpenEditRoleDialog(false)
      setMemberToEdit(null)
      setTeamForRoleEdit(null)
      setSelectedRoleId('')
    } catch (error) {
      console.error(
        'Failed to update team member role:',
        error
      )

      setError('Failed to update team member role.')
    } finally {
      setUpdatingRole(false)
    }
  }

  const resetCreateForm = () => {
    setTeamName('')
    setTeamSlug('')
    setTeamDescription('')
    setTeamOwnerId('')
    setTeamAvatarUrl('')
  }

  const handleCreateTeam = async () => {
    setCreating(true)
    setError('')

    try {
      await createTeam({
        name: teamName,
        slug: teamSlug,
        description: teamDescription || undefined,
        ownerId: teamOwnerId,
        avatarUrl: teamAvatarUrl || undefined,
      })

      resetCreateForm()
      setOpenCreateDialog(false)

      const updatedTeams = await getTeams()
      setTeams(updatedTeams)
    } catch (error) {
      console.error('Failed to create team:', error)
      setError('Failed to create team.')
    } finally {
      setCreating(false)
    }
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team)

    setEditTeamName(team.name)
    setEditTeamSlug(team.slug)
    setEditTeamDescription(team.description || '')
    setEditTeamOwnerId(team.ownerId)
    setEditTeamAvatarUrl(team.avatarUrl || '')

    setOpenEditDialog(true)
  }

  const handleUpdateTeam = async () => {
    if (!editingTeam) {
      return
    }

    setUpdating(true)
    setError('')

    try {
      await updateTeam(editingTeam.id, {
        name: editTeamName,
        slug: editTeamSlug,
        description: editTeamDescription || undefined,
        ownerId: editTeamOwnerId,
        avatarUrl: editTeamAvatarUrl || undefined,
      })

      setOpenEditDialog(false)
      setEditingTeam(null)

      const updatedTeams = await getTeams()
      setTeams(updatedTeams)
    } catch (error) {
      console.error('Failed to update team:', error)
      setError('Failed to update team.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteTeam = (team: Team) => {
    setDeletingTeam(team)
    setOpenDeleteDialog(true)
  }

  const confirmDeleteTeam = async () => {
    if (!deletingTeam) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      await deleteTeam(deletingTeam.id)

      setOpenDeleteDialog(false)
      setDeletingTeam(null)

      const updatedTeams = await getTeams()
      setTeams(updatedTeams)
    } catch (error: any) {
      console.error('Failed to delete team:', error)

      if (error.response?.status === 409) {
        setError(
          'This team cannot be deleted because it contains projects.'
        )
      } else {
        setError('Failed to delete team.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const cardStyle = {
    height: '100%',
    borderRadius: 3,
    border: `1px solid ${borderColor}`,
    backgroundColor: cardBackground,
    boxShadow: isDark
      ? '0 4px 14px rgba(0,0,0,0.20)'
      : '0 4px 14px rgba(23,32,51,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
      color: isDark ? '#90caf9' : '#173f6b',
    },

    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      color: primaryText,

      '& fieldset': {
        borderColor: inputBorder,
        borderWidth: 1.5,
      },

      '&:hover fieldset': {
        borderColor: isDark ? '#90caf9' : '#173f6b',
      },

      '&.Mui-focused fieldset': {
        borderColor: isDark ? '#90caf9' : '#173f6b',
        borderWidth: 2,
      },
    },

    '& .MuiInputBase-input': {
      color: primaryText,
    },

    '& .MuiInputBase-input::placeholder': {
      color: secondaryText,
      opacity: 1,
    },

    '& .MuiFormHelperText-root': {
      color: secondaryText,
    },

    '& .MuiSelect-select': {
      color: primaryText,
    },

    '& .MuiSvgIcon-root': {
      color: secondaryText,
    },
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: pageBackground,
        py: { xs: 3, md: 5 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1440,
          px: { xs: 2, sm: 3, md: 5 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              component="h1"
              sx={{
                color: primaryText,
                fontSize: { xs: '1.9rem', md: '2.25rem' },
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              Teams
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: secondaryText,
                fontSize: '0.98rem',
              }}
            >
              Organize people into teams and manage team ownership.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setError('')
              setOpenCreateDialog(true)
            }}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              px: 2.5,
              py: 1.25,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              background:
                'linear-gradient(135deg, #3f51ff, #7c4dff)',
              boxShadow: '0 6px 16px rgba(63,81,255,0.20)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #3545e8, #6d42e8)',
                boxShadow: '0 8px 20px rgba(63,81,255,0.28)',
              },
            }}
          >
            Create Team
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Summary */}
        {!loading && teams.length > 0 && (
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
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
                        background: iconBoxBackground,
                        color: '#3f51ff',
                      }}
                    >
                      <GroupsOutlined />
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: secondaryText }}
                      >
                        Total Teams
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '1.6rem',
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        {teams.length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
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
                        background: isDark
                          ? 'linear-gradient(135deg, rgba(46,125,50,0.16), rgba(66,165,245,0.16))'
                          : 'linear-gradient(135deg, #e8f5e9, #e3f2fd)',
                        color: '#2e7d32',
                      }}
                    >
                      <PersonOutline />
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: secondaryText }}
                      >
                        Active Users
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '1.6rem',
                          fontWeight: 800,
                          color: primaryText,
                        }}
                      >
                        {users.filter((user) => user.isActive).length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Loading */}
        {loading && (
          <Card sx={cardStyle}>
            <CardContent sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ color: secondaryText }}>
                Loading teams...
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!loading && teams.length === 0 && !error && (
          <Card sx={cardStyle}>
            <CardContent sx={{ py: 7, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: iconBoxBackground,
                  color: '#3f51ff',
                }}
              >
                <GroupsOutlined sx={{ fontSize: 32 }} />
              </Box>

              <Typography
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: primaryText,
                }}
              >
                No teams found
              </Typography>

              <Typography
                sx={{
                  mt: 0.8,
                  mb: 2.5,
                  color: secondaryText,
                }}
              >
                Create your first team to start organizing users.
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenCreateDialog(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg, #3f51ff, #7c4dff)',
                }}
              >
                Create Team
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Team cards */}
        {!loading && teams.length > 0 && (
          <Grid container spacing={3}>
            {teams.map((team) => (
              <Grid item xs={12} sm={6} md={4} key={team.id}>
                <Card sx={cardStyle}>
                  <Box
                    sx={{
                      height: 6,
                      background:
                        'linear-gradient(90deg, #42a5f5, #7c4dff)',
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        mb: 2.5,
                      }}
                    >
                      <Avatar
                        src={team.avatarUrl || undefined}
                        sx={{
                          width: 52,
                          height: 52,
                          fontWeight: 800,
                          background:
                            'linear-gradient(135deg, #42a5f5, #7c4dff)',
                        }}
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          component="h2"
                          sx={{
                            color: primaryText,
                            fontSize: '1.15rem',
                            fontWeight: 750,
                            mb: 0.4,
                            wordBreak: 'break-word',
                          }}
                        >
                          {team.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: secondaryText,
                            wordBreak: 'break-word',
                          }}
                        >
                          {team.slug}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        color: bodyText,
                        fontSize: '0.93rem',
                        lineHeight: 1.6,
                        minHeight: 70,
                        mb: 2.5,
                      }}
                    >
                      {team.description ||
                        'No description provided.'}
                    </Typography>

                    {/* Owner */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: sectionBackground,
                        border: `1px solid ${sectionBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        mb: 2.5,
                      }}
                    >
                      <PersonOutline
                        sx={{
                          fontSize: 20,
                          color: '#3f51ff',
                        }}
                      />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '0.72rem',
                            color: mutedText,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            fontWeight: 700,
                          }}
                        >
                          Owner
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '0.9rem',
                            color: primaryText,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {getUserName(team.ownerId)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Members */}
                    <Box
                      sx={{
                        mb: 2.5,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: sectionBackground,
                        border: `1px solid ${sectionBorder}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              color: mutedText,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              fontWeight: 700,
                            }}
                          >
                            Members
                          </Typography>

                          <Box
                            sx={{
                              minWidth: 24,
                              height: 24,
                              px: 0.75,
                              borderRadius: 10,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: countBackground,
                              color: isDark
                                ? '#9aa7ff'
                                : '#3f51ff',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {(teamMembers[team.id] || []).length}
                          </Box>
                        </Box>

                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() =>
                            handleOpenAddMember(team)
                          }
                          sx={{
                            minWidth: 'auto',
                            px: 1,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            color: isDark
                              ? '#9aa7ff'
                              : '#3f51ff',
                            '&:hover': {
                              backgroundColor: isDark
                                ? 'rgba(63,81,255,0.16)'
                                : 'rgba(63,81,255,0.06)',
                            },
                          }}
                        >
                          Add
                        </Button>
                      </Box>

                      {(teamMembers[team.id] || []).length === 0 ? (
                        <Typography
                          variant="body2"
                          sx={{
                            color: secondaryText,
                            fontStyle: 'italic',
                          }}
                        >
                          No members yet.
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          {(teamMembers[team.id] || []).map(
                            (member) => (
                              <Box
                                key={member.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.2,
                                  p: 1,
                                  borderRadius: 1.5,
                                  backgroundColor: memberBackground,
                                  border: `1px solid ${memberBorder}`,
                                }}
                              >
                                <Avatar
                                  src={
                                    member.avatarUrl ||
                                    undefined
                                  }
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    background:
                                      'linear-gradient(135deg, #42a5f5, #7c4dff)',
                                  }}
                                >
                                  {member.fullName
                                    .charAt(0)
                                    .toUpperCase()}
                                </Avatar>

                                <Box
                                  sx={{
                                    minWidth: 0,
                                    flex: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: '0.86rem',
                                      color: primaryText,
                                      fontWeight: 650,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {member.fullName}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: secondaryText,
                                      overflow: 'hidden',
                                      textOverflow:
                                        'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'block',
                                    }}
                                  >
                                    @{member.username}
                                    {member.roleName
                                      ? ` • ${member.roleName}`
                                      : ''}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: 0.5,
                                      mt: 0.5,
                                    }}
                                  >
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleOpenEditRole(
                                          team,
                                          member
                                        )
                                      }
                                      startIcon={<EditOutlined />}
                                      sx={{
                                        minWidth: 'auto',
                                        px: 1,
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: isDark
                                          ? '#9aa7ff'
                                          : '#3f51ff',
                                        flexShrink: 0,
                                        '&:hover': {
                                          backgroundColor:
                                            isDark
                                              ? 'rgba(63,81,255,0.16)'
                                              : 'rgba(63,81,255,0.06)',
                                        },
                                      }}
                                    >
                                      Edit Role
                                    </Button>

                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleOpenRemoveMember(
                                          team,
                                          member
                                        )
                                      }
                                      startIcon={
                                        <PersonRemoveOutlined />
                                      }
                                      sx={{
                                        minWidth: 'auto',
                                        px: 1,
                                        borderRadius: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: isDark
                                          ? '#f87171'
                                          : '#d32f2f',
                                        flexShrink: 0,
                                        '&:hover': {
                                          backgroundColor:
                                            isDark
                                              ? 'rgba(211,47,47,0.16)'
                                              : 'rgba(211,47,47,0.06)',
                                        },
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            )
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Team actions */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: {
                          xs: 'column',
                          sm: 'row',
                        },
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditOutlined />}
                        onClick={() => handleEditTeam(team)}
                        sx={{
                          py: 1.1,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 650,
                          borderColor: isDark
                            ? '#6f7cff'
                            : '#3f51ff',
                          color: isDark
                            ? '#9aa7ff'
                            : '#3f51ff',
                          '&:hover': {
                            borderColor: isDark
                              ? '#8b95ff'
                              : '#3040df',
                            backgroundColor: isDark
                              ? 'rgba(63,81,255,0.16)'
                              : 'rgba(63,81,255,0.04)',
                          },
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={() =>
                          handleDeleteTeam(team)
                        }
                        sx={{
                          py: 1.1,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 650,
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Team Dialog */}
        <Dialog
          open={openCreateDialog}
          onClose={() => {
            if (!creating) {
              setOpenCreateDialog(false)
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 750,
              pb: 1,
            }}
          >
            Create Team
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: secondaryText,
                mb: 1,
              }}
            >
              Create a team and assign an owner.
            </Typography>

            <TextField
              label="Team Name"
              fullWidth
              margin="normal"
              value={teamName}
              onChange={(event) =>
                setTeamName(event.target.value)
              }
              required
              sx={fieldSx}
            />

            <TextField
              label="Slug"
              fullWidth
              margin="normal"
              value={teamSlug}
              onChange={(event) =>
                setTeamSlug(event.target.value)
              }
              helperText="Example: development-team"
              required
              sx={fieldSx}
            />

            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={teamDescription}
              onChange={(event) =>
                setTeamDescription(event.target.value)
              }
              sx={fieldSx}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              sx={fieldSx}
            >
              <InputLabel id="team-owner-label">
                Owner
              </InputLabel>

              <Select
                labelId="team-owner-label"
                value={teamOwnerId}
                label="Owner"
                onChange={(event) =>
                  setTeamOwnerId(event.target.value)
                }
              >
                {users
                  .filter((user) => user.isActive)
                  .map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName || user.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label="Avatar URL"
              fullWidth
              margin="normal"
              value={teamAvatarUrl}
              onChange={(event) =>
                setTeamAvatarUrl(event.target.value)
              }
              helperText="Optional"
              sx={fieldSx}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
            }}
          >
            <Button
              onClick={() =>
                setOpenCreateDialog(false)
              }
              disabled={creating}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: bodyText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleCreateTeam}
              disabled={
                creating ||
                !teamName.trim() ||
                !teamSlug.trim() ||
                !teamOwnerId
              }
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3545e8, #6d42e8)',
                },
              }}
            >
              {creating ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Team Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => {
            if (!updating) {
              setOpenEditDialog(false)
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 750,
              pb: 1,
            }}
          >
            Edit Team
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: secondaryText,
                mb: 1,
              }}
            >
              Update the team information and owner.
            </Typography>

            <TextField
              label="Team Name"
              fullWidth
              margin="normal"
              value={editTeamName}
              onChange={(event) =>
                setEditTeamName(event.target.value)
              }
              required
              sx={fieldSx}
            />

            <TextField
              label="Slug"
              fullWidth
              margin="normal"
              value={editTeamSlug}
              onChange={(event) =>
                setEditTeamSlug(event.target.value)
              }
              required
              sx={fieldSx}
            />

            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={editTeamDescription}
              onChange={(event) =>
                setEditTeamDescription(event.target.value)
              }
              sx={fieldSx}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              sx={fieldSx}
            >
              <InputLabel id="edit-team-owner-label">
                Owner
              </InputLabel>

              <Select
                labelId="edit-team-owner-label"
                value={editTeamOwnerId}
                label="Owner"
                onChange={(event) =>
                  setEditTeamOwnerId(event.target.value)
                }
              >
                {users
                  .filter((user) => user.isActive)
                  .map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName || user.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label="Avatar URL"
              fullWidth
              margin="normal"
              value={editTeamAvatarUrl}
              onChange={(event) =>
                setEditTeamAvatarUrl(event.target.value)
              }
              helperText="Optional"
              sx={fieldSx}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
            }}
          >
            <Button
              onClick={() => setOpenEditDialog(false)}
              disabled={updating}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: bodyText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleUpdateTeam}
              disabled={
                updating ||
                !editTeamName.trim() ||
                !editTeamSlug.trim() ||
                !editTeamOwnerId
              }
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3545e8, #6d42e8)',
                },
              }}
            >
              {updating ? 'Updating...' : 'Update Team'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Team Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => {
            if (!deleting) {
              setOpenDeleteDialog(false)
            }
          }}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 750,
            }}
          >
            Delete Team
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ color: primaryText }}>
              Are you sure you want to delete{' '}
              <strong>{deletingTeam?.name}</strong>?
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1.5,
                color: secondaryText,
                lineHeight: 1.6,
              }}
            >
              This action cannot be undone. Teams containing
              projects cannot be deleted.
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
            }}
          >
            <Button
              onClick={() =>
                setOpenDeleteDialog(false)
              }
              disabled={deleting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: bodyText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteTeam}
              disabled={deleting}
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              {deleting ? 'Deleting...' : 'Delete Team'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Member Dialog */}
        <Dialog
          open={openAddMemberDialog}
          onClose={() => {
            if (!addingMember) {
              setOpenAddMemberDialog(false)
              setSelectedTeam(null)
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 750,
              pb: 1,
            }}
          >
            Add Team Member
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: secondaryText,
                mb: 2,
              }}
            >
              Add a user to{' '}
              <strong>{selectedTeam?.name}</strong>.
            </Typography>

            <FormControl
              fullWidth
              margin="normal"
              required
              sx={fieldSx}
            >
              <InputLabel id="team-member-user-label">
                User
              </InputLabel>

              <Select
                labelId="team-member-user-label"
                value={selectedMemberUserId}
                label="User"
                onChange={(event) =>
                  setSelectedMemberUserId(event.target.value)
                }
              >
                {users
                  .filter((user) => {
                    if (!user.isActive) {
                      return false
                    }

                    const members =
                      teamMembers[selectedTeam?.id || ''] || []

                    return !members.some(
                      (member) => member.userId === user.id
                    )
                  })
                  .map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName || user.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              sx={fieldSx}
            >
              <InputLabel id="team-member-role-label">
                Role
              </InputLabel>

              <Select
                labelId="team-member-role-label"
                value={selectedMemberRoleId}
                label="Role"
                onChange={(event) =>
                  setSelectedMemberRoleId(event.target.value)
                }
              >
                <MenuItem value="">
                  No role
                </MenuItem>

                {roles
                  .filter(
                    (role) =>
                      role.name.toLowerCase() !== 'admin'
                  )
                  .map((role) => (
                    <MenuItem
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenAddMemberDialog(false)
                setSelectedTeam(null)
              }}
              disabled={addingMember}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: bodyText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleAddMember}
              disabled={
                addingMember ||
                !selectedMemberUserId
              }
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3545e8, #6d42e8)',
                },
              }}
            >
              {addingMember ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove Member Confirmation Dialog */}
        <Dialog
          open={openRemoveMemberDialog}
          onClose={() => {
            if (!removingMember) {
              setOpenRemoveMemberDialog(false)
              setMemberToRemove(null)
              setTeamForRemoval(null)
            }
          }}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 750,
              pb: 1,
            }}
          >
            Remove Team Member
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: bodyText,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to remove{' '}
              <strong>
                {memberToRemove?.fullName}
              </strong>{' '}
              from{' '}
              <strong>
                {teamForRemoval?.name}
              </strong>
              ?
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenRemoveMemberDialog(false)
                setMemberToRemove(null)
                setTeamForRemoval(null)
              }}
              disabled={removingMember}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: bodyText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleRemoveMember}
              disabled={removingMember}
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
            >
              {removingMember
                ? 'Removing...'
                : 'Remove Member'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Team Member Role Dialog */}
        <Dialog
          open={openEditRoleDialog}
          onClose={() => {
            if (!updatingRole) {
              setOpenEditRoleDialog(false)
              setMemberToEdit(null)
              setTeamForRoleEdit(null)
              setSelectedRoleId('')
            }
          }}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              backgroundColor: dialogBackground,
              backgroundImage: 'none',
              border: `1px solid ${borderColor}`,
            },
          }}
        >
          <DialogTitle
            sx={{
              color: primaryText,
              fontWeight: 750,
              pb: 1,
            }}
          >
            Edit Team Member Role
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="body2"
              sx={{
                color: bodyText,
                lineHeight: 1.6,
                mb: 1,
              }}
            >
              Update the role for{' '}
              <strong>
                {memberToEdit?.fullName}
              </strong>
              .
            </Typography>

            <FormControl
              fullWidth
              margin="normal"
              sx={fieldSx}
            >
              <InputLabel id="edit-team-member-role-label">
                Role
              </InputLabel>

              <Select
                labelId="edit-team-member-role-label"
                value={selectedRoleId}
                label="Role"
                onChange={(event) =>
                  setSelectedRoleId(event.target.value)
                }
              >
                <MenuItem value="">
                  No role
                </MenuItem>

                {roles
                  .filter(
                    (role) =>
                      role.name.toLowerCase() !== 'admin'
                  )
                  .map((role) => (
                    <MenuItem
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              pt: 1,
            }}
          >
            <Button
              onClick={() => {
                setOpenEditRoleDialog(false)
                setMemberToEdit(null)
                setTeamForRoleEdit(null)
                setSelectedRoleId('')
              }}
              disabled={updatingRole}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: bodyText,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleUpdateRole}
              disabled={updatingRole}
              sx={{
                px: 2.5,
                py: 1.1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #3f51ff, #7c4dff)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #3545e8, #6d42e8)',
                },
              }}
            >
              {updatingRole
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Teams