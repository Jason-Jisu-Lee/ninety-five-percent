import { oct } from '../chip/kit.mjs'

const up = '| o2 c c >c <c e- c f g', down = '| o2 c c >c <c b- g f e-'
const stab = c => `| r ${c} r ${c} r ${c} r ${c}`
const Cm = '{e-g>c}', Ab = '{e-a->c}', Bb = '{fb->d}', Fm = '{fa->c}', G = '{gb>d}', G7 = '{gb>df}'
const hats = '| k h h h s h h h k h k h s h h h'

export default {
  title: 'Horsefly',
  bpm: 150,
  beats: 4,
  tail: 6,
  intro: {
    a: `@1 v12 x0 q5 ~0 l8 | r1 | r1 | o5 r4 g g r4 g g | o5 r4 g g r b >d4 |`,
    b: `@1 v9 x0 q5 l8 | r1 | r1 | o5 r4 e- e- r4 e- e- | o5 r4 d d r g b4 |`,
    w: `@1 v3 q7 l8 ${up} ${down} ${up} | o2 g g >g <g g g b >d |`,
    n: `v15 l8 | h h h h h h h h | h h h h h h s s | k h s h k h s h | k h s h s16 s16 s16 s16 s16 s16 s16 s16 |`,
  },
  loop: {
    a: `@1 v13 x0 q6 ~0 l8
| o5 c r e- g r f+ g4
| o5 b- r g e- r d c4
| o5 c r e- g r f+ g4
| o6 c r <b- g r b >c4
q7
| o5 a-4. >c e-4 d c
| o5 b-4. >d f4 e- d
| o6 e-4 d c4 <b- g e-
| o5 d4 g b4 >d <b4
| o5 c4 f a-4 g f4
| o5 d4 g b4 a- g4
| o5 e-4 a- >c4 <b- a-4
| o5 f4 b- >d4 c <b-4
| o6 c <a- f a- >c <a- f a-
| o6 d <b g b >d <b g b
| o6 e- c <a- >c f d <b- >d
| o6 d4. <b g4 f4
@2 ~2 q8
| o5 g2 b-4 >e-4
| o6 d2. <b-4
| o5 g2 >c4 e-4
| o6 e-2 c4 <a-4
| o5 b-2 g4 b-4
| o5 b-2 >d4 f4
| o6 e-4. d c4 <a-4
| o5 g4. b >d2
@1 ~0 q7
| r1
| r1
| l16 o4 a- a b- b >c c+ d e- e f f+ g a- a b- b
| l8 o6 c r r4 r2 |`,
    b: `@1 v9 x0 q4 l8 o4 [${stab(Cm)}]4 ${stab(Ab)} ${stab(Bb)} ${stab(Cm)}
| r {dgb} r {dgb} r {dgb} {dgb} {dgb}
v7 q6 l16
| o4 [f a- >c <a-]4
| [g b >d <b]4
| [a- >c e- c<]4
| [b- >d f d<]4
v9 q4 l8 ${stab(Fm)} ${stab(G)}
| r {a->ce-} r {a->ce-} r {b->df} r {b->df}
| r ${G7} r ${G7} r ${G7} ${G7} ${G7}
v7 q6 l16
| o4 [g b- >e- <b-]4
| [f b- >d <b-]4
| [g >c e- c<]4
| [a- >c e- c<]4
| [g b- >e- <b-]4
| [f b- >d <b-]4
| [a- >c e- c<]4
| [g b >d <b]4
| r1
| r1
| q7 o4 f f+ g a- a b- b >c c+ d e- e f f+ g a-
| l8 o5 e- r r4 r2 |`,
    w: `@1 v3 q7 l8 ${up} ${down} ${up} ${down}
| o2 ${oct('a-')}
| o2 ${oct('b-')} ${up}
| o2 ${oct('g')}
| o2 ${oct('f')}
| o2 ${oct('g')}
| o2 ${oct('a-')}
| o2 ${oct('b-')}
| o2 ${oct('f')}
| o2 ${oct('g')}
| o2 a- a- >a- <a- b- b- >b- <b-
| o2 ${oct('g')}
| o2 ${oct('e-')}
| o2 ${oct('d')}
| o2 ${oct('c')}
| o1 ${oct('a-')}
| o2 ${oct('e-')}
| o1 ${oct('b-')}
| o1 ${oct('a-')}
| o1 ${oct('g')} ${up} ${down}
| o2 g g g g g g g g
| o2 c r r4 r2 |`,
    n: `v15 l8 [| k h s h k k s k]7 | k h s h s s t t
[| k k s h k k s h]7 | k k s h s s16 s16 t t
l16 [${hats}]7 | k h h h s h h h s s s s t8 t8
l8 | k h s h k k s h | k h s h k k s h | t t t t m m s s | c4 r4 s16 s16 s16 s16 t t |`,
  },
}
