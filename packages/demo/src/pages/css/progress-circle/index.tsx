import React, { useEffect, useLayoutEffect } from 'react';
import './index.less';

export const ProgressCircle = () => {
  useLayoutEffect(() => {
    setValue(30);
  }, []);
  const setValue = (value: number) => {
    const root = document.querySelector(':root') as any;
    root?.style?.setProperty('--value', value);
  };

  return (
    <div className="semicircle-box">
      <div className="dot"> </div>
      <div className="semicircle-box-hidden" style={{ width: '400px', height: '200px' }}>
        <div className="semicircle-plan">
          <div className="cover"> </div>
        </div>
      </div>
    </div>
  );
};
