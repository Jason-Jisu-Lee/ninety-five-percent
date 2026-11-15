import becoming from '../assets/audio/soundtrack/02_becoming_2.ogg'
import wing from '../assets/audio/soundtrack/03_on_the_wing.ogg'
import anthem from '../assets/audio/soundtrack/11_ninety_five.ogg'
import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { W } from '../data/look/screen'
import { nav } from '../ui/nav/nav'
import { text } from '../ui/text/text'
import { ground } from '../world/stage1/scenery/ground'
import { equalizer } from './equalizer'
import { hear, sound } from './hear'
import { lens } from './lens'
import { meter } from './meter'
import { pond } from './pond'
import { pulse } from './pulse'

const TRACKS = [['Becoming II', becoming], ['On the Wing', wing], ['Ninety-Five', anthem]], KINDS = [['Equalizer', equalizer], ['Meter', meter], ['Pond', pond], ['Pulse', pulse], ['Lens', lens]] as const
const LEFT = 380, WIDE = W - LEFT, TALL = 34, bins = new Uint8Array(512), el = new Audio(), buttons = nav([]), hint = document.querySelector('p')!
const cards = KINDS.map(() => document.querySelector('main')!.appendChild(mk(WIDE, TALL)))
const tabs = TRACKS.map(([name], i) => {
  const b = document.querySelector('nav')!.appendChild(document.createElement('button'))
  b.textContent = name
  b.onclick = () => play(i)
  return b
})
let ac: AudioContext | undefined, scope: AnalyserNode, at = 0, last = 0

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
  const k = Math.max(2, Math.floor(Math.min((innerWidth - 24) / WIDE, (innerHeight - 90) / KINDS.length / (TALL + 2))))
  for (const c of cards) c.style.width = WIDE * k + 'px'
}

function frame(now: number) {
  requestAnimationFrame(frame)
  const dt = Math.min(.05, (now - last) / 1000)
  last = now
  if (ac && !el.paused) scope.getByteFrequencyData(bins)
  else bins.fill(0)
  hear(bins, dt)
  KINDS.forEach(([name, draw], i) => {
    const g = ctx(cards[i])
    g.setTransform(1, 0, 0, 1, -LEFT, 0)
    g.drawImage(ground(), 0, 0)
    buttons.draw(g, false, false)
    text(g, String(i + 1), LEFT + 8, 24, UI.text, undefined, UI.panel, 2)
    text(g, name, LEFT + 26, 20, UI.text, undefined, UI.panel)
    draw(g, W - 71, TRACKS[at][0], sound, dt)
  })
}

el.onended = () => play(at + 1)
addEventListener('pointerdown', () => el.paused && start())
addEventListener('resize', fit)
fit()
play(0)
requestAnimationFrame(frame)
