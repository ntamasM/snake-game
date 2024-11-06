import {
  getRandomPosition,
  isCollision,
  getNewHeadPosition,
} from "../utils/gameUtils";

const BOUNDARY = 5; // Set boundary limit on each axis

// Function to generate a random power-up type and position
export function generatePowerUp() {
  const types = ["extraLife", "slowDown"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return { position: getRandomPosition(), type: randomType };
}

// Function to handle power-up collision and apply effects
export function handlePowerUpCollision(snakeHead, powerUp, setLives, setSpeed) {
  if (isCollision(snakeHead, powerUp.position)) {
    if (powerUp.type === "extraLife") {
      setLives((prevLives) => prevLives + 1); // Grant extra life
    } else if (powerUp.type === "slowDown") {
      setSpeed((prevSpeed) => prevSpeed + 50); // Temporarily slow down
      setTimeout(() => setSpeed((prevSpeed) => prevSpeed - 50), 5000); // Restore speed after 5 seconds
    }
    return generatePowerUp(); // Generate a new power-up
  }
  return powerUp; // Return existing power-up if no collision
}

// Main function to handle the snake's movement, food collision, and obstacle collision
export function moveSnake({
  snakeSegments,
  direction,
  obstacles,
  powerUp,
  setLives,
  setSpeed,
  setGameOver,
  foodPosition,
  setFoodPosition,
  setScore,
  setLevel,
  setObstacles,
}) {
  const newHead = getNewHeadPosition(snakeSegments[0], direction);

  if (
    newHead[0] > BOUNDARY ||
    newHead[0] < -BOUNDARY ||
    newHead[1] > BOUNDARY ||
    newHead[1] < -BOUNDARY
  ) {
    setLives((prevLives) => {
      const updatedLives = prevLives - 1;
      if (updatedLives <= 0) {
        setGameOver(true); // Game over if lives are exhausted
      }
      return updatedLives;
    });
    return { newSnakeSegments: snakeSegments, updatedPowerUp: powerUp }; // Stop movement on boundary collision
  }

  // Check collision with food
  if (isCollision(newHead, foodPosition)) {
    setFoodPosition(getRandomPosition()); // Relocate food
    setScore((prevScore) => prevScore + 10); // Increase score by 10

    // Level up every 5 segments
    if ((snakeSegments.length + 1) % 5 === 0) {
      setLevel((prevLevel) => prevLevel + 1);
      setObstacles((prevObstacles) => [...prevObstacles, getRandomPosition()]);
    }

    return {
      newSnakeSegments: [newHead, ...snakeSegments],
      updatedPowerUp: powerUp,
    }; // Grow snake
  }

  // Check collision with obstacles
  if (obstacles.some((obs) => isCollision(newHead, obs))) {
    setLives((prevLives) => {
      const updatedLives = prevLives - 1;
      if (updatedLives <= 0) {
        setGameOver(true); // Only trigger game over if lives are now zero
      }
      return updatedLives; // Return updated lives count
    });
    return { newSnakeSegments: snakeSegments, updatedPowerUp: powerUp }; // No movement on obstacle collision
  }

  // Handle power-up collision and update power-up if collected
  const updatedPowerUp = handlePowerUpCollision(
    newHead,
    powerUp,
    setLives,
    setSpeed
  );

  // Move snake by adding the new head and removing the last segment
  return {
    newSnakeSegments: [newHead, ...snakeSegments.slice(0, -1)],
    updatedPowerUp,
  };
}
