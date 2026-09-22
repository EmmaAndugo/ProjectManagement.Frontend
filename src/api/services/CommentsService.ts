import axiosClient from '../axiosClient'
import type { Attachment } from './AttachmentsService'

export interface Comment {
  id: string
  taskId: string
  authorId: string
  parentId?: string | null
  body: string
  isEdited: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  author?: {
    id: string
    username?: string
    fullName?: string
    email?: string
  }
  replies?: Comment[]
  attachments?: Attachment[]
}


export interface CreateCommentRequest {
  taskId: string
  parentId?: string | null
  body: string
}

export interface UpdateCommentRequest {
  body: string
}

export const getComments = async (): Promise<Comment[]> => {
  const response = await axiosClient.get<Comment[]>(
    '/api/Comments'
  )

  return response.data
}

export const getTaskComments = async (
  taskId: string
): Promise<Comment[]> => {
  const response = await axiosClient.get<Comment[]>(
    `/api/Comments/task/${taskId}`
  )

  return response.data
}

export const getComment = async (
  commentId: string
): Promise<Comment> => {
  const response = await axiosClient.get<Comment>(
    `/api/Comments/${commentId}`
  )

  return response.data
}

export const createComment = async (
  request: CreateCommentRequest
): Promise<Comment> => {
  const response = await axiosClient.post<Comment>(
    '/api/Comments',
    request
  )

  return response.data
}

export const updateComment = async (
  commentId: string,
  request: UpdateCommentRequest
): Promise<Comment> => {
  const response = await axiosClient.put<Comment>(
    `/api/Comments/${commentId}`,
    request
  )

  return response.data
}

export const deleteComment = async (
  commentId: string
): Promise<void> => {
  await axiosClient.delete(
    `/api/Comments/${commentId}`
  )
}