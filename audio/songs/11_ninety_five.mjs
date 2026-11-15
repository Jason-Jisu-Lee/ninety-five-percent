import { beat, crash, oct, roll, soft } from '../chip/kit.mjs'

const hook = `
| o5 f+4. e4. d4
| o5 e4. c+4. <a b
| o5 c+4. f+4. e4
| o5 d2. f+ a`
const chorus = `${hook}
| o5 b4. a4. g4
| o5 a4. g4. e f+
| o5 g4. f+4. e4
| o5 d1`
const verse = `
| r4 o5 d4 f+4. e
| o5 e2 r8 c+ e a
| o5 b4. a f+4 d4
| o5 c+2. r4
| r4 o5 d4 g4. f+
| o5 f+2 r8 d f+ a
| o5 b4. a g4 e4
| o5 e2. r4`
const rise = `
| o5 e4 g b4 a g e
| o5 f+4 a >c+4 <b a f+
| o5 g4 b >d4 c+ <b g
| o5 a2 r8 <a b >d`
const box = `@0 v9 x5 q8 l8
| o6 f+4. e4. d4
| o6 e4. c+4. <a b
| o6 c+4. f+4. e4
| o6 d2. r4`
const climb = `@1 v6 x0 q6 l16
| o4 [e g b g]4
| [f+ a >c+ <a]4
| [g b >d <b]4
| [e a >c+ <a]4`
const wide = `
| o4 [d g b g]4
| [e a >c+ <a]4
| [f+ a >c+ <a]4
| [f+ b >d <b]4
| [d g b g]4
| [e a >c+ <a]4
| [e g b g]2 [e g >c+ <g]2
| [f+ a >d <a]4`
const walk = `
| o2 d4. d a4 d4
| o2 c+4. c+ a4 c+4
| o1 b4. b >f+4 <b4
| o1 a4. a >f+4 <a4
| o2 g4. g >d4 <g4
| o2 f+4. f+ >d4 <f+4
| o2 e4. e b4 e4
| o2 a4. a >e4 <a4`
const steps = `
| o2 ${oct('e')}
| o2 ${oct('f+')}
| o2 ${oct('g')}
| o2 ${oct('a')}`
const pulse = '| o2 g4. g4. >g4 | o2 a4. a4. >a4 | o2 f+4. f+4. >f+4 | o1 b4. b4. >b4'
const drive = `${pulse}
| o2 ${oct('g')}
| o2 ${oct('a')}
| o2 e e >e <e a a >a <a
| o2 d d >d <d d a f+ a`
const push = '| k h h h s h k h h h k h s h h h'
const build = `[${beat}]3 | k h s h s16 s16 s16 s16 s16 s16 s16 s16`
const full = `l16 ${crash} [${push}]6 ${roll} l8`

export default {
  title: 'Ninety-Five',
  bpm: 120,
  beats: 4,
  tail: 4,
  send: { a: .25, b: .2 },
  intro: {
    a: `| r1 | r1 | r1 | r1 |`,
    b: `${box} |`,
    w: `@1 v3 q8 | o2 g1 | o2 a1 | o2 f+1 | o1 b1 |`,
    n: `v9 l8 | r1 | r1 | r1 | r2 h h h h |`,
  },
  loop: {
    a: `@2 v10 x14 q8 ~2 l8 ${verse}
v12 x0 q7 ${rise}
v13 ${chorus}
[| r1]4
v11 x14 q8 ${verse}
v12 x0 q7 ${rise}
v13 k2 ${chorus} k0
| o5 e1 | o5 g2 r2 |`,
    b: `@0 v7 x3 q8 l8
| o4 f+ a >d <a f+ a >d <a
| o4 e a >c+ <a e a >c+ <a
| o4 f+ b >d <b f+ b >d <b
| o4 f+ a >c+ <a f+ a >c+ <a
| o4 g b >d <b g b >d <b
| o4 f+ a >d <a f+ a >d <a
| o4 e g b g e g b g
| o4 e a >c+ <a e a >c+ <a
${climb} ${wide}
${box}
@1 v8 x14 q8 l8
| r4 o4 a4 >d4. c+
| o5 c+2 r8 <a >c+ e
| o5 f+4. f+ d4 <b4
| o4 a2. r4
| r4 o4 b4 >d4. d
| o5 d2 r8 <a >d f+
| o5 g4. e e4 <b4
| o5 c+2. r4
${climb} k2 ${wide} k0
| o4 [e a >c+ <a]4 | [e g >c+ <g]4 |`,
    w: `@1 v3 q7 l8 ${walk} ${steps} ${drive} ${pulse} ${walk} ${steps} k2 ${drive} k0
| o2 ${oct('a')}
| o2 a a >a <a a b >c+ e |`,
    n: `v12 l8 [${soft}]7 | k4 h h s s16 s16 s s
${build}
${full}
[${beat}]3 | k h s h k s s16 s16 s
[${beat}]7 | k h s h s s16 s16 s s
${build}
${full}
| c4 s h k k s h | k h s h s16 s16 s16 s16 s s |`,
  },
}
