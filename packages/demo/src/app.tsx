import React, { useState } from 'react';
import './styles/initialize.css';

const App = () => {
  const [ceshi, setCeshi] = useState<number>(0);

  return (
    <div className="app">
      <span className="ceshi">hello word</span>
      <span className="ceshi">{ceshi}</span>
      <button onClick={()=>{
        setCeshi(count => count +1)
      }}>点击</button>
    </div>
  );
};
export default App