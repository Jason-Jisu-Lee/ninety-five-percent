export const once = <T>(f: () => T) => {
  let v: T | undefined
  return () => v ??= f()
}
