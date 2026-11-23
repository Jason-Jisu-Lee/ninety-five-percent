import { save, store } from '../../core/save/save'
import { hear } from './hear'
import { FRONT, GAME } from './tracks'

const bins = new Uint8Array(512), LOUD = .6, GAP = 2600
let ac: AudioContext | undefined, el: HTMLAudioElement, out: GainNode, scope: AnalyserNode, list = FRONT, at = 0

const level = () => save.mute ? 0 : (save.vol / 5) ** 2 * LOUD
const go = () => void (save.vol && !quiet && !turn && el.play().catch(() => {}))
let quiet = false, turn = 0, nap = 0

function play(i: number) {
  at = i % list.length
  el.src = list[at][1]
  go()
}

function fade(to: number, rest = false) {
  out.gain.setTargetAtTime(to, ac!.currentTime, .1)
  clearTimeout(nap)
  if (rest) nap = setTimeout(() => el.pause(), 400)
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
  fade(0, true)
  clearTimeout(turn)
  turn = setTimeout(() => {
    turn = 0
    if (quiet) return
    play(0)
    fade(level())
  }, game ? GAP : 400)
}

export function hush(on: boolean, again = true) {
  quiet = on
  if (!ac) return
  fade(on ? 0 : level(), on)
  if (on) return
  if (again) play(0)
  else go()
}

export function mix(kind: 'vol' | 'fx', v: number) {
  Object.assign(save, { [kind]: Math.max(0, Math.min(10, v)), mute: false })
  apply()
}

function apply() {
  store()
  if (!ac) return
  out.gain.setTargetAtTime(quiet ? 0 : level(), ac.currentTime, .05)
  if (save.vol) go()
  else el.pause()
}

export function listen(dt: number) {
  if (ac && !el.paused && level()) scope.getByteFrequencyData(bins)
  else bins.fill(0)
  hear(bins, dt)
}

export function toggle() {
  save.mute = !save.mute
  apply()
}
export const silent = () => save.mute || !(save.vol || save.fx)
export const tracks = () => GAME.map(t => t[0])
export const pick = (i: number) => void (list === GAME && play(i))
export const playing = () => ac && level() ? list[at][0] : ''
