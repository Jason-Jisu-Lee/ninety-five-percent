import { ctx, mk } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLORS, type Color } from '../data/dragonfly/colors'
import { wear } from '../world/dragonfly/sprite/sheet'
import { scene } from '../world/place/place'

const K = Math.max(2, Math.round(2.5 * devicePixelRatio)), CW = 120, CH = 80, SX = 300, SY = 150
const WAYS: [string, string][] = [['#f0d830', 'Yellow, a touch darker than bright yellow'], ['#e6cc28', 'Yellow, darker'], ['#dcc020', 'Yellow, darker still']]
const C = COLORS as Record<string, string[]>
WAYS.forEach(([hex], i) => C['y' + i] = [hex])
const ROWS: [string, string, number?][] = [['azure', 'Blue, for comparison'], ...WAYS.map(([, t], i): [string, string, number] => ['y' + i, t, i + 1]), ['scarlet', 'Red, for comparison']]
const views = ROWS.map(([color, caption, n]) => {
  const fig = document.querySelector('section')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(CW * K, CH * K))
  c.style.width = CW * K / devicePixelRatio + 'px'
  fig.insertAdjacentHTML('beforeend', `<figcaption>${n ? `<b>${n}</b>` : ''}${caption}</figcaption>`)
  const g = ctx(c)
  g.imageSmoothingEnabled = false
  return { g, color: color as Color }
})

function tick() {
  requestAnimationFrame(tick)
  const t = performance.now() / 1000, art = scene(1).art
  for (const v of views) {
    const [spr, sh] = wear(v.color)(4, Math.floor(t * 12) % DF.flapFrames), half = spr.width >> 1
    v.g.setTransform(K, 0, 0, K, -SX * K, -SY * K)
    v.g.drawImage(art, 0, 0)
    v.g.drawImage(sh, SX + CW / 2 + 5 - half, SY + CH / 2 + 8 - half)
    v.g.drawImage(spr, SX + CW / 2 - half, SY + CH / 2 - half)
  }
}
tick()
