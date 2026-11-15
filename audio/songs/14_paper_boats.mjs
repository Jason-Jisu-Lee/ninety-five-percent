const verse = `
| o5 b4 a g4.
| o5 e4 g e4.
| o5 d4 g b4 a
| o5 a4. f+4.
| o5 b4 a g4.
| o5 e4 g >c4.
| o5 b4 a f+4 d
| o5 e4. d4.`
const lift = `
| o5 c4 e g4 e
| o5 d f+ a b4.
| o6 c4. <b a g
| o5 a4.^4 r8`
const chorus = `
| o6 e4. d c <g
| o5 a4 >d4 c4
| o5 b4. a f+ d+
| o5 e4. g4.
| o6 e4. d c <g
| o5 a4 >d4 e4
| o6 d4. <b g b
| o5 g2.`
const box = `@0 v9 x4 q8 l8
| o5 e g b >e <b g
| o5 e g b >e <b g
| o5 e g >c e c <g
| o5 d f+ a >d <a f+`
const flow = `@1 v7 x3 q8 l8
| o4 e a >c e c <a
| o4 f+ b >d f+ d <b
| o4 g >c e g e c
| o4 a >d f+ a f+ d`
const sway = '| o2 e4. b4. | o2 c4. g4. | o2 g4. >d4. | o2 f+4. a4. | o2 e4. b4. | o2 c4. g4. | o2 d4. a4. | o2 d4. a4.'
const climb = '| o2 a4. >e4. | o2 b4. >f+4. | o3 c4. <g4. | o3 d4. <a4.'
const roll = '| o2 c4 c g4 g | o2 d4 d a4 a | o1 b4 b >f+4 f+ | o2 e4 e b4 b | o2 c4 c g4 g | o2 d4 d a4 a | o2 g4 g >d4 d | o2 g2.'
const build = '[| k h h s h h]3 | k h h s s s'

export default {
  title: 'Paper Boats',
  bpm: 108,
  beats: 3,
  tail: 10,
  send: { a: .3, b: .2 },
  feel: [.006, 1],
  intro: {
    a: `[| r2.]4 |`,
    b: `${box} |`,
    w: `@0 v3 q7 l8 | r2. | r2. | o2 c2. | o2 d2. |`,
    n: `[| r2.]4 |`,
  },
  loop: {
    a: `@2 v10 x12 q8 ~2 l8 ${verse}
v11 x0 ${lift}
v12 ${chorus}
[| r2.]4
v10 x12 ${verse}
v11 x0 ${lift}
v13 ${chorus}
v10 x12 | o5 e4. g4. | o5 f+4. a4. | o5 g2. | r2. |`,
    b: `@1 v6 x3 q8 l8
| r o4 g b r g b
| r o4 e g r e g
| r o4 d g r d g
| r o4 d a r d a
| r o4 g b r g b
| r o4 e g r e g
| r o4 f+ a r f+ a
| r o4 f+ a r f+ a
${flow}
@1 v9 x0 q7
| o6 c4. <b a e
| o5 f+4 a4 a4
| o5 d+4. f+ d+ <b
| o4 b4. >e4.
| o6 c4. <b a e
| o5 f+4 a4 >c4
| o5 b4. g d g
| o4 b2.
${box}
@1 v8 x12 q8
| o5 g4 e e4.
| o5 c4 e c4.
| o4 b4 >d g4 f+
| o5 f+4. d4.
| o5 g4 e e4.
| o5 c4 e g4.
| o5 g4 f+ d4 <a
| o5 c4. <a4.
${flow}
@1 v6 x0 q6 l16
| o4 [e g >c <g]3
| [f+ a >d <a]3
| [f+ a >d+ <a]3
| [e g b g]3
| [e g >c <g]3
| [f+ a >d <a]3
| [d g b g]3
| [d g b g]3
@0 v9 x4 q8 l8
| o5 e g >c e c <g
| o5 d f+ a >d <a f+
| o5 e g b >e <b g
| o5 e2. |`,
    w: `@0 v3 q6 l8 ${sway} ${climb} ${roll}
| o2 e2. | o2 e2. | o2 c2. | o2 d2.
${sway} ${climb} ${roll}
| o2 c2. | o2 d2. | o2 e2. | o2 e2. |`,
    n: `v8 l8 [| r2.]4 [| k r h s r h]4
${build}
v11 | c4. s h h [| k h h s h h]6 | k h h s16 s16 s16 s16 s16 s16
[| r2.]4
v9 [| k r h s r h]7 | k r h s s s
${build}
v12 l16 | c4. s h h h h h [| k h h h h h s h h h h h]6 | k h h h h h s s s s s s
v8 l8 | k r h s r h | k r h s r h | k r r r r r | r2. |`,
  },
}
