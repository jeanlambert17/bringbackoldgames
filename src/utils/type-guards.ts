import { ComponentType, isValidElement, ReactNode } from 'react'

export const isFunction = <T extends (...attrs: unknown[]) => unknown>(func?: T | unknown): func is T => {
  return typeof func === 'function'
}
export const isNumber = (value?: number | null): value is number => {
  return typeof value === 'number'
}
export const isBoolean = (value?: unknown): value is boolean => {
  return typeof value === 'boolean'
}
export const isString = (value?: unknown): value is string => {
  return typeof value === 'string'
}
export const isUndefined = <T>(value: T | undefined): value is T => {
  return value === undefined
}
export const isNotUndefined = <T>(value: T | undefined): value is T => {
  return value !== undefined
}
export const isDefined = <T>(value?: T | null): value is T => {
  return value !== undefined && value !== null
}
export const isNotNull = <T>(value: T | null): value is T => {
  return value !== null
}
export const isEvent = (value: unknown): value is Event => {
  return isObject(value) && 'target' in value
}
export const isObject = <T extends object>(value?: unknown): value is T => {
  const type = typeof value
  return value !== null && type === 'object'
}
export const isFunctionComponent = <P = unknown>(
  component: ComponentType<P> | ReactNode
): component is ComponentType<P> => {
  return (typeof component === 'function' || !isValidElement(component)) && component !== undefined
}
