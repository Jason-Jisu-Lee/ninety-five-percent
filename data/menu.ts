import type { SceneId } from '../core/scene'

export const MENU: { label: string; to?: SceneId; exit?: boolean }[] = [
  { label: 'Start', to: 'egg_stage' },
  { label: 'Forest', to: 'forest' },
  { label: 'Settings' },
  { label: 'Exit', exit: true },
]
