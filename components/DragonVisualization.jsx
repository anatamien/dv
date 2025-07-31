import React, { useState, useEffect, useRef } from 'react';

function DragonVisualization({ selectedCoin, marketData }) {
  const [dragonState, setDragonState] = useState('neutral');
  const [energyFlows, setEnergyFlows] = useState([]);
  const [transactionFlashes, setTransactionFlashes] = useState([]);
  const dragonRef = useRef(null);

  useEffect(() => {
    if (selectedCoin && marketData[selectedCoin.id]) {
      const coinData = marketData[selectedCoin.id];
      const priceChange = coinData.price_change_percentage_24h || 0;

      if (priceChange > 5) {
        setDragonState('bullish');
      } else if (priceChange < -5) {
        setDragonState('bearish');
      } else {
        setDragonState('neutral');
      }

      // Simulate energy flows based on volume
      const volume = coinData.total_volume || 0;
      const flowIntensity = Math.min(volume / 1000000000, 10);
      setEnergyFlows(prev => [...prev, { id: Date.now(), intensity: flowIntensity }]);

      // Add transaction flash
      setTransactionFlashes(prev => [...prev, { id: Date.now(), x: Math.random() * 400, y: Math.random() * 300 }]);

      // Clean up old flashes
      setTimeout(() => {
        setTransactionFlashes(prev => prev.slice(-5));
      }, 1000);
    }
  }, [selectedCoin, marketData]);

  const getDragonClass = () => {
    switch (dragonState) {
      case 'bullish':
        return 'dragon-bullish';
      case 'bearish':
        return 'dragon-bearish';
      default:
        return 'dragon-neutral';
    }
  };

  const getEnergyVeinColor = (coinSymbol) => {
    switch (coinSymbol?.toLowerCase()) {
      case 'eth':
        return 'ethereum';
      case 'btc':
        return 'bitcoin';
      default:
        return 'altcoin';
    }
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center dragon-container">
      <svg
        ref={dragonRef}
        width="800"
        height="600"
        viewBox="0 0 800 600"
        className="w-full h-full max-w-4xl"
      >
        <defs>
          {/* Gradients for various effects */}
          <linearGradient id="flameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f7931e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0.3" />
          </linearGradient>
          
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff9c" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00c8ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b800ff" stopOpacity="0.4" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Energy Veins - Background flowing paths */}
        <g className="energy-veins">
          {/* Main dragon body energy path */}
          <path
            d="M 50 300 Q 200 250 400 300 T 750 280"
            className={`energy-vein ${selectedCoin ? getEnergyVeinColor(selectedCoin.symbol) : 'ethereum'}`}
            filter="url(#glow)"
          />
          
          {/* Secondary veins */}
          <path
            d="M 100 200 Q 300 180 500 220 T 700 200"
            className="energy-vein bitcoin"
            filter="url(#glow)"
          />
          
          <path
            d="M 80 400 Q 250 420 450 380 T 720 400"
            className="energy-vein altcoin"
            filter="url(#glow)"
          />
        </g>

        {/* Main Dragon Body */}
        <g className={`dragon-main ${getDragonClass()}`}>
          {/* Dragon Head */}
          <ellipse
            cx="400"
            cy="300"
            rx="80"
            ry="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            filter="url(#glow)"
          />
          
          {/* Dragon Eye */}
          <circle
            cx="420"
            cy="290"
            r="8"
            fill="currentColor"
            className="animate-pulse"
          />
          
          {/* Dragon Body Segments */}
          <ellipse
            cx="300"
            cy="320"
            rx="60"
            ry="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          <ellipse
            cx="200"
            cy="340"
            rx="50"
            ry="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          <ellipse
            cx="120"
            cy="360"
            rx="40"
            ry="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Dragon Wings */}
          <path
            d="M 350 250 Q 320 200 280 220 Q 300 180 340 190 Q 380 200 380 240 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          <path
            d="M 450 250 Q 480 200 520 220 Q 500 180 460 190 Q 420 200 420 240 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Dragon Tail */}
          <path
            d="M 80 380 Q 50 400 30 420 Q 20 440 40 450 Q 60 440 80 420"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#glow)"
          />
        </g>

        {/* Flame Breath (visible during bullish state) */}
        {dragonState === 'bullish' && (
          <g className="flame-effects">
            <ellipse
              cx="500"
              cy="300"
              rx="60"
              ry="20"
              className="flame-breath"
              filter="url(#glow)"
            />
            <ellipse
              cx="520"
              cy="305"
              rx="40"
              ry="15"
              className="flame-breath"
              style={{ animationDelay: '0.3s' }}
              filter="url(#glow)"
            />
          </g>
        )}

        {/* Cracks (visible during bearish state) */}
        {dragonState === 'bearish' && (
          <g className="crack-effects">
            <path
              d="M 380 280 L 420 320"
              className="dragon-crack"
            />
            <path
              d="M 350 310 L 380 340"
              className="dragon-crack"
              style={{ animationDelay: '0.2s' }}
            />
            <path
              d="M 280 300 L 310 330"
              className="dragon-crack"
              style={{ animationDelay: '0.4s' }}
            />
          </g>
        )}

        {/* Transaction Flashes */}
        {transactionFlashes.map(flash => (
          <circle
            key={flash.id}
            cx={flash.x}
            cy={flash.y}
            r="8"
            fill="url(#energyGradient)"
            className="transaction-flash"
            filter="url(#glow)"
          />
        ))}

        {/* Mystic Text */}
        <text
          x="400"
          y="500"
          textAnchor="middle"
          fontSize="24"
          fill="url(#energyGradient)"
          fontFamily="'Noto Sans JP', sans-serif"
          fontWeight="bold"
          filter="url(#glow)"
        >
          龍脈
        </text>
        
        <text
          x="400"
          y="530"
          textAnchor="middle"
          fontSize="14"
          fill="#00ff9c"
          fontFamily="Orbitron, monospace"
          fontWeight="400"
        >
          Dragon Veins
        </text>
      </svg>

      {/* Floating Energy Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {energyFlows.slice(-3).map((flow, index) => (
          <div
            key={flow.id}
            className="absolute w-2 h-2 rounded-full bg-[#00ff9c] animate-ping"
            style={{
              left: `${20 + index * 30}%`,
              top: `${40 + index * 10}%`,
              animationDelay: `${index * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

window.DragonVisualization = DragonVisualization;