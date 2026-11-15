import { SR } from './tables.mjs'

export function wav(chans, gain) {
  const n = chans[0].length, c = chans.length, b = Buffer.alloc(44 + n * c * 2)
  b.write('RIFF')
  b.writeUInt32LE(36 + n * c * 2, 4)
  b.write('WAVEfmt ', 8)
  b.writeUInt32LE(16, 16)
  b.writeUInt16LE(1, 20)
  b.writeUInt16LE(c, 22)
  b.writeUInt32LE(SR, 24)
  b.writeUInt32LE(SR * c * 2, 28)
  b.writeUInt16LE(c * 2, 32)
  b.writeUInt16LE(16, 34)
  b.write('data', 36)
  b.writeUInt32LE(n * c * 2, 40)
  for (let i = 0; i < n; i++) for (let j = 0; j < c; j++)
    b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(chans[j][i] * gain * 32767 + Math.random() - Math.random()))), 44 + (i * c + j) * 2)
  return b
}
