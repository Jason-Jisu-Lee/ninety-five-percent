import { H, W } from '../../data/look/screen'

export type Mask = Uint8Array

export function shape(cell: (i: number, j: number) => boolean, c = 16, r = 6): Mask {
  const cw = Math.ceil(W / c), ch = Math.ceil(H / c), wide = cw + 2, g = new Uint8Array(wide * (ch + 2)), m = new Uint8Array(W * H), half = c / 2
  for (let j = -1; j <= ch; j++) for (let i = -1; i <= cw; i++) g[(j + 1) * wide + i + 1] = +cell(Math.min(cw - 1, Math.max(0, i)), Math.min(ch - 1, Math.max(0, j)))
  const at = (i: number, j: number) => g[(j + 1) * wide + i + 1]
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = x / c | 0, j = y / c | 0, lx = x % c, ly = y % c, me = at(i, j), sx = lx < half ? -1 : 1, sy = ly < half ? -1 : 1
    const a = sx < 0 ? lx : c - 1 - lx, b = sy < 0 ? ly : c - 1 - ly, out = a < r && b < r && (r - a - .5) ** 2 + (r - b - .5) ** 2 > r * r
    m[y * W + x] = out && at(i + sx, j) !== me && at(i, j + sy) !== me ? 1 - me : me
  }
  return m
}

export function tidy(cell: (i: number, j: number) => boolean, cw: number, ch: number) {
  const g = new Uint8Array(cw * ch), at = (i: number, j: number) => g[Math.min(ch - 1, Math.max(0, j)) * cw + Math.min(cw - 1, Math.max(0, i))]
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) g[j * cw + i] = +cell(i, j)
  for (let pass = 0; pass < 3; pass++) for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    const me = at(i, j), same = +(at(i - 1, j) === me) + +(at(i + 1, j) === me) + +(at(i, j - 1) === me) + +(at(i, j + 1) === me)
    if (same < 2) g[j * cw + i] = 1 - me
  }
  return (i: number, j: number) => !!at(i, j)
}

export const reach = (m: Mask, far: number) => {
  const d = new Uint8Array(W * H).fill(far)
  for (let i = 0; i < W * H; i++) if (m[i]) d[i] = 0
  for (let n = 1; n < far; n++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x
    if (d[i] === far && (x && d[i - 1] === n - 1 || x < W - 1 && d[i + 1] === n - 1 || y && d[i - W] === n - 1 || y < H - 1 && d[i + W] === n - 1)) d[i] = n
  }
  return d
}
