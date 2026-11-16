import { story } from '../parts/story'

const PAGES = [
  ['Of every hundred it hunts,', 'the dragonfly takes ninety-five.'],
  ['Before the first bird flew,', 'giants of its blood ruled the sky.'],
  ['Take it back.'],
]

export const intro = (done: () => void) => story(PAGES, done)
