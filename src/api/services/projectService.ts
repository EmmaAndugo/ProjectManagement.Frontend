import axiosClient from '../axiosClient'

export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  ownerId: string
  teamId: string
  status: string
  visibility: string
  startDate?: string
  dueDate?: string
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await axiosClient.get<Project[]>('/api/Projects')

  return response.data
}

export interface CreateProjectRequest {
  name: string
  ownerId: string
  teamId?: string
  description?: string
  status?: string
  visibility?: string
}

export const createProject = async (
  project: CreateProjectRequest
): Promise<Project> => {
  const response = await axiosClient.post<Project>(
    '/api/Projects',
    project
  )

  return response.data
}

export interface UpdateProjectRequest {
  name: string
  ownerId: string
  teamId?: string
  description?: string
  status?: string
  visibility?: string
}

export const updateProject = async (
  id: string,
  project: UpdateProjectRequest
): Promise<Project> => {
  const response = await axiosClient.put<Project>(
    `/api/Projects/${id}`,
    project
  )

  return response.data
}

export const deleteProject = async (
  id: string
): Promise<void> => {
  await axiosClient.delete(`/api/Projects/${id}`)
}