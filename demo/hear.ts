const EDGE = [1, 2, 4, 7, 12, 22, 40, 128], N = EDGE.length - 1, peak = Array<number>(N).fill(4), slow = Array<number>(N).fill(0)
let wait = 0, usual = 0

export const sound = { bands: Array<number>(N).fill(0), level: 0, hit: 0 }
export type Sound = typeof sound

export function hear(bins: Uint8Array, dt: number) {
  let flux = 0, sum = 0
  for (let k = 0; k < N; k++) {
    let v = 0
    for (let i = EDGE[k]; i < EDGE[k + 1]; i++) v += bins[i]
    v = 10 ** (v / (EDGE[k + 1] - EDGE[k]) / 57)
    peak[k] = Math.max(v, peak[k] * (1 - dt * .2), 4)
    const b = (v - 1) / peak[k]
    flux += Math.max(0, b - slow[k])
    slow[k] += (b - slow[k]) * Math.min(1, dt * 6)
    sum += sound.bands[k] = b
  }
  sound.level = sum / N
  usual += (flux - usual) * Math.min(1, dt * 2)
  sound.hit = (wait -= dt) < 0 && flux > usual * 1.4 + .2 ? Math.min(1, flux / 2) : 0
  if (sound.hit) wait = .12
}
