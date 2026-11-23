import { ctx, mk } from '../core/screen/canvas'
import { UI } from '../data/look/palette'
import { menu } from '../ui/parts/menu'

const K = 2, VW = 116, VH = 124, LOUD = .6, LABELS = ['Continue', 'Settings', 'Statistics', 'Exit']
const OPTIONS: [name: string, note: string][] = [
  ['Sharp tick', 'A tiny bright click. The commonest menu hover sound, as in Hades'],
  ['Soft tick', 'The same, lower and rounder'],
  ['Double tick', 'Two ticks close together, like a dial moving one notch'],
  ['Wood tap', 'A small knock, in the style of Stardew Valley'],
  ['Low tap', 'A deeper, softer knock, close to the out of stamina sound'],
  ['Brush', 'A short breath of air, like a card lifting in Slay the Spire'],
  ['Wing flick', 'One quick flutter, a short cousin of the Feast sound'],
  ['Soft tone', 'One short round note, in the style of Nintendo menus'],
  ['High tone', 'The same, an octave up and shorter'],
  ['Pluck', 'A soft plucked note, in the style of Celeste'],
]

OPTIONS.forEach(([name, note], n) => {
  const fig = document.getElementById('options')!.appendChild(document.createElement('figure')), c = fig.appendChild(mk(VW * K, VH * K)), g = ctx(c), low = ctx(mk(VW, VH))
  const m = menu(LABELS.map(label => ({ label, run() {} })), 10, VH - 8), sound = new Audio(`./sounds/hover${n + 1}.wav`)
  let was = -1
  const draw = () => {
    low.fillStyle = UI.night
    low.fillRect(0, 0, VW, VH)
    m.draw(low)
    g.drawImage(low.canvas, 0, 0, VW * K, VH * K)
  }
  const move = (x: number, y: number) => {
    const i = m.hover(x, y) ? Math.floor((y - m.top) / 28) : -1
    if (i >= 0 && i !== was) {
      const s = sound.cloneNode() as HTMLAudioElement
      s.volume = LOUD
      s.play()
    }
    was = i
    draw()
  }
  fig.insertAdjacentHTML('beforeend', `<figcaption><b>${n + 1}</b>${name}<i>${note}</i></figcaption>`)
  g.imageSmoothingEnabled = false
  c.onpointermove = e => move(e.offsetX / K, e.offsetY / K)
  c.onpointerleave = () => move(-1, -1)
  draw()
})
