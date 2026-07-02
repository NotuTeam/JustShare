export interface NoteImage {
  url: string;
  name?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  language: string;
  type: string;
  images: NoteImage[] | string;
  shareId: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
