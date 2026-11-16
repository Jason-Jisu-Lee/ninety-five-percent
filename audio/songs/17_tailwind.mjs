import { beat, crash, hats, oct, roll } from '../chip/kit.mjs'

const hook = `
| o5 f+4. e4 f+ a4
| o5 g+4. f+4 e <b4`
const verse = `
| r o5 c+ c+ <b >c+4 e4
| o4 b4. g+ b2
| r o5 c+ c+ <b >c+4 f+4
| o5 e2 r8 <b >c+ e
| o5 f+4. e d4 <a4
| o5 c+4. <b a4 >e4
| o5 d4. c+ <b4 >d4
| o5 e2. r4`
const lift = `
| o5 a2. f+4
| o5 b2. g+4
| o6 d2 c+4 <a4
| o5 b2 r8 e f+ g+`
const first = `${hook}
| o5 c+4. e4 g+ e4
| o5 f+2. e f+
| o5 a4. g+4 f+ a4
| o5 b4. a4 g+ e4
| o6 c+4. <b4 a4.
| ^2 r8 o5 e f+ g+`
const second = `${hook}
| o5 c+4. e4 g+ b4
| o5 a2. g+ a
| o6 d4. c+4 <b f+4
| o5 g+4. a4 b >e4
| o6 c+2. <b4
| o5 a2. r4`
const calm = `
| o5 c+2 f+2
| o5 a2. f+4
| o5 e2 c+2
| o4 b2. r4
| o5 c+2 f+2
| o5 a2. >d4
| o6 e2 <b2
| o5 g+2 r8 e f+ g+`
const strum = `@0 v7 x3 q8 l8
| o4 e a >c+ <a e a >c+ <a
| o4 e g+ b g+ e g+ b g+
| o4 f+ a >c+ <a f+ a >c+ <a
| o4 e g+ b g+ e g+ b g+
| o4 f+ a >d <a f+ a >d <a
| o4 e a >c+ <a e a >c+ <a
| o4 f+ b >d <b f+ b >d <b
| o4 e g+ b g+ e g+ b >e<`
const climb = `@1 x0 q6 l16
| v5 o4 [f+ a >d <a]4
| v6 [g+ b >e <b]4
| v7 [a >d f+ d<]4
| v8 [b >e g+ e<]2 [g+ b >e <b]2`
const under = `@1 v8 x14 q8 l8
| o4 a2 >d2
| o4 b2 g+2
| o4 g+2 >c+2
| o5 c+2 <a2
| o5 d2 f+2
| o5 e2 <b2
| o5 e2 c+2
| o4 a2 r2`
const thirds = `@1 v9 x0 q7 l8
| o5 d4. c+4 d f+4
| o5 e4. d4 <b g+4
| o4 g+4. >c+4 e g+4
| o5 f+2. e f+
| o5 b4. a4 f+ d4
| o5 e4. f+4 g+ b4
| o5 a2. g+4
| o5 e2. r4`
const drops = `@0 v6 x4 q8 l8
| o4 f+ >c+ f+ c+ <a >c+ f+ c+<
| o4 f+ >d f+ d <a >d f+ d<
| o4 e >c+ e c+ <a >c+ e c+<
| o4 e b >e <b g+ b >e <b
| o4 f+ >c+ f+ c+ <a >c+ f+ c+<
| o4 f+ >d f+ d <a >d f+ d<
| o4 e b >e <b g+ b >e <b
| o4 e b >e <b g+ b >e g+<`
const spin = `@1 v6 x0 q6 l16
| o4 [f+ a >d <a]4
| [g+ b >e <b]4
| [g+ >c+ e c+<]4
| [f+ a >c+ <a]4`
const spinA = `${spin}
| [f+ a >d <a]4
| [g+ b >e <b]4
| [a >c+ e c+<]4
| [e a >c+ <a]4`
const spinB = `${spin}
| [f+ b >d <b]4
| [g+ b >e <b]4
| [a >c+ e c+<]4
| [a >c+ e c+<]2 o5 e8 c+8 <a4`
const road = `
| o2 [a]8
| o2 [g+]8
| o2 [f+]8
| o2 [e]6 e g+
| o2 [d]8
| o2 [c+]8
| o1 [b]8
| o2 [e]4 e f+ g+ b`
const pump = `
| o2 [d]8
| o2 [e]8
| o2 [d]8
| o2 e e e e e4 r4`
const four = `
| o2 ${oct('d')}
| o2 ${oct('e')}
| o2 ${oct('c+')}
| o2 ${oct('f+')}`
const driveA = `${four}
| o2 ${oct('d')}
| o2 ${oct('e')}
| o2 ${oct('a')}
| o2 a a >a <a a b >c+ e`
const driveB = `${four}
| o1 ${oct('b')}
| o2 ${oct('e')}
| o2 ${oct('a')}
| o2 a a >a <a a2`
const still = `
| o2 f+2. f+4
| o2 d2. d4
| o2 a2. a4
| o2 e2. e4
| o2 f+2. f+4
| o2 d2. d4
| o2 e2. e4
| o2 e e e e e f+ g+ b`
const D = '| o3 {a>df+}1', E = '| o3 {g+b>e}1', A = '| o3 {a>c+e}1', Fm = '| o3 {a>c+f+}1'
const warm = `${D} ${E} | o3 {g+>c+e}1 ${Fm}`
const full = `l16 ${crash} [${hats}]6`

export default {
  title: 'Tailwind',
  bpm: 144,
  beats: 4,
  tail: 8,
  send: { a: .25, b: .2, c: .15 },
  feel: [.006, 1],
  intro: {
    a: `@2 v11 x0 q7 ~2 l8 ${hook}
| o5 c+4. e4 a f+4
| o5 g+2. r4 |`,
    b: `@0 v7 x3 q8 l8
| o4 f+ a >d <a f+ a >d <a
| o4 e g+ b g+ e g+ b g+
| o4 f+ a >c+ <a f+ a >c+ <a
| o4 e g+ b g+ e g+ b >e< |`,
    c: `[| r1]4 |`,
    w: `@1 v3 q7 l8
| o2 ${oct('d')}
| o2 ${oct('e')}
| o2 ${oct('f+')}
| o2 e e >e <e e f+ g+ b |`,
    n: `v12 l8 | c4 s h k k s h ${beat} ${beat} | k h s h s s16 s16 s s |`,
    s: `v5 x0 ${D} ${E} ${Fm} ${E} |`,
  },
  loop: {
    a: `@2 v11 x14 q8 ~2 l8 ${verse}
v12 x0 q7 ${lift}
v13 ${first} ${second}
v10 x14 q8 ${calm}
v13 x0 q7 ${first} ${second} |`,
    b: `${strum} ${climb} ${under} ${thirds} ${drops} ${under} ${thirds} |`,
    c: `[| r1]12 ${spinA} ${spinB} [| r1]8 ${spinA} ${spinB} |`,
    w: `@1 v3 q7 l8 ${road} ${pump} ${driveA} ${driveB} ${still} ${driveA} ${driveB} |`,
    n: `v12 l8 [${beat}]3 | k h s h k s s16 s16 s
[${beat}]3 | k h s h s s16 s16 s s
| k h k h k h k h | k h k h k s k s | k s k s k s k s | s16 s16 s16 s16 s16 s16 s16 s16 s4 r4
v13 ${full} ${roll}
${crash} [${hats}]6 | k h h h s h h h k8 s8 c4
v10 l8 [| k4 h h s4 h h]7 | k4 h h s s16 s16 s s
v13 ${full} ${roll}
${crash} [${hats}]6 | k h h h s h h h k8 s8 s s s s |`,
    s: `v5 x0 [| r1]12 ${warm} ${D} ${E} ${A} ${A} ${warm} | o3 {b>df+}1 ${E} ${A} ${A}
${Fm} ${D} ${A} ${E} ${Fm} ${D} ${E} ${E} ${warm} ${D} ${E} ${A} ${A} ${warm} | o3 {b>df+}1 ${E} ${A} ${A} |`,
  },
}
