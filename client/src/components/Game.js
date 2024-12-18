import React, { useState, useEffect } from 'react';

function Game({ currentQuestion, players, socket }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(30);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    socket.emit('submitAnswer', { answer });
  };

  return (
    <div className="game">
      <div className="scoreboard">
        {players.map(player => (
          <div key={player.id}>
            {player.name}: {player.score} puan
          </div>
        ))}
      </div>

      {currentQuestion && (
        <div className="question-container">
          <div className="timer">Kalan Süre: {timeLeft}</div>
          <h2>{currentQuestion.question}</h2>
          <div className="answers">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer || timeLeft === 0}
                className={selectedAnswer === option ? 'selected' : ''}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game; 