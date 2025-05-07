export const isNil = (v: string | number | object | boolean | null | undefined) => {
  return Object.prototype.toString.call(v) === '[object Null]' || Object.prototype.toString.call(v) === '[object Undefined]'
}
