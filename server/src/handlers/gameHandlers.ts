import { Server, Socket } from 'socket.io';
import { gameService } from '@/services/gameService';
import { redisService } from '@/services/redisService';
import {
  createGameSchema,
  joinGameSchema,
  submitWordSchema,
  voteSchema,
} from '@/utils/validators';

export function registerGameHandlers(io: Server, socket: Socket) {
  // Créer une partie
  socket.on('create_game', async (data) => {
    try {
      const validated = createGameSchema.parse(data);
      const game = await gameService.createGame(
        socket.id,
        validated.pseudo,
        validated.config
      );

      socket.join(game.id);
      socket.emit('game_created', { gameId: game.id, code: game.code });
      socket.emit('game_state', game);

      // Sauvegarder le joueur actuel
      const currentPlayer = game.players.find(p => p.socketId === socket.id);
      if (currentPlayer) {
        currentPlayer.gameId = game.id;
        socket.emit('current_player', currentPlayer);
      }
    } catch (error: any) {
      console.error('Error creating game:', error);
      socket.emit('error', { message: error.message || 'Erreur lors de la création' });
    }
  });

  // Rejoindre une partie
  socket.on('join_game', async (data) => {
    try {
      const validated = joinGameSchema.parse(data);
      const game = await gameService.joinGame(
        socket.id,
        validated.code,
        validated.pseudo
      );

      socket.join(game.id);
      
      const currentPlayer = game.players.find(p => p.socketId === socket.id);
      
      // Notifier le nouveau joueur
      socket.emit('game_state', game);
      if (currentPlayer) {
        currentPlayer.gameId = game.id;
        socket.emit('current_player', currentPlayer);
      }

      // Notifier les autres joueurs
      socket.to(game.id).emit('player_joined', { player: currentPlayer });
      socket.to(game.id).emit('game_state', game);
    } catch (error: any) {
      console.error('Error joining game:', error);
      socket.emit('error', { message: error.message || 'Erreur lors de la connexion' });
    }
  });

  // Démarrer la partie
  socket.on('start_game', async (data) => {
    try {
      const { gameId } = data;
      const game = await redisService.getGame(gameId);
      
      if (!game) {
        throw new Error('Partie introuvable');
      }

      const player = game.players.find(p => p.socketId === socket.id);
      
      if (!player?.isHost) {
        throw new Error('Seul l\'hôte peut démarrer la partie');
      }

      const updatedGame = await gameService.startGame(io, gameId);
      
      io.to(gameId).emit('phase_started', { 
        phase: updatedGame.currentPhase, 
        timeLeft: updatedGame.config.timePerPhase 
      });
      io.to(gameId).emit('game_state', updatedGame);
    } catch (error: any) {
      console.error('Error starting game:', error);
      socket.emit('error', { message: error.message || 'Erreur lors du démarrage' });
    }
  });

  // Soumettre un mot
  socket.on('submit_word', async (data) => {
    try {
      const validated = submitWordSchema.parse(data);
      const game = await redisService.getGame(validated.gameId);
      
      if (!game) {
        throw new Error('Partie introuvable');
      }

      const player = game.players.find(p => p.socketId === socket.id);
      
      if (!player) {
        throw new Error('Joueur introuvable');
      }

      const updatedGame = await gameService.submitWord(
        io,
        validated.gameId,
        player.id,
        validated.word
      );

      io.to(validated.gameId).emit('player_submitted', { playerId: player.id });
      io.to(validated.gameId).emit('game_state', updatedGame);
    } catch (error: any) {
      console.error('Error submitting word:', error);
      socket.emit('error', { message: error.message || 'Erreur lors de l\'envoi' });
    }
  });

  // Voter
  socket.on('vote', async (data) => {
    try {
      const validated = voteSchema.parse(data);
      const game = await redisService.getGame(validated.gameId);
      
      if (!game) {
        throw new Error('Partie introuvable');
      }

      const player = game.players.find(p => p.socketId === socket.id);
      
      if (!player) {
        throw new Error('Joueur introuvable');
      }

      const updatedGame = await gameService.vote(
        io,
        validated.gameId,
        player.id,
        validated.sentenceId
      );

      io.to(validated.gameId).emit('player_voted', { playerId: player.id });
      io.to(validated.gameId).emit('game_state', updatedGame);
    } catch (error: any) {
      console.error('Error voting:', error);
      socket.emit('error', { message: error.message || 'Erreur lors du vote' });
    }
  });
}
