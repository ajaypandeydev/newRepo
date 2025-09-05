import CoinEffect from "./CoinEffect";
import FlopEffect from "./FlopEffect";

export default function EffectsRenderer({ coinEffects, flopEffects, setCoinEffects, setFlopEffects }) {
  return (
    <>
      {coinEffects.map(effect => (
        <CoinEffect
          key={effect.id}
          x={effect.x}
          y={effect.y}
          onComplete={() => setCoinEffects(prev => prev.filter(e => e.id !== effect.id))}
        />
      ))}
      {flopEffects.map(effect => (
        <FlopEffect
          key={effect.id}
          x={effect.x}
          y={effect.y}
          onComplete={() => setFlopEffects(prev => prev.filter(e => e.id !== effect.id))}
        />
      ))}
    </>
  );
}
