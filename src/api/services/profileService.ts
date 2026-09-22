import axiosClient from '../axiosClient'

export interface ProfilePictureResponse {
  message: string
  avatarUrl: string
}

export const uploadProfilePicture = async (
  file: File
): Promise<ProfilePictureResponse> => {
  const formData = new FormData()

  formData.append('file', file)

  const response =
    await axiosClient.post<ProfilePictureResponse>(
      '/api/Users/profile-picture',
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    )

  return response.data
}