import { pointer } from '../core/screen/pointer'
import { figure } from './lair/figure'
import { WAYS } from './lair/ways'

const SOUNDS = [
  ['Knock and tone', 'The shop button knock with the soft menu tone after it'],
  ['Two notes up', 'Two short soft notes, a small cousin of the quest sound'],
  ['Gulp', 'A quick swallow: down, then up'],
  ['Bite', 'A short dry crunch with a low thump'],
  ['Heartbeat', 'Two low thumps'],
  ['Stamp', 'One firm low thump with a click'],
  ['Soft bell', 'One clear note that rings out'],
  ['Coin', 'Two quick high notes, the classic pickup'],
]
const clips = SOUNDS.map((_, i) => new Audio(`./sounds/buy${i + 1}.wav`)), list = document.querySelector<HTMLElement>('#sounds')!, host = document.querySelector('section')!, seen = new Set<Element>()
let pick = 0

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
pointer(2, devicePixelRatio)

const figs = WAYS.map((_, n) => figure(host, n, play))
const watch = new IntersectionObserver(all => all.forEach(e => seen[e.isIntersecting ? 'add' : 'delete'](e.target)), { threshold: .2 })
figs.forEach(f => watch.observe(f.fig))

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (at - last) / 1000)
  last = at
  for (const f of figs) if (seen.has(f.fig)) f.frame(dt)
}
requestAnimationFrame(tick)
