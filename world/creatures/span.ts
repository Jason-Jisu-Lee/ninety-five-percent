import { PREY } from '../../data/enemies/enemies'
import type { Prey } from './prey'

export const span = (p: Prey) => Math.ceil(Math.max(PREY[p.kind].len, PREY[p.kind].wing * 2 + PREY[p.kind].wide) / 2) + 3
