import React, { useState } from 'react';
import { useBoolean } from '@unifying/react';
import './styles/initialize.css';

const App = () => {
  const [count, setCount] = useState<number>(0);
  const [value, { on, off, toggle }] = useBoolean(true);

  return (
    <div id="app">
      <span className="ceshi">hello word </span>
      <span className="ceshi">{count}</span>
      <button
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        点击
      </button>
      <button
        onClick={() => {
          on();
        }}
      >
        on
      </button>
      <button
        onClick={() => {
          off();
        }}
      >
        off
      </button>
      <button
        onClick={() => {
          toggle();
        }}
      >
        toggle
      </button>
    </div>
  );
};
export default App;
