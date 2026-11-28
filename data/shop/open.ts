export const HIDDEN = ['Appetite', 'Swarm', 'Wildlife'], RIPE = 3, FREE = 1
export const NEEDS: Record<string, string> = { 'Sharper Mandibles': 'Sharp Mandibles', 'Stronger Heart': 'Strong Heart', 'Longer Wings': 'Long Wings', 'Wider Spiracles': 'Wide Spiracles' }
export const AFTER: Record<string, string> = { 'Strong Heart': 'anatomy', 'Warm Blood': 'anatomy' }, GROWN = 'anatomy'
export const BEFORE: Record<string, string[]> = { Instinct: ['Lunge', 'Ambush'] }
export const OPEN: Record<string, string[]> = { Instinct: ['Lunge', 'Ambush', 'Dive Strike', 'Auto Target'] }
export const LESSON = [['Anatomy', 'Sharp Mandibles'], ['Instinct', 'Lunge']]
export const FIRST: Record<string, string[]> = { Anatomy: ['Sharp Mandibles', 'Long Wings', 'Wide Spiracles'], Instinct: ['Lunge', 'Ambush'] }
export const LATER = ['Hard Shell', 'Slow Mend']
