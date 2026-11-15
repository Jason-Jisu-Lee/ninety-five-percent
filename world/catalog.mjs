import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { crc32, deflateSync } from 'node:zlib'
import { createServer } from 'vite'

globalThis.ImageData = class {
  constructor(w, h) {
    Object.assign(this, { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) })
  }
}
const root = join(import.meta.dirname, '..'), out = join(root, 'assets/sprites')
const vite = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
const load = p => vite.ssrLoadModule(p)
const { u32 } = await load('/core/canvas.ts'), { COLORS, DF, REST: { tilt: REST_TILT } } = await load('/data/dragonfly.ts'), { FOREST: C, UI } = await load('/data/palette.ts')
const { STATS } = await load('/data/stats.ts'), { PREY, TIERS } = await load('/data/stage1/enemies.ts')
const { look } = await load('/world/dragonfly/look.ts'), { size, sprite } = await load('/world/dragonfly/sprite.ts')
const { drawBug } = await load('/world/creatures/draw.ts'), { glyph } = await load('/ui/text.ts')

function png(u, w, h) {
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

const span = ch => {
  const m = glyph(ch).reduce((a, r) => a | r, 0)
  return m ? 5 - Math.log2(m & -m) : 3
}

function board(w, h, bg = 0) {
  const u = new Uint32Array(w * h).fill(bg)
  const g = {
    fillStyle: '',
    fillRect(x, y, rw, rh) {
      for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) if (i >= 0 && j >= 0 && i < w && j < h) u[j * w + i] = u32(this.fillStyle)
    },
  }
  return {
    w, h, u, g,
    blit(src, sw, x, y) {
      src.forEach((v, i) => {
        const px = x + i % sw, py = y + (i / sw | 0)
        if (v && px >= 0 && py >= 0 && px < w && py < h) u[py * w + px] = v
      })
    },
    text(str, x, y, col = UI.text) {
      let cx = Math.round(x - [...str].reduce((n, ch) => n + span(ch) + 1, -1) / 2)
      g.fillStyle = col
      for (const ch of str) {
        glyph(ch).forEach((row, j) => {
          for (let i = 0; i < 5; i++) if (row >> 4 - i & 1) g.fillRect(cx + i, y + j, 1, 1)
        })
        cx += span(ch) + 1
      }
    },
    save(path, k = 8) {
      const W = w * k, big = new Uint32Array(W * h * k)
      for (let i = 0; i < big.length; i++) big[i] = u[(i / W / k | 0) * w + (i % W / k | 0)]
      mkdirSync(dirname(join(out, path)), { recursive: true })
      writeFileSync(join(out, path), png(big, W, h * k))
    },
  }
}

const S = size(DF.scale), NONE = [0, 0], REST = DF.flapFrames, GROUND = u32(C.g1), pad = n => String(n + 1).padStart(2, '0')
const fly = (col, st = NONE, frame = REST, heading = 0, grab = false, tilt = 0) => {
  const [pf, ph] = frame < REST ? [0, DF.hindLead].map(o => DF.amp * Math.sin(2 * Math.PI * frame / REST + o)) : [tilt, tilt]
  return { u: sprite(heading * 2 * Math.PI / DF.headings, pf, ph, look(col, st), DF.lift, grab, DF.scale, frame >= REST).p.u, w: S, h: S }
}
const strip = (frames, path) => {
  const b = board(frames.reduce((n, f) => n + f.w, 0), frames[0].h)
  let x = 0
  for (const f of frames) {
    b.blit(f.u, f.w, x, 0)
    x += f.w
  }
  b.save(path)
}
const grid = (items, cols, cw, ch, draw, path, k = 4) => {
  const b = board(cols * cw, Math.ceil(items.length / cols) * ch, GROUND)
  items.forEach((it, i) => draw(b, it, i % cols * cw, (i / cols | 0) * ch, i))
  b.save(path, k)
}
const bug = (k, n = k.len, { pose = 'out', wings = true } = {}) => {
  const B = 2 * Math.max(k.len, k.wing + k.wide) + 5, b = board(B, B), h = pose === 'rest' ? 0 : 10, m = B >> 1
  drawBug(b.g, k, { x: m, y: m + h * .7, h, ang: -Math.PI / 2, flash: +(pose === 'hit'), seed: 0, wings }, n, pose === 'in' ? .5 / k.beat : 0)
  return b
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const colors = Object.keys(COLORS)
colors.forEach((c, i) => strip([fly(c)], `dragonfly/colors/${pad(i)}_${c}.png`))
grid(colors, 4, 78, 80, (b, c, x, y, i) => {
  b.blit(fly(c).u, S, x + 5, y)
  b.text(`${pad(i)} ${c}`, x + 39, y + 68)
}, 'dragonfly/colors.png')

const PARTS = [['speed', n => [n, 0]], ['power', n => [0, n]], ['', n => [n, n]]]
for (const [s, st] of PARTS) if (s) [1, 2, 3].forEach(n => strip([fly(DF.color, st(n))], `dragonfly/upgrades/${s}_${n}.png`))
grid(PARTS.flatMap(([s, st]) => [0, 1, 2, 3].map(n => [s, st(n), n])), 4, 80, 84, (b, [s, st, n], x, y) => {
  b.blit(fly(DF.color, st).u, S, x + 6, y + 2)
  b.text(`${s ? STATS[s].name : 'Both'} Level ${n * 5 || 1}`, x + 40, y + 71)
}, 'dragonfly/upgrades.png')

strip(Array.from({ length: REST }, (_, f) => fly(DF.color, NONE, f)), 'dragonfly/states/fly.png')
strip([0, REST_TILT, -REST_TILT].map(t => fly(DF.color, NONE, REST, 0, false, t)), 'dragonfly/states/rest.png')
strip([0, 4].map(f => fly(DF.color, NONE, f, 0, true)), 'dragonfly/states/eat.png')
strip(Array.from({ length: 8 }, (_, i) => fly(DF.color, NONE, 2, i * 4)), 'dragonfly/states/turn.png')

const title = { fly: 'housefly' }, cast = Object.entries(PREY).map(([kind, k], i) => ({ k, name: title[kind] ?? kind, dir: `stage1/enemies/${i + 1}_${title[kind] ?? kind}` }))
for (const { k, dir } of cast) {
  const left = [...new Set(Array.from({ length: k.hp - 1 }, (_, i) => Math.max(1, Math.ceil(k.len * (k.hp - 1 - i) / k.hp))))]
  strip([bug(k), bug(k, k.len, { pose: 'in' })], `${dir}/fly.png`)
  strip([bug(k, k.len, { pose: 'hit' })], `${dir}/hit.png`)
  if (k.land) strip([bug(k, k.len, { pose: 'rest' })], `${dir}/rest.png`)
  if (left.length) strip(left.map(n => bug(k, n, { wings: !!k.grip })), `${dir}/eaten.png`)
}
grid(cast, 3, 84, 56, (b, { k, name }, x, y) => {
  const s = bug(k)
  b.blit(s.u, s.w, x + 42 - (s.w >> 1), y + 18 - (s.h >> 1))
  b.text(name, x + 42, y + 34)
  b.text(TIERS[k.tier], x + 42, y + 44, UI.dim)
}, 'stage1/enemies.png', 8)

await vite.close()
