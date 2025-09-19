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
  team: {
    teamId: number;
    name: string;
    logoUrl?: string;
  };
  quantity: number;
  createdUtc: string;
  claimedUtc: string;
  remainingTickets: number;
}

export interface DraftStatus {
  seasonId: number;
  isActive: boolean;
  upcoming: UpcomingPick[];
  history: DraftPick[];
  users: UserProgress[];
  totalTicketsRemaining: number;
}

export interface UpcomingPick {
  draftPickId: number;
  pickOrder: number;
  firebaseUserId: string;
  displayName: string;
  remainingTickets: number;
}

export interface UserProgress {
  firebaseUserId: string;
  displayName: string;
  allotment: number;
  picked: number;
  remaining: number;
}