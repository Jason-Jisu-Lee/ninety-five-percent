const head = `
| o4 g4 >e2 d8. c16`
const theme = `${head}
| o5 d4. <b g2
| o4 a4 >c4. d e g
| o5 g2 e4. d
| o5 a4. g f4 c4
| o5 g2 e4 c e
| o5 f4. e d4 f4
| o5 e2 d4. r8`
const again = `${head}
| o5 d4. <b g4. >d
| o4 a4 >c4. e g >c
| o6 c4 <b4 g4. e
| o5 a4. g f4 a4
| o5 g2 e4 >c4
| o5 f4. a g4 <b4
| o5 c2. r4`
const yearn = `
| o5 c4 a2 g f
| o5 a4. >c e-4 c4
| o5 g4 >e2 d c
| o6 d4. <b ^2
| o6 c2. <b8 a8
| o6 c4 <a4 f+2
| o5 g2 >c2
| o5 b2 >d2`
const peak = `
| o6 e2. d8. c16
| o6 d4. <b g2
| o5 a4 >c4. <b >c e
| o6 d2 <b4. g
| o6 c2 <a4 >c4
| o6 e2. d8 c8
| o6 d2 <b2
| o6 c1`
const glow = `
| r2 o5 e4 c4
| o5 d2. r4
| r4 o5 d4 b4 g4
| o5 a2. r4
| o5 c4. a f2
| o5 g2 f4 d4
| o5 e1
| o5 d2. r4`
const harp = `
| o4 c g >e <g c g >e <g
| o3 b >g >d <g <b >g >d <g
| o3 a >e >c <e <a >e >c <e
| o3 g >e b e <g >e b e
| o3 f >c f a >c <a f c
| o3 e >c e g >c <g e c
| o3 d a >c f a f c <a
| o3 g >c e g <g b >d g`
const answer = `
| o4 e4 g4 >c4 <g4
| o4 b4 a4 g4 f4
| o4 e2 a4 >c4
| o4 g4 b4 >e4 d4
| o4 f2 a4 >c4
| o5 e2 <g4 >e4
| o5 d4 f4 d4 <g4
| o4 e4 g4 b-2`
const inner = `
| o4 a2 >c2
| o5 c2 <a2
| o5 c2 g2
| o5 f2 d2
| o5 e2 c2
| o5 d2 c2
| o5 c2 d2
| o5 d2 g2`
const counter = `
| o5 g2 a2
| o4 b2 >d2
| o5 e2 a2
| o5 g2 e2
| o5 f2 c2
| o5 c2 <g2
| o5 f2 d2
| o4 e1`
const embers = `
| o3 f >c e a <f >c e a
| o3 f >c d a- <f >c d a-
| o3 e b >d g <e b >d g
| o3 a >e g >c <<a >e g >c
| o3 d a >c f <d a >c f
| o3 g >d f b <g >d f b
| o4 c e g >c <c e g >c
| o3 g b >d g <g b >d g`
const arch = `
| o3 f >c f a >c <a f c
| o3 f+ >c e- a >c <a e- c
| o3 g >e g >c e c <g e
| o3 g+ >d f b >d <b f d
| o3 a >e a >c e c <a e
| o3 f+ >d f+ a >c <a f+ d`
const wave = `
| o4 [c e g >c <g e]2 c e g >c<
| o3 [b >d g b g d<]2 b >d g b<
| o3 [a >c e a e c<]2 a >c e a<
| o3 [g b >e g e <b]2 g b >e g<
| o3 [f a >c f c <a]2 f a >c f<
| o3 [e g >c e c <g]2 e g >c e<
| o3 d f a >c f c <a f g b >d g b g d <b
| o6 c <g e c <g e c <g >c2`
const fall = `
| o3 c4. c c2
| o2 b4. b b2
| o2 a4. a a2
| o2 g4. g g2
| o2 f4. f f2
| o2 e4. e e2`
const roll = `
| o3 c c g c c g c g
| o2 b b >d <b b >d <b >d<
| o2 a a >e <a a >e <a >e<
| o2 g g >d <g g >d <g >d<
| o2 f f >c <f f >c <f >c<
| o2 e e g e e g e g
| o2 d d a d g g >d <g`
const beat = '| k h s h k k s h'
const broad = '| k4 h h s4 h h | k4 h h s4 h k | k4 h h s4 h h'

export default {
  title: 'Take It Back',
  bpm: 104,
  beats: 4,
  tail: 0,
  tone: 3400,
  send: { a: .3, b: .15, c: .1 },
  level: { w: .8 },
  feel: [.005, 1],
  intro: {
    a: `k-5 @2 v9 x14 q8 ~1 l8 | r1 | r1 | o5 e2. d4 | o5 c2 d2 |`,
    b: `k-5 @2 v6 x4 q8 l8
| o3 e g >c e g e c <g
| o3 f a >c f a f c <a
| o3 e >c e g >c <g e c
| o3 g >c d g <g b >d g |`,
    c: `k-5 @2 v5 x0 q8 l8 | o4 g1 | o4 f1 | o4 e1 | o4 c2 <b2 |`,
    w: `k-5 @0 v2 q7 l8 | o3 c1 | o3 c1 | o2 e1 | o2 g1 |`,
    n: `[| r1]4 |`,
  },
  loop: {
    a: `k-5 @2 v10 x14 q8 ~1 l8 ${theme} ${again}
x18 ${yearn}
v11 ${peak}
v8 x14 ${glow} |`,
    b: `k-5 @2 v6 x4 q8 l8 ${harp}
v7 x14 ${answer}
v6 x0 ${inner}
v7 x18 ${counter}
v5 x4 ${embers} |`,
    c: `k-5 [| r1]8
@2 v4 x0 q8 l8
| o5 c1 | o4 b1 | o5 c1 | o4 g1 | o5 c1 | o5 c1 | o4 a2 b2 | o4 g1
v5 x4 ${arch}
v4 x0 q6 l16
| o4 [g >c d c<]4
| o4 [g b >d <b]2 [b >d g d<]2 ${wave}
[| r1]8 |`,
    w: `k-5 @0 v3 q7 l8 ${fall}
| o2 d4. d d4 d4
| o2 g4. g g4 b4 ${roll}
| o3 c c <g >c <b- a g e
v2
| o2 f2. f4
| o2 f+2. f+4
| o2 g2. g4
| o2 g+2. g+4
v3
| o2 a4. a a4 a4
| o2 f+4. f+ f+4 f+4
| o2 g g >g <g g g >g <g
| o2 g g >g <g g g a b ${roll}
| o3 c c >c <c c2
v2 | o2 f1 | o2 f1 | o2 e1 | o2 a1 | o2 d1 | o2 g1 | o3 c1 | o2 g2. b4 |`,
    n: `v7 l8
| k4 h h s4 h h | k4 h h s4 h h | k4 h h s4 k h | k4 h h s h16 h16 s s
| k4 h h s4 h h | k4 h k s4 h h | k4 h h s4 k h | k4 h h s4 s s
v8 ${beat} ${beat} ${beat} | k h s h k s s16 s16 s
${beat} | k h s h k h s k ${beat} | k h s h k h s s
v7 | k4 h h r4 h h | k4 h h r4 h h | k4 h h s4 h h | k4 h h s4 h k
${beat} | k h s h k h s k
v8 ${beat} | k h s h k k s s
v9 ${broad} | k4 h k s4 s16 s16 s
${broad} | k4 r4 r2
v6 | r1 | r1 | k4 h h r4 h h | k4 h h r4 h h
| k4 h h s4 h h | k4 h h s4 h h | k4 h h s4 h h | k4 h h s4 h h |`,
  },
}
