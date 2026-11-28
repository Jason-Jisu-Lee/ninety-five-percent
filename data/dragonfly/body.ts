export const DF = {
  scale: 1.971,
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
  jaw: { x: .3, y: -3.1 },
  headAt: 2.3,
  mouth: 3.9,
}

export const LEAN = { bank: .16, sway: .5 }
