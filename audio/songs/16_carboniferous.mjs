import { crash, hats, oct } from '../chip/kit.mjs'

const giants = `
| o5 g4 >c4 e-2
| o6 d4. c <g2
| o5 a-4 >c4 f2
| o6 e-4. d <b2`
const song = `
| o5 a4. >c e4 d c
| o5 b4. >d <b2
| o5 a4. >c <a4 f4
| o5 g+4. b >e2
| o6 c2 <a4 >c4
| o6 d2 <b4 >d4
| o6 e2. d <b
| o5 a2 g2`
const answer = `
| o5 e4. a >c4 <b a
| o5 g4. b g2
| o5 f4. a f4 c4
| o5 e4. g+ b2
| o5 a2 f4 a4
| o5 b2 g4 b4
| o5 b2. b g
| o5 e2 d2`
const pluck = `@0 x0 q6 ~0 l8
| o4 a >e <a >e <a >e <a >e<
| o4 g >d <g >d <g >d <g >d<
| o4 f >c <f >c <f >c <f >c<
| o4 e b e b e b e b
| o4 f >c <f >c <f >c <f >c<
| o4 g >d <g >d <g >d <g >d<
| o4 e b e b e b e b
| o4 a >e <a >e <g >d <g >d<`
const voice = `@2 v10 x0 q7 ~2
| o5 e-4 g4 >c2
| o5 b-4. g d2
| o5 f4 a-4 >c2
| o6 c4. <b g2
| o6 c2 <a-4 >c4
| o6 d2 <b-4 >d4
| o5 b-2. g4
| o5 g1`
const rush = `@1 v6 x0 q6 l16
| o4 [e- g >c <g]4 | [d g b- g]4 | [f a- >c <a-]4 | e- g >c <g e- g d g b g d g b g d g | [e- a- >c <a-]4 | [f b- >d <b-]4 | [d g b- g]4 | [e- g >c <g]4`
const walk = `@1 v3 q7 l8
| o2 a4. a >e4 <a4 | o2 g4. g >d4 <g4 | o2 f4. f >c4 <f4 | o2 e4. e b4 e4 | o2 f4. f >c4 <f4 | o2 g4. g >d4 <g4 | o2 e4. e b4 e4 | o2 a4. a g4 g4`
const stride = `
| o2 ${oct('c')}
| o1 ${oct('b-')}
| o1 ${oct('a-')}
| o1 ${oct('g')}
| o1 ${oct('a-')}
| o1 ${oct('b-')}
| o1 ${oct('g')}
| o2 c c >c <c c2`
const light = `v11 l8 [| k4 h h s4 h h | k h k h s4 h h]3 | k4 h h s4 h h | k h k h s s16 s16 s16 s16 s`
const heavy = `v13 l16 ${crash} [${hats}]6 | k h h h s h h h k8 s8 c4`
const haze = '| o3 {a>ce}1 | o3 {gb>d}1 | o3 {fa>c}1 | o3 {eg+b}1 | o3 {fa>c}1 | o3 {gb>d}1 | o3 {egb}1 | o3 {a>ce}2 {gb>d}2'
const dusk = '| o3 {g>ce-}1 | o3 {gb->d}1 | o3 {a->cf}1 | o3 {g>ce-}4. {gb>d}4.^4'
const night = `${dusk} | o3 {a->ce-}1 | o3 {b->df}1 | o3 {gb->d}1 | o3 {g>ce-}1`

export default {
  title: 'Carboniferous',
  bpm: 92,
  beats: 4,
  tail: 0,
  fade: 3,
  send: { a: .4, b: .25, c: .15 },
  feel: [.006, 1],
  intro: { a: '', b: '', c: '', w: '', n: '', s: '' },
  loop: {
    a: `@2 v12 x0 q7 ~2 l8 ${song}
v13 ${giants}
| o6 e-2 c4 e-4
| o6 f2 d4 f4
| o6 d2. <b-4
| o6 c1
v10 x14 q8 k-9 ${song} k0
v13 x0 q7 ${giants}
| o6 e-2 c4 e-4
| o6 f2 d4 f4
| o6 d2. <b-4
| o6 c1
v10 x14 q8 ${giants}
| o6 c1 | ^2 r2 |`,
    b: `@1 v9 x0 q7 l8 ${answer} ${rush}
@1 v8 x14 q8 l8 k-9 ${answer} k0 ${rush}
@1 v7 x14 q8 l8 | o5 e-1 | o5 d1 | o5 c1 | o5 e-4. d ^2 | o5 e-1 | ^2 r2 |`,
    c: `v6 ${pluck} ${voice} v5 k-9 ${pluck} k0 ${voice} [| r1]6 |`,
    w: `${walk} ${stride} k-9 ${walk} k0 ${stride}
@0 v2 q8 l4 | o2 c g c >e- | o1 b- >f <b- >d | o1 a- >e- <a- >c | o1 g2 >d4 <b4 | o2 c1 | ^1 |`,
    n: `${light} ${heavy} ${light} ${heavy}
v6 l8 [| r4 e e r4 e e]4 | r1 | r1 |`,
    s: `v5 x0 ${haze} v6 ${night} v5 k3 ${haze} k0 v6 ${night}
${dusk} | o3 {g>ce-}1 | ^1 |`,
  },
}
