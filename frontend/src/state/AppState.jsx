import { createContext, useContext, useReducer } from 'react';

const initialState = {
  role: null, // 'brother' | 'sister'
  senderName: '',
  recipientName: '',
  gift: { type: null, amount: '', photoFile: null, photoPreview: null }, // brother only
  rakhiSent: false, // sister only
  memoryFile: null,
  memoryPreview: null,
  parentSlug: null, // set when this creation is a reply to a received letter
  travelling: false, // guide-transition overlay flag
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...initialState, role: action.role, parentSlug: state.parentSlug };
    case 'SET_NAMES':
      return { ...state, senderName: action.senderName, recipientName: action.recipientName };
    case 'SET_GIFT':
      return { ...state, gift: { ...state.gift, ...action.gift } };
    case 'SET_RAKHI_SENT':
      return { ...state, rakhiSent: action.value };
    case 'SET_MEMORY':
      return { ...state, memoryFile: action.file, memoryPreview: action.preview };
    case 'SET_PARENT':
      return { ...state, parentSlug: action.slug };
    case 'SET_TRAVELLING':
      return { ...state, travelling: action.value };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
