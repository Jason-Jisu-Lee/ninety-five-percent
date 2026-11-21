import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const LINES = {
  'Stage': 'stage', 'Tier': 'tier', 'Plural': 'many', 'Description': 'text', 'Health': 'hp', 'Power': 'power', 'Strikes every': 'strike', 'Blood': 'blood',
  'On screen': 'count', 'Returns after': 'back', 'Stays': 'stay', 'Lives': 'zone', 'Height': 'h', 'Speed': 'speed', 'Flee speed': 'fast', 'Flees within': 'flee',
  'Burst lasts': 'wind', 'Tires for': 'tire', 'Dodge distance': 'dodge', 'Turn rate': 'turn', 'Wobble': 'jink', 'Sits for': 'sit', 'Lands': 'land',
  'Cover range': 'cover', 'Breaks free after': 'grip', 'Shape': 'shape', 'Length': 'len', 'Width': 'wide', 'Wing length': 'wing', 'Wing width': 'chord',
  'Wing beat': 'beat', 'Body colour': 'body', 'Band colour': 'band', 'Eye colour': 'eye', 'Wing colour': 'tint', 'Wing edge colour': 'rim',
}
const WORDS = ['tier', 'many', 'text', 'zone', 'shape', 'body', 'band', 'eye', 'tint', 'rim'], NEEDED = ['Stage', 'Tier', 'Health', 'Blood', 'Lives']

const blocks = (file, mark) => readFileSync(file, 'utf8').replace(/\r/g, '').split('\n' + mark + ' ').slice(1).map(b => b.split('\n'))
const items = lines => lines.filter(l => l.startsWith('- ')).map(l => l.slice(2).trim())

function enemies(file) {
  return Object.fromEntries(blocks(file, '##').map(([name, ...rest]) => {
    const e = Object.fromEntries(Object.values(LINES).map(k => [k, WORDS.includes(k) ? '' : 0])), seen = []
    for (const line of items(rest)) {
      const at = line.indexOf(':'), label = line.slice(0, at).trim(), value = line.slice(at + 1).trim(), key = LINES[label]
      if (at < 0 || !key) throw Error(`docs/enemies.md, ${name}: "${line}" is not a line this file knows. Known lines: ${Object.keys(LINES).join(', ')}`)
      if (!WORDS.includes(key) && !/^(yes|no|none|-?\d*\.?\d+)$/.test(value)) throw Error(`docs/enemies.md, ${name}: ${label} needs a number, got "${value}"`)
      e[key] = WORDS.includes(key) ? value === 'none' ? '' : value : value === 'yes' ? 1 : +value || 0
      seen.push(label)
    }
    for (const label of NEEDED) if (!seen.includes(label)) throw Error(`docs/enemies.md, ${name}: the ${label} line is missing`)
    return [name.trim().toLowerCase().replace(/[^a-z]/g, ''), { name: name.trim(), ...e }]
  }))
}

function shop(file) {
  const tabs = []
  let shop = '', tab = null, fresh = false
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.replace(/^[#-]+ +/, '').trim(), at = line.indexOf(':')
    if (!line) continue
    if (/^(Blood|Evolution) shop$/.test(line)) [shop, tab] = [line, null]
    else if (!shop) continue
    else if (at > 0 && tab) {
      tab.items.push({ name: line.slice(0, at).trim(), text: line.slice(at + 1).trim() })
      fresh = false
    }
    else if (fresh) [tab.note, fresh] = [line, false]
    else tabs.push(tab = { shop, name: line, note: '', items: [] }), fresh = true
  }
  if (!tabs.length) throw Error('docs/shop.md: no shop found. A shop starts with a line reading "Blood shop" or "Evolution shop"')
  return tabs
}

const rows = v => Array.isArray(v) ? '[\n' + v.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]\n'
  : '{\n' + Object.entries(v).map(([k, x]) => `  ${JSON.stringify(k)}: ${JSON.stringify(x)}`).join(',\n') + '\n}\n'

export function sync(root) {
  for (const [doc, out, read] of [['enemies', 'data/enemies/list.json', enemies], ['shop', 'data/shop/list.json', shop]]) {
    const from = join(root, 'docs', doc + '.md'), to = join(root, out)
    if (!existsSync(from)) continue
    const made = rows(read(from))
    if (existsSync(to) && readFileSync(to, 'utf8') === made) continue
    mkdirSync(dirname(to), { recursive: true })
    writeFileSync(to, made)
  }
}
