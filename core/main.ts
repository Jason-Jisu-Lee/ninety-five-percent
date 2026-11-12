import '../ui/page.css'
import { eggStage } from '../world/egg_stage/scene'
import { forest } from '../world/forest/scene'
import { frontPage } from '../world/front_page/scene'
import { fit } from './display'
import { listen } from './input'
import { redraw, start } from './loop'

await Promise.race([document.fonts.load('12px "Pixelify Sans"'), new Promise(r => setTimeout(r, 2000))]).catch(() => 0)
fit()
addEventListener('resize', () => {
  fit()
  redraw()
})
listen()
start({ front_page: frontPage, egg_stage: eggStage, forest }, 'front_page')
