import { clamp } from './clamp'

export const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
export const turn = (from: number, to: number, max: number) => from + clamp(wrap(to - from), -max, max)
