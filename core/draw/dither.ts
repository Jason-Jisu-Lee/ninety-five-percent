const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

export const bayer = (x: number, y: number) => B[(y & 3) * 4 + (x & 3)] / 16
export const dither = (x: number, y: number, level: number) => level > bayer(x, y)
