import { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context
interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with default values
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Create a provider component
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(localStorage.getItem('isDarkMode') === 'true');

  const toggleDarkMode = () => {
    localStorage.setItem('isDarkMode', (!isDarkMode).toString());
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the DarkModeContext
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};