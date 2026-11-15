import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import effects from '../effects.mjs'
import { parse, WHOLE } from './mml.mjs'
import { render, wav } from './synth.mjs'

const root = join(import.meta.dirname, '../..'), songs = join(root, 'audio/songs'), out = join(root, 'assets/audio')
const only = process.argv[2] ?? '', PEAK = .89, LOUD = .085, tmp = join(tmpdir(), 'chip.wav')
if (!only) for (const dir of ['soundtrack', 'effects']) rmSync(join(out, dir), { recursive: true, force: true })
mkdirSync(join(out, 'soundtrack'), { recursive: true })
mkdirSync(join(out, 'effects'), { recursive: true })

for (const file of readdirSync(songs)) {
  if (!file.includes(only)) continue
  const s = (await import(pathToFileURL(join(songs, file)))).default, bar = WHOLE / 4 * s.beats, name = file.replace('.mjs', ''), KEYS = Object.keys(s.loop)
  const size = ['intro', 'loop'].map(part => {
    const ends = KEYS.map(k => {
      const p = parse(s[part][k], k === 'n', bar)
      if (p.bad.length) console.log(name, part, k, 'bars off at', p.bad.join(' '))
      return p.end
    })
    if (new Set(ends).size > 1) console.log(name, part, 'lengths differ', ends.map(e => e / bar).join(' '))
    return ends[0]
  })
  const src = Object.fromEntries(KEYS.map(k => [k, s.intro[k] + s.loop[k].repeat(2)]))
  const mix = render(s, src, (size[0] + size[1] + s.tail * bar) / 48 * 60 / s.bpm, 4)
  writeFileSync(tmp, wav([mix.l, mix.r], Math.min(PEAK / mix.peak, LOUD / mix.rms)))
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-c:a', 'libvorbis', '-q:a', '7', '-metadata', `title=${s.title}`, join(out, 'soundtrack', name + '.ogg')])
  console.log(name, Math.round(mix.l.length / 48000) + ' s')
}
rmSync(tmp, { force: true })

if (!only || only === 'fx') {
  const made = Object.entries(effects).map(([name, { ring, send, ...fx }]) => {
    const mix = render({ bpm: 150, ring, send }, fx)
    return { name, mono: mix.l.map((v, i) => (v + mix.r[i]) / 2), peak: mix.peak }
  })
  const gain = .4 / Math.max(...made.map(m => m.peak))
  for (const m of made) writeFileSync(join(out, 'effects', m.name + '.wav'), wav([m.mono], gain))
  console.log(made.length, 'effects')
}
