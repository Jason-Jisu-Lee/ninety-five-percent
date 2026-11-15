import { beat, crash, hats, oct, roll } from '../chip/kit.mjs'

const riff = `@1 v11 x0 q8 ~0 l16
| o5 a r a >c r <a >c e r c e d r c <b r
| o5 a r a >c r <a >c f r c f e r c <a r
| o5 g r g >c r <g >c e r c e d r c <g r
| o5 g r g b r g b >d r <b >d c r <b g r`
const verse = `@2 v12 x0 q7 ~2 l8
| o5 e e e d e4 a4
| o5 g4. f ^2
| o5 e e e d e4 g4
| o5 d2. r8 e
| o5 a a a g a4 >c4
| o6 c4. <a ^2
| o5 g g g e g4 >c4
| o5 b2 r4 b >c`
const pre = `
| o6 c4 <a >c^4 <a4
| o6 d4 <b >d^4 <b4
| o6 e4 <b >e^4 d4
| o6 e2. r4`
const chorus = `v13 q8
| o5 a2. >c4
| o6 d2. <b4
| o6 e2 d4 <b4
| o6 c2. <a4
| o5 a2. >c4
| o6 d2. e4
| o6 e2 d4 c4
| o6 c1`
const stabs = `@1 v8 x0 q5 l8
| o4 e r e r r e r e
| f r f r r f r f
| e r e r r e r e
| d r d r r d r d`
const turn = `v7 q6 l16
| o4 [e a >c <a]4
| [f a >c <a]4
| [e g >c <g]4
| [d g b g]4`
const lift = `
| o4 [f a >c <a]4
| [g b >d <b]4
| [e g+ b g+]4
| [e g+ >d <g+]4`
const wide = `
| o4 [f a >c <a]4
| [g b >d <b]4
| [e g b g]4
| [e a >c <a]4
| [f a >c <a]4
| [g b >d <b]4
| [e g >c <g]4
| [e g >c <g]4`
const round = `
| o2 ${oct('a')}
| o2 ${oct('f')}
| o2 ${oct('c')}
| o2 ${oct('g')}`
const climb = `
| o2 ${oct('f')}
| o2 ${oct('g')}
| o2 ${oct('e')}
| o2 e e >e <e e e g+ b`
const drive = `
| o2 ${oct('f')}
| o2 ${oct('g')}
| o2 ${oct('e')}
| o2 ${oct('a')}
| o2 ${oct('f')}
| o2 ${oct('g')}
| o2 ${oct('c')}
| o2 c c >c <c c e g b`
const fill = '| k h s h s16 s16 s16 s16 s s'
const snare = '| s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16'
const full = `l16 ${crash} [${hats}]6 ${roll} l8`

export default {
  title: 'Before the Rain',
  bpm: 160,
  beats: 4,
  tail: 6,
  send: { a: .2, b: .1 },
  intro: {
    a: `${riff} |`,
    b: `${stabs} |`,
    w: `@1 v3 q7 l8 ${round} |`,
    n: `v15 l8 [${beat}]3 ${fill} |`,
  },
  loop: {
    a: `${verse} ${pre} ${chorus} ${riff} ${verse} ${pre} ${chorus}
@2 v12 q8 ~0 l16
| o5 e a >c <a e a >c <a >e c <a >c e c <a >c
| o5 d g b g d g b g >d <b g b >d <b g b
| o5 c f a f c f a f >c <a f a >c <a f a
| o4 b >e g+ e <b >e g+ e b g+ e g+ b g+ e g+
v13 q7 ~2 l8
| o5 a4. e c4 e4
| o5 g4. d <b4 >d4
| o5 f4 c f g4 d g
| o5 g2. r4 ${chorus} |`,
    b: `@1 v9 x0 q4 l8 o4
| {ea>c}4 r4 r2 | {fa>c}4 r4 r2 | {eg>c}4 r4 r2 | {dgb}4 r4 r2
${turn} ${lift} ${wide} ${stabs} ${turn} ${turn} ${lift} ${wide}
v9 q5 l8
| o4 e r e r r e r e
| d r d r r d r d
| c r c r r c r c
| o4 b r b r r b r b
v7 q6 l16
| o4 [e a >c <a]4
| [d g b g]4
| [f a >c <a]2 [g b >d <b]2
| [d g b g]4 ${wide} |`,
    w: `@1 v3 q7 l8
| o2 a4 r4 r2 | o2 f4 r4 r2 | o2 c4 r4 r2 | o2 g4 r4 r2 ${round} ${climb} ${drive} ${round} ${round} ${round} ${climb} ${drive}
| o2 ${oct('a')}
| o2 ${oct('g')}
| o2 ${oct('f')}
| o2 ${oct('e')}
| o2 ${oct('a')}
| o2 ${oct('g')}
| o2 f f >f <f g g >g <g
| o2 ${oct('g')} ${drive} |`,
    n: `v15 l8 | c4 r4 r2 | k4 r4 r2 | k4 r4 r2 | k4 r4 s16 s16 s16 s16 s s [${beat}]4
[${beat}]3 ${snare}
${full}
[${beat}]3 ${fill}
[${beat}]7 | k h s h s s16 s16 s s
[${beat}]3 ${snare}
${full}
[| k k s h k k s h]3 | k k s k s s16 s16 s s [${beat}]3 ${snare}
${full} |`,
  },
}
