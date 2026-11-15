import { playing } from '../../audio/player/music'
import type { Ctx } from '../../core/screen/canvas'
import { UI } from '../../data/look/palette'
import { text } from '../text/text'

export const now = (g: Ctx, right: number, y: number) => text(g, playing(), right, y, UI.text, 'r', UI.panel)
