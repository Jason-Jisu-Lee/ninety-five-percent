const call = `
| r o5 d f g4 b-4 a
| o5 g2 r2
| r o5 d f g4 >d4 c
| o5 a2 r2`
const verse = `${call}
| r o5 d f g4 b-4 >d
| o6 e-4. d <b-2
| o5 g4. f e-4 c4
| o5 d2 c2`
const chorus = `
| o5 b-4. >d^4 c <b-
| o5 a4. >c^4 <b- a
| o5 a4 f d^4 f4
| o5 g4. b >d2
| o6 e-4. d^4 c <b-
| o5 a4. g^4 f e-
| o5 d4 f b-^4 f4
| o5 d2 f+2`
const reply = `@0 v8 x4 q8 l8
| r1
| r2 o4 b- >e- g b-
| r1
| r2 o5 c <a f a`
const under = `${reply}
@1 v8 x12
| r o4 b- >d d4 g4 b-
| o5 g4. b- g2
| o5 e-4. d c4 <g4
| o4 b-2 a2`
const pluck = `@0 v7 x3 q8 l8
| o4 g b- >d <b- g b- >d <b-
| o4 f a >c <a f a >c <a
| o4 f a >c <a f a >c <a
| o4 g b >d f d <b g b`
const vamp = '| o2 g4 r g r4 >d <g | o2 e-4 r e- r4 b- e- | o2 b-4 r b- r4 >f <b- | o2 f4 r f r4 >c <f'
const walk = `${vamp} | o2 g4 r g r4 >d <g | o2 e-4 r e- r4 b- e- | o2 c4 r c r4 g c | o2 f4 r f r2`
const pedal = '| o2 e-4. e- r4 e-4 | o2 e-4. e- r4 e-4 | o2 d4. d r4 a4 | o2 g4. g r4 b4 | o3 c4. c r4 <g4 | o2 f4. f r4 >c4 | o2 b-4. b- r4 f4 | o2 d4. d f+4 a4'
const g1 = '| k r h r s r h k h r k r s r h r', g2 = '| k r h r s r h r h k k r s r h h'
const drop = '| k r h r s r h r r r r r r r r r'
const full = `v12 | c4 s r h k h r k r s r h r ${g2} ${g1} ${g2} ${g1} ${g2} ${g1} | k r h r s r h r s r s r s s s s`

export default {
  title: 'Tin Lantern',
  bpm: 104,
  beats: 4,
  tail: 6,
  send: { a: .3, b: .25 },
  feel: [.006, 1],
  intro: {
    a: `[| r1]4 |`,
    b: `${reply} |`,
    w: `@1 v3 q6 l8 | o2 g4 r g r4 >d <g | o2 e-4 r e- r4 b- e- | o2 g4 r g r4 >d <g | o2 f4 r f r4 >c <f |`,
    n: `v11 l16 | k r h r r r h r k r h r r r h r | k r h r r r h r k r h r s r h h ${g1} ${g2} |`,
  },
  loop: {
    a: `@2 v11 x0 q7 ~2 l8 ${verse}
v12 ${chorus}
v11 ${verse}
v13 ${chorus}
v10 x14 q8
| o5 g2 b-2 | o5 a2 >c2 | o6 d1 | r1
v11 x0 q7 ${call} |`,
    b: `${under}
${pluck}
| o4 g b- >e- <b- g b- >e- <b-
| o4 a >c e- c <a >c e- c
| o4 f b- >d <b- f b- >d <b-
| o4 f+ a >c <a f+ a >c <a
${under}
${pluck}
@1 v6 x0 q6 l16
| o4 [g b- >e- <b-]4 | [a >c e- c<]4 | [f b- >d <b-]4 | [f+ a >c <a]4
@1 v8 x14 q8 l8
| o5 e-2 g2 | o5 f2 a2 | o5 b-1 | r2 o5 d f g a
${reply} |`,
    w: `@1 v3 q6 l8 ${walk} ${pedal} ${walk} ${pedal}
| o2 e-1 | o2 f1 | o2 g1 | o2 g2 r2
${vamp} |`,
    n: `v11 l16 [| k r h r r r h r k r h r r r h r]4 ${g1} ${g2} ${g1} ${drop}
${full}
v11 ${g1} ${g2} ${g1} ${g2} ${g1} ${g2} ${g1} ${drop}
${full}
| c1 | r1 | r1 | r2 s16 s16 s16 s16 s16 s16 s16 s16
v11 ${g1} ${g2} ${g1} ${g2} |`,
  },
}
