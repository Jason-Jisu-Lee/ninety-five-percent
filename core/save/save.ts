import { cost, full, NAMES, type Stat } from '../../data/dragonfly/stats'

const KEY = 'ninety-five-percent'
const fresh = () => ({
  energy: 0, lv: Object.fromEntries(NAMES.map(s => [s, 1])) as Record<Stat, number>, quest: 0, count: 0, started: false, music: true, vol: 5,
  time: 0, hand: 0, earned: 0, bought: 0, caught: {} as Record<string, number>,
})

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const save = { ...fresh(), ...read() } as ReturnType<typeof fresh>

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
  if (save.energy < c || full(s, save.lv[s])) return
  save.energy -= c
  save.lv[s]++
  save.bought++
  store()
}

addEventListener('pagehide', store)
