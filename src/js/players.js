// TypeRacer Arena - Player Management

export class PlayerManager {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.roundScores = []; // Scores for current round
    this.matchScores = []; // Cumulative scores across rounds
    this.currentRound = 1;
    this.totalRounds = 3;
  }

  // Initialize players with names
  setPlayers(names) {
    this.players = names.map((name, index) => ({
      id: index + 1,
      name: name || `Player ${index + 1}`,
      color: this.getPlayerColor(index)
    }));
    this.resetScores();
    return this.players;
  }

  // Get color for player avatar
  getPlayerColor(index) {
    const colors = ['#e94560', '#4ecca3', '#6bcbff', '#ffd93d'];
    return colors[index % colors.length];
  }

  // Reset all scores
  resetScores() {
    this.currentPlayerIndex = 0;
    this.currentRound = 1;
    this.roundScores = this.players.map(() => null);
    this.matchScores = this.players.map(() => ({
      totalScore: 0,
      totalWPM: 0,
      totalAccuracy: 0,
      rounds: 0
    }));
  }

  // Get current player
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  // Check if all players have typed in current round
  isRoundComplete() {
    return this.roundScores.every(score => score !== null);
  }

  // Record score for current player
  recordScore(wpm, accuracy, time, score) {
    this.roundScores[this.currentPlayerIndex] = {
      wpm,
      accuracy,
      time,
      score
    };

    // Update match totals
    const matchScore = this.matchScores[this.currentPlayerIndex];
    matchScore.totalScore += score;
    matchScore.totalWPM += wpm;
    matchScore.totalAccuracy += accuracy;
    matchScore.rounds++;
  }

  // Move to next player
  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return this.getCurrentPlayer();
  }

  // Get round results sorted by score
  getRoundResults() {
    return this.players
      .map((player, index) => ({
        ...player,
        ...this.roundScores[index],
        rank: 0
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  // Get match results (cumulative scores)
  getMatchResults() {
    return this.players
      .map((player, index) => ({
        ...player,
        ...this.matchScores[index],
        avgWPM: this.matchScores[index].rounds > 0
          ? Math.round(this.matchScores[index].totalWPM / this.matchScores[index].rounds)
          : 0,
        avgAccuracy: this.matchScores[index].rounds > 0
          ? Math.round(this.matchScores[index].totalAccuracy / this.matchScores[index].rounds)
          : 0,
        rank: 0
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }

  // Start next round
  startNextRound() {
    this.currentRound++;
    this.currentPlayerIndex = 0;
    this.roundScores = this.players.map(() => null);
  }

  // Check if match is complete
  isMatchComplete() {
    return this.currentRound > this.totalRounds && this.isRoundComplete();
  }

  // Get winner of current round
  getRoundWinner() {
    const results = this.getRoundResults();
    return results[0];
  }

  // Get match winner
  getMatchWinner() {
    const results = this.getMatchResults();
    return results[0];
  }

  // Set number of rounds
  setTotalRounds(rounds) {
    this.totalRounds = rounds;
  }

  // Get player count
  getPlayerCount() {
    return this.players.length;
  }

  // Check if it's the last player's turn in this round
  isLastPlayerTurn() {
    return this.currentPlayerIndex === this.players.length - 1;
  }
}

// Export singleton instance
export const playerManager = new PlayerManager();
