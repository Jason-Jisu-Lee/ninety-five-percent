import '../ui/page.css'
import { demo } from '../demo/switch'
import { stage1 } from '../world/stage1/scene'
import { fit } from './display'
import { listen } from './input'
import { start } from './loop'

await Promise.race([document.fonts.load('12px "Pixelify Sans"'), new Promise(r => setTimeout(r, 2000))]).catch(() => 0)
fit()
addEventListener('resize', fit)
listen()
start(stage1)
demo()
