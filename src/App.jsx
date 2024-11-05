import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Snake from "./components/Snake.jsx";
import Food from "./components/Food.jsx";
import {
  getRandomPosition,
  isCollision,
  getNewHeadPosition,
} from "./utils/gameUtils.jsx";

function App() {
  const [snakeSegments, setSnakeSegments] = useState([[0, 0, 0]]);
  const [foodPosition, setFoodPosition] = useState(getRandomPosition());
  const [direction, setDirection] = useState([1, 0, 0]);
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0); // New score state
  const [lives, setLives] = useState(3); // New lives state
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(200);

  const startGame = () => {
    setGameStarted(true);
    restartGame(); // Reset the game state in case it’s a restart
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  const restartGame = () => {
    setSnakeSegments([[0, 0, 0]]);
    setFoodPosition(getRandomPosition());
    setDirection([1, 0, 0]);
    setLevel(1);
    setObstacles([]);
    setScore(0);
    setLives(3);
    setIsPaused(false);
    setGameOver(false);
  };

  // Handle arrow key presses to change direction
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection([0, 1, 0]);
          break;
        case "ArrowDown":
          setDirection([0, -1, 0]);
          break;
        case "ArrowLeft":
          setDirection([-1, 0, 0]);
          break;
        case "ArrowRight":
          setDirection([1, 0, 0]);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update snake position and handle collisions
  useEffect(() => {
    const moveSnake = () => {
      if (isPaused || gameOver) return; // Skip movement if paused or game is over
      setSnakeSegments((prevSegments) => {
        const newHead = getNewHeadPosition(prevSegments[0], direction);

        // Check collision with food
        if (isCollision(newHead, foodPosition)) {
          setFoodPosition(getRandomPosition()); // Relocate food
          setScore((prevScore) => prevScore + 10); // Increase score by 10

          // Every 5 segments, increase level
          if ((prevSegments.length + 1) % 5 === 0) {
            setLevel((prevLevel) => prevLevel + 1);
            setSpeed((prevSpeed) => Math.max(prevSpeed - 20, 50)); // Increase speed, with a cap

            // Add new obstacles as level increases
            setObstacles((prevObstacles) => [
              ...prevObstacles,
              getRandomPosition(),
            ]);
          }

          return [newHead, ...prevSegments]; // Grow snake
        }

        // Check collision with obstacles
        if (obstacles.some((obs) => isCollision(newHead, obs))) {
          setLives((prevLives) => prevLives - 1); // Reduce lives by 1
          if (lives - 1 <= 0) {
            setGameOver(true);
            setGameStarted(false);
          }
          return prevSegments; // Stop moving if hit obstacle
        }

        // Move snake by adding the new head and removing the last segment
        return [newHead, ...prevSegments.slice(0, -1)];
      });
    };

    const interval = setInterval(moveSnake, speed);
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
  ]);

  return (
    <div
      style={{
        height: "100svh",
        width: "100svw",
        backgroundColor: "#222", // Dark background color for contrast
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "white",
          zIndex: 10,
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <div>Level: {level}</div>
        <div>Score: {score}</div>
        <div>Lives: {lives}</div>
        <div>Speed: {speed}ms</div>
        <button onClick={togglePause} style={{ margin: "5px" }}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button onClick={restartGame} style={{ margin: "5px" }}>
          Restart
        </button>
      </div>
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
      </Canvas>
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
              onClick={startGame}
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              Start Game
            </button>
          </div>
        </div>
      )}
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
              onClick={startGame}
              style={{ padding: "10px 20px", marginTop: "10px" }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
