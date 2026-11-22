import { beat } from '../chip/kit.mjs'

const lope = (n, f) => `${n}4 ${n} ${n} ${f}4 ${n}4`
const sway = (n, f) => `${n}2 ${f}4 ${n}4`
const riff = `
| o5 g4 >c <g ^2
| o5 f4 b- f ^2
| o5 a-2 >c4. <a-
| o5 g2 b4 >d4`
const calm = '| o5 e1 | o5 d1 | o5 c1 | o5 e2 d2'
const verse = `
| r8 o5 g >c d e4 d c
| o5 b2. r4
| o6 c4 <a4 f4 a >c
| o5 b2 g4 r4
| o6 e4. d c4 <a4
| o5 b4 g4 e4. g
| o5 a4. >c f4 e4
| o6 d2. r4`
const pre = `
| o5 a4 a g a4 >c4
| o6 d4. c <b4 g4
| o5 a4 >c4 f4. e
| o6 d2 <b4 g b`
const hook = `
| o5 a4 >c4 e4. d
| ^4 c4 <a2`
const fall = `
| o6 c4 e4. d c4
| ^4 <a4 >c4 f4
| o6 e-2 c4 <a-4`
const guide = '| o5 e1 | o5 f1 | o5 e1 | o5 d1 | o5 e1 | o5 f1 | o5 a-2 f2 | o5 d2 g2'
const chug = `
| o4 e e g e e e g e
| o4 e e g e e e b g
| o4 f f a f f f a f
| o4 d d g d d d g d
| o4 e e a e e a e a
| o4 e e g e e g e g
| o4 f f a f f a f a
| o4 d d g d d g b >d<`
const bell = `
| o4 [>e< a >e c<]2
| o4 [>c< f >c< a]2
| o4 [>e< g >e c<]2
| o4 [>d< g+ >d< b]2
| o4 [>e< a >e c<]2
| o4 [>c< f >c< a]2
| o4 [>c< f >c< a-]2
| o4 [>d< g >d< b]2`
const pedal = `
| o4 [c e g e]2
| o4 [d f b- f]2
| o4 [c f a- f]2
| o4 c e g e d g b g`
const hold = `
| o2 ${lope('c', 'g')}
| o2 c2 c4 c4
| o2 ${lope('c', 'c')}
| o2 c4 c c g4 b4`
const ground = `
| o2 ${lope('a', 'e')}
| o2 ${lope('f', 'c')}
| o2 ${lope('c', 'g')}
| o2 g+4 g+ g+ b4 >e4<
| o2 ${lope('a', 'e')}
| o2 ${lope('f', 'c')}
| o2 ${sway('f', 'c')}
| o2 ${lope('g', 'd')}`
const P = '| k h s h k h s h', V = '| k h e h k h e h', W = '| k h e h k k e h'

export default {
  title: 'Dive II',
  bpm: 144,
  beats: 4,
  tail: 4,
  tone: 3400,
  send: { a: .25, b: .2, c: .15 },
  level: { w: .7 },
  feel: [.004, 1],
  intro: {
    a: `k-4 @2 v9 x16 q8 ~1 l8 ${riff} |`,
    b: `k-4 @2 v5 x0 q8 l8 ${calm} |`,
    c: `k-4 @2 v4 x8 q7 l8 ${pedal} |`,
    w: `k-4 @0 v3 q7 l8 ${hold} |`,
    n: `v7 l8 | k4 h h e4 h h ${V} ${V} ${W} |`,
  },
  loop: {
    a: `k-4 @2 v9 x14 q8 ~1 l8 ${verse}
x16 ${pre}
v10 ${hook}
| o5 g4 e4 >c4. <b
| ^4 >d4 <b2 ${fall}
| o5 g2 b4 >d4
v9 x14
| r8 o5 g >c d e4 d c
| o5 b2. r4
| r1 | r1
| o6 c4. <b a4 e4
| o5 g2. r4
| r1
| o6 d2. r4
[| r1]4
v8
| o5 f2 a2
| o6 d2. c4
| o5 g2 >c2
| o5 b2. r4
| r1 | r1 | r1
v9 x16 | r2 o5 b4 g4
v10 ${hook}
| o5 g4 >c4 e4. d
| ^4 <b4 g+2 ${fall}
| o5 b2 >d2
v9 ${riff} |`,
    b: `k-4 @2 v4 x6 q7 l8 ${chug}
v6 x0 q8 | o5 c1 | o5 d1 | o5 f1 | o5 g2 d2
${guide}
v8 x14 ~1
| r1
| r4 o4 g b >e4 <b4
| o5 c4 <a4 f4 a >c
| o4 b2 g4 r4
| r1 | r1
| o4 a4 >c4 f4 a4
| o4 b2 >g2
~0
| o4 a2 >c2
| o5 f2. e4
| o5 e2 c2
| o4 g2. r4
| o4 a2 >d2
| o5 f2. e4
| o5 d2 c2
| o4 b2. r4
v4 x8 q7
| o4 [f a >c <a]2
| o4 [g b >d <b]2
v5 | o5 [c f a f]2
v6 | o5 [d g b g]2
v7 x14 q8
| o5 e2. r4
| r2 o5 f c f4
| o5 e2. r4
| r2 o5 d <b >d4
| o5 e1
| o5 f2 a2
| o5 a-2 f2
| o5 g2 b2
v5 x0 ${calm} |`,
    c: `k-4 [| r1]8
@2 v4 x6 q7 l8
| o4 f f a f f f a f
| o4 g g b g g g b g
| o4 a a >c <a a a >c <a
| o4 b b >d <b g g b >d<
x8 ${bell}
x0 q8
| o4 e2 g2 | o4 g2 b2 | o4 a2 >c2 | o4 b2 >d2 | o5 c2 <a2 | o4 b2 g2 | o4 a2 >c2 | o4 b2 >d2
x6 l4
| o4 f a >c <a | o4 f >c <a >c< | o4 e g >c <g | o4 e g >c e
| o4 d f a f | o4 d f a >d | o4 d g >c <g | o4 d g b >d
x0 q8 l8
| r1 | o4 b2 >d2 | o4 a2 >c2 | o4 b1
x8 q7 ${bell} ${pedal} |`,
    w: `k-4 @0 v3 q7 l8
| o2 ${lope('c', 'g')}
| o2 ${lope('e', 'b')}
| o2 ${lope('f', 'c')}
| o2 ${lope('g', 'd')}
| o2 ${lope('a', 'e')}
| o2 ${lope('e', 'b')}
| o2 ${lope('f', 'c')}
| o2 ${lope('g', 'd')}
| o2 ${sway('f', 'c')}
| o2 ${sway('g', 'd')}
| o2 ${sway('a', 'f')}
| o2 b4 b b g4 g4 ${ground}
| o2 ${sway('c', 'g')}
| o2 ${sway('e', 'b')}
| o2 ${lope('f', 'c')}
| o2 ${lope('g', 'd')}
| o2 ${sway('a', 'e')}
| o2 ${sway('e', 'b')}
| o2 ${lope('f', 'c')}
| o2 ${lope('g', 'd')}
| o2 f1 | o2 f2. f4 | o2 e1 | o2 e2. e4 | o2 d1 | o2 d2. d4 | o2 g1 | o2 g2 g4 g4
| o2 g2 g2 | o2 g2 g4 g4
| o2 [g4]4
| o2 [g]8 ${ground} ${hold} |`,
    n: `v7 l8 [${V}]3 ${W} [${V}]3 ${W}
${V} ${V} ${W} | k h e h k h s s
${beat} ${P} ${beat} | k h s h k k s s
${P} ${beat} ${P} | k h s h k h s s
[${V}]3 ${W} [${V}]3 ${W}
v6 | k4 h4 s4 h4 | k4 h k s4 t t | k4 h4 s4 h4 | k4 h k s4 m m
| k4 h4 s4 h4 | k4 h k s4 t t | k4 h4 s4 h k | k4 h k s h h h
v7 | k4 h h k4 h h | k h k h k h k h ${P} | k h s h k k s s
${P} ${beat} ${beat} | k h s h k k s s
${beat} ${P} ${beat} | k h s h k h s s
| k4 h h e4 h h ${V} ${V} ${W} |`,
  },
}
