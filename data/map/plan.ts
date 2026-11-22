import { H, W } from '../look/screen'

export const SPAN = 4, LEVELS = 5
export const MW = W * SPAN, MH = H * SPAN, CX = MW / 2, CY = MH / 2
export const zoom = (level: number) => SPAN ** (level / LEVELS)

export const LAND = {
  pond: { r: [400, 540], squash: [.68, .95], share: [.08, .2], lobes: 190, wiggle: 46 },
  stream: { wide: [10, 15], step: 120, bend: .5 },
  meadow: { r: [470, 620], squash: [.7, 1], share: [.3, .6] },
  rocks: { r: [170, 250], squash: [.6, .9], far: [400, 620] },
  trunk: { len: [640, 900], r: [30, 42], far: [430, 640] },
  log: { len: [230, 330], r: [12, 17], far: [150, 250] },
  trees: { n: 8, r: [52, 96], gap: 420, clear: 400, reach: 4.6 },
}

export const OWNED = ['pads', 'reeds', 'flowers', 'stones', 'log', 'ferns', 'ring', 'fruit'] as const
export type Own = (typeof OWNED)[number]
