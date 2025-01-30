export interface Note {
  id: string;
  text: string;
  isRaw: boolean;
  isCollapsed: boolean;
}

export interface List {
  id: string;
  title: string;
  notes: Note[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
