import { useCallback, useState } from 'react'
import { useLatestValue } from './use-latest-value'
import { isEvent } from '@/utils/type-guards'
import { fallback } from '@/utils/fallback'

type UseModalPropsReturn<T extends object> = [
  { open: boolean, onOpenChange: (open: boolean) => void },
  (props?: void | T) => void,
  () => void,
  boolean
]

export function useModalProps<T extends object>(
  onClose?: () => void,
  defaultProps?: T
): UseModalPropsReturn<T> {
  const onCloseRef = useLatestValue(onClose)
  const [isLoaded, setIsLoaded] = useState(false)
  const [props, setProps] = useState({ ...(defaultProps ?? {}), open: false })

  const open = useCallback((_props: void | T) => {
    if (!isLoaded) setIsLoaded(true)
    const props = fallback(isEvent(_props) ? null : _props, {})
    setProps({ ...(props ?? {}), open: true })
  }, [isLoaded])

  const onOpenChange = useCallback((open: boolean) => {
    if(open) {
      setProps(props => ({ ...props, open: true }))
    } else {
      if (onCloseRef.current) onCloseRef.current()
      setProps(props => ({ ...props, open: false }))
    }
  }, [onCloseRef])

  return [
    {
      onOpenChange,
      ...props
    },
    open,
    close,
    isLoaded
  ] as const
}
