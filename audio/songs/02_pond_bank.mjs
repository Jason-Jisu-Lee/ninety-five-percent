const tune = `
| o5 d4. e g4 e d
| o4 b4. >d e4 d e
| o5 g4. e d4 c e
| o5 d2 <a b >d e
| o5 g4. a b4 a g
| o5 e4. g a4 >c4
| o5 b4 a g a4 g f+`
const under = `
| o4 b4. >c d4 c <b
| o4 g4. a b4 a b
| o5 e4. c <b4 a >c
| o4 a2 f+ g a >c`
const close = `
| o5 d4. f+ g4 f+ d
| o5 c4. e e4 g4
| o5 g4 f+ d f+4 d c
| o4 b2. r4`
const G = '| o4 g b >d <b g b >d <b', Em = '| o4 e g b g e g b g', C = '| o4 e g >c <g e g >c <g', D = '| o4 f+ a >d <a f+ a >d <a'
const bass = `
| o2 g4. g >d4 <g4
| o2 e4. e b4 e4
| o2 c4. c g4 c4
| o2 d4. d a4 d4
| o2 g4. g >d4 <g4
| o2 c4. c g4 c4`
const bassB = `
| o2 d4 >d4 <d4 a4
| o2 g4. g >d4 <g4`
const soft = '| k4 h h s4 h h', beat = '| k h s h k k s h'

export default {
  title: 'Pond Bank',
  bpm: 108,
  beats: 4,
  tail: 4,
  intro: {
    a: `@2 v12 x9 q8 ~1 l8 | r1 | r2. o4 b >c |`,
    b: `@0 v8 x2 q8 l8 ${G} ${G} |`,
    w: `@0 v3 q7 l8 [| o2 g4. g >d4 <g4]2 |`,
    n: `v9 l8 | r1 | r2 h h h h |`,
  },
  loop: {
    a: `@2 v12 x9 q8 ~1 l8
| o5 d4. e g4 e d
| o4 b4. >d e2
| o5 g4. e d4 c e
| o5 d2 <a b >d e
| o5 g4. a b4 a g
| o5 e4. g a4 g4
| o5 e4 d c d4 c <a
| o4 g2. b >c ${tune}
| o5 g2. r4
@1
| o5 e g >c4 <b a g4
| o5 f+ a >d4 c <b a4
| o5 b4. a f+4 d4
| o5 e4. f+ g2
| o5 e g >c4 <b a g4
| o5 f+ a >d4 e d <b4
| o6 c4 <b a g4 e4
| o5 f+4 e4 d4 <b >c
@2 ${tune}
| o5 g2 r4 <b >c |`,
    b: `@0 v8 x2 q8 l8 ${G} ${Em} ${C} ${D} ${G} ${C}
| o4 e a >c <a f+ a >c <a ${G}
@1 v8 x9 ${under}
@0 v8 x2 ${G} ${C}
| o4 g b >d <b f+ a >c <a ${G} ${C} ${D}
| o4 f+ b >d <b f+ b >d <b ${Em} ${C} ${D}
| o4 e a >c <a e a >c <a
| o4 f+ a >c <a f+ a >c <a
@1 v8 x9 ${under} ${close} |`,
    w: `@0 v3 q7 l8 ${bass}
| o2 a4 >e4 <d4 a4
| o2 g4. g >d4 <b4 ${bass} ${bassB}
| o2 c4. c g4 e4
| o2 d4. d a4 f+4
| o1 b4. b >f+4 <b4
| o2 e4. e b4 e4
| o2 c4. c g4 e4
| o2 d4. d a4 f+4
| o2 a4. a >e4 <a4
| o2 d4 a4 >d4 <d4 ${bass} ${bassB} |`,
    n: `v9 l8 [${soft}]7 | k4 h h s s16 s16 s h
[${beat}]7 | k h s h k s s16 s16 s16 s16
[${soft}]7 | k h s h s s16 s16 s s
[${beat}]7 | k h s h k4 r4 |`,
  },
}
