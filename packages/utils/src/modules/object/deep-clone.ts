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
  // 处理原始类型和函数
  if (typeof sourceData !== 'object' || sourceData === null) {
    return sourceData;
  }

  // 处理 Date 对象
  if (sourceData instanceof Date) {
    return new Date(sourceData.getTime());
  }

  // 处理 RegExp 对象
  if (sourceData instanceof RegExp) {
    return new RegExp(sourceData.source, sourceData.flags);
  }

  // 处理 Map 对象
  if (sourceData instanceof Map) {
    const cloneMap = new Map();
    hash.set(sourceData, cloneMap);
    sourceData.forEach((value, key) => {
      cloneMap.set(deepClone(key, hash), deepClone(value, hash));
    });
    return cloneMap;
  }

  // 处理 Set 对象
  if (sourceData instanceof Set) {
    const cloneSet = new Set();
    hash.set(sourceData, cloneSet);
    sourceData.forEach(value => {
      cloneSet.add(deepClone(value, hash));
    });
    return cloneSet;
  }

  // 处理 Array 对象
  if (Array.isArray(sourceData)) {
    const cloneArray: any[] = [];
    hash.set(sourceData, cloneArray);
    sourceData.forEach((value, index) => {
      cloneArray[index] = deepClone(value, hash);
    });
    return cloneArray;
  }

  // 处理普通对象
  if (hash.has(sourceData)) {
    return hash.get(sourceData);
  }

  // 创建新对象，保持原型链
  const cloneObj = Object.create(Object.getPrototypeOf(sourceData));
  hash.set(sourceData, cloneObj);

  // 复制所有属性（包括 Symbol 属性和不可枚举属性）
  for (const key of Reflect.ownKeys(sourceData)) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(sourceData, key);
      if (descriptor && descriptor.enumerable) {
        cloneObj[key] = deepClone(sourceData[key], hash);
      } else if (descriptor && !descriptor.enumerable) {
        // 只读属性需要特殊处理
        if (descriptor.value !== undefined) {
          Object.defineProperty(cloneObj, key, {
            ...descriptor,
            value: deepClone(sourceData[key], hash)
          });
        } else {
          Object.defineProperty(cloneObj, key, descriptor);
        }
      }
    } catch (error) {
      // 如果无法复制某个属性，跳过它
      continue;
    }
  }

  return cloneObj;
};
