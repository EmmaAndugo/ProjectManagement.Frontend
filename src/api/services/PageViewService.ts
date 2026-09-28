import axiosClient from '../axiosClient'

export const logPageView = async (
  pageName: string
): Promise<void> => {
  await axiosClient.post(
    '/api/PageViews',
    pageName
  )
}