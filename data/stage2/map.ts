import { LOG, POND, type Log } from '../stage1/map'

export const INSET = { x: 160, y: 90, k: .5 }
export const mini = ([x, y]: number[]) => [INSET.x + x * INSET.k, INSET.y + y * INSET.k]
export const POND2 = { x: INSET.x + POND.x * INSET.k, y: INSET.y + POND.y * INSET.k, r: POND.r * INSET.k, wave: POND.wave * INSET.k }
export const LOG2: Log = {
  ...LOG, x: INSET.x + LOG.x * INSET.k, y: INSET.y + LOG.y * INSET.k, len: 250, r: LOG.r * INSET.k, taper: .2,
  stubs: [[48, -1, -1.75, 7.5], [102, 1, 1.25, 6.5], [156, -1, -1.4, 11], [204, 1, 1.5, 9]], fungi: [64, 70.5, 118, 176],
}
export const STUMP = { x: 468, y: 44, r: 38, wall: 11, roots: [[2.3, 44], [2.95, 34], [1.75, 50], [.8, 42], [.15, 32], [3.6, 26], [1.25, 30], [2.6, 24]] }
export const STREAM = { path: [[-12, 36], [30, 66], [60, 120], [48, 172], [76, 224], [120, 266]], wide: 7 }
export const FIELD = { x: 580, y: 304, rx: 74, ry: 54 }
export const BOULDERS = [[528, 262, 19, 12], [574, 298, 27, 16], [620, 268, 16, 10], [544, 326, 14, 9], [606, 336, 22, 13], [632, 310, 11, 7], [500, 304, 10, 6], [486, 272, 7, 5]]
export const PADS2 = [[236, 252, 9, -1.2], [150, 300, 11, .6], [100, 330, 7, 2.4], [262, 300, 6, 1.1], [300, 338, 9, -.4]]
export const FERNS = [[34, 232], [16, 286], [118, 26], [72, 326], [22, 132], [156, 58], [330, 20], [612, 150], [606, 36], [560, 88]]
export const BEDS = [[100, 150, 28, 0], [286, 52, 30, 1], [530, 214, 22, 2], [150, 92, 18, 1], [420, 318, 20, 0], [60, 60, 20, 2]]
export const REEDS2 = [[214, 204], [220, 206], [100, 250], [106, 247], [58, 300], [300, 300], [306, 303], [326, 330], [150, 222], [144, 226], [36, 196], [42, 199]]
