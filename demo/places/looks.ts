const tints = { w: '#f4efe1', x: '#cfc8bb', p: '#f0a3b6', q: '#c96a8a', y: '#f4cf52', o: '#d9952f', v: '#a98be0', u: '#6e56b0', l: '#7fb6ea', r: '#d8442c' }

const day = {
  water: ['#0f2c40', '#163c53', '#1d5068', '#2a6a80', '#8fd0cc'],
  grass: ['#235239', '#2f6b41', '#3c7f49', '#62a855'],
  earth: ['#33252a', '#57423a', '#7a6148', '#a08a62'],
  pad: ['#1f5a44', '#2f7a4e', '#4a9a58', '#86c56f'],
  reed: ['#1e4c38', '#34774a', '#5c9f52', '#a6cc6c'],
  stone: ['#3c464e', '#5f6b74', '#8b979a', '#c3cac4'],
  wood: ['#33241f', '#553d2f', '#7c5d42', '#a5835a'],
  head: ['#3b271e', '#5f3f2a', '#8a6038'],
  shade: ['#0c1f1a', '#143024', '#1f4630', '#2f6340'],
  weed: ['#3f7a44', '#6aa24e', '#9cc75f'],
  tints,
}

export type Look = typeof day

export const POND: Look[] = [
  day,
  {
    ...day,
    water: ['#123250', '#19466a', '#215c84', '#3079a0', '#a5dfe0'],
    grass: ['#2c6a3c', '#3f8a45', '#56a34c', '#8fca5c'],
    earth: ['#3d2b2a', '#66493a', '#8e6f4a', '#b89c68'],
    pad: ['#226347', '#2f8552', '#4fa85c', '#92d274'],
    reed: ['#235a3a', '#3b8848', '#69b052', '#b6dc70'],
  },
  {
    ...day,
    water: ['#0a1b2a', '#10283a', '#17384c', '#22505f', '#7fc4c0'],
    grass: ['#12302a', '#1a4435', '#245a40', '#4f9454'],
    earth: ['#1c1a20', '#2f2a2e', '#4a4039', '#6e6048'],
    pad: ['#184a40', '#22664e', '#33865a', '#6fc07a'],
    reed: ['#143a30', '#235a40', '#3f8450', '#8cc46c'],
    stone: ['#2a333c', '#46525c', '#6e7c84', '#aab6b6'],
  },
]

const fen = {
  ...day,
  water: ['#10262a', '#173638', '#20494a', '#2f6460', '#9ccfb4'],
  grass: ['#3a4a2a', '#536532', '#71823c', '#a9ad52'],
  earth: ['#2a2220', '#4a3b30', '#6b573f', '#8f7a56'],
  pad: ['#24543a', '#357244', '#52924e', '#92bf62'],
  reed: ['#33401f', '#5a6a2c', '#8a9238', '#cfc462'],
  weed: ['#3d6a3c', '#5a8a46', '#84ac58'],
}

export const MARSH: Look[] = [
  fen,
  {
    ...fen,
    water: ['#152d3c', '#1d4152', '#28586a', '#3a7584', '#b8dcc4'],
    grass: ['#4a5a2a', '#6a7c33', '#8d9a3c', '#c8c456'],
    earth: ['#33261f', '#5a4330', '#80633f', '#a88a58'],
    reed: ['#3f4a20', '#6b7830', '#a09a3c', '#e2cf6a'],
  },
  {
    ...fen,
    water: ['#091618', '#0e2224', '#143233', '#1f4a46', '#86bfa6'],
    grass: ['#1f2a1e', '#2f3f26', '#445630', '#7e8c48'],
    earth: ['#17151a', '#2a2526', '#40382f', '#5f5340'],
    pad: ['#173f32', '#22583c', '#357646', '#74ae5c'],
    reed: ['#222b18', '#3b4a22', '#63702e', '#b0aa54'],
    weed: ['#1f4a34', '#2c6440', '#47854e'],
    stone: ['#2a333c', '#46525c', '#6e7c84', '#aab6b6'],
  },
]

export const ramps = (L: Look) => [L.water, L.grass, L.earth, L.pad, L.reed, L.stone, L.wood, L.head, L.shade, [L.water[1], ...L.weed]]
export const key = (L: Look, leaf = L.pad) => {
  const k: Record<string, string> = { ...L.tints }
  ;[[leaf, '1234'], [L.reed, '5678'], [L.stone, 'abcd'], [L.wood, 'efgz'], [L.head, 'hij'], [L.earth, 'mnkt']].forEach(([ramp, ids]) => [...ids as string].forEach((ch, i) => k[ch] = (ramp as string[])[i]))
  return k
}
