import { ctx, mk, type Ctx } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { H, W } from '../data/look/screen'
import { SHOP } from '../data/shop/shop'
import { price } from '../core/save/save'
import { frame } from '../ui/parts/frame'
import { orb } from '../ui/parts/icons'
import { head } from '../ui/shop/head'
import { text, width } from '../ui/text/text'

type Tab = { name: string; lock?: boolean; mark?: boolean }

const K = 2, L = 32, R = W - L, GAP = 26, VW = 400, VH = 112, TOP = 14, FAINT = '#59635c', TABS = SHOP.filter(t => t.shop === 'Blood shop'), HIDE = 'Appetite'
const LOCK = ['..###..', '.#...#.', '.#...#.', '#######', '###.###', '###.###', '#######']
const all = TABS.map(t => ({ name: t.name })), rest = all.filter(t => t.name !== HIDE), swap = (to: Tab) => all.map(t => t.name === HIDE ? to : t)

const OPTIONS: [name: string, note: string, tabs: Tab[]][] = [
  ['Five tabs, Appetite showing', 'What the game has', all],
  ['A padlock at the end of the row', 'One quiet locked slot after the last tab. The usual sign in action and role playing games', [...rest, { name: '', lock: true }]],
  ['Question marks at the end of the row', 'A mystery slot, the style of Vampire Survivors and Cookie Clicker', [...rest, { name: '???', mark: true }]],
  ['Padlock and question marks at the end', 'Both signs together, the clearest of the three', [...rest, { name: '???', lock: true }]],
  ['Padlock and question marks where the tab was', 'The locked slot keeps its place, so nothing moves when it opens', swap({ name: '???', lock: true })],
  ['Its real name, greyed, with a padlock', 'The name itself is the teaser. Common in skill trees', swap({ name: HIDE, lock: true })],
]

function lock(g: Ctx, x: number, y: number) {
  g.fillStyle = FAINT
  LOCK.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(x + i, y + j, 1, 1)
  })
}

function draw(g: Ctx, tabs: Tab[]) {
  let x = L
  g.fillStyle = UI.night
  g.fillRect(0, 0, W, H)
  head(g, 'Blood shop', 0, L, R)
  tabs.forEach((t, i) => {
    const shut = t.lock || t.mark
    if (t.lock) lock(g, x, 61)
    text(g, t.name, x + (t.lock ? 10 : 0), 68, shut ? FAINT : i ? UI.dim : UI.text)
    if (!i) {
      g.fillStyle = UI.gold
      g.fillRect(x, 72, width(t.name), 1)
    }
    x += (t.lock ? t.name ? 10 : 7 : 0) + width(t.name) + GAP
  })
  text(g, TABS[0].note, L, 88, UI.dim)
  TABS[0].items.slice(0, 2).forEach((it, i) => {
    const y = 98 + i * 20, p = String(price(it.name))
    frame(g, L, y, 184, 17, false)
    text(g, it.name, L + 7, y + 12, UI.text)
    text(g, p, L + 177, y + 12, UI.dim, 'r')
    orb(g, L + 172 - width(p), y + 8, UI.dim)
  })
}

OPTIONS.forEach(([name, note, tabs], n) => {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(VW * K, VH * K)), g = ctx(c), low = ctx(mk(W, H))
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n || 'Now'}</b>${name}<br><i>${note}</i></figcaption>`)
  fig.style.width = VW * K + 4 + 'px'
  g.imageSmoothingEnabled = false
  draw(low, tabs)
  g.drawImage(low.canvas, 0, TOP, VW, VH, 0, 0, VW * K, VH * K)
})
