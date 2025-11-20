import { isEmpty } from "./is-empty";

/**
 * 格式化对象，去除空键值对
 * @param obj
 * @param visited 用于防止循环引用的 WeakSet
 * @returns
 */
export const formatObject = (obj: any, visited = new WeakSet()) => {
  // 处理 null 或非对象
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (visited.has(obj)) {
    return obj;
  }
  visited.add(obj);

  // 获取所有属性，包括 Symbol 属性
  const keys = Reflect.ownKeys(obj);

  for (const key of keys) {
    const value = obj[key];

    if (isEmpty(value)) {
      delete obj[key];
    } else if (typeof value === "object" && value !== null) {
      // 递归处理嵌套的对象
      formatObject(value, visited);
      // 递归处理后再次检查对象是否为空
      if (isEmpty(value)) {
        delete obj[key];
      }
    }
  }
  visited.delete(obj);
  return obj;
};
