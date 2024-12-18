import React, { useState } from 'react';

function WaitingRoom({ players, socket }) {
  const [playerName, setPlayerName] = useState('');

  const joinGame = () => {
    if (playerName.trim()) {
      socket.emit('joinGame', { name: playerName });
    }
  };

  return (
    <div className="waiting-room">
      <h2>Bekleme Odası</h2>
      {players.length < 2 ? (
        <div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="İsminizi girin"
          />
          <button onClick={joinGame}>Oyuna Katıl</button>
        </div>
      ) : (
        <div>Oyun başlamak üzere...</div>
      )}
      
      <div className="players-list">
        <h3>Oyuncular:</h3>
        {players.map(player => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
    </div>
  );
}

export default WaitingRoom; 