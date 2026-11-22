export const COLORS = {
  azure: ['#7fd4f2'],
  emerald: ['#5fc06a'],
  scarlet: ['#d8442c'],
  amber: ['#e2a634'],
}

export type Color = keyof typeof COLORS

export const COLOR: Color = 'azure'
export const HUES: [color: Color, name: string, stage: number, note?: string][] = [
  ['azure', 'Blue', 1], ['emerald', 'Green', 1], ['scarlet', 'Red', 1], ['amber', 'Amber', 2, 'available after reaching Marsh for the first time'],
]
export const JAW = '#c9a45c'
export const WING = { fill: '#cfe6e4', vein: '#8fc4c2', costa: '#344244', stigma: '#181e1e', outline: '#14301f', shadow: '#14301f' }
