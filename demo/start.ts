import './start/fresh'
import { CIRCLES } from './start/circle'
import { figure, type Opt } from './start/figure'
import { HINTS } from './start/hint'
import { POOFS } from './start/poof'

const PARTS: Record<string, { head: string[]; wide: boolean; list: Opt[] }> = {
  circle: {
    head: ['Three ways the circle could open. Each picture plays the whole start at the timing you gave: 0 s dragonfly lit and music, 2 s circle opens and the world moves, 5 s quest, 6 s control and hint', 'Each also plays the quest poof and the hint with the same number, so you see everything together. Pick the circle here, the poof and the hint on their own tabs. Click a picture to play it again. No sound here. Nothing here is in the game'],
    wide: false,
    list: CIRCLES.map((c, i) => ({ n: i + 1, name: c.name, note: c.note, circle: i, poof: i, hint: i, from: 0, zoom: 2 })),
  },
  poof: {
    head: ['Three ways the quest could appear. The top right corner of the screen at 3 times size, on a loop', 'Click a picture to play it again. No sound here. Nothing here is in the game'],
    wide: true,
    list: POOFS.map((p, i) => ({ n: i + 1, name: p.name, note: p.note, circle: -1, poof: i, hint: -1, from: 4.2, until: 7.6, zoom: 3, crop: [464, 0, 176, 66] })),
  },
  hint: {
    head: ['Three ways to show "put the pointer on a fruit fly, then press A" without words. Each starts when control starts and ends at the first bite', 'The white arrow is a pretend player who waits, moves onto a fruit fly, waits again and presses A. Click a picture to play it again. Nothing here is in the game'],
    wide: false,
    list: HINTS.map((h, i) => ({ n: i + 1, name: h.name, note: h.note, circle: -1, poof: -1, hint: i, from: 5.4, zoom: 2 })),
  },
}

const part = PARTS[new URLSearchParams(location.search).get('v') ?? ''] ?? PARTS.circle, host = document.querySelector('section')!, seen = new Set<Element>()
document.querySelector('header')!.innerHTML = part.head.map(h => `<h2>${h}</h2>`).join('')
host.classList.toggle('wide', part.wide)
const figs = part.list.map(o => figure(host, o))
const watch = new IntersectionObserver(all => all.forEach(e => {
  if (e.isIntersecting && !seen.has(e.target)) figs.find(f => f.fig === e.target)!.reset()
  seen[e.isIntersecting ? 'add' : 'delete'](e.target)
}), { threshold: .3 })
figs.forEach(f => watch.observe(f.fig))

let last = -1
function tick(at: number) {
  requestAnimationFrame(tick)
  const dt = last < 0 ? 0 : Math.min(.05, (at - last) / 1000)
  last = at
  for (const f of figs) if (seen.has(f.fig)) f.frame(dt)
}
requestAnimationFrame(tick)
