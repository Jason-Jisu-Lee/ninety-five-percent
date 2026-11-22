import { FIGHT } from '../../data/dragonfly/fight'
import { BASE, STAT, type Stat } from '../../data/dragonfly/stats'
import { UPGRADES } from '../../data/shop/upgrades'
import { QUESTS } from '../../data/game/quests'

const KEY = 'ninety-five-percent'
const fresh = () => ({
  blood: 0, quest: 0, count: 0, started: false, warned: false, points: 0, wild: 0, vol: 5, fx: 5, mute: false,
  time: 0, earned: 0, bought: 0, deaths: 0, caught: {} as Record<string, number>, levels: {} as Record<string, number>,
})

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const save = { ...fresh(), ...read() } as ReturnType<typeof fresh>
export const own = (s: Stat) => STAT[s]
export const level = (name: string) => save.levels[name] ?? 0
export const price = (name = '') => UPGRADES[name]?.[2][level(name)]

function grow() {
  Object.assign(STAT, BASE)
  for (const [name, [stat, each]] of Object.entries(UPGRADES)) STAT[stat] += each * level(name)
}
grow()

export function buy(name: string) {
  const cost = price(name)
  if (!cost || save.blood < cost) return
  Object.assign(save, { blood: save.blood - cost, bought: save.bought + 1 })
  save.levels[name] = level(name) + 1
  grow()
  store()
}

export function store() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save))
  } catch {}
}

export function wipe() {
  Object.assign(save, fresh(), { vol: save.vol, fx: save.fx, mute: save.mute })
  grow()
  store()
}

export function progress(kind: string) {
  const q = QUESTS[save.quest]
  if (q?.kind !== kind || ++save.count < q.n) return
  Object.assign(save, { quest: save.quest + 1, count: 0, blood: save.blood + q.blood, earned: save.earned + q.blood })
}

export function fall() {
  save.deaths++
  save.blood = Math.floor(save.blood * (100 - FIGHT.loss) / 100)
  store()
}
