const H = {
  am: 'o3 a >e a >c e c <a e',
  as: 'o3 a >e a b >e <b a e',
  f: 'o3 f >c f a >c <a f c',
  g: 'o3 g >d g b >d <b g d',
  e: 'o3 e b >e g+ b g+ e <b',
  es: 'o3 e b >e a b a e <b',
  c: 'o3 g >c e g >c <g e c',
  gb: 'o3 g b >d g b g d <b',
  dm: 'o3 a >d f a >d <a f d',
  ame: 'o3 e a >c e a e c <a',
}
const harp = s => s.split(' ').map(c => `| ${H[c]} ${H[c]}`).join('\n')
const theme = `
| o4 a2 >e2
| o5 d4. c8 <b2
| o5 c2 a2
| o5 g4. f8 d2
| o5 e2 a2
| o5 g4. f+8 e2`
const pulse = '| k4. k8 r2 | r1'

export default {
  title: 'Meganeura',
  bpm: 84,
  beats: 4,
  tail: 4,
  intro: {
    a: `| r1 | r1 |`,
    b: `@0 v8 x3 q8 l16 ${harp('am am')} |`,
    w: `@0 v2 q8 | o2 a1 | a1 |`,
    n: `| r1 | r1 |`,
  },
  loop: {
    a: `@1 v11 x14 q8 ~2 l4 ${theme}
| o5 f4. g8 a >c
| o5 b2 g+2
| o6 c2 <g e
| o5 d2. g
| o5 a2 e c
| o4 a2. >c
| o5 d2 f a
| o6 c2 <a e
| o5 f a g b
| o5 a1 ${theme}
| o5 f a g b
| o5 a1 |`,
    b: `@0 v8 x3 q8 l16 ${harp('am')}
| ${H.am} ${H.as}
${harp('f g am am f')}
| ${H.es} ${H.e}
${harp('c gb am f dm ame')}
| ${H.f} ${H.g}
${harp('am am')}
| ${H.am} ${H.as}
${harp('f g am am')}
| ${H.f} ${H.g}
${harp('am')} |`,
    w: `@0 v2 q8 l1
| o2 a | a | f | g | a | a | f | e
| o3 c | o2 b | a | f | d | e | f2 g2 | a1
l4 | o2 a2. >e | <a2. >e | <f2. >c | <g2. >d | <a2. >e | <a2. >e | <f2 g2 | a1 |`,
    n: `v9 l4 [${pulse}]4
| c2. r | r1 [${pulse}]2 | k4. k8 r t | t8 t8 t8 t8 m8 m8 m8 m8
[| k4. k8 r2 | r2. t]4 |`,
  },
}
