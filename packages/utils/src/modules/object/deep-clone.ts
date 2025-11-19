/**
 * 是否是引用数据类型
 * @param sourceData
 * @returns
 */

export const isComplexDataType = (sourceData: any) =>
  (typeof sourceData === "object" || typeof sourceData === "function") &&
  sourceData !== null;
/**
 * 深拷贝
 * @param sourceData
 * @param hash
 * @returns
 */
export const deepClone = function (sourceData: any, hash = new WeakMap()) {
  if (sourceData.constructor === Date) {
    return new Date(sourceData); // 日期对象直接返回一个新的日期对象
  }

  if (sourceData.constructor === RegExp) {
    return new RegExp(sourceData); //正则对象直接返回一个新的正则对象
  }
  //如果循环引用了就用 weakMap 来解决
  if (hash.has(sourceData)) {
    return hash.get(sourceData);
  }
  const allDesc = Object.getOwnPropertyDescriptors(sourceData);

  //遍历传入参数所有键的特性
  const cloneObj = Object.create(Object.getPrototypeOf(sourceData), allDesc);

  // 把cloneObj原型复制到obj上
  hash.set(sourceData, cloneObj);

  for (const key of Reflect.ownKeys(sourceData)) {
    cloneObj[key] =
      isComplexDataType(sourceData[key]) &&
        typeof sourceData[key] !== "function"
        ? deepClone(sourceData[key], hash)
        : sourceData[key];
  }
  return cloneObj;
};
