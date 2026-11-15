import { oct } from '../chip/kit.mjs'

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
const beat = '| k h s h k k s h'

export default {
  title: 'Becoming',
  bpm: 126,
  beats: 4,
  tail: 8,
  intro: {
    a: `@1 v10 x0 q8 ~0 l16
| o4 d f+ a >d f+ a >d <a f+ d <a f+ d f+ a >d
| o4 d g b >d g b >d <b g d <b g d g b >d
| o4 e g >c e g >c e c <g e c <g e g >c e
| o4 e a >c+ e a >c+ e r @2 v13 q7 o5 a8. a a4 |`,
    b: `@1 v6 x0 q8 l16 r8
o4 d f+ a >d f+ a >d <a f+ d <a f+ d f+ a >d
o4 d g b >d g b >d <b g d <b g d g b >d
o4 e g >c e g >c e c <g e c <g e g >c e
o4 e a >c+ e a >c+ v9 q7 o5 c+8. c+ c+4 |`,
    w: `@1 v3 q8 | o2 d1 | d1 | d1 | o1 a2 >a8. a16 a4 |`,
    n: `v15 l8 | r1 | r1 | h h h h h h h h | l16 s s s s s s s s s8. s c4 |`,
  },
  loop: {
    a: `@2 v13 x0 q7 ~2 l8 ${head}
| o5 f+4. a >d4. c+16 d16
| o6 e4. c <g2
| o5 b4. g d4 g b
| o5 a2. r4 ${again}
@1 v11
| o5 d2. <b >d
| o5 e2. c+ e
| o5 g2. f+ e
| o5 f+2 c+ f+ a+ >c+
| o6 d4. c+ <b4 f+4
| o5 g4. a b4 >d4
| o6 e4. d <b4 g4
| o5 a2. r4
@2 v13 ${again} |`,
    b: `@1 v7 x0 q6 l16
| o4 [f+ a >d <a]4
| [e a >c+ <a]4
| [f+ b >d <b]4
| [g b >d <b]2 [e a >c+ <a]2
| [f+ a >d <a]4
| [e g >c <g]4
| [g b >d <b]4
| [e a >d <a]2 [e a >c+ <a]2
v9 q7 l8 ${thirds}
v7 q6 l16
| o4 [g b >d <b]2 [e a >c+ <a]2
| [f+ a >c+ <a]2 [f+ b >d <b]2
| [e g b g]2 [e g >c+ <g]2
| [f+ a >d <a]2 l8 a >d f+ a
@0 v8 x3 q8
| o4 f+ b >d <b f+ b >d <b
| o4 e a >c+ <a e a >c+ <a
| o4 d g b g d g b g
| o4 c+ f+ a+ f+ c+ f+ a+ f+
| o4 f+ b >d <b f+ b >d <b
| o4 g b >d <b g b >d <b
| o4 g b >e <b g b >e <b
| o4 a >c+ e c+ e f+ g a
@1 v9 x0 q7 ${thirds}
| o5 g4 f+ d e4 e c+
| o5 c+4 c+ <a b4 >d f+
| o5 e4 d <b a4 >c+ e
| o5 d4. <a a2 |`,
    w: `@1 v3 q7 l8 ${bassA}
| o2 ${oct('d')}
| o2 ${oct('c')}
| o2 ${oct('g')}
| o2 a a >a <a a a b >c+ ${bassA} ${bassEnd}
| o2 d d >d <d d a f+ a
| o2 b4. b >b4 <b4
| o2 a4. a >a4 <a4
| o2 g4. g >g4 <g4
| o2 f+4. f+ >f+4 <f+4
| o1 ${oct('b')}
| o2 ${oct('g')}
| o2 ${oct('e')}
| o2 a a >a <a a b >c+ e ${bassA} ${bassEnd}
| o2 d d >d <d d a b >c+ |`,
    n: `v15 l8 [${beat}]7 | k h s h s16 s16 s16 s16 s s
[${beat}]7 | k h s h k s16 s16 s s
[| k4 h h s4 h h]4 [${beat}]3 | k h s h s16 s16 s16 s16 s16 s16 s16 s16
l16 | c4 s h h h k h k h s h h h [| k h h h s h h h k h k h s h h h]6 | k h h h s h h h s s s s s8 s8 |`,
  },
}
