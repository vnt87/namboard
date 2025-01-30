import { create } from 'zustand';
import { Board, List, Note, BoardMetadata } from '../types';
import { storage } from './localStorage';

interface BoardStore {
  currentBoard: Board | null;
  boardList: BoardMetadata[];
  isDragging: boolean;
  
  // Board actions
  loadBoards: () => void;
  createBoard: () => void;
  loadBoard: (boardId: string) => void;
  saveCurrentBoard: () => void;
  deleteCurrentBoard: () => void;
  updateBoardTitle: (title: string) => void;
  
  // List actions
  addList: () => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  moveList: (fromIndex: number, toIndex: number) => void;
  
  // Note actions
  addNote: (listId: string) => void;
  updateNoteText: (listId: string, noteId: string, text: string) => void;
  deleteNote: (listId: string, noteId: string) => void;
  moveNote: (fromListId: string, toListId: string, fromIndex: number, toIndex: number) => void;
  toggleNoteRaw: (listId: string, noteId: string) => void;
  toggleNoteCollapsed: (listId: string, noteId: string) => void;
  
  // Drag state
  setDragging: (isDragging: boolean) => void;
}

export const useStore = create<BoardStore>((set, get) => ({
  currentBoard: null,
  boardList: [],
  isDragging: false,

  loadBoards: () => {
    const boardList = storage.getBoardList();
    const currentBoardId = storage.getCurrentBoardId();
    
    set({ boardList });
    
    if (currentBoardId) {
      get().loadBoard(currentBoardId);
    }
  },

  createBoard: () => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title: 'New Board',
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.saveBoard(newBoard);
    storage.setCurrentBoardId(newBoard.id);
    
    set(state => ({
      currentBoard: newBoard,
      boardList: [...state.boardList, {
        id: newBoard.id,
        title: newBoard.title,
        createdAt: newBoard.createdAt,
        updatedAt: newBoard.updatedAt
      }]
    }));
  },

  loadBoard: (boardId: string) => {
    const board = storage.getBoard(boardId);
    if (board) {
      storage.setCurrentBoardId(boardId);
      set({ currentBoard: board });
    }
  },

  saveCurrentBoard: () => {
    const { currentBoard } = get();
    if (currentBoard) {
      currentBoard.updatedAt = new Date();
      storage.saveBoard(currentBoard);
      set(state => ({
        boardList: state.boardList.map(b => 
          b.id === currentBoard.id 
            ? { ...b, title: currentBoard.title, updatedAt: currentBoard.updatedAt }
            : b
        )
      }));
    }
  },

  deleteCurrentBoard: () => {
    const { currentBoard } = get();
    if (currentBoard) {
      storage.deleteBoard(currentBoard.id);
      set(state => ({
        currentBoard: null,
        boardList: state.boardList.filter(b => b.id !== currentBoard.id)
      }));
    }
  },

  updateBoardTitle: (title: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedBoard = { ...state.currentBoard, title };
      return { currentBoard: updatedBoard };
    });
    get().saveCurrentBoard();
  },

  addList: () => {
    set(state => {
      if (!state.currentBoard) return state;
      const newList: List = {
        id: Date.now().toString(),
        title: 'New List',
        notes: []
      };
      const updatedBoard = {
        ...state.currentBoard,
        lists: [...state.currentBoard.lists, newList]
      };
      return { currentBoard: updatedBoard };
    });
    get().saveCurrentBoard();
  },

  updateListTitle: (listId: string, title: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = state.currentBoard.lists.map(list =>
        list.id === listId ? { ...list, title } : list
      );
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  deleteList: (listId: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = state.currentBoard.lists.filter(list => list.id !== listId);
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  moveList: (fromIndex: number, toIndex: number) => {
    set(state => {
      if (!state.currentBoard) return state;
      const lists = [...state.currentBoard.lists];
      const [moved] = lists.splice(fromIndex, 1);
      lists.splice(toIndex, 0, moved);
      return {
        currentBoard: { ...state.currentBoard, lists }
      };
    });
    get().saveCurrentBoard();
  },

  addNote: (listId: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const newNote: Note = {
        id: Date.now().toString(),
        text: '',
        isRaw: false,
        isCollapsed: false
      };
      const updatedLists = state.currentBoard.lists.map(list =>
        list.id === listId
          ? { ...list, notes: [...list.notes, newNote] }
          : list
      );
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  updateNoteText: (listId: string, noteId: string, text: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = state.currentBoard.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              notes: list.notes.map(note =>
                note.id === noteId ? { ...note, text } : note
              )
            }
          : list
      );
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  deleteNote: (listId: string, noteId: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = state.currentBoard.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              notes: list.notes.filter(note => note.id !== noteId)
            }
          : list
      );
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  moveNote: (fromListId: string, toListId: string, fromIndex: number, toIndex: number) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = [...state.currentBoard.lists];
      const fromList = updatedLists.find(l => l.id === fromListId);
      const toList = updatedLists.find(l => l.id === toListId);
      
      if (!fromList || !toList) return state;
      
      const [movedNote] = fromList.notes.splice(fromIndex, 1);
      toList.notes.splice(toIndex, 0, movedNote);
      
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  toggleNoteRaw: (listId: string, noteId: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = state.currentBoard.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              notes: list.notes.map(note =>
                note.id === noteId ? { ...note, isRaw: !note.isRaw } : note
              )
            }
          : list
      );
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  toggleNoteCollapsed: (listId: string, noteId: string) => {
    set(state => {
      if (!state.currentBoard) return state;
      const updatedLists = state.currentBoard.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              notes: list.notes.map(note =>
                note.id === noteId ? { ...note, isCollapsed: !note.isCollapsed } : note
              )
            }
          : list
      );
      return {
        currentBoard: { ...state.currentBoard, lists: updatedLists }
      };
    });
    get().saveCurrentBoard();
  },

  setDragging: (isDragging: boolean) => {
    set({ isDragging });
  }
}));
