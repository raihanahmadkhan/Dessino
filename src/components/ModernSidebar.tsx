import React from 'react';
import { motion } from 'framer-motion';

export type DrawingTool = 'pencil' | 'rectangle' | 'circle' | 'eraser' | 'line' | 'fill';

interface SidebarProps {
  currentTool: DrawingTool;
  setCurrentTool: (tool: DrawingTool) => void;
  setShowToolSettings: (show: boolean) => void;
  setShowLayersPanel: (show: boolean) => void;
  showLayersPanel: boolean;
}

const ModernSidebar: React.FC<SidebarProps> = ({
  currentTool,
  setCurrentTool,
  setShowToolSettings,
  setShowLayersPanel,
  showLayersPanel
}) => {
  return (
    <div className="app-sidebar bg-surface border-r border-border shadow-md z-10 flex flex-col h-full">
      <div className="flex flex-col space-y-2 p-2 overflow-y-auto">
        {/* Drawing Tools Section */}
        <div className="flex flex-col space-y-1">
          <div className="text-xs text-text-secondary font-medium px-2 py-1">Draw</div>
          <button
            className={`tool-btn ${currentTool === 'pencil' ? 'active' : ''}`}
            onClick={() => setCurrentTool('pencil')}
            title="Pencil Tool (B)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            className={`tool-btn ${currentTool === 'line' ? 'active' : ''}`}
            onClick={() => setCurrentTool('line')}
            title="Line Tool (L)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M4 4h16" />
            </svg>
          </button>
          
          <button
            className={`tool-btn ${currentTool === 'rectangle' ? 'active' : ''}`}
            onClick={() => setCurrentTool('rectangle')}
            title="Rectangle Tool (R)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </button>
          
          <button
            className={`tool-btn ${currentTool === 'circle' ? 'active' : ''}`}
            onClick={() => setCurrentTool('circle')}
            title="Circle Tool (C)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
            </svg>
          </button>
        </div>
        
        {/* Utility Tools Section */}
        <div className="flex flex-col space-y-1 mt-4">
          <div className="text-xs text-text-secondary font-medium px-2 py-1">Tools</div>

          <button
            className={`tool-btn ${currentTool === 'eraser' ? 'active' : ''}`}
            onClick={() => setCurrentTool('eraser')}
            title="Eraser Tool (E)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          <button
            className={`tool-btn ${currentTool === 'fill' ? 'active' : ''}`}
            onClick={() => setCurrentTool('fill')}
            title="Fill Tool (F)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
          

        </div>
        
        {/* Settings Button */}
        <div className="flex flex-col space-y-1 mt-4">
          <div className="text-xs text-text-secondary font-medium px-2 py-1">Settings</div>
          <button
            className="tool-btn"
            onClick={() => setShowToolSettings(true)}
            title="Tool Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          

        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
