const tune = `
| o5 d2 f4 a4
| o5 g2. e4
| o5 c4. e g2
| o5 f2. r4
| o5 d4 f4 b-2
| o5 a4. g e2
| o5 g4 a2.
| ^2 r2`
const again = `
| o5 d2 f4 a4
| o5 g2. e g
| o6 c4. <a g2
| o5 f2 r8 d f a
| o5 b-2 >d4 <b-4
| o5 a4. g e4 g4
| o5 f1
| ^2 r2`
const away = `
| o5 b-2 a4 f4
| o5 a4. g f2
| o5 g4. a b-4 >d4
| o6 c2. <g4
| o6 d2 c4 <b-4
| o5 a2 >c4 <a4
| o5 g4 b-4 g4 e4
| o5 f1`
const close = `
| o5 d2 f2
| o5 e2 g2
| o5 a1
| ^1`
const below = `
| o4 b-2 >d4 f4
| o5 e2. c e
| o5 a4. e e2
| o5 d2 r2
| o5 g2 b-4 g4
| o5 e2 c4 e4
| o4 a1
| ^2 r2`
const B = '| o4 d f b- >d <b- f d f', C = '| o4 e g >c e c <g e g', Am = '| o4 e a >c e c <a e a'
const Dm = '| o4 f a >d f d <a f a', Gm = '| o4 d g b- >d <b- g d g', F = '| o4 f a >c f c <a f a'
const wide = `
| o4 d f b- >d f d <b- f
| o4 e g >c e g e c <g
| o4 e a >c e g e c <a
| o4 f a >d f a f d <a
| o4 d g b- >d g d <b- g
| o4 e g >c e g e c <g
| o4 f a >c f a f c <a
| o4 f a >c f a f c <a`
const low = '| o1 b-2. >f4 | o2 c2. g4 | o1 a2. >e4'
const chords = '| o3 {b->df}1 | o3 {g>cde}1 | o3 {a>ceg}1 | o3 {a>cdf}1'
const pads = `${chords} | o3 {b->dfg}1 | o3 {g>ce}1 | o3 {a>cfg}1 | o3 {a>cf}1`
const sway = '| k4 e e s4 e e | k e e k s4 e e'
const beat = `[${sway}]3 | k4 e e s4 e e | k4 e e s e16 e16 e e`

export default {
  title: 'Drift',
  bpm: 84,
  beats: 4,
  tail: 4,
  send: { a: .35, b: .25, c: .3 },
  feel: [.008, 1],
  intro: {
    a: `@2 v9 x14 q8 ~2 l8 | r1 | r1 | o5 e2 g2 | o5 f2. r4 |`,
    b: `[| r1]4 |`,
    c: `@0 v6 x4 q8 l8 ${B} ${C} ${Am} ${Dm} |`,
    w: `@1 v2 q8 l8 ${low} | o2 d2. a4 |`,
    n: `v8 l8 [| k4 e e r4 e e]4 |`,
    s: `v5 x0 ${chords} |`,
  },
  loop: {
    a: `@2 v10 x14 q8 ~2 l8 ${tune} ${again} v11 ${away} ${again} v10 ${close} |`,
    b: `@1 v7 x14 q8 l8 [| r1]4
| o4 b-4 >d4 g2
| o5 e2 c2
| o5 c4 f2.
| ^2 r2 ${below}
| o5 d1
| o5 c1
| o4 b-2 >d2
| o5 e2. r4
| o5 f2 e4 d4
| o5 c2 f4 c4
| o4 b-4 >d4 e4 c4
| o4 a1 ${below}
| o4 b-2 >d2
| o5 c2 e2
| o5 f1
| ^1 |`,
    c: `@0 v6 x4 q8 l8 ${B} ${C} ${Am} ${Dm} ${Gm} ${C} ${F} ${F} ${wide}
l4 | o4 d f b- >d< | o4 c f a >c< | o4 d g b- >d< | o4 e g >c e< | o4 d f b- >d< | o4 c f a >c< | o4 d g e g | o4 c f a >c<
l8 ${wide} ${B} ${C} ${F} | o4 f a >c f r2 |`,
    w: `@1 v2 q8 l8 ${low} | o2 d2. a4 | o1 g2. >d4 | o2 c2. e4 | o2 f2. c4 | o2 f2 c2
${low} | o2 d2. c4 | o1 g2. >d4 | o2 c2. e4 | o2 f2. c4 | o2 f2. a4
| o1 b-2. >f4 | o1 a2. >f4 | o1 g2. >d4 | o2 c2. g4 | o1 b-2. >f4 | o1 a2. >c4 | o1 g2 >c2 | o2 f2. c4
${low} | o2 d2. c4 | o1 g2. >d4 | o2 c2. e4 | o2 f2. c4 | o2 f2. a4
| o1 b-1 | o2 c1 | o2 f1 | ^1 |`,
    n: `v9 l8 [| k4 e e s4 e e | k4 e e s4 e k]4 ${beat}
[| k4 e e r4 e e]7 | k4 e e s4 s16 s16 s ${beat}
[| k4 e e r4 e e]3 | k4 r2. |`,
    s: `v5 x0 ${pads} ${pads}
| o3 {b->df}1 | o3 {a>cf}1 | o3 {b->dg}1 | o3 {g>ce}1 | o3 {b->df}1 | o3 {a>cf}1 | o3 {b->dg}2 {g>ce}2 | o3 {a>cf}1 ${pads}
| o3 {b->df}1 | o3 {g>cde}1 | o3 {a>cfg}1 | ^1 |`,
  },
}
