const day = {
  abyss: '#102f42',
  water: ['#173f55', '#1f566b', '#2c7282', '#4b9c9c', '#9fd9cf'],
  grass: ['#24523a', '#2f6b41', '#3a7b49', '#418548', '#5fa352'],
  earth: ['#3a2a26', '#54403a', '#6f5847', '#8d765a'],
  plant: ['#1f4a36', '#3c7d47', '#6aa84f', '#a3c96a'],
  head: ['#3d2a20', '#5d3f2b', '#7d5a3a'],
  pad: ['#235c44', '#2f7a4e', '#4a9a58', '#7dbd6a'],
  stone: ['#414b52', '#66727a', '#8f9a9c', '#bcc4bf'],
  wood: ['#3b2a21', '#5c4331', '#806043'],
  white: '#f1ecdb', pink: '#e79ab0', yellow: '#f0c64a', daisy: '#bdb8a4', gold: '#d0a53c', dry: '#b9a36a', moss: '#56703f', line: '', cast: [2, 3],
}

export type Look = typeof day

export const LOOKS: Look[] = [day, { ...day, line: '#12242a' }]
