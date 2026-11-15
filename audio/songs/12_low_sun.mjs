const drift = `
| r4 o5 a4. g f4
| o5 e2 r4 c d
| o5 e4. d c4 <a4
| o5 c4 <a2 r4
| r4 o5 a4. >c <a4
| o5 g2 r4 e g
| o5 a4. g e4 c4
| o5 d1`
const Bb = '| o4 d f a >d <a f d f', C = '| o4 e g >c e c <g e g', Am = '| o4 c e g >c <g e c e', Dm = '| o4 c f a >c <a f c f'
const Gm = '| o4 d f b- >d <b- f d f', C7 = '| o4 e g b- >e <b- g e g', F = '| o4 e a >c e c <a e a', A7 = '| o4 e g >c+ e c+ <g e g', Dn = '| o4 d f a >d <a f d f'
const road = `${Bb} ${C} ${Am} ${Dm}`
const sway = '| o2 b-4. b-^2 | o3 c4. c^2 | o2 a4. a^2 | o3 d4. d^2'
const lazy = '| k r r h r h k r s r r h r h r r'

export default {
  title: 'Low Sun',
  bpm: 84,
  beats: 4,
  tail: 4,
  tone: 5200,
  send: { a: .45, b: .3 },
  intro: {
    a: `| r1 | r1 | r1 | r1 |`,
    b: `@0 v7 x4 q8 l8 ${road} |`,
    w: `@0 v3 q8 | o2 b-1 | o3 c1 | o2 a1 | o3 d1 |`,
    n: `| r1 | r1 | r1 | r1 |`,
  },
  loop: {
    a: `@2 v10 x12 q8 ~2 l8 ${drift}
| o5 d4 f g^4 f4
| o5 e4 g b-^4 g4
| o5 a4 >c e^4 c4
| o5 a2. r4
| o5 b-4 a g^4 f4
| o5 e4 f g^4 b-4
| o5 a4 g e^4 c+4
| o5 d1
v11 ${drift}
[| r1]4 |`,
    b: `@0 v7 x4 q8 l8 ${road} ${road}
${Gm} ${C7} ${F} ${Dm} ${Gm} ${C7} ${A7} ${Dn}
${road} ${road}
${road} |`,
    w: `@0 v3 q8 l8 ${sway} ${sway}
| o2 g4. g^2 | o3 c4. c^2 | o2 f4. f^2 | o3 d4. d^2 | o2 g4. g^2 | o3 c4. c^2 | o2 a4. a^2 | o3 d4. d^2
${sway} ${sway}
| o2 b-1 | o3 c1 | o2 a1 | o3 d1 |`,
    n: `v9 l16 [${lazy}]8
[${lazy}]7 | k r r h r h k r s r s r s s s s
[| k r h h r h k r s r h h r h h r]8
[${lazy}]3 | k r r r r r r r r r r r r r r r |`,
  },
}
