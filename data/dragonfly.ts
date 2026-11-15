export const DF = {
  scale: 2.43,
  giant: 12,
  color: 'azure' as Color,
  headings: 32,
  flapFrames: 8,
  amp: 1,
  hindLead: Math.PI / 2,
  lift: .55,
  fore: { L: 7.2, ry: -.6, sweep: .1, chord: 1.5 },
  hind: { L: 6.6, ry: .6, sweep: .34, chord: 2.1 },
  thorax: { rx: 1.5, ry: 1.75 },
  abdomen: { from: 1.2, to: 10.4, band: 1.5, baseWidth: .85, width: .5 },
  head: { y: -2.25, rx: 1.05, ry: .8 },
  eyes: { x: .68, y: -2.4, rx: .62, ry: .72 },
  jaw: { x: .34, y: -2.95, len: .4 },
  legs: [
    [[.9, -1.3], [1.5, -2.9], [.55, -4.2]],
    [[1.1, -.7], [2.1, -2.7], [.9, -4.5]],
    [[1.1, -.1], [2.6, -1.9], [1.3, -4.7]],
  ],
  headAt: 2.3,
  mouth: 3.9,
}

export const GROW = { tail: .4, fork: .3, jaw: .3 }

export const COLORS = {
  reed: ['#b9a57a'],
  bark: ['#8a6a4a', '', '#ead9ab', '#c9a45c'],
  moss: ['#8b9a57'],
  slate: ['#7f95a3'],
  ash: ['#a9aba3'],
  smoke: ['#5d6263', '#c9c0b2'],
  clay: ['#b0714f'],
  dusk: ['#8c7a99'],
  azure: ['#3aa6c8'],
  scarlet: ['#d8442c'],
  emerald: ['#5fc06a'],
  amber: ['#e2a634'],
}

export type Color = keyof typeof COLORS

export const JAW = '#c9a45c'

export const WING = { fill: '#cfe6e4', vein: '#8fc4c2', sheen: '#f3faf8', costa: '#344244', stigma: '#181e1e', outline: '#14301f', shadow: '#14301f' }

export const FLY = { top: 122, cruise: .55, turn: 5.5, accel: 4.5, arrive: 4, height: 16, bob: 1.2, beat: 4, catch: 8, reach: 20 }
export const STAMINA = { hover: 1, sprint: 5, regen: 12, tired: 10, wake: 80, show: 25, spent: .6 }
export const AUTO = { tier: 0, sight: 100, near: 60, chain: 4, chase: .9, shun: 8, patience: [2.5, 5], sit: [1, 3], bored: [6, 12], home: .7 }
export const REST = { every: [3, 8], flick: .32, droop: [1, 2.5], tilt: .3 }
export const GLOW = 2
