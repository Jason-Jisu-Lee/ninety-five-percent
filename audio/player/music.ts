import becoming from '../../assets/audio/soundtrack/01_becoming_2.ogg'
import anthem from '../../assets/audio/soundtrack/02_ninety_five.ogg'
import wing from '../../assets/audio/soundtrack/03_on_the_wing.ogg'
import { save, store } from '../../core/save/save'
import { hear } from './hear'

const FRONT = [['Becoming II', becoming]], GAME = [['Ninety-Five', anthem], ['On the Wing', wing]], bins = new Uint8Array(512), LOUD = .6
let ac: AudioContext | undefined, el: HTMLAudioElement, out: GainNode, scope: AnalyserNode, list = FRONT, at = 0

const level = () => save.music ? (save.vol / 5) ** 2 * LOUD : 0
const go = () => void (save.music && el.play().catch(() => {}))

function play(i: number) {
  at = i % list.length
  el.src = list[at][1]
  go()
}

export function wake() {
  if (ac) return void (ac.resume(), go())
  ac = new AudioContext()
  el = new Audio()
  out = ac.createGain()
  scope = Object.assign(ac.createAnalyser(), { fftSize: 1024, smoothingTimeConstant: .5, maxDecibels: -10 })
  out.gain.value = level()
  ac.createMediaElementSource(el).connect(scope).connect(out).connect(ac.destination)
  el.onended = () => play(at + 1)
  play(0)
}

export function mood(game: boolean) {
  const next = game ? GAME : FRONT
  if (next === list) return
  ;[list, at] = [next, 0]
  if (!ac) return
  out.gain.setTargetAtTime(0, ac.currentTime, .1)
  setTimeout(() => {
    play(0)
    out.gain.setTargetAtTime(level(), ac!.currentTime, .1)
  }, 400)
}

export function tune(vol = save.vol, on = vol > 0) {
  Object.assign(save, { vol: vol || save.vol, music: on })
  store()
  if (!ac) return
  out.gain.setTargetAtTime(level(), ac.currentTime, .05)
  if (on) go()
  else el.pause()
}

export function listen(dt: number) {
  if (ac && !el.paused) scope.getByteFrequencyData(bins)
  else bins.fill(0)
  hear(bins, dt)
}

export const toggle = () => tune(save.vol, !save.music)
export const playing = () => ac && save.music ? list[at][0] : ''
