import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Theme Toggle Button Component
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="tool-btn"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        // Sun icon for dark mode (clicking switches to light)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon icon for light mode (clicking switches to dark)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};

interface HeaderProps {
  onBack: () => void;
  clearCanvas: () => void;
  saveAsImage: () => void;
  undo: () => void;
  redo: () => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  setShowShortcutsGuide: (show: boolean) => void;
  history: any[];
  redoStack: any[];
}

const ModernHeader: React.FC<HeaderProps> = ({
  onBack,
  clearCanvas,
  saveAsImage,
  undo,
  redo,
  showGrid,
  setShowGrid,
  showMobileMenu,
  setShowMobileMenu,
  setShowShortcutsGuide,
  history,
  redoStack
}) => {
  return (
    <header className="bg-surface shadow-md z-20 border-b border-border">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Back to home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl elegant-logo">Dessino</h1>
              <span className="elegant-subtitle">Artistry Unleashed</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">

              
              <button 
                className={`tool-btn ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={undo}
                disabled={history.length === 0}
                title="Undo (Ctrl+Z)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              
              <button 
                className={`tool-btn ${redoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={redo}
                disabled={redoStack.length === 0}
                title="Redo (Ctrl+Y)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h7m0 0v2a8 8 0 01-8 8H3m18-8l-6-6m0 0l-6 6" />
                </svg>
              </button>
              
              <button 
                className="tool-btn"
                onClick={clearCanvas}
                title="Clear Canvas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <button 
                className="tool-btn"
                onClick={saveAsImage}
                title="Save Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              
              <ThemeToggleButton />
            </div>
            
            {/* Mobile menu button removed */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
