import { hats, oct, roll } from '../chip/kit.mjs'

const riff = `
| o5 d4 f a4 g f e
| o5 e4. c ^2
| o5 d4 f b-4 a g f
| o5 e4. c+ ^4 <a >c+
| o5 f4 a >d4 c <a g
| o5 g4. e ^2`
const Dm = '| o4 [d f a f]4', C = '| o4 [e g >c <g]4', Bb = '| o4 [d f b- f]4', A = '| o4 [e a >c+ <a]4', F = '| o4 [c f a f]4', Gm = '| o4 [d g b- g]4'
const fall = `
| o2 ${oct('d')}
| o2 ${oct('c')}
| o1 ${oct('b-')}
| o1 ${oct('a')}`
const gal = '| k k16 k16 s h k k16 k16 s h'

export default {
  title: 'On the Wing II',
  bpm: 152,
  beats: 4,
  tail: 24,
  intro: {
    a: `@1 v12 x0 q8 ~0 l16
| o5 d <a >d <a >e <a >e <a >f <a >f <a >g <a >g <a
| o5 a d a d g d g d f d f d e d e d
@2 v13 q6 l8
| o5 d d r f r f d4
| o5 e e r g r g a4 |`,
    b: `@1 v8 x0 q8 l16
| o4 f r f r g r g r a r a r b- r b- r
| o5 f r f r e r e r d r d r c+ r c+ r
v9 q6 l8
| o4 a a r >d r d <a4
| o5 c+ c+ r e r e e4 |`,
    w: `@1 v3 q7 l8
| o2 d d d d d d d d
| o2 d d d d d d d d
| o2 d d r d r d d4
| o1 a a r a r a a4 |`,
    n: `v15 l16
| h h h h h h h h h h h h h h h h
| h h h h h h h h h h h h s s s s
l8 | k k r s r s c4
| k k r s r s s16 s16 s16 s16 |`,
  },
  loop: {
    a: `@2 v13 x0 q7 ~2 l8 ${riff}
| o5 b-4 a g4 f e d
| o5 c+4. e a4 r4 ${riff}
| o5 g4 b- >d4 c <b- a
| o5 g4 e c+ d2
@1 v12
| o5 a2. g f
| o5 g2. f e
| o5 f2. e d
| o5 e2 c4 e4
| o5 d2. f b-
| o6 c2. <b- a
| o5 b-2 g4 b-4
| o5 a4 g e c+4 e g
@2 v11 q8 ~3
| o5 d2 f2
| o5 e2 g2
| o5 f2 a2
| o6 d1
| o5 b-2 >d2
| o6 c2 e2
| o6 c+1
| o6 c+2 <a4 >e4
v12 ~0 l16
| o5 d f a f d f a f >d <a f a >d <a f a
| o5 c e g e c e g e >c <g e g >c <g e g
| o4 b- >d f d <b- >d f d b- f d f b- f d f
| o4 a >c+ e c+ <a >c+ e c+ a e c+ e a e c+ e
v13 q7 ~2 l8
| o5 d4 f a4 g f e
| o5 e4 g >c4 <b- a g
| o5 f4 d f e4 c+ e
| o5 d2 r2 |`,
    b: `@1 v7 x0 q6 l16 ${Dm} ${C} ${Bb} ${A} ${Dm} ${C} ${Bb} ${A}
${Dm} ${C} ${Bb} ${A} ${Dm} ${C} ${Gm}
| o4 [e a >c+ <a]2 [d f a f]2
${F}
| o4 [c e g e]4 ${Dm}
| o4 [c e a e]4 ${Bb} ${F} ${Gm} ${A}
@0 v8 x4 q8 l8
| o4 d f b- f d f b- f
| o4 e g >c <g e g >c <g
| o4 d f a f d f a f
| o4 d f a f d f a f
| o4 d f b- f d f b- f
| o4 e g >c <g e g >c <g
| o4 e a >c+ <a e a >c+ <a
@1 v7 x0 q6 l16 ${A}
v9 q5 l8
| o4 a r a r r a r a
| g r g r r g r g
| f r f r r f r f
| e r e r r e r e
v7 q6 l16 ${Dm} ${C}
| o4 [d f b- f]2 [e a >c+ <a]2
| o4 [d f a f]2 r2 |`,
    w: `@1 v3 q7 l8 ${fall} ${fall} ${fall}
| o2 ${oct('d')}
| o2 ${oct('c')}
| o2 ${oct('g')}
| o1 a a >a <a >d d >d <d
| o2 ${oct('f')}
| o2 ${oct('c')}
| o2 ${oct('d')}
| o1 ${oct('a')}
| o1 ${oct('b-')}
| o1 ${oct('a')}
| o2 ${oct('g')}
| o1 ${oct('a')}
| o1 b-1
| o2 c1
| o2 d1
| o2 d2 d4 d4
| o1 b- b- b- b- b- b- b- b-
| o2 c c c c c c c c
| o1 a a a a a a a a
| o1 a a a a a a a16 a16 a16 a16 ${fall}
| o2 ${oct('d')}
| o2 ${oct('c')}
| o1 b- b- >b- <b- a a >a <a
| o2 d d >d <d d4 r4 |`,
    n: `v15 l8 [${gal}]7 | k k16 k16 s h s s16 s16 s s
[${gal}]7 | k k16 k16 s h s16 s16 s16 s16 s s
l16 [${hats}]7 ${roll}
l8 | c2. r4 | r1 | t4 r4 t4 r4 | t4 r4 t t t t | k4 t t k4 t t | k4 t t k4 t t | k t t k t t k t
| s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16 s16
[| k k s h k k s h]3 | k k s k s s16 s16 s s [${gal}]3 | k h s h c4 s16 s16 s16 s16 |`,
  },
}
