import { EGG } from '../../data/egg'

export const gnd = (x: number) => Math.round(229 + 5 * Math.sin(x * .012 + .5) + 2 * Math.sin(x * .033 + 1.7))
export const rdg = (x: number) => Math.round(204 + 9 * Math.sin(x * .008 + 2.1) + 3 * Math.sin(x * .027))
export const FLOOR = gnd(EGG.x), ECY = FLOOR - EGG.ry + 1
