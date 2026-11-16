import { beat } from '../chip/kit.mjs'

const strum = n => `${n}4 ${n} ${n}4 ${n} ${n} ${n}`
const eight = n => `[${n}]8`
const bars = (list, f) => list.map(n => `| ${f(n)}`).join(' ')
const riff = `
| o5 d4. <b ^4 g4
| o4 a4. >d ^4 <a4
| o4 b4. g ^4 e4
| o4 g4 >c4 e4 d4`
const shut = `
| o4 e4 g4 >c4. <b
| o4 b b b >d ^ e d <b
| o5 d4 <a b ^4 >d4
| o5 e e e g ^ e d <b
| o5 c4 <b4 a2`
const verse = `
| o4 b b b >d ^ <b a g
| o4 a4 a b ^4 a4
| o4 g g g b ^ g f+ e ${shut}`
const again = `
| o4 b b >d d ^ <b a g
| o4 a4 a b ^4 >d4
| o5 e e d <b ^ g f+ e ${shut}`
const pre = `
| o4 a4. >c ^2
| o4 b4. >d ^2
| o5 c4. e ^2
| o5 d4 e4 f+4 a4`
const chorus = `
| o5 g2. f+ g
| o5 a2 f+4 d4
| o5 f+2. e f+
| o5 g2 e4 <b4
| o5 c4 e4 g4. a
| ^4 f+4 d4 f+4
| o5 g1
| ^2 r4 d4
| o5 g2. f+ g
| o5 a2 b4 a4
| o5 f+2. e f+
| o5 g2 b4 >d4
| o6 e4. d ^4 c4
| o5 b4. a ^4 f+4
| o5 g1
| ^2 r2`
const under = `@1 v8 x0 q7 l8
| o5 e2. d e
| o5 f+2 d4 f+4
| o5 d2. <b >d
| o5 e2 g4 b4
| o6 c4. <b ^4 a4
| o5 f+4. f+ ^4 d4
| o4 b1
| ^2 r2`
const LOW = ['o3 b', 'o3 a', 'o3 b', 'o4 c'], HIGH = ['o4 d', 'o4 d', 'o4 e', 'o4 e'], ROOT = ['o2 g', 'o2 f+', 'o2 e', 'o2 c']
const tone = '@1 v6 x5 q6 l8'
const lowV = `${tone} ${bars(LOW, strum)} ${bars(LOW.slice(0, 3), strum)} | o4 c4 c c4 d d d`
const highV = `${tone} ${bars(HIGH, strum)} ${bars(HIGH.slice(0, 3), strum)} | o4 e4 e e4 f+ f+ f+`
const lowC = `x5 q6 ${bars(['o4 e', 'o4 f+', 'o4 d', 'o4 e', 'o4 e', 'o4 f+', 'o4 d', 'o4 d'], eight)}
| o4 [e g]4 | o4 [f+ a]4 | o4 [d f+]4 | o4 [e g]4 | o4 [e a]4 | o4 [f+ a]4 | o4 [d g]4 | o4 [d g]2 d2`
const highC = `x5 q6 ${bars(['o4 g', 'o4 a', 'o4 f+', 'o4 g', 'o4 g', 'o4 a', 'o4 g', 'o4 g'], eight)} ${under}`
const bassV = `${bars(ROOT, strum)} ${bars(ROOT.slice(0, 3), strum)} | o2 c4 c c4 d d d`
const bassC = `${bars(['o2 c', 'o2 d', 'o1 b', 'o2 e', 'o2 c', 'o2 d', 'o2 g'], eight)} | o2 g g g g g a b >d
${bars(['o2 c', 'o2 d', 'o1 b', 'o2 e', 'o2 a', 'o2 d', 'o2 g'], eight)} | o2 g4 g4 g2`
const hit = '| c4 s h k k s h', fill = '| k h s h s s16 s16 s s', turn = '| k h s h k s s16 s16 s'
const four = `${hit} ${beat} ${beat}`
const drumV = `v12 [${beat}]3 ${turn} [${beat}]3 ${fill}`
const drumP = `v10 [| k4 h h s4 h h]2 | k4 h h s4 s s | s16 s16 s16 s16 s16 s16 s16 s16 s s s16 s16 s16 s16`
const drumC = `v13 ${four} ${turn} ${four} ${fill} ${four} ${turn} ${four} | c4 r4 s16 s16 s16 s16 s s`

export default {
  title: 'Mayfly',
  bpm: 168,
  beats: 4,
  tail: 8,
  send: { a: .25, b: .1, c: .1 },
  feel: [.006, 1],
  intro: {
    a: `@2 v11 x0 q7 ~2 l8 ${riff} |`,
    b: `${tone} ${bars(HIGH, strum)} |`,
    c: `${tone} ${bars(LOW, strum)} |`,
    w: `@1 v3 q7 l8 ${bars(ROOT, strum)} |`,
    n: `v12 l8 ${four} ${fill} |`,
  },
  loop: {
    a: `@2 v11 x0 q7 ~2 l8 ${verse}
x14 q8 ${pre}
v13 x0 q7 ${chorus}
v11 ${riff} ${again}
x14 q8 ${pre}
v13 x0 q7 ${chorus} |`,
    b: `${highV}
x14 q8 | o4 e1 | o4 f+1 | o4 g1 | o4 a2 a4 a4
${highC}
${tone} ${bars(HIGH, strum)} ${highV}
x14 q8 | o4 e1 | o4 f+1 | o4 g1 | o4 a2 a4 a4
${highC} |`,
    c: `${lowV}
x14 q8 | o4 c1 | o4 d1 | o4 e1 | o4 f+2 f+4 f+4
${lowC}
${tone} ${bars(LOW, strum)} ${lowV}
x14 q8 | o4 c1 | o4 d1 | o4 e1 | o4 f+2 f+4 f+4
${lowC} |`,
    w: `@1 v3 q7 l8 ${bassV}
q8 | o2 a2. a4 | o2 b2. b4 | o3 c2. c4 | o3 d4 d4 d4 d4
q7 ${bassC}
${bars(ROOT, strum)} ${bassV}
q8 | o2 a2. a4 | o2 b2. b4 | o3 c2. c4 | o3 d4 d4 d4 d4
q7 ${bassC} |`,
    n: `l8 ${drumV} ${drumP} ${drumC}
v12 ${four} ${fill} ${drumV} ${drumP} ${drumC} |`,
  },
}
