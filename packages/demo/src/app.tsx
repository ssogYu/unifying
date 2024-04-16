import React, { useState } from 'react';
import './styles/initialize.css';
import { useEffectCustomAsync } from '@unifying/react';

const App = () => {
  const [ceshi, setCeshi] = useState<number>(0);
  useEffectCustomAsync(async () => {
    console.log(11122);
  }, []);
  return (
    <div className="app">
      <span className="ceshi">hello word</span>
      <span className="ceshi">{ceshi}</span>
      <button
        onClick={() => {
          setCeshi((count) => count + 1);
        }}
      >
        点击
      </button>
    </div>
  );
};
export default App;
