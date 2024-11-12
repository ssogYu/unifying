import React from 'react';
import { createRoot } from 'react-dom/client';
import { RoutesLayout } from './routes';

import './styles/global.less';
import { adjectTheme } from './utils/adjust-theme';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    adjectTheme();
  } catch (error) {
    console.error(error);
  }
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RoutesLayout />
  </React.StrictMode>,
);
