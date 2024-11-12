import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeSwitchDemo } from './theme-switch-demo/theme-switch-demo';

export const Scheme = () => {
  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>测试</button>
    </div>
  );
};
