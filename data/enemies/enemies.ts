import { WING } from '../dragonfly/colors'
import { FOREST as C } from '../look/palette'
import list from './list.json'

export type Kind = keyof typeof list
export type Enemy = Omit<(typeof list)[Kind], 'tier'> & { tier: number }

const HUE: Record<string, string> = {
  ink: WING.stigma, bark: C.t0, umber: C.t1, white: C.white, pink: C.pink, yellow: C.yellow, red: C.red, slate: C.r0, stone: C.r1, husk: C.husk,
  clear: WING.fill, moss: C.cLight, fern: C.g3, pine: C.cDark,
}
const hue = (name: string) => HUE[name] ?? name

export const TIERS = ['Easy', 'Normal', 'Slightly difficult', 'Difficult', 'Very difficult']
export const PREY = Object.fromEntries(Object.entries(list).map(([kind, e]) =>
  [kind, { ...e, tier: Math.max(0, TIERS.indexOf(e.tier)), body: hue(e.body), band: hue(e.band), eye: hue(e.eye), tint: hue(e.tint), rim: hue(e.rim) }])) as Record<Kind, Enemy>
export const cast = (stage: number) => (Object.keys(PREY) as Kind[]).filter(k => PREY[k].stage === stage)
