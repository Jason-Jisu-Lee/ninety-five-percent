import { FIGHT } from '../data/dragonfly/fight'
import { FLY, STAMINA } from '../data/dragonfly/flight'
import { STAT, type Stat } from '../data/dragonfly/stats'
import { PREY } from '../data/enemies/enemies'
import { H, W } from '../data/look/screen'
import type { Prey } from '../world/creatures/prey'
import { hunt } from '../world/stage1/hunt/hunt'
import { render } from '../world/stage1/render'

const CM = 3.8, DEG = 180 / Math.PI
const BLOOD: [name: string, stat: Stat, each: number, max: number, says: string][] = [
  ['Sharp Mandibles', 'power', .2, 5, '+20% power each'],
  ['Sharper Mandibles', 'power', .6, 2, '+60% power each'],
  ['Hard Shell', 'health', .2, 5, '+20% health each'],
  ['Harder Shell', 'health', .6, 2, '+60% health each'],
  ['Thick Hide', 'armour', .2, 3, '20% less damage taken each'],
  ['Long Wings', 'speed', .1, 5, '+10% speed each'],
  ['Longer Wings', 'speed', .25, 2, '+25% speed each'],
  ['Split Wingbeat', 'turn', 25, 3, '+25 degrees a second each'],
  ['Counterweight Tail', 'accel', .25, 5, '+25% acceleration each'],
  ['Wide Spiracles', 'stamina', .2, 5, '+20% stamina each'],
  ['Wider Spiracles', 'stamina', .6, 2, '+60% stamina each'],
  ['Warm Blood', 'rest', .25, 1, 'rest restores 25% faster'],
  ['Slow Mend', 'mend', .5, 1, '1% every 2 s while flying'],
]
const BASES: [stat: Stat, max: number, at: (n: number) => number][] = [
  ['power', 9, n => 1 + n], ['health', 9, n => 1 + n], ['speed', 12, n => 1 + n / 4], ['turn', 2, n => 75 + 50 * n],
  ['accel', 6, n => 1 + n / 2], ['stamina', 6, n => 1 + n / 2], ['reach', 1, n => 1 + n],
]
const STATS: [label: string, stat: Stat][] = [
  ['Power', 'power'], ['Health', 'health'], ['Damage taken', 'armour'], ['Top speed', 'speed'], ['Turning', 'turn'], ['Acceleration', 'accel'],
  ['Stamina', 'stamina'], ['Catch reach', 'reach'], ['Rest, stamina', 'rest'], ['Rest, health', 'rest'], ['Mend in flight', 'mend'],
]

const $ = <T extends HTMLElement>(q: string) => document.querySelector<T>(q)!
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, into: HTMLElement, say = '') => Object.assign(into.appendChild(document.createElement(tag)), { textContent: say })
const slider = (into: HTMLElement, max: number) => Object.assign(el('input', into), { type: 'range', min: '0', max: String(max), value: '0', oninput: apply })
const num = (v: number) => String(Math.round(v * 10) / 10), pct = (v: number) => Math.round(v * 100) + '%'
const cv = $<HTMLCanvasElement>('canvas'), g = cv.getContext('2d')!
let sim = hunt(), clock = 0, last = 0, hot: Prey | null = null, mouse: [number, number] | null = null

const blood = BLOOD.map(([name, , , max, says]) => {
  const row = el('div', $('#blood'))
  el('span', row, name)
  const slide = slider(row, max), level = el('b', row)
  el('i', row, says)
  return { row, slide, level, max }
})
for (const say of ['', 'Base value', '', 'With upgrades']) el('i', $('#head'), say)
const stats = STATS.map(([label, stat]) => {
  const row = el('div', $('#stats')), at = BASES.find(b => b[0] === stat)
  el('span', row, label)
  return { row, label, at, slide: at ? slider(row, at[1]) : (el('span', row), null), base: el('b', row), now: el('em', row) }
})

function apply() {
  const add = Object.fromEntries(STATS.map(([, stat]) => [stat, 0])), b = Object.fromEntries(stats.filter(s => s.at).map(s => [s.at![0], s.at![2](+s.slide!.value)]))
  blood.forEach((r, i) => add[BLOOD[i][1]] += BLOOD[i][2] * +r.slide.value)
  const power = b.power * (1 + add.power), health = b.health * (1 + add.health), speed = b.speed * (1 + add.speed), turn = b.turn + add.turn
  const accel = b.accel * (1 + add.accel), stamina = b.stamina * (1 + add.stamina), rest = 1 + add.rest, heal = FIGHT.heal * rest
  const more = (v: number) => v ? ` + ${pct(v)} from the Blood shop` : '', cms = (k: number) => `${Math.round(FLY.top * k / CM)} cm/s`
  const quick = (k: number) => `${num(Math.log(10) / (FLY.accel * k))} s to top speed`, air = (k: number) => `${Math.round(100 / STAMINA.sprint * k)} s at top speed`
  const resting = `Resting restores ${num(STAMINA.regen * rest)}% stamina and ${num(heal * 100)}% of full health a second, which is ${num(health * heal)} health`
  const say: Record<string, [base: string, now: string, tip: string]> = {
    'Power': [num(b.power), `${num(power)} damage a bite`, `Power: base ${num(b.power)}${more(add.power)} = ${num(power)} damage a bite`],
    'Health': [num(b.health), num(health), `Health: base ${num(b.health)}${more(add.health)} = ${num(health)}`],
    'Damage taken': ['100%', `${pct(1 - add.armour)} of each strike`, `An enemy strike does ${pct(1 - add.armour)} of its damage`],
    'Top speed': [cms(b.speed), cms(speed), `Top speed: base ${cms(b.speed)}${more(add.speed)} = ${cms(speed)}`],
    'Turning': [`${b.turn}`, `${turn} degrees a second`, `Turning: base ${b.turn}${add.turn ? ` + ${add.turn} from the Blood shop` : ''} = ${turn} degrees a second`],
    'Acceleration': [quick(b.accel), quick(accel), `Acceleration: base ${quick(b.accel)}${more(add.accel)} = ${quick(accel)}`],
    'Stamina': [air(b.stamina), air(stamina), `Stamina: base ${air(b.stamina)}${more(add.stamina)} = ${air(stamina)}`],
    'Catch reach': [num(FLY.catch * b.reach), num(FLY.catch * b.reach), `Catch reach: ${num(FLY.catch * b.reach)}. Only the Evolution shop raises it, by 100%`],
    'Rest, stamina': [`${STAMINA.regen}% a second`, `${num(STAMINA.regen * rest)}% a second`, resting],
    'Rest, health': [`${num(b.health * FIGHT.heal)} a second`, `${num(health * heal)} a second`, resting],
    'Mend in flight': ['none', add.mend ? '1% every 2 seconds' : 'none', add.mend ? `Flying restores 1% stamina and ${num(health / 100)} health every 2 seconds` : 'Flying restores nothing'],
  }
  Object.assign(STAT, { power, health, speed, turn: turn / (FLY.turn * DEG), accel, stamina, armour: add.armour, reach: b.reach, rest, mend: add.mend })
  for (const s of stats) [s.base.textContent, s.now.textContent, s.row.dataset.tip] = say[s.label]
  blood.forEach((r, i) => {
    r.level.textContent = `${r.slide.value}/${r.max}`
    r.row.dataset.tip = say[STATS.find(s => s[1] === BLOOD[i][1])![0]][2]
  })
}

const set = (to: (max: number) => number) => () => {
  blood.forEach(r => r.slide.value = String(to(r.max)))
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
  $('#state').textContent = `${doing}. Stamina ${Math.round(sim.stamina)}%. Health ${num(sim.health)} of ${num(sim.cap)}.`
}

apply()
requestAnimationFrame(frame)
