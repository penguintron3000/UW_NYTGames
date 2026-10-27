import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from './landing/LandingPage.tsx';
import WordlePage from './wordle/WordlePage.tsx';
import { WordleGameContextProvider } from './wordle/contexts/WordleGameContext.tsx';
import ConnectionsPage from './connections/ConnectionsPage.tsx';
import { ConnectionsGameContextProvider } from './connections/contexts/ConnectionsGameContext.tsx';
import { DarkModeProvider } from './header/contexts/useDarkMode.tsx';
import Header from './header/Header.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <div style={{width:'100%', height: '500%'}}>
      <Header/>
      <LandingPage />
    </div>,
  },
  {
    path: "/wordle",
    element: (
    <WordleGameContextProvider withCache={true}>
      <Header/> 
      <WordlePage />
    </WordleGameContextProvider>
    ),
  },
  {
    path: "/connections",
    element: (
      <ConnectionsGameContextProvider withCache={true}>
        <Header/> 
        <ConnectionsPage/>
      </ConnectionsGameContextProvider>
    )
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </StrictMode>,
)
