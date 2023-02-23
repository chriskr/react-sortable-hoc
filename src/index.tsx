import React from 'react';
import { createRoot } from 'react-dom/client';
import Test from './Test';

window.onload = async () => {
  const reactRoot = document.querySelector('#react-root');
  if (!reactRoot) return;
  createRoot(reactRoot).render(
    <React.StrictMode>
      <Test />
    </React.StrictMode>
  );
};
