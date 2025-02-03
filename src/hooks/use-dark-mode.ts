import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const matches = window.matchMedia('(prefers-color-scheme: dark)').matches
    if(matches) document.body.classList.add('dark')
    return matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (evt: any) => { // eslint-disable-line
      setIsDarkMode(evt.matches)
      if(evt.matches) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isDarkMode
}