import { beat, crash, hats, oct, roll, soft } from '../chip/kit.mjs'

const verse = `
| o4 a4. >c e2
| o5 d4. <b g2
| o4 g4. b >d2
| o5 c4 <b4 a2
| o4 a4. >c e4 g4
| o5 f4. d <b4 >d4
| o5 e4. d <b4 g4
| o4 a2. r4`
const F = '| o4 f a >c <a f a >c <a', G = '| o4 g b >d <b g b >d <b', Em = '| o4 e g b g e g b g', Am = '| o4 e a >c <a e a >c <a', Dm = '| o4 d f a f d f a f'
const road = `${F} ${G} ${Em} ${Am}`
const fast = '| o4 [f a >c <a]4 | [g b >d <b]4 | [e g b g]4 | [e a >c <a]4'
const slow = '| o2 f2. f4 | o2 g2. g4 | o2 e2. e4 | o2 a2. a4'
const step = '| o2 f4. f >c4 <f4 | o2 g4. g >d4 <g4 | o2 e4. e b4 e4 | o2 a4. a >e4 <a4'
const run = `
| o2 ${oct('f')}
| o2 ${oct('g')}
| o2 ${oct('e')}
| o1 ${oct('a')}`

export default {
  title: 'Afterglow',
  bpm: 96,
  beats: 4,
  tail: 4,
  send: { a: .35, b: .25 },
  intro: {
    a: `| r1 | r1 | r1 | r1 |`,
    b: `@0 v7 x3 q8 l8 ${road} |`,
    w: `@0 v2 q8 | o2 f1 | o2 g1 | o2 e1 | o1 a1 |`,
    n: `| r1 | r1 | r1 | r1 |`,
  },
  loop: {
    a: `@2 v10 x12 q8 ~2 l8 ${verse}
v12 x0 ${verse}
@1 v11
| o5 d4. e f4 a4
| o5 g4. f d2
| o5 e4. g b4 g4
| o5 a2. e4
| o5 f4. g a4 >d4
| o6 d4. c <b2
| o6 c4. <g e4 g4
| o5 g+4. b >e2
@2 v12
| o6 e4 d c^4 <a4
| o6 d4 c <b^4 g4
| o5 b4 >d e^4 d4
| o6 c2. <b a
| o5 a4 >c e^4 f4
| o6 d4 <b >d^4 e4
| o6 e4 d <b^4 g4
| o5 a1
v10 x12
| o5 c2 e2
| o5 d2 g2
| o5 e1
| r1 |`,
    b: `@0 v7 x3 q8 l8 ${road} ${road}
@1 v8 x12
| o4 f4. a >c2
| o4 b4. g d2
| o4 e4. g b2
| o4 a4 g4 e2
| o4 f4. a >c4 e4
| o5 d4. <b g4 b4
| o4 b4. b g4 e4
| o4 e2. r4
@0 v7 x3 ${Dm} ${G} ${Em} ${Am} ${Dm} ${G}
| o4 e g >c <g e g >c <g
| o4 e g+ b g+ e g+ >d <g+
@1 v6 x0 q6 l16 ${fast} ${fast}
@0 v7 x3 q8 l8 ${F} ${G} ${Am} ${Am} |`,
    w: `@0 v2 q7 l8 ${slow} ${slow} ${step} ${step}
| o2 d4. d a4 d4
| o2 g4. g >d4 <g4
| o2 e4. e b4 e4
| o2 a4. a >e4 <a4
| o2 d4. d a4 d4
| o2 g4. g >d4 <g4
| o2 c4. c g4 c4
| o2 e4. e b4 >e4 ${run} ${run}
| o2 f1 | o2 g1 | o1 a1 | o1 a2. r4 |`,
    n: `v11 l8 [| r1]4 [| r4 h h r4 h h]4
[${soft}]7 | k4 h h s s16 s16 s s
[${beat}]7 | k h s h s16 s16 s16 s16 s16 s16 s16 s16
l16 ${crash} [${hats}]6 ${roll}
l8 | c2. r4 | r1 | k4 r4 r2 | r1 |`,
  },
}
