import { FLY, STAMINA } from '../data/dragonfly/flight'
import { BASE, STAT, type Stat } from '../data/dragonfly/stats'
import { PREY } from '../data/enemies/enemies'
import { H, W } from '../data/look/screen'
import type { Prey } from '../world/creatures/prey'
import { hunt } from '../world/stage1/hunt/hunt'
import { render } from '../world/stage1/render'

const UPGRADES: [name: string, stat: Stat, each: number, max: number, says: string][] = [
  ['Sharp Mandibles', 'power', 20, 5, '+20% power each'],
  ['Sharper Mandibles', 'power', 60, 2, '+60% power each'],
  ['Hard Shell', 'health', 20, 5, '+20% health each'],
  ['Harder Shell', 'health', 60, 2, '+60% health each'],
  ['Thick Hide', 'armour', 20, 3, '20% less damage taken each'],
  ['Long Wings', 'speed', 10, 5, '+10% speed each'],
  ['Longer Wings', 'speed', 25, 2, '+25% speed each'],
  ['Split Wingbeat', 'turn', 30, 2, '+30% turning each'],
  ['Counterweight Tail', 'accel', 25, 5, '+25% acceleration each'],
  ['Wide Spiracles', 'stamina', 20, 5, '+20% stamina each'],
  ['Wider Spiracles', 'stamina', 60, 2, '+60% stamina each'],
  ['Long Reach', 'reach', 50, 1, '+50% catch reach'],
  ['Warm Blood', 'rest', 25, 1, 'rest restores 25% faster'],
  ['Slow Mend', 'mend', 50, 1, '1% stamina and health every 2 seconds in flight'],
]

const $ = <T extends HTMLElement>(q: string) => document.querySelector<T>(q)!
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, into: HTMLElement, say = '') => Object.assign(into.appendChild(document.createElement(tag)), { textContent: say })
const cv = $<HTMLCanvasElement>('canvas'), g = cv.getContext('2d')!, pct = (v: number) => Math.round(v * 100) + '%'
let sim = hunt(), clock = 0, last = 0, hot: Prey | null = null, mouse: [number, number] | null = null

const rows = UPGRADES.map(([name, , , max, says]) => {
  el('span', $('#rows'), name)
  const slide = Object.assign(el('input', $('#rows')), { type: 'range', min: '0', max: String(max), value: '0' }), level = el('b', $('#rows'))
  el('i', $('#rows'), says)
  slide.oninput = apply
  return { slide, level, max }
})
const facts = ['Power', 'Health', 'Damage taken', 'Top speed', 'Turning', 'Acceleration', 'Stamina', 'Catch reach', 'Rest', 'Mend in flight'].map(name => (el('span', $('#now'), name), el('span', $('#now'))))

function apply() {
  Object.assign(STAT, BASE)
  UPGRADES.forEach(([, stat, each], i) => STAT[stat] += each * +rows[i].slide.value / 100)
  rows.forEach(r => r.level.textContent = `${r.slide.value}/${r.max}`)
  ;[
    pct(STAT.power), pct(STAT.health), pct(1 - STAT.armour), `${pct(STAT.speed)}, ${Math.round(FLY.top * STAT.speed)} pixels a second`,
    `${pct(STAT.turn)}, ${Math.round(FLY.turn * STAT.turn * 180 / Math.PI)} degrees a second`, pct(STAT.accel),
    `${pct(STAT.stamina)}, ${Math.round(100 / STAMINA.sprint * STAT.stamina)} seconds at top speed`, `${pct(STAT.reach)}, ${Math.round(FLY.catch * STAT.reach)} pixels`,
    pct(STAT.rest), STAT.mend ? `1% every ${Math.round(1 / STAT.mend)} seconds` : 'none',
  ].forEach((say, i) => facts[i].textContent = say)
}

const set = (to: (max: number) => number) => () => {
  rows.forEach(r => r.slide.value = String(to(r.max)))
  apply()
}
el('button', $('nav'), 'All min').onclick = set(() => 0)
el('button', $('nav'), 'All max').onclick = set(max => max)
el('button', $('nav'), 'Tire it out').onclick = () => sim.stamina = Math.min(sim.stamina, 3)
el('button', $('nav'), 'Hurt it').onclick = () => sim.health = sim.cap * .2

const at = (e: PointerEvent): [number, number] => {
  const r = cv.getBoundingClientRect()
  return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]
}
cv.onpointermove = e => mouse = at(e)
cv.onpointerleave = () => mouse = null
cv.onpointerdown = e => {
  const p = sim.prey.at(...at(e), hot)
  if (!p) sim.mark = null
  else if (!sim.rest) sim.mark = p
}

function frame(now: number) {
  const dt = Math.min(.05, Math.max(0, (now - last) / 1000))
  requestAnimationFrame(frame)
  last = now
  sim.step(dt, clock += dt)
  if (sim.fell) sim = hunt()
  hot = mouse && sim.prey.at(mouse[0], mouse[1], hot)
  cv.style.cursor = hot ? 'pointer' : ''
  render(g, sim, clock, true, hot)
  const doing = sim.held ? 'Eating a ' + PREY[sim.held.kind].name.toLowerCase() : sim.fly.perched ? 'Resting' : sim.rest ? 'Out of stamina, flying to a rest spot' : sim.mark ? 'Chasing a ' + PREY[sim.mark.kind].name.toLowerCase() : 'Flying about'
  $('#state').textContent = `${doing}. Stamina ${Math.round(sim.stamina)}%. Health ${Math.round(sim.health / sim.cap * 100)}%.`
}

apply()
requestAnimationFrame(frame)
