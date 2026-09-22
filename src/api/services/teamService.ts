import axiosClient from '../axiosClient'

export interface Team {
  id: string
  name: string
  slug: string
  description?: string
  ownerId: string
  avatarUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateTeamRequest {
  name: string
  slug: string
  description?: string
  ownerId: string
  avatarUrl?: string
}

export const createTeam = async (
  team: CreateTeamRequest
): Promise<Team> => {
  const response = await axiosClient.post<Team>(
    '/api/Teams',
    team
  )

  return response.data
}

export interface UpdateTeamRequest {
  name: string
  slug: string
  description?: string
  ownerId: string
  avatarUrl?: string
}

export const updateTeam = async (
  id: string,
  team: UpdateTeamRequest
): Promise<Team> => {
  const response = await axiosClient.put<Team>(
    `/api/Teams/${id}`,
    team
  )

  return response.data
}

export const deleteTeam = async (
  id: string
): Promise<void> => {
  await axiosClient.delete(`/api/Teams/${id}`)
}

export const getTeams = async (): Promise<Team[]> => {
  const response = await axiosClient.get<Team[]>('/api/Teams')

  return response.data
}