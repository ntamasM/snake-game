const BOUNDARY = 5; // Use the same boundary constant here

// Function to generate a random position for food or obstacles
export function getRandomPosition() {
  const min = -BOUNDARY + 1;
  const max = BOUNDARY - 1;
  const x = Math.floor(Math.random() * (max - min + 1)) + min;
  const y = Math.floor(Math.random() * (max - min + 1)) + min;
  return [x, y, 0]; // Fixed Z axis for 2D gameplay
}

// Function to check if two positions are close enough to consider a "collision"
export function isCollision(pos1, pos2, threshold = 0.5) {
  return (
    Math.abs(pos1[0] - pos2[0]) < threshold &&
    Math.abs(pos1[1] - pos2[1]) < threshold
  );
}

// Function to calculate new head position based on direction
export function getNewHeadPosition(head, direction) {
  return [
    head[0] + direction[0] * 0.5,
    head[1] + direction[1] * 0.5,
    head[2] + direction[2] * 0.5,
  ];
}
