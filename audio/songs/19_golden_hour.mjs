import { beat, crash, hats, oct, soft } from '../chip/kit.mjs'

const C = 'o3 g >d g d a d g d<', D = 'o3 a >d f+ d a d f+ d<', G = 'o3 g >d g d b d g d<', Em = 'o3 g >e g e b e g e<'
const Am = 'o3 a >e a e >c <e a e<', Bm = 'o3 f+ >d f+ d b d f+ d<'
const turn = `| ${C} | ${D} | ${G} | ${Em}`
const fast = [C, D, Bm, Em, C, D, G, G].map(p => `| [${p}]2`).join(' ')
const pC = '| o4 {eg>c}1', pD = '| o4 {df+a}1', pG = '| o4 {dgb}1', pE = '| o4 {egb}1'
const pads = `${pC} ${pD} ${pG} ${pE}`
const tick = '| k4 e e r4 e e'

export default {
  title: 'Golden Hour',
  bpm: 108,
  beats: 4,
  tail: 8,
  send: { a: .35, b: .2, c: .25 },
  feel: [.006, 1],
  intro: {
    a: `[| r1]4 |`,
    b: `@1 v6 x8 q8 l8 ${turn} |`,
    c: `[| r1]4 |`,
    w: `@1 v3 q8 l8 | o2 c1 | o2 d1 | o1 b1 | o2 e1 |`,
    n: `v8 l8 [| r4 e e r4 e e]4 |`,
    s: `v5 x0 ${pads} |`,
  },
  loop: {
    a: `@2 v10 x14 q8 ~2 l8
| o5 e2. d4
| o5 d2 r8 <b >d f+
| o5 g2. d4
| o5 e2. r4
| o5 e4. g ^2
| o5 f+4. a ^2
| o5 b2 a4 g4
| o5 e2. r4
v11
| o5 e2. g4
| o5 f+2 r8 d f+ a
| o5 b2. g4
| o5 g2. r4
| o6 c4. <b ^2
| o5 a4. >d ^2
| o6 d2 <b4 g4
| o5 g2 e2
v12 x0 q7
| o5 c4 e4 a4. g
| o5 f+4. e d2
| o5 b4. a g4 d4
| o5 e2. r4
| o5 c4 e4 a4. b
| o6 c4. <b a2
| o5 b2 >d2
| o6 d2 r8 <b >c d
v13
| o6 e4. d ^4 <b4
| o5 a4. >d ^4 <a4
| o5 b4. f+ ^4 >d4
| o6 e2. d4
| o6 e4. d ^4 <b4
| o5 a4. b ^4 >d4
| o5 b2. a4
| o5 g2. r4
v10 x14 q8
| o5 e2. d4
| o5 f+2. a4
| o5 g1
| ^2 r2 |`,
    b: `@1 v6 x8 q8 l8 ${turn} ${turn} ${turn} ${turn}
v7 | ${Am} | ${D} | ${G} | ${Em} | ${Am} | ${D} | ${G} | o3 f+ >d f+ d a d f+ d<
v6 x0 q6 l16 ${fast}
v6 x8 q8 l8 | ${C} | ${D} | ${G} | o3 g >d g d b2< |`,
    c: `[| r1]8 @1 v8 x14 q8 l8
| o5 c2. e4
| o5 d2 r2
| o5 g2. d4
| o5 e2. r4
| o5 e4. g ^2
| o5 f+4. a ^2
| o5 b2 g4 d4
| o5 e2 <b2
[| r1]6
| o5 g2 b2
| o5 a2 r2
v9 x0 q7
| o6 c4. <b ^4 g4
| o5 f+4. a ^4 f+4
| o5 f+4. d ^4 b4
| o5 g2. b4
| o6 c4. <b ^4 g4
| o5 f+2. a4
| o5 g2. f+4
| o4 b2. r4
v7 x14 q8
| o5 c1
| o5 d2. f+4
| o4 b1
| ^2 r2 |`,
    w: `@1 v3 q8 l8
| o2 c1 | o2 d1 | o1 b1 | o2 e2. d4 | o2 c1 | o2 d1 | o1 b1 | o2 e1
| o2 c2. c4 | o2 d2. d4 | o1 b2. b4 | o2 e2. d4 | o2 c2. c4 | o2 d2. d4 | o1 b2. b4 | o2 e2 e4 g4
| o2 a2. a4 | o2 d2. d4 | o2 g2. g4 | o2 e2. e4 | o2 a2. a4 | o2 d2. d4 | o2 g2. g4 | o2 f+2 d2
q7
| o2 ${oct('c')}
| o2 ${oct('d')}
| o1 ${oct('b')}
| o2 ${oct('e')}
| o2 ${oct('c')}
| o2 ${oct('d')}
| o2 ${oct('g')}
| o2 g g >g <g g2
q8 | o2 c1 | o2 d1 | o2 g1 | ^1 |`,
    n: `v8 l8 [${tick}]7 | k4 e e r4 s16 s16 s
v10 [${soft}]7 | k4 h h s s16 s16 s s
v11 [${beat}]6 | k h s h k k s s | s16 s16 s16 s16 s16 s16 s16 s16 s s s16 s16 s16 s16
v13 l16 ${crash} [${hats}]6 | k h h h s h h h k8 s8 c4
v8 l8 [${tick}]3 | k4 r2. |`,
    s: `v5 x0 ${pads} ${pads} ${pads} ${pads}
| o4 {ea>c}1 ${pD} ${pG} ${pE} | o4 {ea>c}1 ${pD} ${pG} ${pD}
v6 ${pC} ${pD} | o4 {df+b}1 ${pE} ${pC} ${pD} ${pG} ${pG}
v5 ${pC} ${pD} ${pG} | ^1 |`,
  },
}
