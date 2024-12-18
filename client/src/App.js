import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Game from './components/Game';
import WaitingRoom from './components/WaitingRoom';

const socket = io('https://quiz-game-server.onrender.com', {
  transports: ['websocket'],
  upgrade: false,
  reconnection: true,
  reconnectionAttempts: 5
});

function App() {
  const [gameState, setGameState] = useState('waiting');
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  useEffect(() => {
    socket.on('gameStart', () => {
      setGameState('playing');
    });

    socket.on('updateQuestion', (question) => {
      setCurrentQuestion(question);
    });

    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('connect', () => {
      console.log('Socket bağlandı:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket bağlantı hatası:', error);
    });

    socket.on('disconnect', () => {
      console.log('Socket bağlantısı kesildi');
    });

    return () => {
      socket.off('gameStart');
      socket.off('updateQuestion');
      socket.off('updatePlayers');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="App">
      {gameState === 'waiting' ? (
        <WaitingRoom players={players} socket={socket} />
      ) : (
        <Game 
          currentQuestion={currentQuestion}
          players={players}
          socket={socket}
        />
      )}
    </div>
  );
}

export default App;
