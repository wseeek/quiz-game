const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ["https://quiz-game-client.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const players = new Map();
let currentQuestion = null;
let gameInProgress = false;

// Başlangıçta log
console.log('Server başlatılıyor...');

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı - Socket ID:', socket.id);

  socket.on('joinGame', ({ name }) => {
    console.log(`${name} oyuna katıldı - Socket ID: ${socket.id}`);
    players.set(socket.id, {
      id: socket.id,
      name,
      score: 0
    });

    io.emit('updatePlayers', Array.from(players.values()));
    console.log('Güncel oyuncular:', Array.from(players.values()));

    if (players.size === 2 && !gameInProgress) {
      console.log('İki oyuncu hazır, oyun başlıyor...');
      startGame();
    }
  });

  socket.on('submitAnswer', ({ answer }) => {
    if (currentQuestion && answer === currentQuestion.correctAnswer) {
      const player = players.get(socket.id);
      player.score += 100;
      players.set(socket.id, player);
      io.emit('updatePlayers', Array.from(players.values()));
    }
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı - Socket ID:', socket.id);
    players.delete(socket.id);
    io.emit('updatePlayers', Array.from(players.values()));
    if (players.size < 2) {
      gameInProgress = false;
    }
  });
});

function startGame() {
  gameInProgress = true;
  io.emit('gameStart');
  sendQuestion();
}

function sendQuestion() {
  // Örnek soru - daha sonra gerçek soru veritabanından gelecek
  currentQuestion = {
    question: 'Türkiye\'nin başkenti neresidir?',
    options: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'],
    correctAnswer: 'Ankara'
  };
  
  io.emit('updateQuestion', {
    question: currentQuestion.question,
    options: currentQuestion.options
  });

  setTimeout(() => {
    if (players.size >= 2) {
      sendQuestion();
    }
  }, 30000); // 30 saniye sonra yeni soru
}

const PORT = 7777;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor - ${new Date().toLocaleString()}`);
}); 