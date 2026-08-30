export interface Draft {
  draftId: number;
  seasonId: number;
  createdUtc: string;
  isActive: boolean;
}

export interface DraftPick {
  draftPickId: number;
  draftId: number;
  firebaseUserId: string;
  pickOrder: number;
  displayName: string;
  pickedById: string;
  pickedByDisplayName: string;
  gameId : number;
  gameDateTime: string | null;
  team: {
    teamId: number;
    name: string;
    logoUrl?: string;
  } | null;
  quantity: number;
  createdUtc: string;
  claimedUtc: string;
  remainingTickets: number;
}

export interface DraftStatus {
  seasonId: number;
  isActive: boolean;
  upcoming: UpcomingPick[];
  history: HistoryPick[];
  users: UserProgress[];
  totalTicketsRemaining: number;
}

export interface HistoryPick {
  pickOrder: number;
  firebaseUserId: string;
  displayName: string | null;
  claimedUtc: string | null;
}

export interface UpcomingPick {
  draftPickId: number;
  pickOrder: number;
  firebaseUserId: string;
  displayName: string | null;
}

export interface UserProgress {
  firebaseUserId: string;
  displayName: string;
  allotment: number;
  picked: number;
  remaining: number;
}
