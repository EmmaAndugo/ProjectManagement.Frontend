import axiosClient from '../axiosClient'

export interface Role {
  id: string
  name: string
  description?: string
  permissions?: string
  createdAt: string
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await axiosClient.get<Role[]>(
    '/api/Roles'
  )

  return response.data
}