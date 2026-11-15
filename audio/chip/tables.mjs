export const SR = 48000, OS = 4, FS = SR * OS, STEP = 16, TAPS = 127, CHUNK = 1 << 14, TAU = Math.PI * 2, RELEASE = .003 * FS
export const DUTY = [.125, .25, .5, .75]
export const VIB = [0, [.28, 10, 5.5], [.2, 18, 6], [.12, 30, 6.5]]
export const KIND = { a: 'p', b: 'p', c: 'p', w: 'w', n: 'n', t: 't', s: 's' }
export const MIX = { a: [.8, .5, 0], b: [.5, .8, 0], c: [.65, .65, 0], w: [.85, .85, 0], n: [.55, .55, 0], t: [.9, 1.1, 1], s: [.75, .6, .3] }
export const HITS = {
  k: [15, 5000, 500, .018, 15, .11],
  s: [15, 22000, 8000, .025, 13, .15],
  h: [15, 131072, 131072, 1, 5, .04],
  o: [15, 131072, 131072, 1, 5, .22],
  c: [15, 90000, 30000, .25, 11, .8],
  t: [7, 16000, 9000, .06, 13, .2],
  m: [7, 24000, 14000, .06, 13, .18],
  e: [15, 60000, 60000, 1, 4, .09],
}
export const WAVES = [[1, .35, .15, .06], [1, .5, .33, .2, .1], [1, 0, .33, 0, .2, 0, .14], [1, .25, .08]].map(h => {
  const raw = Array.from({ length: 32 }, (_, i) => h.reduce((a, g, n) => a + g * Math.sin(TAU * (n + 1) * (i + .5) / 32), 0))
  const lo = Math.min(...raw), span = Math.max(...raw) - lo
  return [3, 2, 1, 0].map(shift => {
    const q = raw.map(x => Math.round((x - lo) / span * 15) >> shift), mean = q.reduce((a, b) => a + b) / 32
    const smp = q.map(x => (x - mean) / 15), cum = [0]
    for (const x of smp) cum.push(cum[cum.length - 1] + x)
    return { smp, cum }
  })
})
