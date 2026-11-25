import { LUNGE } from '../../data/dragonfly/fight'

const END = 2, WIDE = 16

export const squeeze = (r: number, far: number) => far > LUNGE.far ? r : Math.round(END + (WIDE - END) * Math.max(0, far - LUNGE.near) / (LUNGE.far - LUNGE.near))
