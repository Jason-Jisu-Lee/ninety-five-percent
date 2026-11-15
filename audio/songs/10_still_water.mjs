import { crash, hats, oct, roll, soft } from '../chip/kit.mjs'

const drone = '| o3 {da}1^1 | o2 {b>f+}1^1 | o2 {a>e}1^1 | o2 {g>d}1^1'
const G = '| o4 g b >d <b g b >d <b', A = '| o4 a >c+ e c+ <a >c+ e c+', Fm = '| o4 f+ a >c+ <a f+ a >c+ <a', Bm = '| o4 f+ b >d <b f+ b >d <b'
const pads = '| o2 {g>db}1 | o2 {a>e>c+}1 | o2 {f+>c+a}1 | o2 {b>f+>d}1'
const fast = '| o4 [d g b g]4 | [e a >c+ <a]4 | [f+ a >c+ <a]4 | [f+ b >d <b]4'
const run = `
| o2 ${oct('g')}
| o2 ${oct('a')}
| o2 ${oct('f+')}
| o1 ${oct('b')}`

export default {
  title: 'Still Water',
  bpm: 100,
  beats: 4,
  tail: 6,
  send: { a: .4, b: .2 },
  intro: {
    t: `v9 x3 l4 | r1 | r1 | o5 r a r f+ | r2 e r | b r a r | r2 f+ d | e2 r2 | r2 a b |`,
    s: `v10 x0 ${drone} |`,
    a: `[| r1]8 |`,
    b: `[| r1]8 |`,
    w: `[| r1]8 |`,
    n: `[| r1]8 |`,
  },
  loop: {
    t: `v10 x4 l8
| o5 a4 f+ e^4 d4
| o5 e4 f+ a^2
| o5 b4 a f+^4 d4
| o5 f+2 r4 b4
| o5 a4 e c+^4 e4
| o5 f+2 e2
| o5 d4 g b^4 a4
| o5 a2. r4
v8 x3 ${G} ${A} ${Fm} ${Bm} ${G} ${A} ${Fm} ${Bm}
${G} ${A} ${Fm} ${Bm} ${G} ${A} ${Bm} ${Bm}
${G} ${A} ${Fm} ${Bm} ${G} ${A} ${Fm} ${Bm}
v9 l4 | o5 f+ r a r | d2 r2 | r e r c+ | e2 r2 |`,
    s: `v10 x0 ${drone} ${pads} ${pads}
${pads} | o2 {g>db}1 | o2 {a>e>c+}1 | o2 {b>f+>d}1 | o2 {b>f+>d}1
${pads} ${pads}
| o3 {da}1^1 | o2 {a>e}1^1 |`,
    a: `[| r1]8
@2 v8 x0 q8 ~2 l8
| o5 b4. a f+4 d4
| o5 c+4. e a2
| o5 a4. f+ c+4 f+4
| o5 f+2 d4 <b4
| o5 g4. b >d4 <b4
| o6 c+4. <a e4 a4
| o5 a4. >c+ <a4 f+4
| o5 f+2. r4
| o5 d4 g b4 a g f+
| o5 e4 a >c+4 <b a e
| o5 c+4 f+ a4 f+ c+ f+
| o5 d4 f+ b4 a f+ d
| o5 g4 b >d4 <b a g
| o5 a4 >c+ e4 d c+ <a
| o5 b4. >d <b4 f+4
| o5 b2. r4
v10
| o6 d2. <b a
| o6 c+2. <b a
| o5 a2. f+ a
| o5 b2 f+4 b4
| o6 d4. e d4 <b4
| o6 e4. c+ <a4 >c+4
| o6 c+4. <a f+4 a4
| o5 b1
v8
| o5 a1 | r1 | r1 | r1 |`,
    b: `[| r1]16
@1 v5 x0 q6 l16 ${fast} | o4 [d g b g]4 | [e a >c+ <a]4 | [f+ b >d <b]4 | [f+ b >d <b]4
v6 ${fast} ${fast}
[| r1]4 |`,
    w: `[| r1]8
@0 v2 q8 l8 | o2 g2. g4 | o2 a2. a4 | o2 f+2. f+4 | o2 b2. b4 | o2 g2. g4 | o2 a2. a4 | o2 f+2. f+4 | o2 b2. b4
q7 | o2 g4. g >d4 <g4 | o2 a4. a >e4 <a4 | o2 f+4. f+ >c+4 <f+4 | o2 b4. b >f+4 <b4 | o2 g4. g >d4 <g4 | o2 a4. a >e4 <a4 | o2 b4. b >f+4 <b4 | o2 b4. b >f+4 <b4
v3 ${run} ${run}
v2 q8 | o2 d1 | r1 | o2 a1 | r1 |`,
    n: `[| r1]8
v6 l4 [| r h r h]8
v9 l8 [${soft}]7 | k4 h h s s16 s16 s s
l16 ${crash} [${hats}]6 ${roll}
[| r1]4 |`,
  },
}
