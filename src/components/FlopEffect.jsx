import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import flopAnim from "../assets/animation/fall smoke dust.json";

const FlopEffect = ({ x, y, size = 150, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >
      <Lottie animationData={flopAnim} autoplay loop={false} />
    </div>
  );
};

export default FlopEffect;
