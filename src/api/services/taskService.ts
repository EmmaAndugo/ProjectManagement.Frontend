import axiosClient from '../axiosClient'

export interface Task {
  id: string
  projectId: string
  parentTaskId?: string
  title: string
  status: string
  description?: string
  assigneeId?: string
  createdBy: string
  startDate?: string
  dueDate?: string
  estimatedHours?: number
  position?: number
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await axiosClient.get<Task[]>('/api/Tasks')

  return response.data
}

export interface CreateTaskRequest {
  projectId: string
  parentTaskId?: string
  title: string
  status?: string
  description?: string
  assigneeId?: string
  startDate?: string
  dueDate?: string
  estimatedHours?: number
  position?: number
  tags?: string
}

export const createTask = async (
  task: CreateTaskRequest
): Promise<Task> => {
  const response = await axiosClient.post<Task>(
    '/api/Tasks',
    task
  )

  return response.data
}

export interface UpdateTaskRequest {
  projectId: string
  parentTaskId?: string
  title: string
  status?: string
  description?: string
  assigneeId?: string
  startDate?: string
  dueDate?: string
  estimatedHours?: number
  position?: number
  tags?: string
}

export const updateTask = async (
  id: string,
  task: UpdateTaskRequest
): Promise<Task> => {
  const response = await axiosClient.put<Task>(
    `/api/Tasks/${id}`,
    task
  )

  return response.data
}

export const deleteTask = async (
  id: string
): Promise<void> => {
  await axiosClient.delete(`/api/Tasks/${id}`)
}