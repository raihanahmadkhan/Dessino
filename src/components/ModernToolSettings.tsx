import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawingTool } from './ModernSidebar';

interface ToolSettingsProps {
  showToolSettings: boolean;
  setShowToolSettings: (show: boolean) => void;
  setShowLayersPanel: (show: boolean) => void;
  currentTool: DrawingTool;
  strokeStyle: string;
  setStrokeStyle: (style: string) => void;
  fillStyle: string;
  setFillStyle: (style: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  colorPalette: string[];
}

const ModernToolSettings: React.FC<ToolSettingsProps> = ({
  showToolSettings,
  setShowToolSettings,
  setShowLayersPanel,
  currentTool,
  strokeStyle,
  setStrokeStyle,
  fillStyle,
  setFillStyle,
  lineWidth,
  setLineWidth,
  opacity,
  setOpacity,
  colorPalette
}) => {
  return (
    <AnimatePresence>
      {showToolSettings && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-surface rounded-lg shadow-lg border border-border z-30 w-80"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-black text-lg">Tool Settings</h3>
              <button
                className="text-black hover:text-black"
                onClick={() => setShowToolSettings(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tool-specific settings */}
            {(currentTool === 'pencil' || currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle') && (
              <div className="mb-4">
                <label className="text-sm text-black font-semibold block mb-2 bg-primary bg-opacity-10 p-2 rounded">Stroke Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={strokeStyle}
                    onChange={(e) => setStrokeStyle(e.target.value)}
                    className="h-10 w-10 border rounded cursor-pointer"
                  />
                  <div className="grid grid-cols-5 gap-1 flex-1">
                    {colorPalette.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        className={`color-swatch ${color === strokeStyle ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setStrokeStyle(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {colorPalette.slice(5, 10).map((color) => (
                    <button
                      key={color}
                      className={`color-swatch ${color === strokeStyle ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setStrokeStyle(color)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {currentTool === 'fill' && (
              <div className="mb-4">
                <label className="text-sm text-black font-semibold block mb-2 bg-primary bg-opacity-10 p-2 rounded">Fill Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={fillStyle}
                    onChange={(e) => setFillStyle(e.target.value)}
                    className="h-10 w-10 border rounded cursor-pointer"
                  />
                  <div className="grid grid-cols-5 gap-1 flex-1">
                    {colorPalette.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        className={`color-swatch ${color === fillStyle ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFillStyle(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="text-sm text-black font-semibold block mb-2 bg-primary bg-opacity-10 p-2 rounded">Brush Size: {lineWidth}px</label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-black font-medium">1</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
                  className="flex-1"
                />
                <span className="text-xs text-black font-medium">50</span>
              </div>
              <div className="flex justify-center mt-2">
                <div 
                  className="rounded-full bg-current border-2 border-border" 
                  style={{ 
                    width: `${Math.min(lineWidth, 50)}px`, 
                    height: `${Math.min(lineWidth, 50)}px`,
                    backgroundColor: currentTool === 'eraser' ? '#f3f4f6' : strokeStyle
                  }}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-black font-semibold block mb-2 bg-primary bg-opacity-10 p-2 rounded">Opacity: {opacity}%</label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-black font-medium">0</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                  className="flex-1"
                />
                <span className="text-xs text-black font-medium">100</span>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <button
                className="px-5 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-hover transition-colors"
                onClick={() => setShowToolSettings(false)}
              >
                Apply & Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernToolSettings;
