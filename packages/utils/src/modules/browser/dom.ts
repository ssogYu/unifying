/**
 * 是否可使用dom 即浏览器环境
 * @returns boolean
 */
export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export const isBrowser = canUseDOM();
