import { Server } from 'socket.io';
import { redisService } from './redisService';
import { timerService } from './timerService';
import { generateGameCode, generateId } from '@/utils/generateCode';
import { Game, GameConfig, Player, Sentence } from '@/types/game.types';
import { getAIMove } from './aiService';

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
      isAi: false,
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
      players: [host, ...config.aiPlayers],
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
      isAi: false,
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
    const allHumansPlayed = game.players
      .filter(p => !p.isAi)
      .every(p => p.hasPlayedCurrentPhase);
    
    if (allHumansPlayed) {
      const aiPlayers = game.players.filter(p => p.isAi && !p.hasPlayedCurrentPhase);

     for (const ai of aiPlayers) {
      try {
        console.log(`🤖 ${ai.pseudo} is thinking...`);
        const aiWord = await getAIMove(game, ai.id);
        console.log(`🤖 ${ai.pseudo} played: ${aiWord}`);
        
        await redisService.setPhaseWord(gameId, game.currentPhase, ai.id, aiWord);
        ai.hasPlayedCurrentPhase = true;
      } catch (error) {
        console.error(`❌ Error with AI ${ai.pseudo}:`, error);
        // Mot par défaut en cas d'erreur
        const fallbackWord = `un ${game.config.phaseDetails[game.config.phases[game.currentPhase]].titre} étrange`;
        await redisService.setPhaseWord(gameId, game.currentPhase, ai.id, fallbackWord);
        ai.hasPlayedCurrentPhase = true;
      }
    }

      await redisService.saveGame(game);
      console.log(`✅ All players submitted for phase ${game.currentPhase}`);
      timerService.clearTimer(gameId);
      await this.nextPhase(io, gameId);
    }

    return game;
  }

  async triggerAiTurn(io: Server, gameId: string): Promise<void> {
    console.log("Déclenchement du tour de l'IA")
    try {
      const game = await redisService.getGame(gameId);
      if(!game || game.status !== 'playing') {
        throw new Error('Partie introuvable ou non en cours');
      }

      // trouver les IA qui n'ont pas encore joué
      const aiPlayers = game.players.filter(p => p.isAi && !p.hasPlayedCurrentPhase);
      if(aiPlayers.length === 0) {
        console.log("Aucune IA n'a besoin de jouer")
        return;
      }
      for (const ai of aiPlayers) {
        io.in(gameId).emit(`${ai.pseudo} réfléchit...`)
        const aiWord = await getAIMove(game, ai.id);

        console.log(`L'IA ${ai.pseudo} a joué le mot: ${aiWord}`)
        await this.submitWord(io, gameId, ai.id, aiWord);
      }
    } catch (error) {
      console.error("Erreur lors du tour de l'IA:", error);
    }
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
    if (game.votes.length >= game.players.filter(p => !p.isAi).length) {
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

    const player = game.players.find(p => !p.isAi && p.socketId === socketId);
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
    const wasHost = player.isHost;
    
    if(player.isAi){ 
      game.players.splice(playerIdx,1);
      console.log(`🗑️ IA ${player.pseudo} a été supprimé de la partie ${gameId}`)
    } else {
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
      if(wasHost){
        if(game.players.length === 1 && game.players[0].isAi){
          // Si le seul joueur restant est une IA, supprimer la partie
          await this.deleteGame(io, gameId);
          return null;
        }

        const newHost = game.players.find(p => !p.isAi && p.isConnected)
        if(!newHost){
          // Pas de joueur humain connecté, supprimer la partie
          await this.deleteGame(io, gameId);
          return null;
        }

        if(newHost.isAi){ // ajout de vérif pour Typescript (normalement on ne devrait jamais arriver ici)
          await this.deleteGame(io, gameId);
          return null;
        }

        newHost.isHost = true;
        game.hostId = newHost.id;

        io.to(newHost.socketId).emit("assigned_host", {
          player: newHost,
          message: 'Vous avez été assigné hôte de la partie.',
        })
        console.log(`👑 ${newHost.pseudo} est le nouveau hôte!`);
      }

    }

      await redisService.saveGame(game);

      // Notifier les autres joueurs
      io.to(gameId).emit("player_removed",{ playerId: player.id, pseudo: player.pseudo })
      io.to(gameId).emit("game_state", game);

      return game

  }

  async addAIPlayer( io: Server, gameId: string): Promise<Game | null> {
    try {
      const game = await redisService.getGame(gameId);
      if (!game) {
        throw new Error('Partie introuvable');
      }
      const aiPlayer : Player = {
        id: generateId(),
        pseudo: `IA_${Math.floor(Math.random() * 1000)}`,
        isHost: false,
        personnality: "comique",
        isAi: true,
        hasPlayedCurrentPhase: false,
        isConnected: true,

      }

      game.players.push(aiPlayer);
      await redisService.saveGame(game);
      return game
    }catch (error){
      console.error(`Erreur lors de l'ajout du joueur IA:`, error);
      return null
    }
  }

  async deleteGame(io: Server, gameId: string): Promise<void> {
    timerService.clearTimer(gameId);
    
    // Nettoyer les données Redis
    const game = await redisService.getGame(gameId);
    if (game) {
      for (const player of game.players) {
        if (player.isAi){
          game.players.splice(game.players.indexOf(player),1)
        }else{
          await redisService.deletePlayerGame(player.socketId);
        }
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