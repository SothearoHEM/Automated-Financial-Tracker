import React from 'react'
import { UserProvider } from './UserContext';
import { FinanceProvider } from './FinanceContext';

function AppProvider({ children }) {
  return (
      <UserProvider>
        <FinanceProvider>
            {children}
        </FinanceProvider>
      </UserProvider>
  )
}

export default AppProvider
  