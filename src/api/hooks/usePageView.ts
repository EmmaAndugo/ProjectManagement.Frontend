import { useEffect, useRef } from 'react'
import { logPageView } from '../services/PageViewService'

export const usePageView = (
  pageName: string
): void => {
  const hasLogged = useRef(false)

  useEffect(() => {
    if (hasLogged.current) {
      return
    }

    hasLogged.current = true

    const recordPageView = async () => {
      try {
        await logPageView(pageName)
      } catch (error) {
        console.error(
          `Failed to record page view for ${pageName}:`,
          error
        )
      }
    }

    recordPageView()
  }, [pageName])
}