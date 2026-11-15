const hop = `
| o5 e g >c4 <a g e4
| o5 c+ e g4 b- a g4
| o5 f a >d4 c <a f4
| o5 d f b4 a g f4
| o5 e g >c4 e d c4
| o6 c+ <a g4 e c+ e4
| o5 f a >d <a b g f d
| o5 c4 r g >c4 r4`
const C = '{eg>c}', A7 = '{eg>c+}', Dm = '{fa>d}', G7 = '{fgb}', F = '{fa>c}', D7 = '{f+a>c}'
const comp = c => `| r ${c} r ${c}`
const stride = `${comp(C)} ${comp(A7)} ${comp(Dm)} ${comp(G7)} ${comp(C)} ${comp(A7)}
| r ${Dm} r ${G7}
| ${C} r ${C} r`
const walk = `
| o2 c e g e
| o2 a >c+ e c+
| o2 d f a f
| o2 g b >d <b
| o2 c e g e
| o2 a >c+ e c+
| o2 d f g b
| o3 c r8 <g8 c r`
const ride = '| k4 s h k4 s h'

export default {
  title: 'Energy Bloom',
  bpm: 132,
  swing: .64,
  beats: 4,
  tail: 8,
  intro: {
    a: `| r1 | r1 |`,
    b: `@1 v8 x0 q4 l4 o4 ${comp(C)} ${comp(G7)} |`,
    w: `@1 v3 q6 l4 | o2 c e g e | o2 g b >d <b |`,
    n: `v12 l8 ${ride} | k4 s h s s s16 s16 s |`,
  },
  loop: {
    a: `@2 v12 x6 q7 ~0 l8 ${hop}
| o5 a4. >c <a4 f4
| o5 a4. >c <a4 f+4
| o5 g4. >c e4 c4
| o6 c+4. <a g4 e4
| o5 f+ a >c4 <a f+ d4
| o5 f+ a >c d c <a f+4
| o5 g b >d4 f d <b4
| o5 g4 r4 r2 ${hop} |`,
    b: `@1 v8 x0 q4 l4 o4 ${stride}
${comp(F)} ${comp(D7)} ${comp(C)} ${comp(A7)} ${comp(D7)} ${comp(D7)} ${comp(G7)}
| ${G7} r r2
${stride} |`,
    w: `@1 v3 q6 l4 ${walk}
| o2 f a >c <a
| o2 f+ a >c <a
| o2 g >c e c
| o2 a >c+ e c+
| o2 d f+ a f+
| o2 d f+ a >c
| o2 g b >d <b
| o2 g r r2 ${walk} |`,
    n: `v12 l8 [${ride}]7 | k4 r s k4 r4
[| k4 s h k k s h]6 | k4 s h k4 s s | c4 r4 s s s16 s16 s
[${ride}]7 | k4 r s k4 s16 s16 s |`,
  },
}
