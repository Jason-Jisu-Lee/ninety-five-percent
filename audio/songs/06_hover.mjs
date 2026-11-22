const sway = `
| o5 e4. g ^2
| o5 e4. c ^2
| o5 d4. f ^4 a4
| o5 g2 f4 d4`
const ask = `${sway}
| o5 e4. g ^2
| o5 e4. c+ ^2
| o5 d4. f ^4 a4
| o5 b2 a4 g4`
const tell = `${sway}
| o5 e4. g ^4 b4
| o5 a2 g4 e4
| o5 f4. e ^4 d4
| o5 c1`
const low = `
| o4 a1 | o4 b1 | o5 d2 <b2 | o5 c1
| o4 f1 | o4 e1 | o4 e2 f+2 | o4 g2 f2`
const back = `
| o5 g2 e4 c4
| o5 d2. e4
| o5 c2 e2
| o5 d2. r4`
const fills = `
| o4 g2 a4 b4
| o5 c4 <a4 g2
| o4 a2 >c4 <a4
| o5 c2 <b2
| o4 g2 >c4 e4
| o4 g4 a4 g2
| o5 c2 <a4 f4
| o4 d2 f4 g4`
const second = `
| r4 o4 g4 >c d e4
| o4 a4 >c4 <a g e4
| o5 c4 <a4 f4. g
| o4 g4 >c4 <b2
| r4 o4 g4 >e d <g4
| o5 c+4 e4 d4 <b4
| o4 a4 f4 g4 b4
| o5 c4 <g4 b-2`
const under = `
| o4 f4. e d4 c4
| o3 b4 >d4 g4. f
| o4 e4 g4 e4. d
| o4 c4 e4 a4 g4
| o5 d2 f4. e
| o5 d4. <b ^2
| o5 c4. e ^4 d4
| o5 d2. <g4`
const breath = `
| o5 e2 d4 c4
| o4 a2. >c4
| o4 a-2. >c4
| o4 g2. r4
| r4 o4 a4 >c <b a4
| o4 g4 b4 a g e4
| o4 f4 a4 g4 e4
| o4 g4 >c4 <b4 a b`
const third = `
| o5 c4 <b4 a g a4
| o4 a4 g4 e g a4
| o5 c4 <a4 >c <b a4
| o4 g4 >c4 <b2
| o5 c4 <a4 b >c <g4
| o4 a4 >c+4 e d c+4
| o5 d4 <a4 b4 g4
| o4 e4 g4 e2`
const rock = `
| o4 c4 e g ^4 e4
| o4 c4 e a ^4 e4
| o4 c f a4 f c ^4
| o4 d g ^4 f4 d4
| o4 c4 e g ^4 e4
| o4 c+4 e g ^4 e4
| o4 d f a4 f d ^4
| o4 d g ^4 f4 d4
| o4 e4 g e ^4 c4
| o4 e a >c <a ^4 e4
| o4 f4 a f ^4 c4
| o4 d g ^4 f4 d4
| o4 c4 g e ^4 g4
| o4 e4 g e ^4 c+4
| o4 d f a4 g d ^4
| o4 c e g4 e g ^4`
const drop = `
| o4 a4 c4 f2
| o4 g4 d4 <b2
| o3 b2 >e4 g4
| o4 a2 e4 c4
| o4 a4 d4 c2
| o4 g+4 d4 <b2
| o4 g4 c4 a4 c4
| o4 c2 <b2`
const still = `
| o4 g4 e g ^4 e4
| o4 f4 c f ^4 c4
| o4 c4 f c ^4 f4
| o4 e4 c e ^4 e4
| o4 c4. e a4 e4
| o4 b4. g e4 g4
| o4 a4. f c4 e4
| o4 d4. f b4 g4`
const hang = `
| o4 e2 g2
| o4 g2 ^4 e4
| o4 a2 ^8 g a4
| o4 f2 d2
| o4 d2 ^8 e g4
| o4 g2 ^4 e4
| o4 f2 ^8 e d4
| o4 e2 c2`
const walk = `
| o2 c2 e4 g4
| o2 a4 g4 e2
| o2 f2. f+4
| o2 g2 b4 f4`
const stride = `
| o2 e2. a4
| o2 g2 e4 c+4
| o2 d4 c4 <g4 b4`

export default {
  title: 'Hover',
  bpm: 100,
  beats: 4,
  tail: 0,
  tone: 3400,
  send: { a: .35, b: .3, c: .25 },
  level: { w: .6 },
  feel: [.005, 1],
  intro: {
    a: `| r1 | r1 |`,
    b: `k3 @2 v6 x14 q8 l8 | o4 a2 >c2 | o5 c2 <b2 |`,
    c: `k3 @2 v4 x8 q7 l8 | o4 e4 a e ^4 c4 | o4 d4 g d ^4 <b4 |`,
    w: `k3 @0 v3 q7 l8 | o2 f2. f+4 | o2 g2 f4 d4 |`,
    n: `| r1 | r1 |`,
  },
  loop: {
    a: `k3 @2 v9 x14 q8 ~1 l8 ${ask} ${tell} ${low}
[| r1]4 ${back}
v10 ${tell}
[| r1]4 |`,
    b: `k3 @2 v6 x14 q8 l8 ${fills} ${second} ${under} ${breath} ${third}
| o4 g1 | o4 g2 e2 | o4 e2 f2 | o4 f2 d2 |`,
    c: `k3 @2 v4 x8 q7 l8 ${rock} ${drop} ${still} ${hang}
| o4 e4 g e ^4 g4 | o4 e4 g e ^4 c4 | o4 e4 a e d2 | o4 d4 g d ^4 <b4 |`,
    w: `k3 @0 v3 q7 l8 ${walk}
| o2 e2 d4 <b4
| o1 a4 >c+4 e2
| o2 d2 c4 <a4
| o1 g4 a4 b4 >d4
| o2 c4 d4 e4 g4
| o2 a2 g4 e4
| o2 a2 c4 d4
| o2 g2 b4 f4 ${stride}
| o2 c2 e4 g4
| o2 f4 a4 >c4 <a4
| o2 f2 g4 f4
| o2 e4 d4 e4 g4
| o2 a2 e4 c4
| o2 d2 f4 a4
| o2 g+2 e4 g+4
| o2 a4 g4 d4 a4
| o2 g2 f4 d4
| o2 c1 | o2 c1 | o2 c1 | o2 c2. <b4
| o1 a2 >e4 a4
| o2 g2 e4 g4
| o2 f2 a4 f+4
| o2 g4 f4 d4 <b4 ${walk} ${stride}
| o2 c2 g4 e4
| o2 c2 <b2 | o1 a2 g2 | o2 f2 d2 | o1 g2 a4 b4 |`,
    n: `v6 l4
| e r e r | e r e e | e r e r | e r e8 e8 e
| e r e r | e r e e | e r e r | e r e t
| k h e h | k h e h | k h e e | k h e8 e8 h
| k h e h | k e e h | k h e h | k h e m
| k r e h | k r e e | k r e h | k r e8 e8 e
| k r e h | k r e e | k h e h | k r e t
[| r1]8
| k h e h | k h e e | k h e h | k h e8 e8 h
| k h e h | k e e h | k h e h | k h e e
| k h e h | k r e e | e r e r | e r r2 |`,
  },
}
