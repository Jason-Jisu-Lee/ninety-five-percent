import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse, WHOLE } from '../audio/chip/mml.mjs'
import { render } from '../audio/chip/synth.mjs'
import { wav } from '../audio/chip/wav.mjs'
import effects from '../audio/effects/effects.mjs'

const root = join(import.meta.dirname, '..'), songs = join(root, 'audio/songs'), out = join(root, 'assets/audio')
const only = process.argv[2] ?? '', PEAK = .89, LOUD = .07, FADE = 12, tmp = join(tmpdir(), 'chip.wav')
if (!only) for (const dir of ['soundtrack', 'effects']) rmSync(join(out, dir), { recursive: true, force: true })
mkdirSync(join(out, 'soundtrack'), { recursive: true })
mkdirSync(join(out, 'effects'), { recursive: true })

function check(s, name, bar) {
  return ['intro', 'loop'].map(part => {
    const ends = Object.keys(s.loop).map(k => {
      const p = parse(s[part][k], k === 'n', bar)
      if (p.bad.length) console.log(name, part, k, 'bars off at', p.bad.join(' '))
      return p.end
    })
    if (new Set(ends).size > 1) console.log(name, part, 'lengths differ', ends.map(e => e / bar).join(' '))
    return ends[0]
  })
}

for (const file of readdirSync(songs)) {
  if (!file.includes(only)) continue
  const s = (await import(pathToFileURL(join(songs, file)))).default, bar = WHOLE / 4 * s.beats, name = file.replace('.mjs', ''), [intro, loop] = check(s, name, bar)
  const src = Object.fromEntries(Object.keys(s.loop).map(k => [k, s.intro[k] + s.loop[k].repeat(2)]))
  const mix = render(s, src, (intro + loop + s.tail * bar) / 48 * 60 / s.bpm, s.fade ?? FADE)
  writeFileSync(tmp, wav([mix.l, mix.r], Math.min(PEAK / mix.peak, LOUD / mix.rms)))
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-ar', '32000', '-c:a', 'libvorbis', '-q:a', '3', '-metadata', `title=${s.title}`, join(out, 'soundtrack', name + '.ogg')])
  console.log(name, Math.round(mix.l.length / 48000) + ' s')
}
rmSync(tmp, { force: true })

if (!only || only === 'fx') {
  const made = Object.entries(effects).map(([name, { ring, send, tone, peak, ...fx }]) => {
    const mix = render({ bpm: 150, ring, send, ...(tone ? { tone } : {}) }, fx)
    return { name, mono: mix.l.map((v, i) => (v + mix.r[i]) / 2), peak: mix.peak, want: peak }
  })
  const gain = .35 / Math.max(...made.filter(m => !m.want).map(m => m.peak))
  for (const m of made) writeFileSync(join(out, 'effects', m.name + '.wav'), wav([m.mono], m.want ? m.want / m.peak : gain))
  console.log(made.length, 'effects')
}
