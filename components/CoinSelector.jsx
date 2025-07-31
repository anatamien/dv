import React, { useState, useEffect } from 'react';

function CoinSelector({ onCoinSelect, selectedCoin }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=false&price_change_percentage=24h'
      );
      const data = await response.json();
      setCoins(data);
      
      // Auto-select Bitcoin as default
      if (data.length > 0 && !selectedCoin) {
        onCoinSelect(data.find(coin => coin.symbol.toLowerCase() === 'btc') || data[0]);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-[#00ff9c]';
    if (change < 0) return 'text-[#ff4757]';
    return 'text-white';
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 japanese-text">選択 / Selection</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-black/20 animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-600 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 max-h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-[#00ff9c] japanese-text">
        暗号通貨選択
      </h2>
      <p className="text-sm text-white/60 mb-4">Crypto Selection</p>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cryptocurrencies..."
          className="w-full bg-black/40 border border-[#00ff9c]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#00ff9c] transition-all duration-300"
        />
        <div className="absolute inset-0 rounded-lg bg-[#00ff9c]/5 -z-10"></div>
      </div>

      {/* Coins List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredCoins.map((coin, index) => (
          <div
            key={coin.id}
            onClick={() => onCoinSelect(coin)}
            className={`coin-card p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
              selectedCoin?.id === coin.id
                ? 'border-[#00ff9c] bg-[#00ff9c]/10'
                : 'border-white/10 bg-black/20 hover:border-[#b800ff]/50 hover:bg-[#b800ff]/5'
            }`}
            style={{
              animationDelay: `${index * 0.05}s`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMGZmOWMiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0iI2ZmZiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9zdmc+Cg==';
                  }}
                />
                <div>
                  <h3 className="font-medium text-white">{coin.name}</h3>
                  <p className="text-xs text-white/60 uppercase">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  ${coin.current_price?.toLocaleString() || 'N/A'}
                </p>
                <p className={`text-xs font-medium ${getPriceChangeColor(coin.price_change_percentage_24h)}`}>
                  {coin.price_change_percentage_24h ? 
                    `${coin.price_change_percentage_24h > 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` 
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            {/* Energy indicator bar */}
            <div className="mt-2 w-full bg-black/30 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  selectedCoin?.id === coin.id ? 'bg-[#00ff9c]' : 'bg-[#b800ff]/50'
                }`}
                style={{
                  width: `${Math.min((coin.total_volume || 0) / 10000000000 * 100, 100)}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredCoins.length === 0 && (
        <div className="text-center py-8 text-white/60">
          <p>No cryptocurrencies found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
}

window.CoinSelector = CoinSelector;