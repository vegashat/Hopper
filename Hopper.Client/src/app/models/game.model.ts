export interface Team {
  teamId: number;
  name: string;
  city?: string;
  logoUrl?: string;
}

export interface Game {
  gameId: number;
  seasonId: number;
  gameDateTime: string;
  arena?: string;
  remainingTickets: number;
  opponent: Team;
  selections: Selection[];
}