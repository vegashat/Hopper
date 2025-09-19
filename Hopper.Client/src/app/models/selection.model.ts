export interface Selection {
  selectionId?: number;
  draftPickId: number;
  firebaseUserId: string;
  displayName: string;
  gameId: number;
  quantity: number;
  pickedUtc?: string;
}