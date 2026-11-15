import { save, store } from '../core/save'

const SCALE = [0, 2, 4, 7, 9], ROOTS = [0, -3, -5, -7], BEAT = .6, hz = (n: number) => 146.83 * 2 ** (n / 12)
let ac: AudioContext | undefined, out: GainNode, wet: GainNode, at = 0, beat = 0

function tone(f: number, len: number, vol: number, soft: boolean) {
  const o = ac!.createOscillator(), g = ac!.createGain()
  o.type = soft ? 'sine' : 'triangle'
  o.frequency.value = f
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(vol, at + (soft ? len * .35 : .02))
  g.gain.exponentialRampToValueAtTime(.0001, at + len)
  o.connect(g).connect(soft ? out : wet)
  o.start(at)
  o.stop(at + len + .05)
}

function tick() {
  at = Math.max(at, ac!.currentTime)
  while (at < ac!.currentTime + .4) {
    if (beat % 8 === 0) for (const n of [0, 7]) tone(hz(ROOTS[beat / 8 % 4] + n), BEAT * 9, .05, true)
    if (Math.random() < (beat % 2 ? .3 : .65)) tone(hz(SCALE[Math.random() * 5 | 0] + 12 * (1 + (Math.random() * 2 | 0))), 1.6, .05, false)
    at += BEAT
    beat++
  }
}

export function wake() {
  if (ac) return void ac.resume()
  ac = new AudioContext()
  const echo = ac.createDelay(), back = ac.createGain()
  out = ac.createGain()
  wet = ac.createGain()
  out.gain.value = +save.music
  echo.delayTime.value = BEAT * .75
  back.gain.value = .35
  out.connect(ac.destination)
  wet.connect(out)
  wet.connect(echo).connect(back).connect(echo)
  back.connect(out)
  setInterval(tick, 150)
}

export function toggle() {
  save.music = !save.music
  store()
  if (ac) out.gain.setTargetAtTime(+save.music, ac.currentTime, .05)
}
