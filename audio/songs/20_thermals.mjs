import { beat, crash, hats, oct, roll, soft } from '../chip/kit.mjs'

const four = '| o4 [e a >c+ <a]4 | [f+ b >d+ <b]4 | [g+ b >d+ <b]4 | [g+ >c+ e c+<]4'
const high = '| o4 [a >c+ e c+<]4 | [b >d+ f+ d+<]4 | [b >d+ g+ d+<]4 | [g+ >c+ e c+<]4'
const home = '| [g+ b >e <b]4'
const top = `${high} | [a >c+ e c+<]4 | [b >d+ f+ d+<]4 ${home} ${home}`
const pad = '| o3 {a>c+e}1 | o3 {b>d+f+}1 | o3 {b>d+g+}1 | o4 {c+eg+}1'
const rest = '| o3 {b>d+f+}1 | o3 {b>eg+}1 | o3 {b>eg+}1'
const glow = `${pad} | o3 {a>c+e}1 ${rest}`
const peak = `
| o6 e4. c+ ^4 <a4
| o6 d+4. <b ^4 f+4
| o5 b4. g+ ^4 >d+4
| o6 c+2. <b4
| o5 a4. >c+ ^4 e4`
const under = `
| o6 c+4. <a ^4 e4
| o5 b4. f+ ^4 d+4
| o5 g+4. d+ ^4 b4
| o5 e2. g+4
| o5 e4. a ^4 >c+4`
const drive = `
| o2 ${oct('a')}
| o2 ${oct('b')}
| o2 ${oct('g+')}
| o2 ${oct('c+')}
| o2 ${oct('a')}
| o2 ${oct('b')}
| o2 ${oct('e')}
| o2 e e >e <e e2`
const tick = '| k4 e e r4 e e'
const full = `l16 ${crash} [${hats}]6`

export default {
  title: 'Thermals',
  bpm: 126,
  beats: 4,
  tail: 8,
  send: { a: .3, b: .2, c: .2 },
  feel: [.006, 1],
  intro: {
    a: `[| r1]4 @2 v10 x14 q8 ~2 l8 | o5 c+1 | o5 d+1 | o5 d+2 g+2 | o5 e2. r4 |`,
    b: `[| r1]8 |`,
    c: `@1 v5 x0 q6 l16 ${four} v6 ${four} |`,
    w: `[| r1]4 @1 v3 q8 l8 | o2 a1 | o2 b1 | o2 g+1 | o2 c+2 e4 g+4 |`,
    n: `v8 l8 [| r4 e e r4 e e]4 [${tick}]3 | k4 e e s16 s16 s16 s16 s s |`,
    s: `v5 x0 ${pad} ${pad} |`,
  },
  loop: {
    a: `@2 v11 x14 q8 ~2 l8
| o5 c+2. e4
| o5 f+2 d+2
| o5 g+4. b ^2
| o5 g+2. r4
| o5 a2. g+4
| o5 f+4. b ^2
| o5 g+1
| ^2 r2
v12 x0 q7
| o5 c+4 e4 a4. g+
| o5 f+4. d+ f+4 b4
| o5 g+4 b4 >d+4. <b
| o6 c+2 <g+4 e4
| o5 a4 >c+4 <a4. f+
| o5 b4 a4 f+4 d+4
| o5 e2 g+2
| o5 b2 r8 b >c+ d+
v13 ${peak}
| o6 f+4. d+ ^4 <b4
| o6 e1
| ^2. r4
k2 ${peak}
| o6 d+4. <b ^4 >d+4
| o6 e1
| ^2. r4
k0 v10 x14 q8
| o5 f+2. d+4
| o5 a2 f+2
| o5 g+1
| ^2 r2 |`,
    b: `[| r1]4 @1 v8 x14 q8 l8
| o5 c+2. e4
| o5 d+4. f+ ^2
| o5 e1
| ^2 r2
v9 x0 q7
| o4 a4 >c+4 e4. e
| o5 d+4. <b >d+4 f+4
| o5 d+4 g+4 b4. g+
| o5 g+2 e4 c+4
| o5 f+4 a4 f+4. c+
| o5 f+4 f+4 d+4 <b4
| o4 b2 >e2
| o5 g+2 r2 ${under}
| o6 d+4. <b ^4 f+4
| o5 g+1
| ^2. r4
k2 ${under}
| o5 b4. f+ ^4 b4
| o5 g+1
| ^2. r4
k0 v8 x14 q8
| o5 d+2. <b4
| o5 f+2 d+2
| o5 e1
| ^2 r2 |`,
    c: `@1 v6 x0 q6 l16 ${four} | [e a >c+ <a]4 | [f+ b >d+ <b]4 ${home} | [g+ b >e <b]2 [e g+ b g+]2
v7 ${four} | [f+ a >c+ <a]4 | [f+ b >d+ <b]4 ${home} | [g+ b >e <b]2 [b >e g+ e<]2
${top} k2 ${top} k0
v6 | o4 [f+ b >d+ <b]4 | [f+ a >d+ <a]4 | [e g+ b g+]4 | [e g+ b g+]2 [e g+ b >e<]2 |`,
    w: `@1 v3 q8 l8
| o2 a2. a4 | o2 b2. b4 | o2 g+2. g+4 | o2 c+2. c+4 | o2 a2. a4 | o2 b2. b4 | o2 e2. e4 | o2 e2 e4 g+4
q7 | o2 [a]8 | o2 [b]8 | o2 [g+]8 | o2 [c+]8 | o2 [f+]8 | o2 [b]8 | o2 [e]8 | o2 e e e e e f+ g+ b
${drive} k2 ${drive} k0
q8 | o1 b1 | o1 b1 | o2 e1 | o2 e2 f+4 g+4 |`,
    n: `v10 l8 [${soft}]7 | k4 h h s s16 s16 s s
v12 [${beat}]7 | k h s h s16 s16 s16 s16 s16 s16 s16 s16
v13 ${full} ${roll}
${crash} [${hats}]6 | k h h h s h h h k8 s8 c4
v8 l8 [${tick}]4 |`,
    s: `v5 x0 ${glow}
v6 ${pad} | o3 {a>c+f+}1 ${rest} ${glow} k2 ${glow} k0
v5 | o3 {b>d+f+}1 | o3 {a>d+f+}1 | o3 {g+b>e}1 | ^1 |`,
  },
}
