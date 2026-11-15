export const DF = {
  scale: 3,
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

export const BODY = {
  blue: { abd: '#3aa6c8', abdDk: '#17485c', tip: '#0f2f3b', thorax: '#2d7f93', thoraxHi: '#67c4d2', thoraxDk: '#174a57', head: '#2a6d82', eye: '#14394a' },
  red: { abd: '#d8442c', abdDk: '#6a1d14', tip: '#3a110b', thorax: '#9b3220', thoraxHi: '#e0714f', thoraxDk: '#561a10', head: '#a33a26', eye: '#3e130d' },
  emerald: { abd: '#5fc06a', abdDk: '#1f5228', tip: '#123319', thorax: '#3f9450', thoraxHi: '#8ad884', thoraxDk: '#1f4f2a', head: '#3d8a4c', eye: '#123a22' },
  amber: { abd: '#e2a634', abdDk: '#6e4512', tip: '#3b240a', thorax: '#b5792a', thoraxHi: '#f0c560', thoraxDk: '#5e3b12', head: '#b37a2c', eye: '#3c2610' },
}

export const JAW = '#c9a45c'

export const WING = { fill: '#cfe6e4', vein: '#8fc4c2', costa: '#344244', stigma: '#181e1e', outline: '#14301f', shadow: '#14301f' }

export const FLY = { top: 150, cruise: .55, turn: 5.5, accel: 4.5, arrive: 4, height: 20, bob: 1.5, beat: 4, catch: 10, reach: 24 }
export const STAMINA = { hover: 1, sprint: 5, regen: 12, tired: 10, wake: 80, show: 25, spent: .6 }
export const HUNT = { sight: 150, shun: 8, patience: [2.5, 5], calm: [.4, 1.6] }
export const GLOW = 2
