import { beat, crash, hats, oct, soft } from '../chip/kit.mjs'

const head = `
| o4 a4. >d f+4. e16 f+16
| o5 e4. c+ <a2
| o4 b4. >d f+4. g16 f+16
| o5 g4 f+ e e4 c+ e`
const again = `
| o4 a4. >d f+4. e16 f+16
| o5 e4. c+ <a4 >c+ e
| o4 b4. >d f+4. g16 f+16
| o5 g4 f+ e e4 f+ g
| o5 b4 a g a4 g e
| o5 f+4 e c+ d4 f+ b
| o5 g4 f+ e c+4 e g
| o5 f+4. d d2`
const thirds = `
| o4 f+4. a >d4. c+16 d16
| o5 c+4. <a e4 a >c+
| o4 f+4. b >d4. e16 d16
| o4 b4 a g >c+4 d e`
const bassA = `
| o2 ${oct('d')}
| o2 ${oct('c+')}
| o1 ${oct('b')}
| o2 g g >g <g a a >a <a`
const bassEnd = `
| o2 g g >g <g a a >a <a
| o2 f+ f+ >f+ <f+ o1 b b >b <b
| o2 e e >e <e o1 a a >a <a`

const dusk = `
| o4 f+4. b >d4. c+16 d16
| o5 c+4. <a f+2
| o4 g4. b >d4. e16 d16
| o5 e4 d c+ c+4 <a+ >c+`
const low = '| o2 e e >e <e f+ f+ >f+ <f+'

export default {
  title: 'Becoming II',
  bpm: 118,
  beats: 4,
  tail: 14,
  send: { a: .3, b: .15 },
  intro: {
    a: `@1 v8 x0 q8 ~0 l16
| o4 d f+ b >d f+ b >d <b f+ d <b f+ d f+ b >d
| o4 d g b >d g b >d <b g d <b g d g b >d
| o4 e g b >e g b >e <b g e <b g e g b >e
| o4 f+ a+ >c+ f+ a+ >c+ f+ r @2 v10 x14 ~2 o5 f+2 |`,
    b: `@1 v5 x0 q8 l16 r8
o4 d f+ b >d f+ b >d <b f+ d <b f+ d f+ b >d
o4 d g b >d g b >d <b g d <b g d g b >d
o4 e g b >e g b >e <b g e <b g e g b >e
o4 f+ a+ >c+ f+ a+ >c+ v8 x14 o5 c+2 |`,
    w: `@1 v3 q8 | o2 b1 | o2 g1 | o2 e1 | o2 f+1 |`,
    n: `v10 l8 | r1 | r1 | r1 | r2 h h h h |`,
  },
  loop: {
    a: `@2 v10 x14 q8 ~2 l8 ${dusk}
| o5 d4. f+ b4. a16 b16
| o6 c+4. <a e2
| o5 g4. e <b4 >e g
| o5 f+2. r4
v12 x0 q7 ${dusk}
| o5 g4 f+ e f+4 e c+
| o5 d4 c+ <a b4 >d g
| o5 e4 d c+ <a+4 >c+ e
| o5 d4. <b b2
@1 v11
| o5 d2. <b >d
| o5 e2. c+ e
| o5 g2. f+ e
| o5 f+2 c+ f+ a+ >c+
| o6 d4. c+ <b4 f+4
| o5 g4. a b4 >d4
| o6 e4. d <b4 g4
| o5 a2. r4
@2 v13 ${head}
| o5 f+4. a >d4. c+16 d16
| o6 e4. c <g2
| o5 b4. g d4 g b
| o5 a2. r4 ${again} |`,
    b: `@0 v7 x3 q8 l8
| o4 f+ b >d <b f+ b >d <b
| o4 f+ a >c+ <a f+ a >c+ <a
| o4 d g b g d g b g
| o4 e g b g f+ a+ >c+ <a+
| o4 f+ b >d <b f+ b >d <b
| o4 e a >c+ <a e a >c+ <a
| o4 e g b g e g b g
| o4 f+ a+ >c+ <a+ f+ a+ >c+ <a+
@1 v6 x0 q6 l16
| o4 [f+ b >d <b]4
| [f+ a >c+ <a]4
| [g b >d <b]4
| [e g b g]2 [f+ a+ >c+ <a+]2
| [e g b g]2 [f+ a >c+ <a]2
| [f+ b >d <b]2 [g b >d <b]2
| [e g b g]2 [f+ a+ >e <a+]2
| [f+ b >d <b]2 l8 b >d f+ b
@0 v8 x3 q8
| o4 f+ b >d <b f+ b >d <b
| o4 e a >c+ <a e a >c+ <a
| o4 d g b g d g b g
| o4 c+ f+ a+ f+ c+ f+ a+ f+
| o4 f+ b >d <b f+ b >d <b
| o4 g b >d <b g b >d <b
| o4 g b >e <b g b >e <b
| o4 a >c+ e c+ e f+ g a
@1 v7 x0 q6 l16
| o4 [f+ a >d <a]4
| [e a >c+ <a]4
| [f+ b >d <b]4
| [g b >d <b]2 [e a >c+ <a]2
| [f+ a >d <a]4
| [e g >c <g]4
| [g b >d <b]4
| [e a >d <a]2 [e a >c+ <a]2
@1 v9 x0 q7 l8 ${thirds}
| o5 g4 f+ d e4 e c+
| o5 c+4 c+ <a b4 >d f+
| o5 e4 d <b a4 >c+ e
| o5 d4. <a a2 |`,
    w: `@1 v3 q7 l8
| o2 b2. b4 | o2 f+2. f+4 | o2 g2. g4 | o2 e2 f+2 | o2 b2. b4 | o2 a2. a4 | o2 e2. e4 | o2 f+2. f+4
| o1 ${oct('b')}
| o2 ${oct('f+')}
| o2 ${oct('g')} ${low} ${low}
| o1 b b >b <b o2 g g >g <g ${low}
| o1 ${oct('b')}
| o2 b4. b >b4 <b4
| o2 a4. a >a4 <a4
| o2 g4. g >g4 <g4
| o2 f+4. f+ >f+4 <f+4
| o1 ${oct('b')}
| o2 ${oct('g')}
| o2 ${oct('e')}
| o2 a a >a <a a b >c+ e ${bassA}
| o2 ${oct('d')}
| o2 ${oct('c')}
| o2 ${oct('g')}
| o2 a a >a <a a a b >c+ ${bassA} ${bassEnd}
| o2 d d >d <d d a f+ a |`,
    n: `v13 l8 [| r1]4 [${soft}]3 | k4 h h s s16 s16 s s
[${beat}]7 | k h s h s16 s16 s16 s16 s s
[${soft}]4 [${beat}]3 | k h s h s16 s16 s16 s16 s16 s16 s16 s16
l16 ${crash} [${hats}]6 | k h h h s h h h s s s s s8 s8
${crash} [${hats}]6 | k h h h s h h h k8 s8 s s s s |`,
  },
}
