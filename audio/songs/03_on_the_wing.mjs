import { oct } from '../chip/kit.mjs'

const riff = `
| o5 e4 g b4 a g f+
| o5 g4. e ^2
| o5 e4 g >c4 <b a g
| o5 a4. f+ ^4 d f+
| o5 g4 b >e4 d <b a
| o5 b4. g ^2`
const Em = '| o4 [e g b g]4', C = '| o4 [e g >c <g]4', D = '| o4 [f+ a >d <a]4', Am = '| o4 [e a >c <a]4'
const low = `
| o2 ${oct('e')}
| o2 ${oct('e')}
| o2 ${oct('c')}
| o2 ${oct('d')}
| o2 ${oct('e')}
| o2 ${oct('e')}`
const beat = '| k h s h k k s h'

export default {
  title: 'On the Wing',
  bpm: 160,
  beats: 4,
  tail: 36,
  intro: {
    a: `@1 v12 x0 q8 ~0 l16
| o5 e <b >e <b >f+ <b >f+ <b >g <b >g <b >a <b >a <b
| o5 b e b e a e a e g e g e f+ e f+ e
@2 v13 q6 l8
| o5 e e r g r g e4
| o5 f+ f+ r a r a b4 |`,
    b: `@1 v8 x0 q8 l16
| o4 g r g r a r a r b r b r >c r c r
| o5 g r g r f+ r f+ r e r e r d r d r
v9 q6 l8
| o4 b b r >e r e <b4
| o5 d+ d+ r f+ r f+ f+4 |`,
    w: `@1 v3 q7 l8
| o2 e e e e e e e e
| o2 e e e e e e e e
| o2 e e r e r e e4
| o1 b b r b r b b4 |`,
    n: `v15 l16
| h h h h h h h h h h h h h h h h
| h h h h h h h h h h h h s s s s
l8 | k k r s r s c4
| k k r s r s s16 s16 s16 s16 |`,
  },
  loop: {
    a: `@2 v13 x0 q7 ~2 l8 ${riff}
| o6 c4 <b a4 g f+ e
| o5 d+4. f+ b4 r4 ${riff}
| o5 a4 >c e4 d c <b
| o5 a4 f+ d+ e2
@1 v12
| o5 b2. a g
| o5 a2. g f+
| o5 g2. f+ e
| o5 f+2 d4 f+4
| o5 e2. g >c
| o6 d2. c <b
| o6 c2 <a4 >c4
| o5 b4 a f+ d+4 f+ a
@2 q8 ~0 l16
| o5 e g b g e g b g >e <b g b >e <b g b
| o5 d f+ a f+ d f+ a f+ >d <a f+ a >d <a f+ a
| o5 c e g e c e g e >c <g e g >c <g e g
| o4 b >d+ f+ d+ <b >d+ f+ d+ a f+ d+ f+ a f+ d+ f+
v13 q7 ~2 l8
| o5 e4 g b4 a g f+
| o5 f+4 a >d4 c <b a
| o5 g4 e g f+4 d+ f+
| o5 e2 r2 |`,
    b: `@1 v7 x0 q6 l16 ${Em} ${Em} ${C} ${D} ${Em} ${Em} ${C}
| o4 [f+ a >d+ <a]4 ${Em} ${Em} ${C} ${D} ${Em} ${Em} ${Am}
| o4 [f+ a >d+ <a]2 [e g b g]2
| o4 [d g b g]4
| [d f+ a f+]4 ${Em}
| o4 [d f+ b f+]4 ${C}
| o4 [d g b g]4 ${Am}
| o4 [d+ f+ a f+]4
v9 q5 l8
| o4 b r b r r b r b
| a r a r r a r a
| g r g r r g r g
| a r a r r a r a
v7 q6 l16 ${Em} ${D}
| o4 [e g >c <g]2 [f+ a >d+ <a]2
| o4 [e g b g]2 r2 |`,
    w: `@1 v3 q7 l8 ${low}
| o2 ${oct('c')}
| o1 ${oct('b')} ${low}
| o1 ${oct('a')}
| o1 b b >b <b >e e >e <e
| o2 ${oct('g')}
| o2 ${oct('d')}
| o2 ${oct('e')}
| o1 ${oct('b')}
| o2 ${oct('c')}
| o1 ${oct('b')}
| o1 ${oct('a')}
| o1 ${oct('b')}
| o2 ${oct('e')}
| o2 ${oct('d')}
| o2 ${oct('c')}
| o1 ${oct('b')}
| o2 ${oct('e')}
| o2 ${oct('d')}
| o2 c c >c <c o1 b b >b <b
| o2 e e >e <e e4 r4 |`,
    n: `v15 l8 [${beat}]7 | k h s h k s s16 s16 s16 s16
[${beat}]7 | k h s h s s16 s16 s s
l16 [| k h h h s h h h k h k h s h h h]7 | k h h h s h h h s s s s s8 s8
l8 [| k k s h k k s h]3 | k k s k s s16 s16 s s
[${beat}]3 | k h s h c4 s16 s16 s16 s16 |`,
  },
}
