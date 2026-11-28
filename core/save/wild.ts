import { cast, PREY } from '../../data/enemies/enemies'
import { WILD } from '../../data/shop/wild'
import { afford, save, spend, store } from './save'

export const pack = { get got() { return save.got }, set got(n: number) { save.got = n } }
export const reach = () => WILD.slice(0, pack.got).reduce((n, w) => Math.max(n, w.stage), 1)
export const owns = (kind: string) => WILD.findIndex(w => w.kind === kind) < pack.got
export const roster = (stage: number) => cast(stage).filter(k => stage > reach() || !PREY[k].unlock || owns(k))

export function unlock() {
  const w = WILD[pack.got]
  if (!w || !afford(w.cost)) return
  pack.got++
  spend(w.cost)
  save.far = Math.max(save.far, w.stage)
  store()
  return w
}
