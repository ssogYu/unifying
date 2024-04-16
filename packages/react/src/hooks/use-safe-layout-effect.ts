import { isBrowser } from '@unifying/utils';
import { useEffect, useLayoutEffect } from 'react';

/**
 * 浏览器使用 useLayoutEffect 更加安全
 * 在服务端使用 useLayoutEffect react会有警告
 * @注意 看场景使用
 */
export const useSafeLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
