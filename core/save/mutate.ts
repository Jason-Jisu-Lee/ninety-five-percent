import { MUTATE, MUTATIONS, type Mutation } from '../../data/game/mutations'
import { WILD } from '../../data/shop/wild'
import { grow, level, morph, save, store, strain } from './save'
import { pack } from './wild'

const AFTER = WILD.findIndex(w => w.kind === MUTATE.after)

export { morph }
export const offered = () => save.fed && !morph.on && pack.got > AFTER
export const need = () => MUTATE.need(morph.n)
export const due = () => morph.on && morph.fed >= need()
export const feed = (n: number) => void (morph.fed += +morph.on * n)

export function mutate() {
  if (!offered() || save.blood < MUTATE.cost) return
  morph.on = true
  Object.assign(save, { blood: save.blood - MUTATE.cost, bought: save.bought + 1 })
  store()
}

export function deal() {
  const pool = MUTATIONS.filter(m => !m.needs || level(m.needs))
  return Array.from({ length: MUTATE.picks }, () => pool.splice(Math.random() * pool.length | 0, 1)[0])
}

export function take(m: Mutation) {
  morph.fed -= need()
  morph.n++
  strain[m.stat] = (strain[m.stat] ?? 0) + m.add
  grow()
}

export function shed() {
  Object.assign(morph, { on: false, fed: 0, n: 0 })
  for (const s of Object.keys(strain)) delete strain[s as keyof typeof strain]
  grow()
}
