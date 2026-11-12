export const DF = {
  S: 33,
  scale: 1.35,
  headings: 16,
  flapFrames: 8,
  frames: 10,
  amp: 1,
  hindLead: Math.PI / 2,
  lift: .55,
  fore: { L: 7.2, ry: -.6, sweep: .1, chord: 1.5 },
  hind: { L: 6.6, ry: .6, sweep: .34, chord: 2.1 },
  thorax: { rx: 1.5, ry: 1.75 },
  abdomen: { from: 1.2, to: 10.4, band: 1.5, baseWidth: .85, width: .5 },
  head: { y: -2.1 },
  eyes: { x: .95, y: -2.7 },
}

export const BODY = {
  blue: { abd: '#3aa6c8', abdDk: '#17485c', tip: '#0f2f3b', thorax: '#2d7f93', thoraxHi: '#67c4d2', thoraxDk: '#174a57', head: '#2a6d82', eye: '#14394a' },
  red: { abd: '#d8442c', abdDk: '#6a1d14', tip: '#3a110b', thorax: '#9b3220', thoraxHi: '#e0714f', thoraxDk: '#561a10', head: '#a33a26', eye: '#3e130d' },
  emerald: { abd: '#5fc06a', abdDk: '#1f5228', tip: '#123319', thorax: '#3f9450', thoraxHi: '#8ad884', thoraxDk: '#1f4f2a', head: '#3d8a4c', eye: '#123a22' },
  amber: { abd: '#e2a634', abdDk: '#6e4512', tip: '#3b240a', thorax: '#b5792a', thoraxHi: '#f0c560', thoraxDk: '#5e3b12', head: '#b37a2c', eye: '#3c2610' },
}

export const WING = { fill: '#cfe6e4', costa: '#344244', stigma: '#181e1e', outline: '#14301f', shadow: '#1c4730' }

export const FLIGHT = {
  cruise: [1.5, 3.5, 38, 1.6],
  dart: [.35, .6, 120, .25],
  hover: [.8, 1.8, 0, 0],
  glide: [.8, 1.4, -1, .5],
}
