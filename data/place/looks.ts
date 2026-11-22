const tints = { w: '#f4efe1', x: '#cfc8bb', p: '#f0a3b6', q: '#c96a8a', y: '#f4cf52', o: '#d9952f', v: '#a98be0', u: '#6e56b0', l: '#7fb6ea', r: '#d8442c' }

export const POND = {
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

export type Look = typeof POND

export const MARSH: Look = {
  ...POND,
  water: ['#152d3c', '#1d4152', '#28586a', '#3a7584', '#b8dcc4'],
  grass: ['#4a5a2a', '#6a7c33', '#8d9a3c', '#c8c456'],
  earth: ['#33261f', '#5a4330', '#80633f', '#a88a58'],
  pad: ['#24543a', '#357244', '#52924e', '#92bf62'],
  reed: ['#3f4a20', '#6b7830', '#a09a3c', '#e2cf6a'],
  weed: ['#3d6a3c', '#5a8a46', '#84ac58'],
}

export const ramps = (L: Look) => [L.water, L.grass, L.earth, L.pad, L.reed, L.stone, L.wood, L.head, L.shade, [L.water[1], ...L.weed]]
export const key = (L: Look) => {
  const k: Record<string, string> = { ...L.tints }
  for (const [ramp, ids] of [[L.pad, '1234'], [L.reed, '5678'], [L.stone, 'abcd'], [L.wood, 'efgz'], [L.head, 'hij'], [L.earth, 'mnkt']] as const) [...ids].forEach((ch, i) => k[ch] = ramp[i])
  return k
}
