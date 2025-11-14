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
      const currentPlayer = game.players.find(p => !p.isAi && p.socketId === socket.id);
      if (currentPlayer) {
        socket.emit('current_player', currentPlayer);
      }
    } catch (error: any) {
      console.error('Error creating game:', error);
      socket.emit('error', { message: error.message || 'Erreur lors de la création' });
    }
  });

  // Annuler la partie
  socket.on('cancel_game', async (data) => {
    try {
      const { gameId } = data;
      const game = await redisService.getGame(gameId);
      
      if (!game) {
        throw new Error('Partie introuvable');
      }

      const player = game.players.find(p => !p.isAi && p.socketId === socket.id);
      
      if (!player?.isHost) {
        throw new Error('Seul l\'hôte peut annuler la partie');
      }

      await gameService.deleteGame(io, gameId);
      io.to(gameId).emit('game_canceled');
    } catch (error: any) {
      console.error('Error canceling game:', error);
      socket.emit('error', { message: error.message || 'Erreur lors de l\'annulation de la partie' });
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
      
      const currentPlayer = game.players.find(p => !p.isAi && p.socketId === socket.id);
      
      // Notifier le nouveau joueur
      socket.emit('game_state', game);
      if (currentPlayer) {
        socket.emit('current_player', currentPlayer);
      }

      // Notifier les autres joueurs
      socket.to(game.id).emit('player_joined', { player: currentPlayer });
      socket.to(game.id).emit('game_state', game);
    } catch (error: any) {
      console.error('Error joining game:', error);
      socket.emit('join_failed', { message: error.message || 'Erreur lors de la connexion' });
    }
  });

  // Quitter une partie
  socket.on('leave_game', async (data) => {
    try {
      const { gameId } = data;
      const game = await redisService.getGame(gameId);

      if (!game) {
        throw new Error('Partie introuvable');
      }

      const player = game.players.find(p => !p.isAi && p.socketId === socket.id);

      if(!player){
        throw new Error('Joueur introuvable');
      }
            
      await gameService.removePlayer(io, gameId, player.id)

      socket.leave(game.id)
      socket.emit('game_left', {message: 'Vous avez quitté la partie.'})

    } catch (error: any) {
      console.error('Error leaving game:', error);
      socket.emit('error', { message: error.message || 'Erreur lors du départ de la partie' });
    }
  });

  // Retirer un joueur de la partie
  socket.on('kick_player', async (data) => {
    try {
      const { gameId } = data;
      const game = await redisService.getGame(gameId);
      if (!game) {
        throw new Error('Partie introuvable');
      }

      // Vérif sur l'auteur de la requête
      const requester = game.players.find(p => !p.isAi && p.socketId === socket.id);
      if(!requester || requester.id !== game.hostId){
        throw new Error('Seul l\'hôte peut retirer un joueur de la partie.');
      }

      // Vérif sur le joueur à retirer
      const playerToRemove = game.players.find(p => p.id === data.playerToRemove.id)
      console.log("Joueur à retirer ID: ",data.playerToRemove.id)
      if(!playerToRemove){
        throw new Error('Joueur à supprimer introuvable')
      }

      if(!playerToRemove.isAi){
        io.to(playerToRemove.socketId).emit("kicked_out", {
          message: 'Vous avez été retiré de la partie par l\'hote.',
          gameId: gameId
        })
      }
      
      await gameService.removePlayer(io, gameId, playerToRemove.id)

      // Confirmer à l'hôte
      socket.emit('player_kicked_success', { playerToRemove });

    } catch (error: any) {
      console.error('Error kicking out player:', error);
      socket.emit('error', { message: error.message || 'Erreur lors de la suppression d\'un joueur de la partie' });
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

      const player = game.players.find(p => !p.isAi && p.socketId === socket.id);
      
      if (!player?.isHost) {
        throw new Error('Seul l\'hôte peut démarrer la partie');
      }

      const updatedGame = await gameService.startGame(io, gameId);
      
      io.to(gameId).emit('phase_started', { 
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

      const player = game.players.find(p => !p.isAi && p.socketId === socket.id);
      
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
      const allPlayed = updatedGame.players.every(p => p.hasPlayedCurrentPhase);
      
      if (!allPlayed) {
        io.to(validated.gameId).emit('game_state', updatedGame);
      }
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

      const player = game.players.find(p => !p.isAi && p.socketId === socket.id);
      
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
