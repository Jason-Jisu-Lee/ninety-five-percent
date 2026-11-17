import { own } from '../../core/save/save'
import { FIGHT } from '../../data/dragonfly/fight'
import type { Kind } from '../../data/enemies/enemies'
import { UI } from '../../data/look/palette'
import { odds } from '../../world/creatures/odds'

export function tone(kind: Kind) {
  const win = odds(kind, own('power'), own('health'), own('armour'), own('bite'))
  return win >= FIGHT.sure ? UI.accent : win <= 1 - FIGHT.sure ? UI.foe : UI.text
}
