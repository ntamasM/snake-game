import { generatePowerUp } from "../logic/gameLogic";
import { getRandomPosition } from "../utils/gameUtils";

// Function to start the game
export function startGame(setGameStarted, restartGame) {
  setGameStarted(true);
  restartGame();
}

// Function to restart the game
export function restartGame({
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
}) {
  setSnakeSegments([[0, 0, 0]]);
  setFoodPosition(getRandomPosition());
  setDirection([1, 0, 0]);
  setLevel(1);
  setObstacles([]);
  setScore(0);
  setLives(3);
  setSpeed(200);
  setIsPaused(false);
  setGameOver(false);
  setPowerUp(generatePowerUp());
}

// Function to toggle pause
export function togglePause(setIsPaused) {
  setIsPaused((prev) => !prev);
}
