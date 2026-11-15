import becoming from '../assets/audio/soundtrack/02_becoming_2.ogg'
import wing from '../assets/audio/soundtrack/03_on_the_wing.ogg'
import anthem from '../assets/audio/soundtrack/11_ninety_five.ogg'
import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { nav } from '../ui/nav/nav'
import { text } from '../ui/text/text'
import { ground } from '../world/stage1/scenery/ground'
import { bars } from './bars'
import { disc } from './disc'
import { grid } from './grid'
import { hear, sound } from './hear'
import { mirror } from './mirror'
import { player } from './player'
import { spectrum } from './spectrum'

const TRACKS = [['Becoming II', becoming], ['On the Wing', wing], ['Ninety-Five', anthem]]
const KINDS = [['Bars', bars], ['Spectrum', spectrum], ['Mirror', mirror], ['Player', player], ['Disc', disc], ['Pixel bars', grid]] as const
const LEFT = 380, WIDE = W - LEFT, TALL = 34, bins = new Uint8Array(512), el = new Audio(), buttons = nav([]), hint = document.querySelector('p')!
const cards = KINDS.map(() => {
  const box = document.querySelector('main')!.appendChild(document.createElement('div'))
  return [box.appendChild(mk(WIDE, TALL)), box.appendChild(mk(1, 1))]
})
const tabs = TRACKS.map(([name], i) => {
  const b = document.querySelector('nav')!.appendChild(document.createElement('button'))
  b.textContent = name
  b.onclick = () => play(i)
  return b
})
let ac: AudioContext | undefined, scope: AnalyserNode, at = 0, last = 0, k = 4

function play(i: number) {
  at = i % TRACKS.length
  el.src = TRACKS[at][1]
  tabs.forEach((b, n) => b.classList.toggle('on', n === at))
  start()
}

function start() {
  if (!ac) {
    ac = new AudioContext()
    scope = ac.createAnalyser()
    scope.fftSize = 1024
    scope.smoothingTimeConstant = .5
    scope.maxDecibels = -10
    ac.createMediaElementSource(el).connect(scope).connect(ac.destination)
  }
  ac.resume()
  el.play().then(() => hint.hidden = true, () => hint.hidden = false)
}

function fit() {
  const zoom = Math.max(2, Math.floor(Math.min((innerWidth - 24) / WIDE, (innerHeight - 90) / KINDS.length / (TALL + 2))))
  k = zoom * (devicePixelRatio || 1)
  for (const [lo, hi] of cards) {
    lo.style.width = WIDE * zoom + 'px'
    hi.width = WIDE * k
    hi.height = TALL * k
  }
}

function frame(now: number) {
  requestAnimationFrame(frame)
  const dt = Math.min(.05, (now - last) / 1000)
  last = now
  if (ac && !el.paused) scope.getByteFrequencyData(bins)
  else bins.fill(0)
  hear(bins, dt)
  sound.at = el.currentTime / (el.duration || 1)
  KINDS.forEach(([name, draw], i) => {
    const lo = ctx(cards[i][0]), hi = ctx(cards[i][1])
    lo.setTransform(1, 0, 0, 1, -LEFT, 0)
    lo.drawImage(ground(), 0, 0)
    buttons.draw(lo, false, false)
    text(lo, String(i + 1), LEFT + 8, 24, UI.text, undefined, UI.panel, 2)
    text(lo, name, LEFT + 26, 20, UI.text, undefined, UI.panel)
    hi.setTransform(1, 0, 0, 1, 0, 0)
    hi.clearRect(0, 0, hi.canvas.width, hi.canvas.height)
    hi.setTransform(k, 0, 0, k, -LEFT * k, 0)
    draw(lo, hi, W - 71, TRACKS[at][0], sound, dt, k)
  })
}

el.onended = () => play(at + 1)
addEventListener('pointerdown', () => el.paused && start())
addEventListener('resize', fit)
fit()
play(0)
requestAnimationFrame(frame)
