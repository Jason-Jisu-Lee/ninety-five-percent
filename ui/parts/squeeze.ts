import { LUNGE } from '../../data/dragonfly/fight'

const END = 2

export const squeeze = (r: number, far: number) => far < LUNGE.near || far > LUNGE.far ? r : Math.round(END + (r - END) * (far - LUNGE.near) / (LUNGE.far - LUNGE.near))
