import { cast, PREY } from '../../data/enemies/enemies'
import { WILD } from '../../data/shop/wild'
import { save, store } from './save'

export const pack = { got: 0 }
export const reach = () => WILD.slice(0, pack.got).reduce((n, w) => Math.max(n, w.stage), 1)
export const roster = (stage: number) => cast(stage).filter(k => stage > reach() || !PREY[k].unlock || WILD.findIndex(w => w.kind === k) < pack.got)

export function unlock() {
  const w = WILD[pack.got]
  if (!w || save.blood < w.cost) return
  pack.got++
  Object.assign(save, { blood: save.blood - w.cost, bought: save.bought + 1, far: Math.max(save.far, w.stage) })
  store()
  return w
}
