import type { Ctx } from '../screen/canvas'

export type Scene = {
  enter(): void
  update(dt: number, t: number): void
  draw(g: Ctx, t: number): void
  over(g: Ctx, k: number): void
  key(k: string): boolean
  hover(x: number, y: number): boolean
  click(x: number, y: number): void
  lift(): void
}
