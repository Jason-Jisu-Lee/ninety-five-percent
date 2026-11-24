import { story, type Page } from '../parts/story'

const PAGES: Page[] = [
  ['300 million BC', 'Meganisoptera ruled the sky'],
  ['250 million BC', 'Massive volcanic eruptions in Siberia scorched the Earth', 'The apex predators were no more'],
  ['But an ancient bloodline survived', 'Dragonflies', 3.5, 'The sky will be theirs again...'],
]

export const intro = (done: () => void) => story(PAGES, done)
