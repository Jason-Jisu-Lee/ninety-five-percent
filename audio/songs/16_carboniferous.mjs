import { crash, hats, oct } from '../chip/kit.mjs'

const theme = `
| o5 e4 a4 >c2
| o5 b4. a e2
| o5 f4 a4 >d2
| o6 c4. <b g+2
| o5 e4 a4 >e2
| o6 d4. c <a2
| o5 f4 a4 g4 b4
| o5 b2. r4`
const giants = `
| o5 g4 >c4 e-2
| o6 d4. c <g2
| o5 a-4 >c4 f2
| o6 e-4. d <b2`
const hush = n => `[| r1]${n}`

export default {
  title: 'Carboniferous',
  bpm: 92,
  beats: 4,
  tail: 0,
  fade: 2,
  send: { a: .4, b: .25, c: .15 },
  feel: [.006, 1],
  intro: { a: '', b: '', c: '', w: '', n: '', s: '' },
  loop: {
    a: `@0 v13 x7 q8 ~0 l8 ${theme}
@2 v10 x14 ~2 ${theme}
v12 x0 q7
| o5 a4. >c e4 d c
| o5 b4. >d <b2
| o5 a4. >c <a4 f4
| o5 g+4. b >e2
| o6 c2 <a4 >c4
| o6 d2 <b4 >d4
| o6 e2. d <b
| o5 a2 g2
v13 ${giants}
| o6 e-2 c4 e-4
| o6 f2 d4 f4
| o6 d2. <b-4
| o6 c1
@0 v13 x7 q8 ~0 ${giants}
| r1 | r1 |`,
    b: `@0 v9 x7 q8 l8 ${hush(4)}
| r2 o4 e4 a4
| r2 o5 d c <a4
| o4 a2 b2
| o5 a2 g+4 r4
@1 v8 x14
| o4 a4 >c4 e2
| o5 g4. e <b2
| o5 d4 f4 a2
| o5 a4. g+ e2
| o5 c4 e4 >c2
| o5 f4. a f2
| o5 c4 f4 d4 g4
| o5 a2 g+4 r4
@1 v9 x0 q7
| o5 e4. a >c4 <b a
| o5 g4. b g2
| o5 f4. a f4 c4
| o5 e4. g+ b2
| o5 a2 f4 a4
| o5 b2 g4 b4
| o5 b2. b g
| o5 e2 d2
@1 v6 x0 q6 l16
| o4 [e- g >c <g]4 | [d g b- g]4 | [f a- >c <a-]4 | e- g >c <g e- g d g b g d g b g d g | [e- a- >c <a-]4 | [f b- >d <b-]4 | [d g b- g]4 | [e- g >c <g]4
${hush(6)} |`,
    c: `${hush(16)}
@0 v6 x0 q6 l8
| o4 a >e <a >e <a >e <a >e<
| o4 g >d <g >d <g >d <g >d<
| o4 f >c <f >c <f >c <f >c<
| o4 e b e b e b e b
| o4 f >c <f >c <f >c <f >c<
| o4 g >d <g >d <g >d <g >d<
| o4 e b e b e b e b
| o4 a >e <a >e <g >d <g >d<
@2 v10 x0 q7 ~2
| o5 e-4 g4 >c2
| o5 b-4. g d2
| o5 f4 a-4 >c2
| o6 c4. <b g2
| o6 c2 <a-4 >c4
| o6 d2 <b-4 >d4
| o5 b-2. g4
| o5 g1
${hush(6)} |`,
    w: `${hush(8)}
@0 v2 q8 l4
| o2 a >e <a >c | o2 g >e <g b | o2 f >c <f a | o2 e >e <b g+ | o2 a >e c <a | o2 d a >d <f | o2 f >c <g >d | o2 e2 e2
@1 v3 q7 l8
| o2 a4. a >e4 <a4 | o2 g4. g >d4 <g4 | o2 f4. f >c4 <f4 | o2 e4. e b4 e4 | o2 f4. f >c4 <f4 | o2 g4. g >d4 <g4 | o2 e4. e b4 e4 | o2 a4. a g4 g4
| o2 ${oct('c')}
| o1 ${oct('b-')}
| o1 ${oct('a-')}
| o1 ${oct('g')}
| o1 ${oct('a-')}
| o1 ${oct('b-')}
| o1 ${oct('g')}
| o2 c c >c <c c2
${hush(6)} |`,
    n: `${hush(8)}
v6 l8 [| r4 e e r4 e e]8
v11 [| k4 h h s4 h h | k h k h s4 h h]3 | k4 h h s4 h h | k h k h s s16 s16 s16 s16 s
v13 l16 ${crash} [${hats}]6 | k h h h s h h h k8 s8 c4
${hush(6)} |`,
    s: `${hush(8)}
v5 x0 | o3 {a>e}1 | o3 {g>e}1 | o3 {f>c}1 | o3 e2 {e b}2 | o3 {a>e}1 | o3 {d a}1 | o3 {f>c}2 {g>d}2 | o3 {e b}1
| o3 {a>ce}1 | o3 {gb>d}1 | o3 {fa>c}1 | o3 {eg+b}1 | o3 {fa>c}1 | o3 {gb>d}1 | o3 {egb}1 | o3 {a>ce}2 {gb>d}2
v6 | o3 {g>ce-}1 | o3 {gb->d}1 | o3 {a->cf}1 | o3 {g>ce-}4. {gb>d}4.^4 | o3 {a->ce-}1 | o3 {b->df}1 | o3 {gb->d}1 | o3 {g>ce-}1
${hush(6)} |`,
  },
}
