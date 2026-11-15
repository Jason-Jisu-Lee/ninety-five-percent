import { oct } from '../chip/kit.mjs'

const Bb = '| o4 [f b- >d <b-]4', Eb = '| o4 [g b- >e- <b-]4', F = '| o4 [f a >c <a]4', Gm = '| o4 [g b- >d <b-]4', F7 = '| o4 [f a >c <a]2 [f a >e- <a]2'
const beat = '| k h s h k k s h'

export default {
  title: 'New Wings',
  bpm: 144,
  beats: 4,
  tail: 4,
  intro: {
    a: `@2 v13 x0 q8 ~2 l16
| o4 f b- >d f f4. d8 <b-4
| o4 g b- >e- g g4. e-8 <b-4
| o4 a >c f a a4. f8 c4
| o5 b-2. r4 |`,
    b: `@1 v9 x0 q8 l16
| o4 d f b- >d d4. <b-8 f4
| o4 e- g b- >e- e-4. <b-8 g4
| o4 f a >c f f4. c8 <a4
| o5 f2. r4 |`,
    w: `@1 v3 q7 l8 | o2 b-2. b-4 | o2 e-2. e-4 | o2 f2. f4 | o2 b- b- b- b- b-4 r4 |`,
    n: `v15 l16 | c2. s s s s | c2. s s s s | c2. s s s s | s s s s s s s s c4 r4 |`,
  },
  loop: {
    a: `@2 v13 x0 q7 ~2 l8
| o5 d f b-4 >c <b- >d4
| o6 e-4 d c <b-4 g4
| o5 a >c f4 e- d c4
| o6 d4. <b- f2
| o5 g b- >d4 c <b- g4
| o5 g b- >e-4 d c <b-4
| o6 c4 <a f a4 >c4
| o5 b-4. f b-4 r4
| o6 e-2 d4 c4
| o6 c2 <a4 f4
| o5 f4. a >d4 c <a
| o5 b-2 g4 d4
| o5 e- g b- >e- d c <b- g
| o5 f a >c f e- c <a f
| o5 b-4 >d4 f4 d4
| o6 c4 <a f e-4 c4 |`,
    b: `@1 v7 x0 q6 l16 ${Bb} ${Eb} ${F} ${Bb} ${Gm} ${Eb} ${F} ${Bb}
${Eb} ${F}
| o4 [f a >d <a]4 ${Gm} ${Eb} ${F7} ${Bb} ${F7} |`,
    w: `@1 v3 q7 l8
| o2 ${oct('b-')}
| o2 ${oct('e-')}
| o2 ${oct('f')}
| o2 ${oct('b-')}
| o2 ${oct('g')}
| o2 ${oct('e-')}
| o2 ${oct('f')}
| o2 b- b- >b- <b- b- f g a
| o2 ${oct('e-')}
| o2 ${oct('f')}
| o2 ${oct('d')}
| o2 ${oct('g')}
| o2 ${oct('e-')}
| o2 ${oct('f')}
| o2 ${oct('b-')}
| o2 f f >f <f f g a a |`,
    n: `v15 l8 [${beat}]3 | k h s h k s s16 s16 s [${beat}]3 | k h s h s16 s16 s16 s16 s s
l16 | c4 s h h h k h k h s h h h [| k h h h s h h h k h k h s h h h]6 | k h h h s h h h s s s s s8 s8 |`,
  },
}
