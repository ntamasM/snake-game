function GameInfo({
  level,
  score,
  lives,
  speed,
  isPaused,
  togglePause,
  restartGame,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "white",
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  );
}

export default GameInfo;
