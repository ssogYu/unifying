import { isBrowser } from '@unifying/utils';
import { useEffect, useLayoutEffect } from 'react';

/**
 * 安全的环境感知布局 effect hook
 * - 浏览器环境使用 useLayoutEffect 以获得同步布局测量
 * - 服务端环境自动降级为 useEffect 避免警告
 *
 * @注意 SSR 场景下需确保环境检测准确，建议在应用初始化时进行环境设置
 */
export const useSafeLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
