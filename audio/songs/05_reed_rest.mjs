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
const F = '| o4 f a >c f c <a f a >c f c <a', CE = '| o4 e g >c e c <g e g >c e c <g', Dm = '| o4 d f a >d <a f d f a >d <a f', FC = '| o4 c f a >c <a f c f a >c <a f'
const Bb = '| o4 d f b- >d <b- f d f b- >d <b- f', Gm = '| o4 d g b- >d <b- g d g b- >d <b- g', C7 = '| o4 e g b- >c <b- g e g b- >c <b- g', Am = '| o4 e a >c e c <a e a >c e c <a'
const back = `${F} ${CE} ${Dm} ${FC} ${Bb} ${FC}
| o4 d g b- >d <b- g d g e g b- g ${FC}`
const walk = '| o3 f2 c | o3 e2 c | o3 d2 <a | o3 c2 c | o2 b-2 >f | o2 a2 >f | o2 g2 >c'

export default {
  title: 'Reed Rest',
  bpm: 100,
  beats: 3,
  tail: 12,
  send: { a: .35, b: .2 },
  intro: {
    a: `| r2. | r2. | r2. | r2. |`,
    b: `@1 v6 x3 q8 l16 ${F} ${CE} ${Dm} ${C7} |`,
    w: `@0 v2 q8 | o3 f2. | e2. | d2. | c2. |`,
    n: `| r2. | r2. | r2. | r2. |`,
  },
  loop: {
    a: `@0 v14 x7 q8 ~0 l4 ${sigh}
| o5 a2 f
| o5 g4. a8 b-
| o5 g2 e
| o5 d8 f8 a2
| o5 e8 a8 >c2
| o5 f8 b-8 >d2
| o6 c4. <a8 f
| o5 g4. b-8 >d
| o6 c2 <a
| o5 f g a
| o5 b-2 g ${home}
l8
| o5 f b- >d f d <b-
| o5 e g >c e c <g
| o5 e a >c e c <a
| o5 f a >d f d <a
| o6 d4. c <b-4
| o6 c4. <b- g4
| o5 a4. g f4
| o5 g2 e4
l4 ${home} |`,
    b: `@1 v6 x3 q8 l16 ${F} ${CE} ${Dm} ${FC} ${Bb} ${FC} ${Gm} ${C7}
${Dm} ${Am} ${Bb} ${FC} ${Gm} ${FC} ${Bb} ${C7}
${back}
${Bb} ${CE} ${Am} ${Dm} ${Bb} ${CE} ${F} ${C7}
${back} |`,
    w: `@0 v2 q8 l4
| o3 f2. | e2. | d2. | c2. | o2 b-2. | a2. | g2. | o3 c2.
| o3 d2. | o2 a2. | b-2. | o3 f2. | o2 g2. | a2. | b-2. | o3 c2.
${walk} | o2 f2.
| o2 b-2 >f | o3 c2 <g | o2 a2 >e | o3 d2 <a | o2 b-2 >f | o3 c2 <g | o3 f2 c | o3 c2 e
${walk} | o2 f2 >c |`,
    n: `v5 l4 [| r2.]8 [| r h h]16 [| k h h]8 [| r h h]7 | r2. |`,
  },
}
