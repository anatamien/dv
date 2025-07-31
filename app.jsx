import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    const checkDependencies = () => {
      if (
        window.Web3Provider &&
        window.CoinDetailsPage &&
        window.Home
      ) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-[#00ff9c] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-r-4 border-l-4 border-[#b800ff] rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
        </div>
        <p className="mt-6 text-[#00ff9c] text-xl font-bold japanese-text">龍脈 Loading...</p>
        <p className="mt-2 text-white/60">Awakening the Dragon...</p>
      </div>
    );
  }

  return (
    <window.Web3Provider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<window.Home />} />
          <Route path="/:coinId" element={<window.CoinDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </window.Web3Provider>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);