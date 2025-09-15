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
  createdUtc: string;
  claimedUtc: string;
}

export interface DraftStatus {
  seasonId: number;
  isActive: boolean;
  upcoming: UpcomingPick[];
  history: HistoryPick[];
  users: UserProgress[];
  totalTicketsRemaining: number;
}

export interface UpcomingPick {
  pickOrder: number;
  firebaseUserId: string;
  displayName: string;
}

export interface HistoryPick {
  pickOrder: number;
  firebaseUserId: string;
  displayName: string;
  claimedUtc: string;
}

export interface UserProgress {
  firebaseUserId: string;
  displayName: string;
  allotment: number;
  picked: number;
  remaining: number;
}