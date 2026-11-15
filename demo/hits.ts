const IDLE = 1.6

export function hits(gap: number) {
  const slow = [0, 0, 0]
  let wait = 0
  return (level: number[], dt: number) => {
    const rise = Math.max(...level.map((v, k) => v - slow[k]))
    level.forEach((v, k) => slow[k] += (v - slow[k]) * Math.min(1, dt * 5))
    if ((wait -= dt) > 0 || rise < .3 && wait > -IDLE) return 0
    wait = gap
    return rise < .3 ? .3 : Math.min(1, rise + .4)
  }
}
