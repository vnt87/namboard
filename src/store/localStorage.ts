import { Board, BoardMetadata } from '../types';

const STORAGE_PREFIX = 'nullboard_next_';
const CURRENT_BOARD_KEY = `${STORAGE_PREFIX}current_board`;
const BOARD_LIST_KEY = `${STORAGE_PREFIX}board_list`;

export const storage = {
  getCurrentBoardId: (): string | null => {
    return localStorage.getItem(CURRENT_BOARD_KEY);
  },

  setCurrentBoardId: (boardId: string | null): void => {
    if (boardId) {
      localStorage.setItem(CURRENT_BOARD_KEY, boardId);
    } else {
      localStorage.removeItem(CURRENT_BOARD_KEY);
    }
  },

  getBoardList: (): BoardMetadata[] => {
    const data = localStorage.getItem(BOARD_LIST_KEY);
    return data ? JSON.parse(data) : [];
  },

  setBoardList: (boards: BoardMetadata[]): void => {
    localStorage.setItem(BOARD_LIST_KEY, JSON.stringify(boards));
  },

  getBoard: (boardId: string): Board | null => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}board_${boardId}`);
    return data ? JSON.parse(data) : null;
  },

  saveBoard: (board: Board): void => {
    localStorage.setItem(`${STORAGE_PREFIX}board_${board.id}`, JSON.stringify(board));
    
    // Update board list
    const boardList = storage.getBoardList();
    const existingIndex = boardList.findIndex((b: BoardMetadata) => b.id === board.id);
    
    const metadata: BoardMetadata = {
      id: board.id,
      title: board.title,
      createdAt: board.createdAt,
      updatedAt: new Date()
    };

    if (existingIndex >= 0) {
      boardList[existingIndex] = metadata;
    } else {
      boardList.push(metadata);
    }
    
    storage.setBoardList(boardList);
  },

  deleteBoard: (boardId: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}board_${boardId}`);
    
    const boardList = storage.getBoardList().filter((b: BoardMetadata) => b.id !== boardId);
    storage.setBoardList(boardList);

    const currentBoardId = storage.getCurrentBoardId();
    if (currentBoardId === boardId) {
      storage.setCurrentBoardId(null);
    }
  },

  clearAll: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
