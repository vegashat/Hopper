export interface GameRanking {
  gameRankingId: number;
  seasonId: number;
  firebaseUserId: string;
  gameId: number;
  rankOrder: number;
  quantity: 2 | 4;
  isFulfilled: boolean;
}

export interface SaveGameRanking {
  gameId: number;
  quantity: 2 | 4;
}
