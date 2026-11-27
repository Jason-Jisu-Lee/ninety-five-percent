import bought from '../../assets/audio/effects/buy.wav'
import cork from '../../assets/audio/effects/cork.wav'
import cry from '../../assets/audio/effects/cry.wav'
import feast from '../../assets/audio/effects/feast.wav'
import hover from '../../assets/audio/effects/hover.wav'
import quest from '../../assets/audio/effects/quest.wav'
import tap from '../../assets/audio/effects/tap.wav'
import thump from '../../assets/audio/effects/thump.wav'
import tired from '../../assets/audio/effects/tired.wav'
import { save } from '../../core/save/save'

const LOUD = .6, FILES = { buy: new Audio(bought), cork: new Audio(cork), cry: new Audio(cry), thump: new Audio(thump), tired: new Audio(tired), quest: new Audio(quest), feast: new Audio(feast), hover: new Audio(hover), tap: new Audio(tap) }, MANY = ['hover', 'tap', 'buy']

export function sound(name: keyof typeof FILES) {
  const el = MANY.includes(name) ? FILES[name].cloneNode() as HTMLAudioElement : FILES[name]
  if (save.mute || !save.fx) return
  el.volume = Math.min(1, (save.fx / 5) ** 2 * LOUD)
  el.currentTime = 0
  el.play().catch(() => {})
}
