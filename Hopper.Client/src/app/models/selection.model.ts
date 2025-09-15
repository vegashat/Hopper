export interface Selection {
  selectionId?: number;
  firebaseUserId: string;
  gameId: number;
  quantity: number;
  pickedUtc?: string;
}