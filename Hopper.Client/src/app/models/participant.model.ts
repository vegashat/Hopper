export interface Participant {
  firebaseUserId: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  pinResetUsed?: boolean;
  createdUtc: string; // ISO date string
  allottedTickets: number;
}