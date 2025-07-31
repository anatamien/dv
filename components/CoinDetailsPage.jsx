import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

function CoinDetailsPage() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoinDetails();
  }, [coinId]);

  const fetchCoinDetails = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=true`
      );
      
      if (!response.ok) {
        throw new Error('Coin not found');
      }
      
      const data = await response.json();
      setCoinData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-t-4 border-b-4 border-[#00ff9c] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-r-4 border-l-4 border-[#b800ff] rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
          </div>
          <h2 className="text-2xl font-bold japanese-text">詳細読込中</h2>
          <p className="text-white/60">Loading dragon data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 px-4 py-2 bg-[#00ff9c]/20 border border-[#00ff9c] rounded-lg hover:bg-[#00ff9c]/30 transition-all duration-300"
          >
            ← Back to Dragon Veins
          </button>
          <div className="glass-panel rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-[#ff4757] mb-4">Error</h2>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const priceChange = coinData.market_data?.price_change_percentage_24h || 0;
  const getPriceChangeColor = (change) => {
    if (change > 0) return 'text-[#00ff9c]';
    if (change < 0) return 'text-[#ff4757]';
    return 'text-white';
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-[#00ff9c]/20 border border-[#00ff9c] rounded-lg hover:bg-[#00ff9c]/30 transition-all duration-300 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Dragon Veins</span>
        </button>

        {/* Header */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={coinData.image?.large}
                alt={coinData.name}
                className="w-16 h-16 rounded-full border-2 border-[#00ff9c]/50"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#00ff9c] japanese-text">
                  {coinData.name}
                </h1>
                <p className="text-white/60 uppercase text-sm">
                  {coinData.symbol} • Rank #{coinData.market_data?.market_cap_rank || 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                ${coinData.market_data?.current_price?.usd?.toLocaleString() || 'N/A'}
              </p>
              <p className={`text-lg font-medium ${getPriceChangeColor(priceChange)}`}>
                {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Main Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Data */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#b800ff] mb-4 japanese-text">
              市場データ
            </h2>
            <p className="text-sm text-white/60 mb-4">Market Data</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-white/80">Market Cap</span>
                <span className="text-white font-medium">
                  ${coinData.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-white/80">24h Volume</span>
                <span className="text-white font-medium">
                  ${coinData.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-white/80">Circulating Supply</span>
                <span className="text-white font-medium">
                  {coinData.market_data?.circulating_supply?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-white/80">All Time High</span>
                <span className="text-[#00ff9c] font-medium">
                  ${coinData.market_data?.ath?.usd?.toLocaleString() || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-white/80">All Time Low</span>
                <span className="text-[#ff4757] font-medium">
                  ${coinData.market_data?.atl?.usd?.toLocaleString() || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#00c8ff] mb-4 japanese-text">
              概要
            </h2>
            <p className="text-sm text-white/60 mb-4">About</p>
            
            <div 
              className="text-white/80 text-sm leading-relaxed max-h-80 overflow-y-auto"
              dangerouslySetInnerHTML={{ 
                __html: coinData.description?.en?.slice(0, 1000) + '...' || 'No description available.' 
              }}
            />
          </div>
        </div>

        {/* Additional Stats */}
        {coinData.community_data && (
          <div className="glass-panel rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-[#ffd700] mb-4 japanese-text">
              コミュニティ
            </h2>
            <p className="text-sm text-white/60 mb-4">Community Data</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <p className="text-[#00ff9c] text-2xl font-bold">
                  {coinData.community_data.twitter_followers?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-white/60 text-sm">Twitter Followers</p>
              </div>
              
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <p className="text-[#b800ff] text-2xl font-bold">
                  {coinData.community_data.reddit_subscribers?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-white/60 text-sm">Reddit Subscribers</p>
              </div>
              
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <p className="text-[#00c8ff] text-2xl font-bold">
                  {coinData.community_data.telegram_channel_user_count?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-white/60 text-sm">Telegram Users</p>
              </div>
              
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <p className="text-[#ffd700] text-2xl font-bold">
                  {coinData.watchlist_portfolio_users?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-white/60 text-sm">Watchlist Users</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.CoinDetailsPage = CoinDetailsPage;