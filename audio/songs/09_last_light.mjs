import { beat, crash, hats, oct, roll } from '../chip/kit.mjs'

const riff = `
| o5 e-4 g >c4 <b- a- g
| o5 f4. d ^2
| o5 d4 g b-4 a- g f
| o5 g4. e- ^4 c e-
| o5 a-4 >c e-4 d c <b-
| o5 b-4. f ^2`
const chorus = `
| o6 e-4. d c4 <a-4
| o6 d4. c <b-4 f4
| o5 b-4. a- g4 b-4
| o6 c2 <g4 e-4
| o6 e-4. d c4 e-4
| o6 f4. e- d4 <b-4
| o6 d4. <b- g4 >d4
| o6 c2. r4`
const Ab = '| o4 [e- a- >c <a-]4', Bb = '| o4 [f b- >d <b-]4', Gm = '| o4 [d g b- g]4', Cm = '| o4 [e- g >c <g]4', Fm = '| o4 [f a- >c <a-]4', Eb = '| o4 [e- g b- g]4', G = '| o4 [d g b g]4'
const road = `${Ab} ${Bb} ${Gm} ${Cm}`
const run = `
| o2 ${oct('a-')}
| o2 ${oct('b-')}
| o2 ${oct('g')}
| o2 ${oct('c')}`

export default {
  title: 'Last Light',
  bpm: 152,
  beats: 4,
  tail: 16,
  send: { a: .2, b: .1 },
  intro: {
    a: `@1 v11 x0 q8 ~0 l16
| o5 c e- g e- c e- g e- >c <g e- g >c <g e- g
| o5 d f b- f d f b- f >d <b- f b- >d <b- f b-
@2 v13 q6 l8
| o5 e- e- r g r g e-4
| o5 d d r g r g b4 |`,
    b: `@1 v8 x0 q6 l8
| o4 g r g r r g r g
| o4 f r f r r f r f
| o5 c c r e- r e- c4
| o4 b b r >d r d g4 |`,
    w: `@1 v3 q7 l8
| o2 c c c c c c c c
| o1 b- b- b- b- b- b- b- b-
| o2 c c r c r c c4
| o1 g g r g r g g4 |`,
    n: `v15 l16
| h h h h h h h h h h h h h h h h
| h h h h h h h h h h h h s s s s
l8 | k k r s r s c4
| k k r s r s s16 s16 s16 s16 |`,
  },
  loop: {
    a: `@2 v13 x0 q7 ~2 l8 ${riff}
| o5 b-4 a- g4 f e- d
| o5 e-4. g >c4 r4 ${riff}
| o5 f4 a- >c4 <b- a- g
| o5 f4 d <b >c2
@1 v12
| o5 a-2. g f
| o5 f2. e- d
| o5 g2. f e-
| o5 g2 e-4 c4
| o5 f2. a- >c
| o6 d2. c <b-
| o5 b2 g4 b4
| o6 d2. r4
@2 v13 ${chorus}
v12 q8 ~0 l16
| o5 c e- g e- c e- g e- >c <g e- g >c <g e- g
| o4 b- >e- g e- <b- >e- g e- b- g e- g b- g e- g
| o4 a- >c e- c <a- >c e- c a- e- c e- a- e- c e-
| o4 g b >d <b g b >d <b >f d <b >d f d <b >d
v13 q7 ~2 l8
| o5 g4. e- c4 e-4
| o5 f4. d <b-4 >d4
| o5 e-4 c e- f4 d f
| o5 g2. r4 ${chorus} |`,
    b: `@1 v7 x0 q6 l16 ${road} ${road}
${road} ${Ab} ${Bb} ${Fm}
| o4 [f g b g]2 [e- g >c <g]2
${Fm} ${Bb} ${Eb} ${Cm} ${Fm} ${Bb} ${G} ${G}
${road} ${road}
v9 q5 l8
| o4 g r g r r g r g
| g r g r r g r g
| a- r a- r r a- r a-
| g r g r r g r g
v7 q6 l16 ${Cm} ${Bb}
| o4 [e- a- >c <a-]2 [f b- >d <b-]2
| o4 [e- g >c <g]2 r2
v9 q7 l8
| o6 c4. <b- a-4 e-4
| o5 b-4. a- f4 d4
| o5 g4. f d4 g4
| o5 g2 e-4 c4
| o6 c4. <b- a-4 >c4
| o6 d4. c <b-4 f4
| o5 b-4. g d4 b-4
| o5 g2. r4 |`,
    w: `@1 v3 q7 l8 ${run} ${run} ${run}
| o2 ${oct('a-')}
| o2 ${oct('b-')}
| o2 ${oct('f')}
| o2 g g >g <g c c >c <c
| o2 ${oct('f')}
| o2 ${oct('b-')}
| o2 ${oct('e-')}
| o2 ${oct('c')}
| o2 ${oct('f')}
| o2 ${oct('b-')}
| o2 ${oct('g')}
| o2 ${oct('g')} ${run} ${run}
| o2 ${oct('c')}
| o1 ${oct('b-')}
| o1 ${oct('a-')}
| o1 ${oct('g')}
| o2 ${oct('c')}
| o1 ${oct('b-')}
| o1 a- a- >a- <a- b- b- >b- <b-
| o2 c c >c <c c4 r4 ${run} ${run} |`,
    n: `v15 l8 [${beat}]7 | k h s h k s s16 s16 s16 s16
[${beat}]7 | k h s h s s16 s16 s s
l16 [${hats}]7 ${roll}
${crash} [${hats}]6 ${roll}
l8 [| k k s h k k s h]3 | k k s k s s16 s16 s s [${beat}]3 | k h s h c4 s16 s16 s16 s16
l16 ${crash} [${hats}]6 | k h h h s h h h k8 s8 s s s s |`,
  },
}
