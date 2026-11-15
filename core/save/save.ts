import { boost, cost, full, NAMES, type Stat } from '../../data/dragonfly/stats'
import { EVOLVE } from '../../data/shop/evolve'

const KEY = 'ninety-five-percent'
const levels = () => Object.fromEntries(NAMES.map(s => [s, 1])) as Record<Stat, number>
const fresh = () => ({
  blood: 0, lv: levels(), spent: 0, quest: 0, count: 0, started: false, warned: false, points: 0, music: true, vol: 5,
  time: 0, hand: 0, earned: 0, bought: 0, deaths: 0, caught: {} as Record<string, number>,
})

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const save = { ...fresh(), ...read() } as ReturnType<typeof fresh>
export const own = (s: Stat) => boost(s, save.lv[s])
export const worth = () => Math.floor(save.spent / EVOLVE.per)

export function store() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save))
  } catch {}
}

export function wipe() {
  Object.assign(save, fresh(), { music: save.music, vol: save.vol })
  store()
}

export function buy(s: Stat) {
  const c = cost(s, save.lv[s])
  if (save.blood < c || full(s, save.lv[s])) return
  save.blood -= c
  save.spent += c
  save.lv[s]++
  save.bought++
  store()
}

export function fall() {
  const back = Math.floor(save.spent * EVOLVE.refund)
  Object.assign(save, { blood: save.blood + back, lv: levels(), spent: 0, deaths: save.deaths + 1 })
  store()
  return back
}

export function evolve() {
  Object.assign(save, { points: save.points + worth(), blood: 0, lv: levels(), spent: 0, quest: 0, count: 0 })
  store()
}

addEventListener('pagehide', store)
