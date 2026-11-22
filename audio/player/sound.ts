import thump from '../../assets/audio/effects/thump.wav'
import { save } from '../../core/save/save'

const LOUD = .6, FILES = { thump: new Audio(thump) }

export function sound(name: keyof typeof FILES) {
  const el = FILES[name]
  if (!save.music) return
  el.volume = Math.min(1, (save.vol / 5) ** 2 * LOUD)
  el.currentTime = 0
  el.play().catch(() => {})
}
