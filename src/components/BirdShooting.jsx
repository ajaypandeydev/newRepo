import { useEffect, useRef, useState } from "react";
import { Application, Sprite, Assets, Graphics, Circle, Text, } from "pixi.js";
import ScoreBoard from "../components/ScoreBoard";
import EffectsRender from "../components/EffectRender";
import { BIRDS } from "../components/birdConfig";

const backgroundSrc = "/background.png";

const BirdShooting = ({ betAmount, bullets, onGameEnd }) => {
  const gameRef = useRef(null);
  const appRef = useRef(null);
  const crossbowRef = useRef(null);

  const [balance, setBalance] = useState(0);
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [inRound, setInRound] = useState(false);
  const [debugInfo, setDebugInfo] = useState("Initializing...");
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [coinEffects, setCoinEffects] = useState([]);
  const [flopEffects, setFlopEffects] = useState([]);

  const pickBird = () => {
    const total = BIRDS.reduce((s, b) => s + b.weight, 0);
    let r = Math.random() * total;
    for (let b of BIRDS) {
      r -= b.weight;
      if (r <= 0) return b;
    }
    return BIRDS[0];
  };

  useEffect(() => {
    let mounted = true;
    const app = new Application();

    app.init({ width: 800, height: 500, backgroundColor: 0x262626 }).then(async () => {
      if (mounted && gameRef.current) {
        gameRef.current.appendChild(app.canvas);
        appRef.current = app;
        
        try {
          // Load background
          try {
            const backgroundTex = await Assets.load({ src: backgroundSrc, parser: "texture" });
            const backgroundSprite = new Sprite(backgroundTex);
            backgroundSprite.width = app.screen.width;
            backgroundSprite.height = app.screen.height;
            app.stage.addChildAt(backgroundSprite, 0);
          } catch {
            const fallbackBG = new Graphics();
            fallbackBG.rect(0, 0, app.screen.width, app.screen.height);
            fallbackBG.fill(0x2a4b2a);
            app.stage.addChildAt(fallbackBG, 0);
          }

          // Load birds
          await Promise.all(
            BIRDS.map(bird =>
              Assets.load(bird.src)
                .then(texture => Assets.cache.set(bird.key, texture))
                .catch(() => {
                  const graphics = new Graphics();
                  graphics.circle(0, 0, 30).fill(bird.color);
                  const placeholderTexture = app.renderer.generateTexture(graphics);
                  Assets.cache.set(bird.key, placeholderTexture);
                })
            )
          );

          // Load crossbow cursor
          const crossbowTex = await Assets.load("/crossbow.png");
          const crossbow = new Sprite(crossbowTex);
          crossbow.anchor.set(0.5);
          crossbow.scale.set(0.05); // adjust size
          app.stage.addChild(crossbow);
          crossbowRef.current = crossbow;

          // Hide default cursor
          app.canvas.style.cursor = "none";

          // Track mouse
          app.stage.eventMode = "static";
          app.stage.hitArea = app.screen;
          app.stage.on("pointermove", (e) => {
            const pos = e.global;
            crossbow.x = pos.x;
            crossbow.y = pos.y;
          });

          setAssetsLoaded(true);
          setDebugInfo("Assets loaded, ready to play!");
        } catch (err) {
          setAssetsLoaded(true);
          setDebugInfo("Error loading assets: " + err.message);
        }
      }
    });

    return () => {
      mounted = false;
      if (appRef.current) {
        appRef.current.destroy(true, true);
        appRef.current = null;
      }
    };
  }, []);

  const startRound = () => {
    if (inRound || !appRef.current) return;
    setInRound(true);
    setTimeLeft(20);
    setHits(0);
    setBalance(0);

    const app = appRef.current;
    const birds = [];

    // keep background + crossbow only
    if (app.stage.children.length > 0) {
      const bg = app.stage.children[0];
      const crossbow = crossbowRef.current;
      app.stage.removeChildren();
      app.stage.addChild(bg);
      if (crossbow) app.stage.addChild(crossbow);
    }

    // Spawn birds every 800ms
    const spawnInterval = setInterval(() => {
      const def = pickBird();
      const texture = Assets.cache.get(def.key);
      if (!texture) return;
      const sprite = new Sprite(texture);

      sprite.scale.set(def.scale);
      sprite.anchor.set(0.5);
      sprite.x = Math.random() < 0.5 ? -40 : app.screen.width + 40;
      sprite.y = Math.random() * (app.screen.height - 100) + 50;
      sprite.vx = (sprite.x < 0 ? 1 : -1) * (def.speed + Math.random() * 2); // give birds extra random speed
      sprite.def = def;
      sprite.hitArea = new Circle(0, 0, 30);

      app.stage.addChild(sprite);
      birds.push(sprite);
    }, 800);

    // Move birds
    const ticker = () => {
      if(!crossbowRef.current) return;

      for (let i = birds.length - 1; i >= 0; i--) {
        const b = birds[i];
        b.x += b.vx * app.ticker.deltaTime;

        // dodge logic 
      const dx = b.x - crossbowRef.current.x;
      const dy = b.y - crossbowRef.current.y;
      const dist =  Math.sqrt(dx * dx + dy * dy);

      if(dist < 80){
        b.y += (Math.random() < 0.5 ? -1 : 1) * 20;
        // keep bird inside screen
        if(b.y < 30) b.y = 30;
        if(b.y > app.screen.height - 30) b.y = app.screen.height - 30;
      }
        if (b.x < -60 || b.x > app.screen.width + 60) {
          app.stage.removeChild(b);
          birds.splice(i, 1);
        }
      }
    };
    app.ticker.add(ticker);

    // Shooting (stage click)
    const handleShoot = () => {
      if (!crossbowRef.current) return;
      const rect = gameRef.current.getBoundingClientRect();

      for (let i = birds.length - 1; i >= 0; i--) {
        const b = birds[i];
        const dx = crossbowRef.current.x - b.x;
        const dy = crossbowRef.current.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50) { // hit radius
          const def = b.def;
          const isFlop = Math.random() < def.flopChance;
          setHits(h => h + 1);

          if (isFlop) {
            const flopSound = new Audio("/flop-hit.wav");
            flopSound.volume = 0.8;
            flopSound.play();
            setFlopEffects(prev => [...prev, { id: Date.now(), x: b.x + rect.left, y: b.y + rect.top }]);
            setDebugInfo(`Oops! ${def.key} was a flop 🪶`);

            const missText = new Text({
              text: "MISS!",
              style: {
                fontFamily: "Arial",
                fontSize: 48,
                fill: 0xff3333,
                fontWeight: "bold",
                toStrokeStyle: { color: 0x000000, width: 3}
              },
              });
              missText.anchor.set(0.5);
              missText.x = b.x;
              missText.y = b.y - 20;
              app.stage.addChild(missText);

              let lifetime = 60
              const animateMiss = () => {
                missText.y -= 1;
                missText.alpha -= 1 / lifetime;
                if(missText.alpha <= 0){
                  app.stage.removeChild(missText);
                }
              };

              app.ticker.add(animateMiss);
          } else {
            new Audio("/hit.wav").play();
            setBalance(bal => bal + def.payout);
            setCoinEffects(prev => [...prev, { id: Date.now(), x: b.x + rect.left, y: b.y + rect.top }]);
            setDebugInfo(`Hit ${def.key}! +₹${def.payout}`);

            const floatingText = new Text({
              text: `₹${def.payout}`,
              style: {
                fontFamily: "Arial",
                fontSize: 48,
                fill: 0xffd700,
                fontWeight: "bold",
                toStrokeStyle: { color: 0x000000, width: 3}
              },
            });

            floatingText.anchor.set(0.5);
            floatingText.x = b.x
            floatingText.y = b.y - 20;
            app.stage.addChild(floatingText);

            let lifetime = 60
            const animateText = () => {
              floatingText.y -= 1,
              floatingText.alpha -= 1 / lifetime;
              if(floatingText.alpha <= 0){
                app.stage.removeChild(floatingText)
              }
            };

            app.ticker.add(animateText)
          }

          app.stage.removeChild(b);
          birds.splice(i, 1);
          break; // only one hit per shot
        }
      }
    };
    app.stage.on("pointerdown", handleShoot);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          clearInterval(spawnInterval);
          app.ticker.remove(ticker);
          app.stage.off("pointerdown", handleShoot);
          setInRound(false);
          birds.forEach(b => app.stage.removeChild(b));
          birds.length = 0;
          onGameEnd(balance);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2 style={{ color: "#4CAF50" }}>🐦 Bird Hunt </h2>
      <ScoreBoard balance={balance} hits={hits} timeLeft={timeLeft} />

      <button
        onClick={startRound}
        disabled={inRound || !assetsLoaded}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: inRound ? "#ccc" : assetsLoaded ? "#4CAF50" : "#ff9800",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: inRound || !assetsLoaded ? "default" : "pointer",
          marginBottom: "20px",
        }}
      >
        {!assetsLoaded ? "Loading Assets..." : inRound ? "Round Running..." : "Start Round"}
      </button>

      <div
        ref={gameRef}
        style={{
          margin: "0 auto",
          width: "800px",
          height: "500px",
          border: "2px solid #4CAF50",
          borderRadius: "5px",
          overflow: "hidden",
          position: "relative",
        }}
      />

      <EffectsRender
        coinEffects={coinEffects}
        flopEffects={flopEffects}
        setCoinEffects={setCoinEffects}
        setFlopEffects={setFlopEffects}
      />

      <div
        style={{
          marginTop: "20px",
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "5px",
          maxWidth: "800px",
          margin: "20px auto",
        }}
      >
        <h3>Debug Info:</h3>
        <pre
          style={{
            background: "#333",
            color: "#0f0",
            padding: "10px",
            borderRadius: "3px",
            fontFamily: "monospace",
          }}
        >
          {debugInfo}
        </pre>
      </div>

      <div>
        <h3>Bet Amount: ₹{betAmount}</h3>
        <h3>Bullets: {bullets}</h3>
        <button onClick={() => onGameEnd(balance)}>End Game</button>
      </div>
    </div>
  );
};

export default BirdShooting;
