export const RIVER = { pts: [[-30, 120], [70, 138], [150, 178], [205, 235], [230, 300]], half: 28, wobble: 4 }
export const TREES = [
  { x: 118, y: 72, r: 46, turn: .4 },
  { x: 388, y: 152, r: 56, turn: 1.1 },
  { x: 318, y: 304, r: 50, turn: 2 },
]
export const BUSHES = [{ x: 28, y: 66, r: 13 }, { x: 452, y: 240, r: 14 }, { x: 262, y: 58, r: 11 }]
export const FLOWER_PATCHES = [
  { x: 236, y: 122, n: 7, spread: 26, kind: 'white' },
  { x: 300, y: 196, n: 6, spread: 22, kind: 'yellow' },
  { x: 176, y: 104, n: 4, spread: 16, kind: 'pink' },
] as const
export const PADS = [[.34, 9, 0], [.6, -7, 1], [.63, 11, 0]]
export const ROCKS = [[.2, -1, 4, 2], [.24, -1, 2, 1], [.56, 1, 3, 2]]
export const REEDS = [[.5, -1, 8, .5], [.3, 1, 4, .4], [.74, -1, 3, .3]]
export const WIND = { speed: 170, dir: [.97, .24], every: [4, 8], band: [10, 34, 52] }
