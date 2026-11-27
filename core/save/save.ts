import { FIGHT } from '../../data/dragonfly/fight'
import { COLOR, type Color } from '../../data/dragonfly/colors'
import { BASE, SHARE, STAT, type Stat } from '../../data/dragonfly/stats'
import { UPGRADES } from '../../data/shop/upgrades'
import { QUESTS } from '../../data/game/quests'

const KEY = 'ninety-five-percent'
const fresh = () => ({
  blood: 0, quest: 0, count: 0, started: false, warned: false, fed: false, tired: false, told: false, bird: false, points: 0, far: 1, color: COLOR as Color, vol: 5, fx: 5, mute: false,
  time: 0, earned: 0, bought: 0, got: 0, deaths: 0, caught: {} as Record<string, number>, levels: {} as Record<string, number>,
})

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

const { morph: was, strain: kin, ...kept } = read()
export const save = { ...fresh(), ...kept, ...import.meta.env.DEV && { vol: 0 } } as ReturnType<typeof fresh>
export const own = (s: Stat) => STAT[s]
export const level = (name: string) => save.levels[name] ?? 0
export const price = (name = '') => UPGRADES[name]?.[2][level(name)]
export const gain = (name: string) => UPGRADES[name] ? UPGRADES[name][1] * (SHARE.includes(UPGRADES[name][0]) ? BASE[UPGRADES[name][0]] : 1) : 0

export const strain: Partial<Record<Stat, number>> = { ...kin }
export const morph = { on: false, fed: 0, n: 0, ...was }

export function grow() {
  Object.assign(STAT, BASE)
  for (const [name, [stat]] of Object.entries(UPGRADES)) STAT[stat] += gain(name) * level(name)
  for (const [stat, add] of Object.entries(strain)) STAT[stat as Stat] += add
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
    localStorage.setItem(KEY, JSON.stringify({ ...save, morph, strain }))
  } catch {}
}

export function adopt(kept: Partial<typeof save> = {}) {
  Object.assign(save, fresh(), kept, { vol: save.vol, fx: save.fx, mute: save.mute })
  grow()
  store()
}

export const wipe = () => adopt()

export function claim() {
  const q = QUESTS[save.quest]
  if (q && save.count >= q.n) Object.assign(save, { quest: save.quest + 1, count: 0, blood: save.blood + q.blood, earned: save.earned + q.blood })
}

export function progress(kind: string, wait = false) {
  const q = QUESTS[save.quest]
  if (q?.kind !== kind) return
  save.count = Math.min(q.n, save.count + 1)
  if (!wait) claim()
}

export function fall(death = true) {
  save.deaths += +death
  save.blood = Math.floor(save.blood * (100 - FIGHT.loss) / 100)
  store()
}
