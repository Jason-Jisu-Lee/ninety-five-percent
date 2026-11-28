export const HIDDEN = ['Swarm', 'Wildlife'], RIPE = 3, FREE = 1
export const NEEDS: Record<string, string> = { 'Sharper Mandibles': 'Sharp Mandibles', 'Stronger Heart': 'Strong Heart', 'Longer Wings': 'Long Wings', 'Wider Spiracles': 'Wide Spiracles', 'Bigger Bounty': 'Bounty' }
export const AFTER: Record<string, string> = { 'Warm Blood': 'anatomy', 'Strong Heart': 'auto', 'Feeding Rest': 'auto', 'Auto Lunge': 'auto', Appetite: 'auto' }, GROWN = 'anatomy'
export const BEFORE: Record<string, string[]> = { Instinct: ['Lunge', 'Ambush'] }
export const OPEN: Record<string, string[]> = { Instinct: ['Lunge', 'Ambush', 'Auto Target', 'Feeding Rest', 'Auto Lunge'], Appetite: ['Bounty', 'Bigger Bounty'] }
export const ONLY: Record<string, string[]> = { Appetite: ['Bounty', 'Bigger Bounty'] }
export const LESSON = [['Anatomy', 'Sharp Mandibles'], ['Instinct', 'Lunge']]
export const FIRST: Record<string, string[]> = { Anatomy: ['Sharp Mandibles', 'Long Wings', 'Wide Spiracles'], Instinct: ['Lunge', 'Ambush'] }
export const LATER = ['Hard Shell', 'Slow Mend', 'Dive Strike']
