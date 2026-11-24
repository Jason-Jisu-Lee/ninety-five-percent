import './start/fresh'
import { figure } from './start/figure'

const SOUNDS = [
  ['Bubble', 'A quick rising blip, like a bubble'],
  ['Cork', 'A falling blip with a small click, like a cork'],
  ['Low bubble', 'The bubble, lower and rounder'],
  ['Tock', 'A short dry click, like a tongue click'],
  ['Wood pop', 'A small knock, a cousin of the shop button tap'],
  ['Air puff', 'A short breath of air, no pitch'],
  ['Double bubble', 'Two quick bubbles, the second higher'],
  ['Bubble and tone', 'The bubble with the soft menu tone under it'],
]
const clips = SOUNDS.map((_, i) => new Audio(`./sounds/pop${i + 1}.wav`)), list = document.querySelector<HTMLElement>('#sounds')!
let pick = 0

function play() {
  const s = clips[pick].cloneNode() as HTMLAudioElement
  s.volume = .6
  s.play().catch(() => {})
}

const whole = figure(document.querySelector<HTMLElement>('#whole')!, 2, play), corner = figure(document.querySelector<HTMLElement>('#corner')!, 3, play, [464, 0, 176, 66])
const buttons = SOUNDS.map(([name, note], i) => {
  const b = list.appendChild(document.createElement('button'))
  b.innerHTML = `<b>${i + 1}</b>${name}<i>${note}</i>`
  b.onclick = () => {
    pick = i
    buttons.forEach(o => o.classList.toggle('on', o === b))
    corner.pop()
  }
  return b
})
buttons[0].classList.add('on')

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (at - last) / 1000)
  last = at
  whole.frame(dt)
  corner.frame(dt)
}
requestAnimationFrame(tick)
