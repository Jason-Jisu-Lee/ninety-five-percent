const sigh = `
| o5 a4. g8 f
| o5 g2 c
| o5 f4. e8 d
| o5 c2.
| o5 d4. f8 b-`
const home = `${sigh}
| o6 c2 <a
| o5 b- a g
| o5 f2.`
const F = '| o4 f a >c <a f a', CE = '| o4 e g >c <g e g', Dm = '| o4 d f a f d f', FC = '| o4 c f a f c f', Bb = '| o4 d f b- f d f'
const Gm = '| o4 d g b- g d g', C7 = '| o4 e g b- g e g'

export default {
  title: 'Reed Rest',
  bpm: 92,
  beats: 3,
  tail: 4,
  intro: {
    a: `| r2. | r2. |`,
    b: `@1 v6 x3 q8 l8 ${F} ${F} |`,
    w: `@0 v2 q8 | o3 f2. | f2. |`,
    n: `| r2. | r2. |`,
  },
  loop: {
    a: `@0 v14 x7 q8 ~0 l4 ${sigh}
| o5 a2 f
| o5 g4. a8 b-
| o5 g2 e ${home}
| o5 d8 f8 a2
| o5 e8 a8 >c2
| o5 f8 b-8 >d2
| o6 c4. <a8 f
| o5 g4. b-8 >d
| o6 c2 <a
| o5 f g a
| o5 b-2 g ${home} |`,
    b: `@1 v6 x3 q8 l8 ${F} ${CE} ${Dm} ${FC} ${Bb} ${FC} ${Gm} ${C7}
${F} ${CE} ${Dm} ${FC} ${Bb} ${FC}
| o4 d g b- g e g ${FC}
${Dm}
| o4 e a >c <a e a ${Bb} ${FC} ${Gm} ${FC} ${Bb} ${C7}
l16
| o4 f a >c f c <a f a >c f c <a
| o4 e g >c e c <g e g >c e c <g
| o4 d f a >d <a f d f a >d <a f
| o4 c f a >c <a f c f a >c <a f
| o4 d f b- >d <b- f d f b- >d <b- f
| o4 c f a >c <a f c f a >c <a f
| o4 d g b- >d <b- g d g e g b- g
| o4 c f a >c <a f c f a >c <a f |`,
    w: `@0 v2 q8 l4
| o3 f2. | e2. | d2. | c2. | o2 b-2. | a2. | g2. | o3 c2.
| o3 f2. | e2. | d2. | c2. | o2 b-2. | a2. | g2 >c | o2 f2.
| o3 d2. | o2 a2. | b-2. | o3 f2. | o2 g2. | a2. | b-2. | o3 c2.
| o3 f2 c | o3 e2 c | o3 d2 <a | o3 c2 c | o2 b-2 >f | o2 a2 >f | o2 g2 >c | o2 f2. |`,
    n: `v5 l4 [| r2.]16 [| r h h]15 | r2. |`,
  },
}
