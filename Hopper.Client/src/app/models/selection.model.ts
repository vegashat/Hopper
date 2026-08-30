export interface Selection {
  selectionId?: number;
  draftPickId: number;
  firebaseUserId: string;
  displayName: string | null;
  gameId: number;
  quantity: number;
  pickedUtc?: string;
}
