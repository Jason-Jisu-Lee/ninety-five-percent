import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const LINES = {
  'Stage': 'stage', 'Tier': 'tier', 'Plural': 'many', 'Description': 'text', 'Health': 'hp', 'Power': 'power', 'Strikes every': 'strike', 'Blood': 'blood', 'Unlock': 'unlock',
  'On screen': 'count', 'Returns after': 'back', 'Stays': 'stay', 'Lives': 'zone', 'Height': 'h', 'Speed': 'speed', 'Flee speed': 'fast', 'Flees within': 'flee',
  'Burst lasts': 'wind', 'Tires for': 'tire', 'Dodge distance': 'dodge', 'Turn rate': 'turn', 'Wobble': 'jink', 'Sits for': 'sit', 'Lands': 'land',
  'Cover range': 'cover', 'Breaks free after': 'grip', 'Shape': 'shape', 'Length': 'len', 'Width': 'wide', 'Wing length': 'wing', 'Wing width': 'chord',
  'Wing beat': 'beat', 'Body color': 'body', 'Band color': 'band', 'Eye color': 'eye', 'Wing color': 'tint', 'Wing edge color': 'rim',
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
  const tabs = [], none = /^\(?placeholder\)?$/, bad = (line, why) => Error(`docs/Lair.md: "${line}" ${why}`)
  let shop = '', tab = null, fresh = false, tier = 0, rows = 0
  const prices = (line, cell) => {
    const cost = cell.split(',').map(n => +n)
    if (cost.some(n => !(n > 0))) throw bad(line, 'needs its prices as numbers with commas between them')
    return cost
  }
  const add = (line, name, text = '', price = '') => {
    if (!tab || !name) throw bad(line, 'must sit under a category and start with the name of the upgrade')
    tab.items.push({ name, text: text.replace(/ *\(placeholder\)$/, ''), off: none.test(price) || text.endsWith('(placeholder)'), tier, cost: price && !none.test(price) ? prices(line, price) : [] })
    fresh = false
  }
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.replace(/^[#>-]+ +/, '').trim(), at = line.indexOf(':'), cells = line.split('|').slice(1, -1).map(c => c.trim())
    rows = line[0] === '|' ? rows + 1 : 0
    if (!line || /^\(.*\)$/.test(line)) continue
    if (/^(Lair|Evolution|Blood shop|Evolution shop)$/.test(line)) [shop, tab] = [line[0] === 'E' ? 'Evolution shop' : 'Blood shop', null]
    else if (line === 'Notes') shop = ''
    else if (!shop) continue
    else if (rows) rows > 1 && cells.some(c => /[^-: ]/.test(c)) && add(line, ...cells)
    else if (tab && /^Tier \d$/.test(line)) tier = +line.slice(5)
    else if (/^Cost:/.test(line)) {
      const last = tab?.items.at(-1)
      if (!last || fresh) throw bad(line, 'must sit under an upgrade')
      last.cost = prices(line, line.slice(5))
    }
    else if (at > 0 && tab) add(line, line.slice(0, at).trim(), line.slice(at + 1).trim())
    else if (fresh) [tab.note, fresh] = [line, false]
    else tabs.push(tab = { shop, name: line, note: '', items: [] }), [fresh, tier] = [true, 0]
  }
  if (!tabs.length) throw Error('docs/Lair.md: no shop found. A shop starts with a line reading "Lair" or "Evolution"')
  return tabs
}

const rows = v => Array.isArray(v) ? '[\n' + v.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n]\n'
  : '{\n' + Object.entries(v).map(([k, x]) => `  ${JSON.stringify(k)}: ${JSON.stringify(x)}`).join(',\n') + '\n}\n'

export function sync(root) {
  for (const [doc, out, read] of [['enemies', 'data/enemies/list.json', enemies], ['Lair', 'data/shop/list.json', shop]]) {
    const from = join(root, 'docs', doc + '.md'), to = join(root, out)
    if (!existsSync(from)) continue
    const made = rows(read(from))
    if (existsSync(to) && readFileSync(to, 'utf8') === made) continue
    mkdirSync(dirname(to), { recursive: true })
    writeFileSync(to, made)
  }
}
