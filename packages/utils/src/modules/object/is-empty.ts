export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true // 统一处理 null/undefined

  switch (true) {
    case typeof value === "string" || value instanceof Array:
      return value.length === 0

    case value instanceof Map || value instanceof Set:
      return value.size === 0
    // 可考虑增加的边界情况处理
    case value instanceof Promise:
      return false // Promise对象通常认为非空
    case ArrayBuffer.isView(value): // 处理 TypedArray
      return value.byteLength === 0
    case value instanceof Date:
      return false

    case Object.prototype.toString.call(value) === '[object Object]':
      return Object.keys(value).length === 0

    default:
      return false
  }
}