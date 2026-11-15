const SEMI = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }
const SET = { v: 'v', x: 'x', '@': 'duty', '~': 'vib', q: 'q' }
export const WHOLE = 192

function unroll(s) {
  for (let m; (m = /\[([^[\]]*)\](\d+)/.exec(s));) {
    const [a, b = ''] = m[1].split(':')
    s = s.slice(0, m.index) + (a + b).repeat(m[2] - 1) + a + s.slice(m.index + m[0].length)
  }
  return s
}

export function parse(src, drums, bar) {
  const s = unroll(src), num = /-?\d+/y, notes = [], bad = [], st = { v: 12, x: 0, duty: 2, vib: 0, q: 8, sw: 0 }
  let i = 0, t = 0, o = 4, l = WHOLE / 8, k = 0, last
  const int = () => {
    num.lastIndex = i
    const m = num.exec(s)
    if (m) i = num.lastIndex
    return m ? +m[0] : 0
  }
  const len = () => {
    const n = int()
    let d = n ? WHOLE / n : l, half = d
    while (s[i] === '.') i++, d += half /= 2
    return d
  }
  const pitch = c => {
    if (!(c in SEMI)) throw Error(`"${c}" in "${s.slice(Math.max(0, i - 24), i + 8)}"`)
    let m = 12 * (o + 1) + SEMI[c] + k
    for (; s[i] === '+' || s[i] === '-'; i++) m += s[i] === '+' ? 1 : -1
    return m
  }
  const add = m => {
    notes.push(last = { t, d: len(), m, ...st })
    t += last.d
  }
  while (i < s.length) {
    const c = s[i++]
    if (c <= ' ') continue
    if (c === '|') bar && t % bar && bad.push(+(t / bar).toFixed(2))
    else if (c === 'r') last = void (t += len())
    else if (c === '^') {
      const d = len()
      if (last) last.d += d
      t += d
    } else if (c === 'l') l = len()
    else if (SET[c]) st[SET[c]] = int()
    else if (drums) add(c)
    else if (c === 'o') o = int()
    else if (c === '<') o--
    else if (c === '>') o++
    else if (c === 'k') k = int()
    else if (c === 's') st.sw = int()
    else if (c === '{') {
      const keep = o, ms = []
      for (let ch; (ch = s[i++]) !== '}';) ch === '>' ? o++ : ch === '<' ? o-- : ch > ' ' && ms.push(pitch(ch))
      o = keep
      add(ms)
    } else add(pitch(c))
  }
  return { notes, end: t, bad }
}
