import thump from '../assets/audio/effects/thump.wav'
import song from '../assets/audio/soundtrack/02_ninety_five.ogg'
import one from './sounds/tired1.wav'
import two from './sounds/tired2.wav'
import three from './sounds/tired3.wav'

const LOUD = .6, music = Object.assign(new Audio(song), { loop: true, volume: LOUD })
const add = (to: string, label: string, run: (b: HTMLButtonElement) => void) => {
  const b = document.getElementById(to)!.appendChild(document.createElement('button'))
  b.innerHTML = label
  b.onclick = () => run(b)
}
const play = (src: string) => () => void Object.assign(new Audio(src), { volume: LOUD }).play().catch(() => {})

;[['One soft low note', one], ['One soft puff', two], ['Two soft puffs', three]].forEach(([name, src], n) => add('options', `<b>${n + 1}</b>${name}`, play(src)))
add('context', 'The Lunge thump that is in the game now', play(thump))
add('context', 'Game music under it: off', b => {
  if (music.paused) music.play().catch(() => {})
  else music.pause()
  b.textContent = `Game music under it: ${music.paused ? 'off' : 'on'}`
  b.setAttribute('aria-pressed', String(!music.paused))
})
