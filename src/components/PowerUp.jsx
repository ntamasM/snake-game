function PowerUp({ position, type }) {
  const color = type === "extraLife" ? "blue" : "purple"; // Color based on type
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default PowerUp;
