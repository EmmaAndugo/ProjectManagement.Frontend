import axiosClient from '../axiosClient'

export interface Attachment {
  id: string
  taskId: string
  commentId?: string | null
  uploadedBy: string
  filename: string
  storageKey: string
  mimeType?: string | null
  sizeBytes?: number | null
  createdAt: string
}

export interface CreateAttachmentRequest {
  taskId: string
  commentId?: string | null
  file: File
}

export const getAttachments = async (): Promise<Attachment[]> => {
  const response = await axiosClient.get<Attachment[]>(
    '/api/Attachments'
  )

  return response.data
}

export const getTaskAttachments = async (
  taskId: string
): Promise<Attachment[]> => {
  const response = await axiosClient.get<Attachment[]>(
    `/api/Attachments/task/${taskId}`
  )

  return response.data
}

export const getAttachment = async (
  attachmentId: string
): Promise<Attachment> => {
  const response = await axiosClient.get<Attachment>(
    `/api/Attachments/${attachmentId}`
  )

  return response.data
}

export const uploadAttachment = async (
  request: CreateAttachmentRequest
): Promise<Attachment> => {
  const formData = new FormData()

  formData.append('taskId', request.taskId)

  if (request.commentId) {
    formData.append(
      'commentId',
      request.commentId
    )
  }

  formData.append('file', request.file)

  const response = await axiosClient.post<Attachment>(
    '/api/Attachments',
    formData
  )

  return response.data
}

export const downloadAttachment = async (
  attachmentId: string
): Promise<Blob> => {
  const response = await axiosClient.get<Blob>(
    `/api/Attachments/${attachmentId}/download`,
    {
      responseType: 'blob',
    }
  )

  return response.data
}

export const getAttachmentDownloadUrl = (
  attachmentId: string
): string => {
  return `/api/Attachments/${attachmentId}/download`
}

export const deleteAttachment = async (
  attachmentId: string
): Promise<void> => {
  await axiosClient.delete(
    `/api/Attachments/${attachmentId}`
  )
}