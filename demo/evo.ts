import { save } from '../core/save/save'
import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { icon } from '../ui/parts/icons'
import { note } from '../ui/parts/note'
import { shop } from '../ui/shop/shop'
import { text, width } from '../ui/text/text'

type Look = { name: string; say: string; top: number; box: number[]; draw: (g: Ctx, hot: boolean) => void }

const WORD = 'Evolution', TIP = [WORD, 'Requires ?????'], VIEW = 130, AFTER = 32 + width('Lair') * 2
const ink = (hot: boolean) => hot ? UI.border : UI.faint, big = width(WORD) * 2, small = width(WORD)

const LOOKS: Look[] = [
  {
    name: 'Second title', say: 'Same size as "Lair", right beside it, dim, with a padlock', top: 0, box: [AFTER + 14, 22, big + 12, 20],
    draw(g, hot) {
      text(g, WORD, AFTER + 14, 38, ink(hot), undefined, undefined, 2)
      icon(g, 'lock', AFTER + 18 + big, 29, ink(hot))
    },
  },
  {
    name: 'Small word', say: 'Normal text size on the title line, right after "Lair"', top: 0, box: [AFTER + 12, 26, small + 14, 14],
    draw(g, hot) {
      text(g, WORD, AFTER + 14, 38, ink(hot))
      icon(g, 'lock', AFTER + 18 + small, 30, ink(hot))
    },
  },
  {
    name: 'Middle of the header', say: 'Normal text size, centered on the title line, away from both ends', top: 0, box: [W / 2 - small / 2 - 8, 26, small + 16, 14],
    draw(g, hot) {
      text(g, WORD, W / 2 - 5, 38, ink(hot), 'c')
      icon(g, 'lock', Math.round(W / 2 + small / 2), 30, ink(hot))
    },
  },
  {
    name: 'Padlock only', say: 'Just a padlock after "Lair"; the word shows only in the hover box', top: 0, box: [AFTER + 8, 24, 16, 16],
    draw: (g, hot) => icon(g, 'lock', AFTER + 12, 29, ink(hot)),
  },
  {
    name: 'Bottom left', say: 'Opposite the Return button, like a way onward', top: H - VIEW, box: [30, H - 40, small + 16, 20],
    draw(g, hot) {
      text(g, WORD, 32, H - 26, ink(hot))
      icon(g, 'lock', 36 + small, H - 34, ink(hot))
    },
  },
]

Object.assign(save, { started: true, fed: true, told: true, quest: 9, blood: 240, levels: { 'Sharp Mandibles': 3, 'Long Wings': 2, 'Wide Spiracles': 1, Lunge: 1 } })

const lair = shop(false), scene = ctx(mk(W, H)), host = document.querySelector('section')!
lair.open(0)

const figs = LOOKS.flatMap((look, i) => [false, true].map(forced => {
  const fig = host.appendChild(document.createElement('figure')), cv = fig.appendChild(mk(W, VIEW)), out = ctx(cv)
  let over = false
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${i + 1}</b>${look.name}${forced ? ', pointer on it' : ''}<i>${forced ? 'How the hover box looks' : look.say + '. Point at it to try'}</i></figcaption>`)
  cv.onmousemove = e => {
    const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * VIEW / r.height + look.top, [bx, by, bw, bh] = look.box
    over = x >= bx && x < bx + bw && y >= by && y < by + bh
  }
  cv.onmouseleave = () => over = false
  return () => {
    const hot = forced || over, [bx, by, , bh] = look.box
    out.setTransform(1, 0, 0, 1, 0, 0)
    out.drawImage(scene.canvas, 0, -look.top)
    out.translate(0, -look.top)
    look.draw(out, hot)
    if (hot) note(out, TIP, bx, look.top ? by - 2 : by + bh + 2, false, !!look.top)
  }
}))

function tick() {
  lair.draw(scene)
  figs.forEach(f => f())
}
const loop = () => {
  tick()
  requestAnimationFrame(loop)
}
Object.assign(window, { tick })
if (!location.search) requestAnimationFrame(loop)
