import { cast, PREY } from '../../data/enemies/enemies'
import { WILD } from '../../data/shop/wild'
import { save, store } from './save'

export const reach = () => WILD.slice(0, save.wild).reduce((n, w) => Math.max(n, w.stage), 1)
export const roster = (stage: number) => cast(stage).filter(k => stage > reach() || !PREY[k].unlock || WILD.findIndex(w => w.kind === k) < save.wild)

export function unlock() {
  const w = WILD[save.wild]
  if (!w || save.blood < w.cost) return
  Object.assign(save, { blood: save.blood - w.cost, bought: save.bought + 1, wild: save.wild + 1 })
  store()
  return w
}
