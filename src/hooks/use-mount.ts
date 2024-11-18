import { useEffect } from 'react'

export function useMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, [])
}
