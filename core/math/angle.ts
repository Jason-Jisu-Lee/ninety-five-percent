export const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
export const turn = (from: number, to: number, max: number) => from + Math.max(-max, Math.min(max, wrap(to - from)))
