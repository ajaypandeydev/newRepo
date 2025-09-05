import { useState } from "react";

const BettingScreen = ({ walletBalance, onStartGame, onCancel }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [error, setError] = useState("");

  // Calculate bullets based on bet amount (10 currency = 3 bullets)
  const calculateBullets = (bet) => {
    return Math.floor(bet / 10) * 3;
  };

  const handleBetChange = (value) => {
    const amount = parseInt(value) || 0;
    setBetAmount(amount);
    
    if (amount < 10) {
      setError("Minimum bet is 10 currency");
    } else if (amount > walletBalance) {
      setError("Insufficient funds in wallet");
    } else {
      setError("");
    }
  };

  const handleStartGame = () => {
    if (betAmount < 10) {
      setError("Minimum bet is 10 currency");
      return;
    }
    
    if (betAmount > walletBalance) {
      setError("Insufficient funds in wallet");
      return;
    }
    
    onStartGame(betAmount, calculateBullets(betAmount));
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f9f9f9', 
      borderRadius: '10px',
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '20px' }}>Place Your Bet</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <p style={{ margin: '0', fontWeight: 'bold', fontSize: '18px' }}>
            Wallet Balance: <span style={{ color: '#4CAF50' }}>₹{walletBalance}</span>
          </p>
        </div>
        
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Bet Amount (Min: 10):
        </label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => handleBetChange(e.target.value)}
          min="10"
          max={walletBalance}
          style={{ 
            padding: '12px', 
            width: '100%', 
            borderRadius: '5px', 
            border: error ? '2px solid #f44336' : '2px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
        
        {error && (
          <p style={{ color: '#f44336', margin: '8px 0 0 0', fontSize: '14px' }}>
            {error}
          </p>
        )}
      </div>
      
      <div style={{ 
        backgroundColor: '#e8f5e9', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Bet Details:</h4>
        <p style={{ margin: '5px 0' }}><strong>Bullets:</strong> {calculateBullets(betAmount)}</p>
        <p style={{ margin: '5px 0' }}><strong>Cost:</strong> ₹{betAmount}</p>
        <p style={{ margin: '5px 0' }}><strong>Remaining Balance:</strong> ₹{walletBalance - betAmount}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Cancel
        </button>
        
        <button
          onClick={handleStartGame}
          disabled={!!error || betAmount < 10}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: error || betAmount < 10 ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: error || betAmount < 10 ? 'default' : 'pointer',
            flex: 2
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default BettingScreen;