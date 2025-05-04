'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDrawingApp from '../components/ModernDrawingApp';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  // We're now using Next.js font loading, so no need for this useEffect
  // State to track if we're on landing page or canvas
  const [showLanding, setShowLanding] = useState(true);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingScreen key="landing" onGetStarted={() => setShowLanding(false)} />
        ) : (
          <ModernDrawingApp key="app" onBack={() => setShowLanding(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-border bg-surface hover:bg-surface-hover transition-colors duration-200 flex items-center justify-center shadow-sm"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        // Sun icon for dark mode (clicking switches to light)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon icon for light mode (clicking switches to dark)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

// LANDING SCREEN COMPONENT
function LandingScreen({ onGetStarted }: { onGetStarted: () => void }) {
  const exampleDrawings = [
    { id: 1, title: "Mountain Landscape", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 2, title: "Abstract Art", imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
    { id: 3, title: "Character Sketch", imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" },
  ];

  return (
    <motion.div 
      className="flex flex-col w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navbar */}
      <header className="w-full bg-surface shadow-md py-4 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl elegant-logo">Dessino</h1>
              <span className="elegant-subtitle">Artistry Unleashed</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
            alt="Creative workspace background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Unleash Your Creative Potential
          </motion.h1>
          <motion.p 
            className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create digital artwork with our intuitive canvas. Sketch, draw, and design with powerful tools designed for both beginners and professionals.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary-hover theme-button font-medium py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary"
            >
              Start Drawing
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-primary">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Intuitive Tools</h3>
              <p className="text-text-secondary">Easy-to-use drawing tools with customizable brushes, shapes, and colors.</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Color Selection</h3>
              <p className="text-text-secondary">Choose from a wide range of colors with an intuitive color picker for your artwork.</p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Export Options</h3>
              <p className="text-text-secondary">Save your artwork in various formats and resolutions for sharing or printing.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-text-primary">Inspiration Gallery</h2>
          <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
            Check out what others have created with Dessino. From simple sketches to complex illustrations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exampleDrawings.map((drawing) => (
              <motion.div 
                key={drawing.id}
                className="rounded-lg overflow-hidden shadow-md bg-surface border border-border"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 * drawing.id }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={drawing.imageUrl} 
                    alt={drawing.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-text-primary">{drawing.title}</h3>
                  <p className="text-text-tertiary text-sm">Created with Dessino</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary-hover theme-button font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-primary"
            >
              Create Your Own Masterpiece
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-bold text-xl bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-md shadow-md mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
            Dessino
          </div>
          <p className="text-text-tertiary mb-6">The ultimate digital drawing experience</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="mt-6 text-text-tertiary text-sm">© 2025 Dessino. All rights reserved. Created by <a href="https://www.linkedin.com/in/raihanahmadkhan/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Raihan Ahmad</a></p>
        </div>
      </footer>
    </motion.div>
  );
}
