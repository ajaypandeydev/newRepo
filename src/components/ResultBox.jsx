import React from "react";

const ResultBox = ({ winnings, net, originalBet, walletBalance, onClose }) => {
  const isProfit = net > 0;
  const isBreakEven = net === 0;
  const isLoss = net < 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Round Over!</h2>

        <div className="mb-4">
          <p className="text-md text-gray-700">
            Original Bet: <span className="font-bold">₹{originalBet}</span>
          </p>
          <p className="text-lg">
            You Won:{" "}
            <span className="font-bold text-green-500">₹{winnings}</span>
          </p>
        </div>

        {isProfit && (
          <p className="text-lg font-bold text-green-600 mb-2">
            🎊 Profit: ₹{net}
          </p>
        )}
        {isBreakEven && (
          <p className="text-lg font-bold text-blue-600 mb-2">➖ Break Even</p>
        )}
        {isLoss && (
          <p className="text-lg font-bold text-red-600 mb-2">
            📉 Loss: ₹{Math.abs(net)}
          </p>
        )}

        <p className="text-md text-gray-700 mb-6">
          Updated Wallet Balance:{" "}
          <span className="font-bold">₹{walletBalance}</span>
        </p>

        <button
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default ResultBox;
