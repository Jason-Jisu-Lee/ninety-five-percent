const EDGE = [1, 2, 3, 4, 5, 7, 9, 12, 16, 22, 30, 41, 56, 80, 128], N = EDGE.length - 1, peak = Array<number>(N).fill(4), slow = Array<number>(N).fill(0)
let wait = 0, usual = 0

export const sound = { bands: Array<number>(N).fill(0), level: 0, hit: 0, pulse: 0, at: 0 }
export type Sound = typeof sound

export const ease = (now: number, want: number, dt: number, up = 30, down = 9) => now + (want - now) * (1 - Math.exp(-dt * (want > now ? up : down)))
export const group = (s: Sound, n: number) => Array.from({ length: n }, (_, i) => {
  const a = Math.floor(i * N / n), b = Math.max(a + 1, Math.floor((i + 1) * N / n))
  return s.bands.slice(a, b).reduce((x, y) => x + y) / (b - a)
})

export function hear(bins: Uint8Array, dt: number) {
  let flux = 0, sum = 0
  for (let k = 0; k < N; k++) {
    let v = 0
    for (let i = EDGE[k]; i < EDGE[k + 1]; i++) v += bins[i]
    v = 10 ** (v / (EDGE[k + 1] - EDGE[k]) / 57)
    peak[k] = Math.max(v, peak[k] * (1 - dt * .2), 4)
    const b = Math.max(0, ((v - 1) / peak[k] - .3) / .7)
    flux += Math.max(0, b - slow[k])
    slow[k] += (b - slow[k]) * Math.min(1, dt * 6)
    sum += sound.bands[k] = b
  }
  sound.level = sum / N
  usual += (flux - usual) * Math.min(1, dt * 2)
  sound.hit = (wait -= dt) < 0 && flux > usual * 1.4 + .5 ? Math.min(1, flux / 4) : 0
  if (sound.hit) wait = .12
  sound.pulse = Math.max(sound.hit, sound.pulse * Math.exp(-dt * 7))
}
