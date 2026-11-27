import { cry } from './cry.mjs'
import { blip, cork, knock } from './taps.mjs'
import { wings } from './wings.mjs'

export default {
  thump: { n: 'v10 k', peak: .19246 },
  tired: { n: 'v6 k', tone: 700, peak: .08 },
  quest: { a: '@1 v9 x10 l32 o5 c e g >c8', ring: .25, peak: .135 },
  feast: { wave: wings, peak: .277 },
  hover: { wave: blip, peak: .07 },
  tap: { wave: knock, peak: .12 },
  cork: { wave: cork, peak: .12 },
  cry: { wave: cry, peak: .08 },
  buy: { a: '@2 v9 x0 l32 o4 g x1 >g8', ring: .15, peak: .09206 },
}
