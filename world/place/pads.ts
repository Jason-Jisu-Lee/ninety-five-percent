const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]], made = new Map<number, string[]>()

export const LILY = [
  '......pwp......',
  '..pp..www..pp..',
  '..pwwpwwwpwwp..',
  '...wwwwxwwww...',
  '.ppxwwwwwwwxpp.',
  'pwwwwwyyywwwwwp',
  'wwwxwyyoyywxwww',
  'pwwwwwyyywwwwwp',
  '.ppxwwwwwwwxpp.',
  '...wwwwxwwww...',
  '..pwwpwwwpwwp..',
  '..qq..wxw..qq..',
  '......qxq......',
]

export const BUD = ['.pw.', 'pwwx', 'pwwx', '.qx.']

export function pad(rx: number, notch: number) {
  const id = rx * 8 + notch, ry = Math.round(rx * .72), [nx, ny] = DIRS[notch], big = rx >= 12
  if (made.has(id)) return made.get(id)!
  const solid = (x: number, y: number) => {
    const along = (x + .5) * nx + (y + .5) * ny, across = Math.abs((x + .5) * ny - (y + .5) * nx)
    return ((x + .5) / rx) ** 2 + ((y + .5) / ry) ** 2 <= 1 && !(along > 1 && across * (nx && ny ? 4 : 3) < along)
  }
  const rows = Array.from({ length: ry * 2 }, (_, j) => Array.from({ length: rx * 2 }, (_, i) => {
    const x = i - rx, y = j - ry, far = Math.hypot((x + .5) / rx, (y + .5) / ry)
    if (!solid(x, y)) return '.'
    if (!solid(x - 1, y - 1)) return '4'
    if (!solid(x + 1, y + 1) || big && !solid(x + 2, y + 2)) return '1'
    if (big && !solid(x - 2, y - 2)) return '3'
    if (big && x >= -1 && x <= 0 && y >= -1 && y <= 0) return '1'
    return big && far < .78 && (!x || !y || x === y || x === -y) ? '3' : '2'
  }).join(''))
  made.set(id, rows)
  return rows
}
