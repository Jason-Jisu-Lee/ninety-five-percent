import { ctx, mk } from '../core/screen/canvas'
import { DF } from '../data/dragonfly/body'
import { COLOR } from '../data/dragonfly/colors'
import { FLY } from '../data/dragonfly/flight'
import { W } from '../data/look/screen'
import { wear } from '../world/dragonfly/sprite/sheet'
import { place } from '../world/place/place'

const K = 2, VH = 120, Y0 = 130, START = 420, HOME = 205, SPEED = FLY.top * FLY.dash
const OPTIONS: [name: string, note: string][] = [
  ['Wings', 'A fast wing flutter that fades as it leaves. The style of flying insects in Hollow Knight'],
  ['Low wings', 'A deeper flutter with a soft hum under it, for a heavier dragonfly'],
  ['Wings flying off', 'The flutter drops in pitch and goes dull, the way a real one sounds as it leaves'],
  ['Quick whoosh', 'One short rush of air. The style of a dash in Hollow Knight or Celeste'],
  ['Wind gust', 'A slower, longer swell of air. The style of a glider taking off in Breath of the Wild'],
  ['Flap, flap, whoosh', 'Two wing beats, then the rush. The style of a bird taking off in Zelda'],
  ['Whoosh with wings', '1 and 4 together'],
  ['Rising note', 'One soft note sliding up. The style of a jump or float in Mario and Kirby'],
  ['Rising note with air', '8 and 4 together'],
  ['Twinkle', 'Five soft bell notes going up. The style of a fairy leaving in Zelda'],
  ['Chip run', 'Six quick square notes going up. The style of an old console warp'],
  ['Wings with twinkle', '1 and 10 together'],
]
const c = document.querySelector('canvas')!, g = ctx(c), low = ctx(mk(W, VH)), buttons: HTMLButtonElement[] = []
let x = START, v = 0, gone = true, last = 0, playing: HTMLAudioElement | undefined
c.width = W * K
c.height = VH * K
g.imageSmoothingEnabled = false

OPTIONS.forEach(([name, note], i) => {
  const b = document.getElementById('options')!.appendChild(document.createElement('button')), sound = new Audio(`./sounds/feast${i + 1}.wav`)
  b.innerHTML = `<b>${i + 1}</b>${name}<i>${note}</i>`
  buttons.push(b)
  b.onclick = () => {
    playing?.pause()
    playing = sound
    sound.currentTime = 0
    sound.play()
    ;[x, v, gone] = [START, 0, false]
    buttons.forEach(o => o.classList.toggle('on', o === b))
  }
})

function frame(ms: number) {
  const dt = Math.min(.05, (ms - last) / 1000), still = gone && x >= START, [spr, sh] = wear(COLOR)(still ? 0 : DF.headings * .75, (ms / 1000 * 24 | 0) % DF.flapFrames)
  last = ms
  if (!gone) {
    v = Math.min(SPEED, v + SPEED * dt / .35)
    x -= v * dt
    if (x < -60) [gone, x] = [true, START + 400]
  } else if (x > START) x = Math.max(START, x - 300 * dt)
  low.drawImage(place().art, 0, -Y0)
  low.drawImage(sh, Math.round(x + FLY.height * .45) - (sh.width >> 1), HOME - Y0 - (sh.height >> 1))
  low.drawImage(spr, Math.round(x) - (spr.width >> 1), HOME - Y0 - Math.round(FLY.height * .7) - (spr.height >> 1))
  g.drawImage(low.canvas, 0, 0, W * K, VH * K)
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
