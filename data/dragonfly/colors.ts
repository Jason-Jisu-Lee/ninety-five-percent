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

export const COLOR: Color = 'azure'
export const JAW = '#c9a45c'
export const WING = { fill: '#cfe6e4', vein: '#8fc4c2', sheen: '#f3faf8', costa: '#344244', stigma: '#181e1e', outline: '#14301f', shadow: '#14301f' }
