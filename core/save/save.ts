import { BASE, type Stat } from '../../data/dragonfly/stats'
import { EVOLVE } from '../../data/shop/evolve'
import { QUESTS } from '../../data/stage1/quests'

const KEY = 'ninety-five-percent'
const fresh = () => ({
  blood: 0, quest: 0, count: 0, started: false, warned: false, points: 0, music: true, vol: 5,
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
export const own = (s: Stat) => BASE[s]

export function store() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save))
  } catch {}
}

export function wipe() {
  Object.assign(save, fresh(), { music: save.music, vol: save.vol })
  store()
}

export function progress(kind: string) {
  const q = QUESTS[save.quest]
  if (q?.kind !== kind || ++save.count < q.n) return
  Object.assign(save, { quest: save.quest + 1, count: 0, blood: save.blood + q.blood, earned: save.earned + q.blood })
}

export function fall() {
  save.deaths++
  store()
}

export function evolve() {
  Object.assign(save, { points: save.points + EVOLVE.points, blood: 0 })
  progress('evolve')
  store()
}
