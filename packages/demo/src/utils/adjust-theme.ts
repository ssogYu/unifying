import { ThemeStyle } from '../types/adjust-theme';

export const adjectTheme = (theme: ThemeStyle = 'default') => {
  //todo 获取url theme参数
  window.document.documentElement.setAttribute('data-theme', `${theme}`);
};
