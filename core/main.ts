import '../ui/page.css'
import { stage1 } from '../world/stage1/scene'
import { fit } from './display'
import { listen } from './input'
import { start } from './loop'

fit()
addEventListener('resize', fit)
listen()
start(stage1)
