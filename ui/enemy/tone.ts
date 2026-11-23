import { own } from '../../core/save/save'
import { FIGHT } from '../../data/dragonfly/fight'
import type { Kind } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { odds } from '../../world/creatures/odds'
import { run } from '../../world/game/run'

export function tone(kind: Kind) {
  const win = odds(kind, own('power'), +run.sim.health.toFixed(2), own('armor'), own('bite'))
  return win >= FIGHT.sure ? UI.accent : win <= 1 - FIGHT.sure ? UI.foe : UI.text
}
