import becoming from '../../assets/audio/soundtrack/02_becoming_2.ogg'
import wing from '../../assets/audio/soundtrack/03_on_the_wing.ogg'
import anthem from '../../assets/audio/soundtrack/11_ninety_five.ogg'
import { save, store } from '../../core/save/save'

const TRACKS = [['Becoming II', becoming], ['On the Wing', wing], ['Ninety-Five', anthem]], bins = new Uint8Array(512)
let ac: AudioContext | undefined, el: HTMLAudioElement, out: GainNode, scope: AnalyserNode, at = 0

const level = () => save.music ? (save.vol / 5) ** 2 : 0

function play(i: number) {
  at = i % TRACKS.length
  el.src = TRACKS[at][1]
  if (save.music) el.play()
}

export function wake() {
  if (ac) return void ac.resume()
  ac = new AudioContext()
  el = new Audio()
  out = ac.createGain()
  scope = ac.createAnalyser()
  scope.fftSize = 1024
  scope.smoothingTimeConstant = .5
  scope.maxDecibels = -10
  out.gain.value = level()
  ac.createMediaElementSource(el).connect(scope).connect(out).connect(ac.destination)
  el.onended = () => play(at + 1)
  play(0)
}

export function tune(vol = save.vol, on = vol > 0) {
  Object.assign(save, { vol: vol || save.vol, music: on })
  store()
  if (!ac) return
  out.gain.setTargetAtTime(level(), ac.currentTime, .05)
  if (on) el.play()
  else el.pause()
}

export const toggle = () => tune(save.vol, !save.music)
export const playing = () => ac && save.music ? TRACKS[at][0] : ''

export function beat() {
  scope.getByteFrequencyData(bins)
  return bins
}
