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
  team: {
    teamId: number;
    name: string;
    logoUrl?: string;
  };
  quantity: number;
  createdUtc: string;
  claimedUtc: string;
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
  pickOrder: number;
  firebaseUserId: string;
  displayName: string;
}

export interface UserProgress {
  firebaseUserId: string;
  displayName: string;
  allotment: number;
  picked: number;
  remaining: number;
}