import { crc32, deflateSync } from 'node:zlib'

export function png(u, w, h) {
  const raw = Buffer.alloc((w * 4 + 1) * h), bytes = Buffer.from(u.buffer), head = Buffer.alloc(13)
  for (let y = 0; y < h; y++) bytes.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4)
  const chunk = (type, data) => {
    const b = Buffer.alloc(12 + data.length)
    b.writeUInt32BE(data.length)
    b.write(type, 4, 'latin1')
    data.copy(b, 8)
    b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length)
    return b
  }
  head.writeUInt32BE(w)
  head.writeUInt32BE(h, 4)
  head.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', head), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}
