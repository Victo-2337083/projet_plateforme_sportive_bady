import type { ReactNode } from 'react';
import fr from '../lang/fr';
import { AppContext } from './AppContext';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={{ t: fr }}>{children}</AppContext.Provider>;
};
