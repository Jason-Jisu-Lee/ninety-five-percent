import type { Ctx } from './canvas'

export type SceneId = 'front_page' | 'egg_stage' | 'forest'

export type Scene = {
  hz?: number
  hud?: boolean
  enter(): void
  update(dt: number, t: number): void
  draw(world: Ctx, ui: Ctx, t: number): void
  key?(k: string): boolean
  hover?(x: number, y: number): boolean
  click?(x: number, y: number): void
}
