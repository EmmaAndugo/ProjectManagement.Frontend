import axiosClient from '../axiosClient'

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  fullName: string
  username: string
  avatarUrl?: string | null
  roleId?: string | null
  roleName?: string | null
  joinedAt: string
}

export interface AddTeamMemberRequest {
  userId: string
  roleId?: string | null
}

export const getTeamMembers = async (
  teamId: string
): Promise<TeamMember[]> => {
  const response = await axiosClient.get<TeamMember[]>(
    `/api/Teams/${teamId}/members`
  )

  return response.data
}

export const addTeamMember = async (
  teamId: string,
  request: AddTeamMemberRequest
): Promise<TeamMember> => {
  const response = await axiosClient.post<TeamMember>(
    `/api/Teams/${teamId}/members`,
    request
  )

  return response.data
}

export const removeTeamMember = async (
  teamId: string,
  userId: string
): Promise<void> => {
  await axiosClient.delete(
    `/api/Teams/${teamId}/members/${userId}`
  )
}

export const updateTeamMember = async (
  teamId: string,
  userId: string,
  roleId: string | null
): Promise<TeamMember> => {
  const response = await axiosClient.put<TeamMember>(
    `/api/Teams/${teamId}/members/${userId}`,
    {
      roleId,
    }
  )

  return response.data
}