import { Server } from 'socket.io';
import { redisService } from './redisService';
import { timerService } from './timerService';
import { generateGameCode, generateId } from '@/utils/generateCode';
import { Game, GameConfig, Player, Sentence } from '@/types/game.types';

export class GameService {
  async createGame(hostSocketId: string, pseudo: string, config: GameConfig): Promise<Game> {
    const gameId = generateId();
    let code = generateGameCode();
    
    // S'assurer que le code est unique
    while (!(await redisService.isCodeAvailable(code))) {
      code = generateGameCode();
    }

    const hostId = generateId();
    
    const host: Player = {
      id: hostId,
      socketId: hostSocketId,
      pseudo,
      isHost: true,
      hasPlayedCurrentPhase: false,
      isConnected: true,
    };

    const game: Game = {
      id: gameId,
      code,
      hostId,
      status: 'waiting',
      config,
      currentPhase: 0,
      phaseStartTime: 0,
      players: [host],
      sentences: [],
      votes: [],
      createdAt: Date.now(),
    };

    await redisService.saveGame(game);
    await redisService.setPlayerGame(hostSocketId, gameId);

    console.log(`🎮 Game created: ${gameId} (${code}) by ${pseudo}`);
    
    return game;
  }

  async joinGame(socketId: string, code: string, pseudo: string): Promise<Game> {
    const game = await redisService.getGameByCode(code);
    
    if (!game) {
      throw new Error('Partie introuvable');
    }

    if (game.status !== 'waiting') {
      throw new Error('La partie a déjà commencé');
    }

    // Vérifier si le pseudo existe déjà
    if (game.players.some(p => p.pseudo === pseudo)) {
      throw new Error('Ce pseudo est déjà pris');
    }

    const playerId = generateId();
    
    const player: Player = {
      id: playerId,
      socketId,
      pseudo,
      isHost: false,
      hasPlayedCurrentPhase: false,
      isConnected: true,
    };

    game.players.push(player);
    await redisService.saveGame(game);
    await redisService.setPlayerGame(socketId, game.id);

    console.log(`👋 ${pseudo} joined game ${game.id}`);

    return game;
  }

  async startGame(io: Server, gameId: string): Promise<Game> {
    const game = await redisService.getGame(gameId);
    
    if (!game) {
      throw new Error('Partie introuvable');
    }

    if (game.status !== 'waiting' && game.status !== 'finished') {
      throw new Error('La partie a déjà commencé');
    }

    if (game.players.length < 1) {
      throw new Error('Il faut au moins 2 joueurs');
    }

    if (game.status === 'finished'){
      game.votes = []
    }

    // Initialiser les phrases
    game.sentences = this.initializeSentences(game.players);
    game.status = 'playing';
    game.currentPhase = 0;
    game.phaseStartTime = Date.now();

    // Reset des statuts de jeu
    game.players.forEach(p => p.hasPlayedCurrentPhase = false);

    await redisService.saveGame(game);

    // Démarrer le timer
    timerService.startPhaseTimer(io, gameId, game.config.timePerPhase);

    // Notify clients of the starting phase and full game state
    io.to(gameId).emit('game_state', game);

    console.log(`🚀 Game ${gameId} started with ${game.players.length} players`);

    return game;
  }

  async submitWord(io: Server, gameId: string, playerId: string, word: string): Promise<Game> {
    const game = await redisService.getGame(gameId);
    
    if (!game) {
      throw new Error('Partie introuvable');
    }

    if (game.status !== 'playing') {
      throw new Error('La partie n\'est pas en cours');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Joueur introuvable');
    }

    if (player.hasPlayedCurrentPhase) {
      throw new Error('Vous avez déjà joué');
    }

    // Sauvegarder le mot
    await redisService.setPhaseWord(gameId, game.currentPhase, playerId, word);
    
    // Marquer le joueur comme ayant joué
    player.hasPlayedCurrentPhase = true;
    await redisService.saveGame(game);

    console.log(`✍️  ${player.pseudo} submitted word for phase ${game.currentPhase}`);

    // Vérifier si tous les joueurs ont joué
    const allPlayed = game.players.every(p => p.hasPlayedCurrentPhase);
    
    if (allPlayed) {
      console.log(`✅ All players submitted for phase ${game.currentPhase}`);
      timerService.clearTimer(gameId);
      await this.nextPhase(io, gameId);
    }

    return game;
  }

  async nextPhase(io: Server, gameId: string): Promise<void> {
    const game = await redisService.getGame(gameId);
    
    if (!game) return;

    // Récupérer tous les mots de la phase actuelle
    const words = await redisService.getPhaseWords(gameId, game.currentPhase);

    // Ajouter les mots aux phrases
    game.sentences.forEach(sentence => {
      const word = words[sentence.currentPlayerId] || '...';
      sentence.words.push(word);
    });

    // Passer à la phase suivante
    game.currentPhase++;

    if (game.currentPhase >= game.config.phases.length) {
      // Fin du jeu, passer au vote
      game.status = 'voting';
      timerService.clearTimer(gameId);
      
      await redisService.saveGame(game);
      io.to(gameId).emit('voting_started', { sentences: game.sentences });
      io.to(gameId).emit('game_state', game);
      
      console.log(`🗳️  Game ${gameId} entering voting phase`);
    } else {
      // Rotation des phrases
      this.rotateSentences(game.sentences, game.players);
      
      // Reset des statuts
      game.players.forEach(p => p.hasPlayedCurrentPhase = false);
      game.phaseStartTime = Date.now();
      
      await redisService.saveGame(game);
      
      // Démarrer le nouveau timer
      timerService.startPhaseTimer(io, gameId, game.config.timePerPhase);
      
      io.to(gameId).emit('phase_started', { 
        phase: game.currentPhase, 
        timeLeft: game.config.timePerPhase 
      });
      io.to(gameId).emit('game_state', game);
      
      console.log(`➡️  Game ${gameId} moved to phase ${game.currentPhase}`);
    }
  }

  async vote(io: Server, gameId: string, playerId: string, sentenceId: string): Promise<Game> {
    const game = await redisService.getGame(gameId);
    
    if (!game) {
      throw new Error('Partie introuvable');
    }

    if (game.status !== 'voting') {
      throw new Error('Ce n\'est pas la phase de vote');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Joueur introuvable');
    }

    // Vérifier si déjà voté
    if (game.votes.some(v => v.playerId === playerId)) {
      throw new Error('Vous avez déjà voté');
    }

    game.votes.push({ playerId, sentenceId });
    await redisService.saveGame(game);

    console.log(`🗳️  ${player.pseudo} voted for sentence ${sentenceId}`);

    // Vérifier si tous ont voté
    if (game.votes.length === game.players.length) {
      game.status = 'finished';
      await redisService.saveGame(game);
      
      io.to(gameId).emit('results', this.calculateResults(game));
      io.to(gameId).emit('game_state', game);
      
      console.log(`🏆 Game ${gameId} finished`);
    }

    return game;
  }

  async handleDisconnect(io: Server, socketId: string): Promise<void> {
    const gameId = await redisService.getPlayerGame(socketId);
    
    if (!gameId) return;

    const game = await redisService.getGame(gameId);
    if (!game) return;

    const player = game.players.find(p => p.socketId === socketId);
    if (!player) return;

    player.isConnected = false;
    await redisService.saveGame(game);

    io.to(gameId).emit('player_left', { playerId: player.id });
    io.to(gameId).emit('game_state', game);

    console.log(`👋 ${player.pseudo} disconnected from game ${gameId}`);

    // Si c'était l'hôte et que le jeu est en attente, supprimer la partie
    // if (player.isHost && game.status === 'waiting') {
    //   await this.deleteGame(io, gameId);
    // }
  }

  async removePlayer(io: Server, gameId: string, playerId: string): Promise<Game | null>{
    const game = await redisService.getGame(gameId);


    if(!game) {
      throw new Error('Partie Introuvable');
    }


    const playerIdx = game.players.findIndex(p => p.id === playerId);


    if(playerIdx === -1){
      throw new Error('Joueur Introuvable');
    }


    const player = game.players[playerIdx];


    // supprimer le mapping redis du joueur
    await redisService.deletePlayerGame(player.socketId);
    game.players.splice(playerIdx,1);
    console.log(`🗑️ ${player.pseudo} a été supprimé de la partie ${gameId}`)


    // Si la partie est vide, la supprimer
    if(game.players.length === 0){
      await this.deleteGame(io, gameId);
      return null;
    }


    // si c'était l'hôte, assigner un nouvel hôte
    if(player.isHost){
      const newHost = game.players[0]
      newHost.isHost = true;
      game.hostId = newHost.id;

      io.to(newHost.socketId).emit("assigned_host", {
        player: player,
        message: 'Vous avez été assigné hôte de la partie.',
      })
      console.log(`👑 ${newHost.pseudo} est le nouveau hôte!`);
    }


    await redisService.saveGame(game);


    // Notifier les autres joueurs
    io.to(gameId).emit("player_removed",{ playerId: player.id, pseudo: player.pseudo })
    io.to(gameId).emit("game_state", game);


    return game


  }


  async deleteGame(io: Server, gameId: string): Promise<void> {
    timerService.clearTimer(gameId);
    
    // Nettoyer les données Redis
    const game = await redisService.getGame(gameId);
    if (game) {
      for (const player of game.players) {
        await redisService.deletePlayerGame(player.socketId);
      }
      
      // Nettoyer les mots de phase
      for (let i = 0; i < game.config.phases.length; i++) {
        await redisService.deletePhaseWords(gameId, i);
      }
    }
    
    await redisService.deleteGame(gameId);
    
    io.to(gameId).emit('game_deleted');
    
    console.log(`🗑️  Game ${gameId} deleted`);
  }

  async fillMissingWords(gameId: string): Promise<void> {
    const game = await redisService.getGame(gameId);
    if (!game) return;

    const words = await redisService.getPhaseWords(gameId, game.currentPhase);

    for (const player of game.players) {
      if (!words[player.id]) {
        await redisService.setPhaseWord(gameId, game.currentPhase, player.id, '...');
        player.hasPlayedCurrentPhase = true;
      }
    }

    await redisService.saveGame(game);
  }

  private initializeSentences(players: Player[]): Sentence[] {
    return players.map((player, index) => ({
      id: `sentence-${index}`,
      words: [],
      currentPlayerId: player.id,
    }));
  }

  private rotateSentences(sentences: Sentence[], players: Player[]): void {
    sentences.forEach(sentence => {
      const currentIndex = players.findIndex(p => p.id === sentence.currentPlayerId);
      const nextIndex = (currentIndex + 1) % players.length;
      sentence.currentPlayerId = players[nextIndex].id;
    });
  }

  private calculateResults(game: Game) {
    const ranking = game.sentences.map(sentence => ({
      sentence,
      voteCount: game.votes.filter(v => v.sentenceId === sentence.id).length,
      words: sentence.words,
    })).sort((a, b) => b.voteCount - a.voteCount);

    return { ranking };
  }
}

export const gameService = new GameService();