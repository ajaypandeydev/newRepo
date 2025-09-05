import React, { useState } from "react";
import BettingScreen from "./components/BettingScreen";
import BirdShooting from "./components/BirdShooting";

const GameWrapper = () => {
  const [walletBalance, setWalletBalance] = useState(200);
  const [showBetting, setShowBetting] = useState(true);
  const [betInfo, setBetInfo] = useState(null);

  const handleStartGame = (betAmount, bullets) => {
    setWalletBalance(prev => prev - betAmount);
    setBetInfo({ betAmount, bullets });
    setShowBetting(false);
  };

  const handleCancel = () => {
    setShowBetting(false);
  };

  const handleGameEnd = (winnings = 0) => {
    setWalletBalance(prev => prev + winnings);
    setShowBetting(true);
    setBetInfo(null);
  };

  return (
    <div>
      {showBetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <BettingScreen
            walletBalance={walletBalance}
            onStartGame={handleStartGame}
            onCancel={handleCancel}
          />
        </div>
      )}

      {!showBetting && betInfo && (
        <BirdShooting
          betAmount={betInfo.betAmount}
          bullets={betInfo.bullets}
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
};

export default GameWrapper;