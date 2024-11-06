function Food({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial
        color="red"
        emissive="darkred"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default Food;
