import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Setting } from './pages/setting';
import { Scheme } from './pages/scheme';
import { ThemeSwitchDemo } from './pages/scheme/theme-switch-demo/theme-switch-demo';
import { ProgressCircle } from './pages/css/progress-circle';
import { CSSDemo } from './pages/css';

export const RoutesLayout = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/scheme" element={<Scheme />} />
        {/* css */}
        <Route path="css" element={<CSSDemo />}>
          <Route path="progress-circle" element={<ProgressCircle />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
};
