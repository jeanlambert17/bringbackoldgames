import { isDefined, isString } from './type-guards'

// eslint-disable-next-line
export const fallback = (...values: unknown[]): any => {
  const value = values.find(isDefined)
  return value ?? values[values.length - 1]
}

// eslint-disable-next-line
export const fallbackString = (...values: unknown[]): any => {
  const value = values.find(isString)
  return value ?? values[values.length - 1]
}
