import { beat, crash, hats, oct, roll, soft } from '../chip/kit.mjs'

const verse = `
| o5 f+4 a a^4 f+4
| o5 g+4 b b^4 g+4
| o5 e4 g+ >c+^4 <b4
| o5 a2. f+4
| o5 f+4 a >d^4 c+4
| o5 b4 g+ e^4 b4
| o6 c+4 <b g+^4 e4
| o5 f+2. r4`
const chorus = `
| o6 d4. c+ <a4 f+4
| o6 e4. d <b4 g+4
| o6 c+4. <b g+4 >c+4
| o6 c+2 <a4 f+4
| o6 d4. c+ <a4 >d4
| o6 e4. d <b4 >e4
| o6 e4. c+ <g+4 >c+4
| o5 a2. r4`
const pluck = '| o4 f+ a >d <a f+ a >d <a | o4 e g+ b g+ e g+ b g+ | o4 e g+ >c+ <g+ e g+ >c+ <g+ | o4 f+ a >c+ <a f+ a >c+ <a'
const D = '| o4 [f+ a >d <a]4', E = '| o4 [e g+ b g+]4', Cm = '| o4 [e g+ >c+ <g+]4', Fm = '| o4 [f+ a >c+ <a]4', Bm = '| o4 [f+ b >d <b]4', A = '| o4 [e a >c+ <a]4', C7 = '| o4 [f g+ b g+]4'
const road = `${D} ${E} ${Cm} ${Fm}`
const slow = '| o2 d2. d4 | o2 e2. e4 | o2 c+2. c+4 | o2 f+2. f+4'
const run = `
| o2 ${oct('d')}
| o2 ${oct('e')}
| o2 ${oct('c+')}
| o2 ${oct('f+')}`

export default {
  title: 'Long Way Home',
  bpm: 132,
  beats: 4,
  tail: 8,
  send: { a: .25, b: .15 },
  intro: {
    a: `| r1 | r1 | r1 | r1 |`,
    b: `@0 v7 x3 q8 l8 ${pluck} |`,
    w: `@1 v3 q8 | o2 d1 | o2 e1 | o2 c+1 | o2 f+1 |`,
    n: `v10 l8 | r1 | r1 | r1 | r2 h h h h |`,
  },
  loop: {
    a: `@2 v12 x0 q7 ~2 l8 ${verse} ${verse}
@1 v11
| o5 d4. f+ b4 a4
| o5 g+4. b >e4 d4
| o6 c+4. <a e4 a4
| o6 c+2 <a4 f+4
| o5 d4. f+ b4 >d4
| o6 e4. d <b4 g+4
| o5 g+2 b2
| o6 c+2. r4
@2 v13 ${chorus}
v12 q8 ~0 l16
| o5 c+ f+ a f+ c+ f+ a f+ >c+ <a f+ a >c+ <a f+ a
| o5 c+ e a e c+ e a e >c+ <a e a >c+ <a e a
| o5 d f+ a f+ d f+ a f+ >d <a f+ a >d <a f+ a
| o5 c+ f g+ f c+ f g+ f b g+ f g+ b g+ f g+
v13 q7 ~2 l8
| o5 a4. f+ c+4 f+4
| o5 g+4. e <b4 >e4
| o5 f+4 d f+ g+4 e g+
| o5 a2. r4 ${chorus} |`,
    b: `@0 v7 x3 q8 l8 ${pluck} ${pluck}
@1 v6 x0 q6 l16 ${road} ${road}
${Bm} ${E} ${A} ${Fm} ${Bm} ${E} ${C7} ${C7}
${road} ${road}
v9 q5 l8
| o4 a r a r r a r a
| a r a r r a r a
| a r a r r a r a
| g+ r g+ r r g+ r g+
v6 q6 l16 ${Fm} ${E}
| o4 [f+ a >d <a]2 [e g+ b g+]2
| o4 [f+ a >c+ <a]2 r2
v9 q7 l8
| o5 a4. a f+4 d4
| o5 b4. b g+4 e4
| o5 g+4. g+ e4 g+4
| o5 a2 f+4 c+4
| o5 a4. a f+4 a4
| o5 b4. b g+4 b4
| o6 c+4. <g+ e4 g+4
| o5 f+2. r4 |`,
    w: `@1 v3 q7 l8 ${slow} ${slow} ${run} ${run}
| o1 ${oct('b')}
| o2 ${oct('e')}
| o1 ${oct('a')}
| o2 ${oct('f+')}
| o1 ${oct('b')}
| o2 ${oct('e')}
| o2 ${oct('c+')}
| o2 ${oct('c+')} ${run} ${run}
| o2 ${oct('f+')}
| o2 ${oct('e')}
| o2 ${oct('d')}
| o2 ${oct('c+')}
| o2 ${oct('f+')}
| o2 ${oct('e')}
| o2 d d >d <d e e >e <e
| o2 f+ f+ >f+ <f+ f+4 r4 ${run} ${run} |`,
    n: `v14 l8 [${soft}]7 | k4 h h s s16 s16 s s
[${beat}]7 | k h s h k s s16 s16 s16 s16
[${beat}]7 | k h s h s16 s16 s16 s16 s16 s16 s16 s16
l16 ${crash} [${hats}]6 ${roll}
l8 [| k k s h k k s h]3 | k k s k s s16 s16 s s [${beat}]3 | k h s h c4 s16 s16 s16 s16
l16 ${crash} [${hats}]6 | k h h h s h h h k8 s8 s s s s |`,
  },
}
