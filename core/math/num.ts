export const num = (v: number) => String(+v.toFixed(2))
export const whole = (v: number) => Math.ceil(+v.toFixed(6) - .5)
