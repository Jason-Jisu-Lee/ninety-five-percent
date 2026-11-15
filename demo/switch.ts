import './switch.css'
import type { Control } from '../world/stage1/hunt'
import { show } from '../world/stage1/scene'

const GROUPS = [
  { name: 'A  Front page', options: [{ label: 'Show', hint: 'Press Start.\nEsc returns here.' }] },
  {
    name: 'B  Control', options: [
      { label: 'Steer', hint: 'Move the mouse.\nThe dragonfly follows it.' },
      { label: 'Mark prey', hint: 'It hunts by itself.\nClick a bug to send it after that one.' },
      { label: 'Send to a spot', hint: 'It hunts by itself inside the ring.\nClick the ground to move the ring.' },
    ],
  },
]

export function demo() {
  const el = document.body.appendChild(document.createElement('div')), hint = document.createElement('p'), buttons: HTMLButtonElement[] = []
  const pick = (i: number) => {
    show(i as Control)
    buttons.forEach((b, j) => b.classList.toggle('on', i === j))
    hint.textContent = GROUPS.flatMap(g => g.options)[i].hint
  }
  el.className = 'demo'
  for (const g of GROUPS) {
    const row = el.appendChild(document.createElement('div'))
    row.append(Object.assign(document.createElement('b'), { textContent: g.name }))
    for (const o of g.options) {
      const i = buttons.length, b = row.appendChild(Object.assign(document.createElement('button'), { textContent: `${i}  ${o.label}` }))
      b.onclick = () => {
        pick(i)
        b.blur()
      }
      buttons.push(b)
    }
  }
  el.append(hint)
  addEventListener('keydown', e => buttons[+e.key] && e.key !== ' ' && pick(+e.key))
  pick(+location.hash.slice(1) || 0)
}
