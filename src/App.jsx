import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Snake from "./components/Snake.jsx";
import Food from "./components/Food.jsx";
import PowerUp from "./components/PowerUp.jsx";
import { moveSnake, generatePowerUp } from "./logic/gameLogic";
import { getRandomPosition } from "./utils/gameUtils.jsx";
import { startGame, restartGame, togglePause } from "./controls/gameControls";
import GameInfo from "./components/GameInfo";
import EventNotification from "./components/EventNotification";

function App() {
  const [snakeSegments, setSnakeSegments] = useState([[0, 0, 0]]);
  const [foodPosition, setFoodPosition] = useState(getRandomPosition());
  const [direction, setDirection] = useState([1, 0, 0]);
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(200);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [powerUp, setPowerUp] = useState(generatePowerUp());
  const [notification, setNotification] = useState(null);

  // Handle direction change on key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") setDirection([0, 1, 0]);
      else if (event.key === "ArrowDown") setDirection([0, -1, 0]);
      else if (event.key === "ArrowLeft") setDirection([-1, 0, 0]);
      else if (event.key === "ArrowRight") setDirection([1, 0, 0]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Snake movement logic
  useEffect(() => {
    const moveSnakeAction = () => {
      if (isPaused || gameOver || !gameStarted) return;
      setSnakeSegments((prevSegments) => {
        const { newSnakeSegments, updatedPowerUp } = moveSnake({
          snakeSegments: prevSegments,
          direction,
          obstacles,
          powerUp,
          setLives: (newLives) => {
            setLives(newLives);
            if (newLives > 0) {
              setNotification("Life Lost!");
            }
          },
          setSpeed,
          setGameOver,
          foodPosition,
          setFoodPosition,
          setScore,
          setLevel: (newLevel) => {
            setLevel(newLevel);
            setNotification(`Level Up! Level ${newLevel}`);
          },
          setObstacles,
        });
        setPowerUp(updatedPowerUp);
        return newSnakeSegments;
      });
    };

    const interval = setInterval(moveSnakeAction, speed);
    return () => clearInterval(interval);
  }, [
    direction,
    foodPosition,
    obstacles,
    lives,
    isPaused,
    gameOver,
    gameStarted,
    speed,
    powerUp,
  ]);

  const handleRestartGame = () =>
    restartGame({
      setSnakeSegments,
      setFoodPosition,
      setDirection,
      setLevel,
      setObstacles,
      setScore,
      setLives,
      setSpeed,
      setIsPaused,
      setGameOver,
      setPowerUp,
    });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#222",
        position: "relative",
      }}
    >
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        {/* Render each snake segment */}
        {snakeSegments.map((position, index) => (
          <Snake key={index} position={position} />
        ))}
        <Food position={foodPosition} />

        {/* Render each obstacle */}
        {obstacles.map((position, index) => (
          <mesh key={index} position={position}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        ))}

        {/* Render power-up */}
        <PowerUp position={powerUp.position} type={powerUp.type} />
      </Canvas>

      {/* Game Information Display */}

      <GameInfo
        level={level}
        score={score}
        lives={lives}
        speed={speed}
        isPaused={isPaused}
        togglePause={() => togglePause(setIsPaused)}
        restartGame={handleRestartGame}
      />

      {/* Start Screen */}
      {!gameStarted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            zIndex: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Snake Game</h1>
            <p>
              Grow your snake by eating food, avoid obstacles, and reach the
              highest score!
            </p>
            <button
              onClick={() => startGame(setGameStarted, handleRestartGame)}
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            zIndex: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Game Over</h1>
            <p>Your final score: {score}</p>
            <button
              onClick={() => startGame(setGameStarted, handleRestartGame)}
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      {notification && (
        <EventNotification
          message={notification}
          onComplete={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
