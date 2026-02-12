import { createContext, useContext } from 'react';
import fr from '../lang/fr';

type AppContextType = {
  t: typeof fr;
};

export const AppContext = createContext<AppContextType>({ t: fr });

export const useAppContext = () => useContext(AppContext);
