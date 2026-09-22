import axiosClient from '../axiosClient'

export interface AIProjectAnalysis {
  projectId: string
  projectName: string
  summary: string
  risks: string[]
  suggestions: string[]
  recommendedActions: string[]
}

export const analyzeProject = async (
  projectId: string
): Promise<AIProjectAnalysis> => {
  const response = await axiosClient.post<AIProjectAnalysis>(
    `/api/AI/projects/${projectId}/analyze`
  )

  return response.data
}

export interface AITaskAnalysis {
  taskId: string
  taskTitle: string
  summary: string
  risks: string[]
  suggestions: string[]
  recommendedActions: string[]
}

export const analyzeTask = async (
  taskId: string
): Promise<AITaskAnalysis> => {
  const response = await axiosClient.post<AITaskAnalysis>(
    `/api/AI/tasks/${taskId}/analyze`
  )

  return response.data
}