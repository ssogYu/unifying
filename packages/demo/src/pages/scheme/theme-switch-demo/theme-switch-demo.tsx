import React from 'react';
import { adjectTheme } from '../../../utils/adjust-theme';
import { useBoolean } from '@unifying/react';

import './index.less';

export const ThemeSwitchDemo = () => {
  const [idDark, { toggle }] = useBoolean(false);
  return (
    <div className="home">
      <div className="header"></div>
      <div className="button">按钮</div>
      <button
        onClick={() => {
          toggle();
          adjectTheme(idDark ? 'default' : 'dark');
        }}
      >
        {idDark ? '明亮' : '暗黑'}
      </button>
    </div>
  );
};
