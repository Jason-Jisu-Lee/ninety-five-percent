import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { createServer } from 'vite'
import { boards } from './board.mjs'

globalThis.ImageData = class {
  constructor(w, h) {
    Object.assign(this, { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) })
  }
}
const root = join(import.meta.dirname, '..'), out = join(root, 'assets/sprites')
const vite = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
const load = p => vite.ssrLoadModule(p)
const { u32 } = await load('/core/screen/canvas.ts'), { DF } = await load('/data/dragonfly/body.ts'), { COLORS, COLOR } = await load('/data/dragonfly/colors.ts')
const { REST } = await load('/data/dragonfly/flight.ts'), { STATS } = await load('/data/dragonfly/stats.ts'), { FOREST: C, UI } = await load('/data/look/palette.ts')
const { PREY, TIERS, cast } = await load('/data/enemies/enemies.ts'), { look } = await load('/world/dragonfly/sprite/look.ts'), { size, sprite } = await load('/world/dragonfly/sprite/sprite.ts')
const { drawBug } = await load('/world/creatures/draw.ts'), { glyph } = await load('/ui/text/text.ts')

const board = boards(u32, glyph, UI.text), S = size(DF.scale), NONE = [0, 0], N = DF.flapFrames, pad = n => String(n + 1).padStart(2, '0')
const fly = (col, st = NONE, frame = N, heading = 0, grab = 0, tilt = 0, lean = 0) => {
  const [pf, ph] = frame < N ? [0, DF.hindLead].map(o => DF.amp * Math.sin(2 * Math.PI * frame / N + o)) : [tilt, tilt]
  return { u: sprite(heading * 2 * Math.PI / DF.headings, pf, ph, look(col, st), DF.lift, grab, DF.scale, frame >= N, lean).p.u, w: S, h: S }
}
const strip = (frames, path) => {
  const b = board(frames.reduce((n, f) => n + f.w, 0), frames[0].h)
  frames.reduce((x, f) => (b.blit(f.u, f.w, x, 0), x + f.w), 0)
  b.save(join(out, path))
}
const grid = (items, cols, cw, ch, draw, path, k = 4) => {
  const b = board(cols * cw, Math.ceil(items.length / cols) * ch, u32(C.g1))
  items.forEach((it, i) => draw(b, it, i % cols * cw, (i / cols | 0) * ch, i))
  b.save(join(out, path), k)
}
const bug = (k, n = k.len, pose = 'out', wings = true) => {
  const B = 2 * Math.max(k.len, k.wing + k.wide) + 5, b = board(B, B), h = pose === 'rest' ? 0 : 10, m = B >> 1
  drawBug(b.g, k, { x: m, y: m + h * .7, h, ang: -Math.PI / 2, flash: +(pose === 'hit'), seed: 0, wings }, n, pose === 'in' ? .5 / k.beat : 0)
  return b
}

rmSync(out, { recursive: true, force: true })
const colors = Object.keys(COLORS), PARTS = [['speed', n => [n, 0]], ['power', n => [0, n]], ['', n => [n, n]]]
colors.forEach((c, i) => strip([fly(c)], `dragonfly/colors/${pad(i)}_${c}.png`))
grid(colors, 4, 78, 80, (b, c, x, y, i) => {
  b.blit(fly(c).u, S, x + 5, y)
  b.text(`${pad(i)} ${c}`, x + 39, y + 68)
}, 'dragonfly/colors.png')
for (const [s, st] of PARTS) if (s) [1, 2, 3].forEach(n => strip([fly(COLOR, st(n))], `dragonfly/upgrades/${s}_${n}.png`))
grid(PARTS.flatMap(([s, st]) => [0, 1, 2, 3].map(n => [s, st(n), n])), 4, 80, 84, (b, [s, st, n], x, y) => {
  b.blit(fly(COLOR, st).u, S, x + 6, y + 2)
  b.text(`${s ? STATS[s].name : 'Both'} Level ${n * 5 || 1}`, x + 40, y + 71)
}, 'dragonfly/upgrades.png')
strip(Array.from({ length: N }, (_, f) => fly(COLOR, NONE, f)), 'dragonfly/states/fly.png')
strip([-1, 1].map(lean => fly(COLOR, NONE, 2, 0, 0, 0, lean)), 'dragonfly/states/bank.png')
strip([0, REST.tilt, -REST.tilt].map(t => fly(COLOR, NONE, N, 0, 0, t)), 'dragonfly/states/rest.png')
strip([[0, 1], [2, 2], [4, 1], [6, 2]].map(([f, grab]) => fly(COLOR, NONE, f, 0, grab)), 'dragonfly/states/eat.png')
strip(Array.from({ length: 8 }, (_, i) => fly(COLOR, NONE, 2, i * 4)), 'dragonfly/states/turn.png')

for (const stage of [1, 2]) {
  const list = cast(stage).map((kind, i) => ({ k: PREY[kind], dir: `stage${stage}/enemies/${i + 1}_${kind}` }))
  for (const { k, dir } of list) {
    const left = [...new Set(Array.from({ length: k.len - 1 }, (_, i) => k.len - 1 - i))]
    strip([bug(k), bug(k, k.len, 'in')], `${dir}/fly.png`)
    strip([bug(k, k.len, 'hit')], `${dir}/hit.png`)
    if (k.land) strip([bug(k, k.len, 'rest')], `${dir}/rest.png`)
    if (left.length) strip(left.map(n => bug(k, n, 'out', !!k.grip)), `${dir}/eaten.png`)
  }
  grid(list, 3, 84, 56, (b, { k }, x, y) => {
    const s = bug(k)
    b.blit(s.u, s.w, x + 42 - (s.w >> 1), y + 18 - (s.h >> 1))
    b.text(k.name, x + 42, y + 34)
    b.text(TIERS[k.tier], x + 42, y + 44, UI.dim)
  }, `stage${stage}/enemies.png`, 8)
}
await vite.close()
