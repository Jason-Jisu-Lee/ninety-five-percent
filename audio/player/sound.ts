import thump from '../../assets/audio/effects/thump.wav'
import tired from '../../assets/audio/effects/tired.wav'
import { save } from '../../core/save/save'

const LOUD = .6, FILES = { thump: new Audio(thump), tired: new Audio(tired) }

export function sound(name: keyof typeof FILES) {
  const el = FILES[name]
  if (save.mute || !save.fx) return
  el.volume = Math.min(1, (save.fx / 5) ** 2 * LOUD)
  el.currentTime = 0
  el.play().catch(() => {})
}
