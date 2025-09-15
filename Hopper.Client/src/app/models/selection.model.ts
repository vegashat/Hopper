export interface Selection {
  selectionId?: number;
  firebaseUserId: string;
  displayName: string;
  gameId: number;
  quantity: number;
  pickedUtc?: string;
}