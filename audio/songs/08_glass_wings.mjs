const first = `
| o5 g4. f8 e-
| o5 f2 c
| o5 f4. e-8 d
| o5 d2 <b-
| o5 e-4. g8 b-`
const again = `${first}
| o6 c2 <a
| o6 d4. c8 <a
| o5 b-2 g`
const Eb = '| o4 e- g b- >e- <b- g e- g b- >e- <b- g', F = '| o4 f a >c f c <a f a >c f c <a', Dm = '| o4 d f a >d <a f d f a >d <a f', Gm = '| o4 d g b- >d <b- g d g b- >d <b- g'
const Cm = '| o4 e- g >c e- c <g e- g >c e- c <g', Bb = '| o4 d f b- >d <b- f d f b- >d <b- f', D = '| o4 d f+ a >d <a f+ d f+ a >d <a f+'
const road = `${Eb} ${F} ${Dm} ${Gm}`
const step = '| o2 e-2 b- | o2 f2 >c | o2 d2 a | o2 g2 >d | o2 e-2 b- | o2 f2 >c'

export default {
  title: 'Glass Wings',
  bpm: 116,
  beats: 3,
  tail: 20,
  send: { a: .35, b: .2 },
  intro: {
    a: `| r2. | r2. | r2. | r2. |`,
    b: `@1 v6 x3 q8 l16 ${road} |`,
    w: `@0 v2 q8 | o2 e-2. | f2. | d2. | g2. |`,
    n: `| r2. | r2. | r2. | r2. |`,
  },
  loop: {
    a: `@0 v14 x7 q8 ~0 l4 ${first}
| o5 a2 f
| o5 a4. g8 f
| o5 g2. ${again}
| o5 e-8 g8 >c2
| o5 f8 a8 >e-2
| o5 f8 b-8 >d2
| o6 d4. <b-8 g
| o5 g4. >c8 e-
| o6 e-2 c
| o6 d2 <a
| o5 f+2.
l8
| o5 e- g b- >e- <b- g
| o5 f a >c f c <a
| o5 f a >d f d <a
| o5 d g b- >d <b- g
| o6 e-4. d <b-4
| o6 c4. <a f4
| o5 b-4. a g4
| o5 g2.
l4 ${again} |`,
    b: `@1 v6 x3 q8 l16 ${road} ${road} ${road} ${road}
${Cm} ${F} ${Bb} ${Gm} ${Cm} ${F} ${D} ${D}
${road} ${Eb} ${F} ${Gm} ${Gm}
${road} ${road} |`,
    w: `@0 v2 q8 l4
| o2 e-2. | f2. | d2. | g2. | o2 e-2. | f2. | d2. | g2.
${step} | o2 d2 a | o2 g2.
| o3 c2. | o2 f2. | b-2. | g2. | o3 c2 <g | o2 f2 >c | o2 d2 a | o2 d2 f+
${step} | o2 g2 >d | o2 g2.
${step} | o2 d2 a | o2 g2 >d |`,
    n: `v5 l4 [| r2.]8 [| r h h]16 [| k h h]8 [| r h h]7 | r2. |`,
  },
}
