import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { ACTS, BH, BW, frame } from '../ui/shop/skill'
import bite from './sounds/bite.wav'
import snap from './sounds/snap.wav'
import ting from './sounds/ting.wav'

const LOOP = 3.6, HIT = ACTS.Lunge.hit, FREEZE = [.06, .11, .17], SOUNDS: [string, string][] = [['Snap', snap], ['Bite', bite], ['Thump and ting', ting]]
const rows = [...document.querySelectorAll('section')], pick = [1, 0]
let last = -1
const held = (t: number, stop: number) => t < HIT ? t : t < HIT + stop ? HIT : t - stop
const play = (n: number) => void Object.assign(new Audio(SOUNDS[n][1]), { volume: .6 }).play().catch(() => {})

function view(row: number, k: number, caption: string, chosen?: () => boolean) {
  const fig = rows[row].appendChild(document.createElement('figure')), g = ctx(fig.appendChild(mk(BW * k, BH * k)))
  fig.insertAdjacentHTML('beforeend', `<figcaption>${caption}</figcaption>`)
  g.imageSmoothingEnabled = false
  return (t: number, stop: number) => {
    fig.classList.toggle('on', !!chosen?.())
    g.fillStyle = UI.night
    g.fillRect(0, 0, BW * k, BH * k)
    if (t < 2.6 + stop) g.drawImage(frame(ACTS.Lunge, held(t, stop)), 0, 0, BW * k, BH * k)
  }
}

const freezes = FREEZE.map((stop, n) => {
  const draw = view(0, 2, `<b>${n + 1}</b>Freeze for ${stop} s`, () => pick[0] === n)
  rows[0].lastElementChild!.addEventListener('click', () => pick[0] = n)
  return draw
})
const keys = SOUNDS.map(([name], n) => {
  const b = rows[1].appendChild(document.createElement('button'))
  b.innerHTML = `<b>${n + 1}</b>${name}`
  b.onclick = () => play(pick[1] = n)
  return b
})
const both = view(2, 3, 'The freeze and the sound you chose above, together'), alone = view(2, 3, 'The same hit with no freeze and no sound')

function tick(now: number) {
  requestAnimationFrame(tick)
  const t = now / 1000 % LOOP, turn = now / 1000 / LOOP | 0
  freezes.forEach((draw, n) => draw(t, FREEZE[n]))
  keys.forEach((b, n) => b.setAttribute('aria-pressed', String(pick[1] === n)))
  both(t, FREEZE[pick[0]])
  alone(t, 0)
  if (t >= HIT && last !== turn) play(pick[1]), last = turn
}
requestAnimationFrame(tick)
