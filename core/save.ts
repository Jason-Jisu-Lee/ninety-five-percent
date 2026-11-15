import { cost, NAMES, type Stat } from '../data/stats'

const KEY = 'becoming-a-dragonfly'
const fresh = () => ({ energy: 0, lv: Object.fromEntries(NAMES.map(s => [s, 1])) as Record<Stat, number>, quest: 0, count: 0, started: false, music: true })

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
  Object.assign(save, fresh(), { music: save.music })
  store()
}

export function buy(s: Stat) {
  const c = cost(s, save.lv[s])
  if (save.energy < c) return
  save.energy -= c
  save.lv[s]++
  store()
}

addEventListener('pagehide', store)
