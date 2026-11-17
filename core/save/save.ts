import type { Stat } from '../../data/dragonfly/stats'
import { EVOLVE } from '../../data/shop/evolve'
import { gain, tally } from '../../data/shop/gains'
import { QUESTS } from '../../data/stage1/quests'

const KEY = 'ninety-five-percent'
const fresh = () => ({
  blood: 0, quest: 0, count: 0, started: false, warned: false, points: 0, music: true, vol: 5,
  time: 0, hand: 0, earned: 0, bought: 0, deaths: 0, caught: {} as Record<string, number>, owned: [] as string[],
})

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const save = { ...fresh(), ...read() } as ReturnType<typeof fresh>
let sum = tally(save.owned)
export const own = (s: Stat) => sum[s]

export function store() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save))
  } catch {}
}

export function wipe() {
  Object.assign(save, fresh(), { music: save.music, vol: save.vol })
  sum = tally(save.owned)
  store()
}

export const can = (it: { name: string; text: string; cost: number }) => !!gain(it.text) && !save.owned.includes(it.name) && save.points >= it.cost

export function buy(it: { name: string; text: string; cost: number }) {
  if (!can(it)) return
  save.points -= it.cost
  save.owned.push(it.name)
  sum = tally(save.owned)
  store()
}

export function progress(kind: string) {
  const q = QUESTS[save.quest]
  if (q?.kind !== kind || ++save.count < q.n) return
  Object.assign(save, { quest: save.quest + 1, count: 0, blood: save.blood + q.blood, earned: save.earned + q.blood })
}

export function fall() {
  save.deaths++
  save.blood = 0
  store()
}

export function evolve() {
  Object.assign(save, { points: save.points + EVOLVE.points, blood: 0 })
  progress('evolve')
  store()
}
