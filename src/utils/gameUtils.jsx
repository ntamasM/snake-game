// src/utils/gameUtils.js

// Function to generate a random position for food or obstacles
export function getRandomPosition() {
  return [
    Math.floor(Math.random() * 10) - 5,
    Math.floor(Math.random() * 10) - 5,
    0,
  ];
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
