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
 * 辅助函数：判断是否为纯对象
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
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

  // NaN
  if (nanAsEmpty && typeof value === 'number' && Number.isNaN(value)) {
    return true;
  }

  // 布尔值 false
  if (falseAsEmpty && value === false) {
    return true;
  }

  // 数字 0
  if (zeroAsEmpty && value === 0) {
    return true;
  }

  // 字符串
  if (typeof value === 'string') {
    return trimString ? value.trim().length === 0 : value.length === 0;
  }

  // 数组
  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    // 深度检查：所有元素都为空
    if (deep) {
      return value.every(item => isEmpty(item, options));
    }
    return false;
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

  // Date
  if (value instanceof Date) {
    return !isValidDate(value);
  }

  // 正则表达式
  if (value instanceof RegExp) {
    return false; // 正则对象本身不为空
  }

  // 函数
  if (typeof value === 'function') {
    return false; // 函数不视为空
  }

  // Promise
  if (value instanceof Promise) {
    return false; // Promise 对象本身不为空
  }

  // ArrayBuffer / TypedArray
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    return (value as ArrayBuffer).byteLength === 0;
  }

  // 普通对象
  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    if (keys.length === 0) return true;

    // 深度检查：所有属性值都为空
    if (deep) {
      return keys.every(key => isEmpty((value as any)[key], options));
    }
    return false;
  }

  // 其他情况视为非空
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