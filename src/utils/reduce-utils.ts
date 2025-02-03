export function reduceToNumber<T>(values: T[] | null | undefined, key: keyof T): number {
  if (values) return values.reduce((p, c) => p + Number(c[key]), 0)
  return 0
}
export function reduceToMapById<T extends { id?: string; uuid?: string }>(values?: T[]) {
  if (values)
    return values.reduce(
      (p, current) => ({
        ...p,
        [current.uuid ?? current.id ?? '']: current
      }),
      {}
    )
  return {}
}
// Reduce to map by given field
export function reduceToMapByField<T extends Record<string, any>>(values: T[] | null | undefined, key: keyof T) { // eslint-disable-line
  if (values) {
    return values.reduce((p, current) => ({ ...p, [current[key as string]]: current }), {})
  }
  return {}
}


export function deepReduceToMapByField<T extends Record<string, any>>(values: T[], key: string) { // eslint-disable-line
  const keys = key.split('.')
  return values.reduce((p, current) => {
    let value = current
    keys.forEach(key => {
      value = value?.[key]
    })
    return {
      ...p,
      [String(value)]: current
    }
  }, {})
}
