// components/CoinEffect.jsx
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import coinAnim from "../assets/animation/Coin.json"; // place your JSON in public/animations

const CoinEffect = ({ x, y, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 800); // match animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x - 50,
        top: y - 50,
        width: 200,
        height: 200,
        pointerEvents: "none",
      }}
    >
      <Lottie
        animationData={coinAnim}
        autoplay
        loop={false}
        style={{ width: "120%", height: "120%" }}
      />
    </div>
  );
};

export default CoinEffect;
