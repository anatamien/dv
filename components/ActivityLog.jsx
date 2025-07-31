import React, { useState, useEffect } from 'react';

function ActivityLog({ selectedCoin, marketData }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (selectedCoin && marketData[selectedCoin.id]) {
      const coinData = marketData[selectedCoin.id];
      const priceChange = coinData.price_change_percentage_24h || 0;
      const currentTime = new Date().toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      let emoji;
      let status;
      let action;

      if (priceChange > 5) {
        emoji = '🔥';
        status = 'awakens';
        action = '龍覚醒';
      } else if (priceChange > 2) {
        emoji = '⚡';
        status = 'stirs';
        action = '龍活動';
      } else if (priceChange < -5) {
        emoji = '❄️';
        status = 'slumbers';
        action = '龍休眠';
      } else if (priceChange < -2) {
        emoji = '😴';
        status = 'rests';
        action = '龍休息';
      } else {
        emoji = '🌊';
        status = 'flows';
        action = '龍流動';
      }

      const newActivity = {
        id: Date.now(),
        time: currentTime,
        emoji,
        coin: selectedCoin.symbol.toUpperCase(),
        change: priceChange,
        status,
        action,
        price: coinData.current_price
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep max 20 activities
    }
  }, [selectedCoin, marketData]);

  const getChangeColor = (change) => {
    if (change > 2) return 'text-[#00ff9c]';
    if (change < -2) return 'text-[#ff4757]';
    return 'text-[#00c8ff]';
  };

  const getActivityBackground = (change) => {
    if (change > 2) return 'bg-[#00ff9c]/10 border-[#00ff9c]/20';
    if (change < -2) return 'bg-[#ff4757]/10 border-[#ff4757]/20';
    return 'bg-[#00c8ff]/10 border-[#00c8ff]/20';
  };

  return (
    <div className="glass-panel rounded-xl p-6 max-h-[600px] flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-[#b800ff] japanese-text">
        活動記録
      </h2>
      <p className="text-sm text-white/60 mb-4">Dragon Heartbeat Log</p>

      <div className="flex-1 overflow-y-auto space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <p className="text-2xl mb-2">🐉</p>
            <p>Waiting for dragon activity...</p>
            <p className="text-sm japanese-text">龍の活動を待機中...</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`activity-item p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${getActivityBackground(activity.change)}`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{activity.emoji}</span>
                  <span className="text-sm text-white/80">[{activity.time}]</span>
                </div>
                <span className={`text-xs font-bold ${getChangeColor(activity.change)}`}>
                  {activity.change > 0 ? '+' : ''}{activity.change.toFixed(2)}%
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-white font-medium">{activity.coin}</span>
                <span className="text-white/80"> → dragon </span>
                <span className={getChangeColor(activity.change)}>{activity.status}</span>
              </div>
              
              <div className="text-xs text-white/60 mt-1 japanese-text">
                {activity.action} - ¥{activity.price?.toLocaleString() || 'N/A'}
              </div>
              
              {/* Pulse effect for recent activities */}
              {index < 3 && (
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00ff9c]/20 to-[#b800ff]/20 blur-sm -z-10 animate-pulse"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Dragon status indicator */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Dragon Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              activities.length > 0 && activities[0].change > 2 ? 'bg-[#00ff9c]' :
              activities.length > 0 && activities[0].change < -2 ? 'bg-[#ff4757]' :
              'bg-[#00c8ff]'
            }`} />
            <span className="text-white/80">
              {activities.length > 0 ? activities[0].status : 'neutral'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ActivityLog = ActivityLog;