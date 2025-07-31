import React, { useState, useEffect } from 'react';

function Home() {
  const DragonVisualization = window.DragonVisualization;
  const CoinSelector = window.CoinSelector;
  const ActivityLog = window.ActivityLog;

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [marketData, setMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial market data
    fetchMarketData();
    
    // Set up interval to refresh data
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=false&price_change_percentage=24h'
      );
      const data = await response.json();
      
      // Convert array to object for easier lookup
      const dataMap = {};
      data.forEach(coin => {
        dataMap[coin.id] = coin;
      });
      
      setMarketData(dataMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setIsLoading(false);
    }
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff9c]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b800ff]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00c8ff]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 text-center border-b border-[#00ff9c]/20">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-[#00ff9c] via-[#00c8ff] to-[#b800ff] bg-clip-text mb-2 japanese-text">
          龍脈
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light">Dragon Veins</p>
        <p className="text-sm text-white/60 mt-2">Blockchain Energy Visualization</p>
        
        {/* Status indicator */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#00ff9c] rounded-full animate-pulse"></div>
            <span className="text-xs text-white/60">ETH Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#00c8ff] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <span className="text-xs text-white/60">BTC Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#b800ff] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span className="text-xs text-white/60">Altcoins</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dragon Visualization - Center */}
          <div className="mb-8">
            <DragonVisualization
              selectedCoin={selectedCoin}
              marketData={marketData}
            />
          </div>

          {/* Side Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coin Selector - Left */}
            <CoinSelector
              onCoinSelect={handleCoinSelect}
              selectedCoin={selectedCoin}
            />

            {/* Activity Log - Right */}
            <ActivityLog
              selectedCoin={selectedCoin}
              marketData={marketData}
            />
          </div>

          {/* Current Selection Display */}
          {selectedCoin && (
            <div className="mt-8 glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#ffd700] japanese-text">
                  現在の選択
                </h2>
                <p className="text-sm text-white/60">Current Selection</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedCoin.image}
                    alt={selectedCoin.name}
                    className="w-12 h-12 rounded-full border-2 border-[#ffd700]/50"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedCoin.name}</h3>
                    <p className="text-white/60 uppercase">{selectedCoin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ${marketData[selectedCoin.id]?.current_price?.toLocaleString() || 'N/A'}
                  </p>
                  <p className={`text-sm font-medium ${
                    (marketData[selectedCoin.id]?.price_change_percentage_24h || 0) > 0 
                      ? 'text-[#00ff9c]' 
                      : 'text-[#ff4757]'
                  }`}>
                    {marketData[selectedCoin.id]?.price_change_percentage_24h ? 
                      `${marketData[selectedCoin.id].price_change_percentage_24h > 0 ? '+' : ''}${marketData[selectedCoin.id].price_change_percentage_24h.toFixed(2)}%`
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {/* Energy level visualization */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/80">Dragon Energy Level</span>
                  <span className="text-sm text-[#ffd700]">
                    {Math.abs(marketData[selectedCoin.id]?.price_change_percentage_24h || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      (marketData[selectedCoin.id]?.price_change_percentage_24h || 0) > 0 
                        ? 'bg-gradient-to-r from-[#00ff9c] to-[#ffd700]' 
                        : 'bg-gradient-to-r from-[#ff4757] to-[#ff6b7a]'
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(marketData[selectedCoin.id]?.price_change_percentage_24h || 0) * 5, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center border-t border-[#00ff9c]/20 mt-16">
        <p className="text-white/60 text-sm">
          Powered by CoinGecko API • Built with ❤️ for the crypto community
        </p>
        <p className="text-white/40 text-xs mt-2 japanese-text">
          暗号通貨の力で龍を覚醒せよ
        </p>
      </footer>
    </div>
  );
}

window.Home = Home;