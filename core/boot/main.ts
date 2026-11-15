import '../../ui/page/page.css'
import { stage1 } from '../../world/stage1/scene'
import { fit } from '../screen/display'
import { listen } from '../input/input'
import { start } from '../loop/loop'

fit()
addEventListener('resize', fit)
listen()
start(stage1)
