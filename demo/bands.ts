const EDGE = [1, 6, 22, 128], LOW = [.55, .3, .4], peak = [4, 4, 4], out = [0, 0, 0]

export function bands(bins: Uint8Array, dt: number) {
  for (let k = 0; k < 3; k++) {
    let v = 0
    for (let i = EDGE[k]; i < EDGE[k + 1]; i++) v += bins[i]
    v = 10 ** (v / (EDGE[k + 1] - EDGE[k]) / 57)
    peak[k] = Math.max(v, peak[k] * (1 - dt * .2), 4)
    out[k] = Math.max(0, ((v - 1) / peak[k] - LOW[k]) / (1 - LOW[k]))
  }
  return out
}
