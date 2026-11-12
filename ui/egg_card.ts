import type { Ctx } from '../core/canvas'
import { UPGRADES } from '../data/egg'
import { UI } from '../data/palette'
import type { Demo } from '../world/egg_stage/demo'
import { bar } from './bar'
import { bubbleIcon } from './bubble_icon'
import { box } from './panel'
import { respireButton } from './respire_button'
import { text } from './text'
import { upgradeRow } from './upgrade_row'

export function eggCard(g: Ctx, s: Demo) {
  box(g, 772, 28, 164, 146 + 40 * UPGRADES.length, '#3a352e', '#0f0c0a')
  bubbleIcon(g, 784, 43)
  text(g, String(s.count), 796, 52, 16, UI.text)
  text(g, 'bubbles', 924, 52, 10, UI.dim, 'r')
  text(g, 'Oxygen', 784, 80, 10, UI.dim)
  text(g, `${Math.round(s.o2 * 100)}%`, 924, 80, 10, UI.text, 'r')
  bar(g, 784, 86, 140, 4, s.o2, '#1f1b17', '#4f8a86', UI.glint)
  respireButton(g, 784, 100, s.phase, s.fill)
  g.fillStyle = '#2a2520'
  g.fillRect(784, 140, 140, 1)
  text(g, 'Upgrades', 784, 158, 10, UI.dim)
  UPGRADES.forEach((u, i) => upgradeRow(g, 166 + 40 * i, u, s.count, i === 0))
}
