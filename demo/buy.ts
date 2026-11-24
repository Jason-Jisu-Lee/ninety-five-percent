import { adopt, save } from '../core/save/save'
import { ctx, mk } from '../core/screen/canvas'
import { pointer } from '../core/screen/pointer'
import { H, W } from '../data/look/screen'
import { shop } from '../ui/shop/shop'

const K = 2, RICH = 500
const SOUNDS = [
  ['Coin', 'Two chip notes, the second ringing: the pattern of the coin in Super Mario Bros.'],
  ['Rupee', 'Three very fast chip notes: the pattern of the rupee in The Legend of Zelda'],
  ['Cash register', 'A clack, then a bell: the ka-ching of the shop in Balatro and Brotato'],
  ['Coin purse', 'Four coins clinking: paying a vendor in World of Warcraft or Diablo'],
  ['Glass clink', 'One short glassy clink: picking up Geo in Hollow Knight'],
  ['Ding', 'One clean high ding: an experience orb in Minecraft'],
  ['Thud and ring', 'A low thud with a metal ring: spending a skill point in Diablo II'],
  ['Blip', 'One chip note jumping an octave: buying a power up in Vampire Survivors'],
]
const clips = SOUNDS.map((_, i) => new Audio(`./sounds/buy${i + 1}.wav`)), list = document.querySelector<HTMLElement>('#sounds')!, c = document.querySelector('figure')!.appendChild(mk(W * K, H * K)), out = ctx(c), low = ctx(mk(W, H)), view = shop(false)
let pick = 0, mine = { blood: RICH, levels: {} as Record<string, number> }, at = [-1, -1]

function play() {
  const s = clips[pick].cloneNode() as HTMLAudioElement
  s.volume = .6
  s.play().catch(() => {})
}

const buttons = SOUNDS.map(([name, note], i) => {
  const b = list.appendChild(document.createElement('button'))
  b.innerHTML = `<b>${i + 1}</b>${name}<i>${note}</i>`
  b.onclick = () => {
    pick = i
    buttons.forEach(o => o.classList.toggle('on', o === b))
    play()
  }
  return b
})
buttons[0].classList.add('on')
pointer(K, devicePixelRatio)

const load = () => adopt({ color: save.color, fed: true, blood: mine.blood, levels: mine.levels })
const open = () => view.open(0, () => {
  mine = { blood: RICH, levels: {} }
  open()
})
c.onpointermove = e => at = [e.offsetX / K, e.offsetY / K]
c.onpointerleave = () => at = [-1, -1]
c.onpointerdown = e => {
  at = [e.offsetX / K, e.offsetY / K]
  load()
  const had = save.blood
  view.hover(at[0], at[1])
  view.click()
  if (save.blood < had) play()
  mine = { blood: save.blood, levels: { ...save.levels } }
}

function tick() {
  requestAnimationFrame(tick)
  load()
  view.hover(at[0], at[1])
  view.draw(low)
  out.imageSmoothingEnabled = false
  out.drawImage(low.canvas, 0, 0, W * K, H * K)
}
open()
requestAnimationFrame(tick)
