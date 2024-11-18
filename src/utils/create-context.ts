import React, { Provider } from 'react'

type CreateContextType<T> = [() => T, Provider<T | undefined>]

export const createContext = <T>(): CreateContextType<T> => {
  const context = React.createContext<T | undefined>(undefined)
  const useContext = () => {
    const contextIsDefined = React.useContext(context)
    if (!contextIsDefined) {
      throw new Error('useContext must be used within a Provider')
    }
    return contextIsDefined
  }

  return [useContext, context.Provider]
}
