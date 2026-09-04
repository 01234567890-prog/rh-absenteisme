import { createContext, useContext } from 'react';

export interface AdminRefreshContextValue {
  loading: boolean;
  refresh: () => void;
  register: (refresh: () => void, loading: boolean) => () => void;
}

export const AdminRefreshContext = createContext<AdminRefreshContextValue | null>(null);

export const useAdminRefresh = () => {
  const context = useContext(AdminRefreshContext);
  if (!context) {
    throw new Error('useAdminRefresh must be used inside AdminRefreshContext.Provider');
  }
  return context;
};
