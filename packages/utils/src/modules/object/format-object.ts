import { isEmpty } from "./is-empty";

/**
 * 格式化对象，去除空键值对
 * @param obj
 * @returns
 */
export const formatObject = (obj: any) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj,key)) {
      const value = obj[key];
      if (isEmpty(value)) {
        delete obj[key];
      } else if (typeof value === "object") {
        formatObject(value); // 递归处理嵌套的对象
      }
    }
  }
  return obj;
};
