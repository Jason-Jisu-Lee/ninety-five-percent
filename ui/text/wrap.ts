import { width } from './text'

export function wrap(str: string, max: number) {
  const lines: string[] = []
  for (const word of str.split(' ')) {
    const last = lines.at(-1)
    if (last !== undefined && width(last + ' ' + word) <= max) lines[lines.length - 1] = last + ' ' + word
    else lines.push(word)
  }
  return lines
}
