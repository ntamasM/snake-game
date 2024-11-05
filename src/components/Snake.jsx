import React from "react";
import { animated, useSpring } from "@react-spring/three";

function Snake({ position }) {
  const { scale } = useSpring({
    scale: [1.1, 1.1, 1.1], // Slight growth effect
    from: { scale: [1, 1, 1] },
    reset: true,
    config: { tension: 200, friction: 10 },
  });

  return (
    <animated.mesh scale={scale} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="green" />
    </animated.mesh>
  );
}

export default Snake;
