import type { Ctx } from './canvas'

export type Scene = {
  enter(): void
  update(dt: number, t: number): void
  draw(g: Ctx, t: number): void
  key(k: string): boolean
  hover(x: number, y: number): boolean
  click(x: number, y: number): void
}
