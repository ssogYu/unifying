/**
 * 空值判断配置选项
 */
interface IsEmptyOptions {
  /** 是否将空格字符串视为空 (默认: true) */
  trimString?: boolean;
  /** 是否将 0 视为空 (默认: false) */
  zeroAsEmpty?: boolean;
  /** 是否将 false 视为空 (默认: false) */
  falseAsEmpty?: boolean;
  /** 是否将 NaN 视为空 (默认: true) */
  nanAsEmpty?: boolean;
  /** 是否检查嵌套对象 (默认: false) */
  deep?: boolean;
  /** 自定义空值判断函数 */
  customValidator?: (value: any) => boolean;
}

/**
 * 辅助函数：判断是否为有效日期
 */
function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 判断值是否为空的通用工具函数
 * @param value - 要检查的值
 * @param options - 配置选项
 * @returns 是否为空
 */
export const isEmpty = (value: unknown, options: IsEmptyOptions = {}): boolean => {
  const {
    trimString = true,
    zeroAsEmpty = false,
    falseAsEmpty = false,
    nanAsEmpty = true,
    deep = false,
    customValidator,
  } = options;

  // 自定义验证器优先
  if (customValidator && customValidator(value)) {
    return true;
  }

  // null 和 undefined
  if (value === null || value === undefined) {
    return true;
  }

  const valueType = typeof value;

  // 处理基本类型
  switch (valueType) {
    case 'string':
      return trimString ? (value as string).trim().length === 0 : (value as string).length === 0;

    case 'number':
      if (nanAsEmpty && Number.isNaN(value)) return true;
      if (zeroAsEmpty && value === 0) return true;
      return false;

    case 'boolean':
      return falseAsEmpty && value === false;

    case 'symbol':
    case 'bigint':
      return false;

    case 'function':
      return false;
  }

  // 处理对象类型
  if (valueType === 'object') {
    // 数组
    if (Array.isArray(value)) {
      if (value.length === 0) return true;
      // 深度检查：所有元素都为空
      if (deep) {
        return value.every(item => isEmpty(item, options));
      }
      return false;
    }

    // Date
    if (value instanceof Date) {
      return !isValidDate(value);
    }

    // Set
    if (value instanceof Set) {
      if (value.size === 0) return true;
      if (deep) {
        return Array.from(value).every(item => isEmpty(item, options));
      }
      return false;
    }

    // Map
    if (value instanceof Map) {
      if (value.size === 0) return true;
      if (deep) {
        return Array.from(value.values()).every(item => isEmpty(item, options));
      }
      return false;
    }

    // WeakMap 和 WeakSet - 永远不为空（无法判断大小）
    if (value instanceof WeakMap || value instanceof WeakSet) {
      return false;
    }

    // RegExp
    if (value instanceof RegExp) {
      return false;
    }

    // Promise
    if (value instanceof Promise) {
      return false;
    }

    // ArrayBuffer 和 TypedArray
    if (value instanceof ArrayBuffer) {
      return value.byteLength === 0;
    }

    if (ArrayBuffer.isView(value)) {
      return value.byteLength === 0;
    }

    // 普通对象
    const keys = Object.keys(value as object);
    if (keys.length === 0) return true;

    // 深度检查：所有属性值都为空
    if (deep) {
      return keys.every(key => isEmpty((value as any)[key], options));
    }
    return false;
  }

  return false;
}


// ============= 基础使用 =============

// isEmpty(null);              // true
// isEmpty(undefined);         // true
// isEmpty('');                // true
// isEmpty('   ');             // true
// isEmpty([]);                // true
// isEmpty({});                // true
// isEmpty(new Set());         // true
// isEmpty(new Map());         // true
// isEmpty(0);                 // false (默认)
// isEmpty(false);             // false (默认)
// isEmpty('hello');           // false
// isEmpty([1, 2]);            // false
// isEmpty({ a: 1 });          // false

// ============= 配置选项 =============

// 0 视为空
//isEmpty(0, { zeroAsEmpty: true });  // true

// false 视为空
//isEmpty(false, { falseAsEmpty: true });  // true

// 不修剪字符串空格
//isEmpty('   ', { trimString: false });  // false

// 深度检查
//isEmpty([[], {}, ''], { deep: true });  // true
//isEmpty([[], {}, 'hello'], { deep: true });  // false

// 自定义验证器
// isEmpty('custom', {
//   customValidator: (v) => v === 'custom'
// });  // true