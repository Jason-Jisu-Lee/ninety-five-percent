import { ctx, mk, u32, type Ctx } from '../../core/canvas'
import { UI } from '../../data/palette'
import { H, W } from '../../data/screen'

const CW = W / 2, CH = H / 2, c = mk(CW, CH), cx = ctx(c), img = new ImageData(CW, CH), u = new Uint32Array(img.data.buffer), lit = u32(UI.glint)
let at = -1

export function caustics(g: Ctx, t: number) {
  if (t !== at) {
    at = t
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
      const v = Math.sin(x * .07 + t * .9) + Math.sin(y * .09 - t * .7) + Math.sin((x * .6 + y * .8) * .05 + t * .5) + Math.sin((-x * .5 + y * .7) * .06 - t * .6)
      u[y * CW + x] = Math.abs(v) < .17 ? lit : 0
    }
    cx.putImageData(img, 0, 0)
  }
  g.imageSmoothingEnabled = false
  g.globalAlpha = .22
  g.drawImage(c, 0, 0, W, H)
  g.globalAlpha = 1
}
