import axiosClient from '../axiosClient'

export interface Notification {
  id: string
  recipientId: string
  actorId?: string | null
  type: string
  resourceType?: string | null
  resourceId?: string | null
  data?: string | null
  readAt?: string | null
  createdAt: string
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axiosClient.get<Notification[]>(
    '/api/Notifications'
  )

  return response.data
}

export const markNotificationAsRead = async (
  id: string
): Promise<Notification> => {
  const response = await axiosClient.put<Notification>(
    `/api/Notifications/${id}/read`
  )

  return response.data
}

export const deleteNotification = async (
  id: string
): Promise<void> => {
  await axiosClient.delete(`/api/Notifications/${id}`)
}