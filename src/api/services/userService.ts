import axiosClient from '../axiosClient'

export interface User {
  id: string
  email: string
  username: string
  passwordHash?: string
  fullName: string
  avatarUrl?: string | null
  isActive: boolean
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  username: string
  passwordHash: string
  fullName: string
  avatarUrl?: string | null
  isActive: boolean
}

export interface UpdateUserRequest {
  email: string
  username: string
  fullName: string
  avatarUrl?: string | null
  isActive: boolean
}

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get<User[]>(
    '/api/Users'
  )

  return response.data
}

export const getUser = async (
  id: string
): Promise<User> => {
  const response = await axiosClient.get<User>(
    `/api/Users/${id}`
  )

  return response.data
}

export const createUser = async (
  request: CreateUserRequest
): Promise<User> => {
  const response = await axiosClient.post<User>(
    '/api/Users',
    request
  )

  return response.data
}

export const updateUser = async (
  id: string,
  request: UpdateUserRequest
): Promise<User> => {
  const response = await axiosClient.put<User>(
    `/api/Users/${id}`,
    request
  )

  return response.data
}

export const deleteUser = async (
  id: string
): Promise<void> => {
  await axiosClient.delete(`/api/Users/${id}`)
}