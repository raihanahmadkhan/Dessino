import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ModernHeader from './ModernHeader';
import ModernSidebar from './ModernSidebar';
import ModernToolSettings from './ModernToolSettings';

export type DrawingTool = 'pencil' | 'rectangle' | 'circle' | 'eraser' | 'line' | 'fill';

interface DrawingAppProps {
  onBack: () => void;
}

interface HistoryAction {
  imageData: ImageData;
}

const ModernDrawingApp: React.FC<DrawingAppProps> = ({ onBack }) => {
  // Constants
  const DEFAULT_STROKE_STYLE = '#000000';
  const DEFAULT_LINE_WIDTH = 5;
  const MAX_HISTORY_LENGTH = 50;
  
  // Canvas size with responsive adjustments
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  // Handle window resize for responsive canvas
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Adjust canvas size for mobile devices
        const mobileWidth = Math.min(window.innerWidth - 80, 600);
        const mobileHeight = Math.min(window.innerHeight - 200, 450);
        setCanvasSize({ width: mobileWidth, height: mobileHeight });
      } else {
        // Default size for desktop
        setCanvasSize({ width: 800, height: 600 });
      }
    };
    
    // Set initial size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Canvas references
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // UI state
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showToolSettings, setShowToolSettings] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pencil');
  const [strokeStyle, setStrokeStyle] = useState<string>(DEFAULT_STROKE_STYLE);
  const [fillStyle, setFillStyle] = useState<string>('#FFFFFF');
  const [lineWidth, setLineWidth] = useState<number>(DEFAULT_LINE_WIDTH);
  const [opacity, setOpacity] = useState<number>(100);
  
  // No selection state needed
  
  // History state
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([]);
  
  // Drawing points
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Initialize canvases
  useEffect(() => {
    if (mainCanvasRef.current) {
      // Set canvas dimensions
      mainCanvasRef.current.width = canvasSize.width;
      mainCanvasRef.current.height = canvasSize.height;
      
      // Fill with white background
      const ctx = mainCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }
      
      // Save initial state to history
      saveToHistory();
    }
    
    if (tempCanvasRef.current) {
      tempCanvasRef.current.width = canvasSize.width;
      tempCanvasRef.current.height = canvasSize.height;
    }
  }, [canvasSize]);
  
  // Save current canvas state to history
  const saveToHistory = useCallback((): void => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get current image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Add to history
    setHistory(prevHistory => {
      const newHistory = [...prevHistory, { imageData }];
      
      // Limit history length
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    
    // Clear redo stack when new action is performed
    setRedoStack([]);
  }, [MAX_HISTORY_LENGTH]);
  
  // Undo last action
  const undo = useCallback((): void => {
    if (history.length <= 1) return;
    
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Remove last action from history
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      const lastAction = newHistory.pop();
      
      if (lastAction) {
        // Add to redo stack
        setRedoStack(prevRedoStack => [...prevRedoStack, lastAction]);
      }
      
      // Apply previous state
      const previousAction = newHistory[newHistory.length - 1];
      if (previousAction) {
        ctx.putImageData(previousAction.imageData, 0, 0);
      }
      
      return newHistory;
    });
  }, [history]);
  
  // Redo last undone action
  const redo = useCallback((): void => {
    if (redoStack.length === 0) return;
    
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Remove last action from redo stack
    setRedoStack(prevRedoStack => {
      const newRedoStack = [...prevRedoStack];
      const lastAction = newRedoStack.pop();
      
      if (lastAction) {
        // Add to history
        setHistory(prevHistory => [...prevHistory, lastAction]);
        
        // Apply redone state
        ctx.putImageData(lastAction.imageData, 0, 0);
      }
      
      return newRedoStack;
    });
  }, [redoStack]);
  
  // Clear canvas
  const clearCanvas = useCallback((): void => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current state to history before clearing
    saveToHistory();
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save cleared state to history
    saveToHistory();
  }, [saveToHistory]);
  
  // Save canvas as image
  const saveAsImage = useCallback((): void => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'drawing.png';
    
    // Convert canvas to data URL
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
  
  // Update cursor position
  const updateCursorPosition = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Show cursor for drawing tools, hide for others
    if (currentTool === 'pencil' || currentTool === 'eraser' || currentTool === 'line') {
      cursor.classList.remove('hidden');
    } else {
      cursor.classList.add('hidden');
    }
  }, [currentTool]);
  
  // Get canvas coordinates from mouse event
  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLDivElement>): { x: number, y: number } => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);
  
  // Handle mouse down event
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    const { x, y } = getCanvasCoordinates(e);
    
      // Select tool removed
    
    // For drawing tools
    setIsDrawing(true);
    setStartPoint({ x, y });
    setLastPoint({ x, y });
    
    // Get temp canvas context
    const tempCanvas = tempCanvasRef.current;
    if (!tempCanvas) return;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Clear the temp canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Set drawing styles
    tempCtx.lineCap = 'round';
    tempCtx.lineJoin = 'round';
    
    // Handle eraser tool
    if (currentTool === 'eraser') {
      // Get main canvas
      const mainCanvas = mainCanvasRef.current;
      if (!mainCanvas) return;
      
      const mainCtx = mainCanvas.getContext('2d');
      if (!mainCtx) return;
      
      // Use destination-out for eraser
      mainCtx.save();
      mainCtx.globalCompositeOperation = 'destination-out';
      mainCtx.beginPath();
      mainCtx.arc(x, y, lineWidth, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.restore();
    } else if (currentTool === 'pencil') {
      // Set drawing styles for pencil
      tempCtx.strokeStyle = strokeStyle;
      tempCtx.lineWidth = lineWidth;
      tempCtx.globalAlpha = opacity / 100;
      
      // Start drawing
      tempCtx.beginPath();
      tempCtx.moveTo(x, y);
      tempCtx.lineTo(x, y);
      tempCtx.stroke();
    }
    
    // Update cursor position
    updateCursorPosition(e);
  }, [currentTool, getCanvasCoordinates, lineWidth, opacity, strokeStyle, updateCursorPosition]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    const { x, y } = getCanvasCoordinates(e);
    
    // Update cursor position
    updateCursorPosition(e);
    
    // Select tool removed
    
    // For drawing tools
    if (!isDrawing || !lastPoint) return;
    
    if (currentTool === 'eraser') {
      // Get main canvas
      const mainCanvas = mainCanvasRef.current;
      if (!mainCanvas) return;
      
      const mainCtx = mainCanvas.getContext('2d');
      if (!mainCtx) return;
      
      // Use destination-out for eraser
      mainCtx.save();
      mainCtx.globalCompositeOperation = 'destination-out';
      mainCtx.lineWidth = lineWidth * 2;
      mainCtx.lineCap = 'round';
      mainCtx.lineJoin = 'round';
      mainCtx.beginPath();
      mainCtx.moveTo(lastPoint.x, lastPoint.y);
      mainCtx.lineTo(x, y);
      mainCtx.stroke();
      mainCtx.restore();
    } else {
      // Get temp canvas context
      const tempCanvas = tempCanvasRef.current;
      if (!tempCanvas) return;
      
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      // Clear the temp canvas for shape tools
      if (currentTool !== 'pencil') {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      }
      
      // Set drawing styles
      tempCtx.strokeStyle = strokeStyle;
      tempCtx.lineWidth = lineWidth;
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';
      tempCtx.globalAlpha = opacity / 100;
      
      // Handle different drawing tools
      switch (currentTool) {
        case 'pencil': {
          // Continue drawing path
          tempCtx.beginPath();
          tempCtx.moveTo(lastPoint.x, lastPoint.y);
          tempCtx.lineTo(x, y);
          tempCtx.stroke();
          break;
        }
        case 'line': {
          // Draw line from start point to current point
          if (startPoint) {
            tempCtx.beginPath();
            tempCtx.moveTo(startPoint.x, startPoint.y);
            tempCtx.lineTo(x, y);
            tempCtx.stroke();
          }
          break;
        }
        case 'rectangle': {
          // Draw rectangle from start point to current point
          if (startPoint) {
            const width = x - startPoint.x;
            const height = y - startPoint.y;
            
            tempCtx.beginPath();
            tempCtx.rect(startPoint.x, startPoint.y, width, height);
            tempCtx.stroke();
          }
          break;
        }
        case 'circle': {
          // Draw circle from start point to current point
          if (startPoint) {
            const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
            
            tempCtx.beginPath();
            tempCtx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
            tempCtx.stroke();
          }
          break;
        }
        case 'fill': {
          // Fill will be handled on mouse up
          break;
        }
      }
    }
    
    // Update last point
    setLastPoint({ x, y });
  }, [currentTool, getCanvasCoordinates, isDrawing, lastPoint, lineWidth, opacity, startPoint, strokeStyle, updateCursorPosition]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((): void => {
      // Select tool removed
    
    // For drawing tools
    if (!isDrawing) return;
    
    // Apply temp canvas to main canvas (except for eraser which draws directly)
    if (currentTool !== 'eraser') {
      const mainCanvas = mainCanvasRef.current;
      const tempCanvas = tempCanvasRef.current;
      
      if (!mainCanvas || !tempCanvas) return;
      
      const mainCtx = mainCanvas.getContext('2d');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!mainCtx || !tempCtx) return;
      
      // Special handling for fill tool
      if (currentTool === 'fill' && startPoint) {
        // Apply fill directly to the main canvas
        mainCtx.fillStyle = fillStyle;
        mainCtx.globalAlpha = opacity / 100;
        
        // Simple fill - in a real app, you'd use a flood fill algorithm
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
      } else {
        // Apply temp canvas to main canvas
        mainCtx.drawImage(tempCanvas, 0, 0);
      }
      
      // Clear the temp canvas
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setLastPoint(null);
    
    // Save to history
    saveToHistory();
  }, [currentTool, fillStyle, isDrawing, opacity, saveToHistory, startPoint]);
  
  // Handle mouse leave
  const handleMouseLeave = useCallback((): void => {
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.classList.add('hidden');
    }
    
    // Call handleMouseUp to stop drawing
    handleMouseUp();
  }, [handleMouseUp]);
  
  // Handle mouse enter
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    updateCursorPosition(e);
  }, [updateCursorPosition]);
  
  // Selection functionality removed
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z') {
        undo();
      }
      
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key === 'y') {
        redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [redo, undo]);
  
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <ModernHeader 
        onBack={onBack}
        clearCanvas={clearCanvas}
        saveAsImage={saveAsImage}
        undo={undo}
        redo={redo}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        setShowShortcutsGuide={() => {}}
        history={history}
        redoStack={redoStack}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Tools */}
        <ModernSidebar 
          currentTool={currentTool}
          setCurrentTool={(tool: DrawingTool) => setCurrentTool(tool)}
          setShowToolSettings={setShowToolSettings}
          setShowLayersPanel={() => {}}
          showLayersPanel={false}
        />
        
        {/* Canvas Area */}
        <div 
          className="flex-1 relative overflow-auto flex items-center justify-center p-2 md:p-4"
          style={{ backgroundColor: showGrid ? 'var(--background)' : 'var(--surface)' }}
        >
          <div 
            ref={containerRef}
            className={`relative ${showGrid ? 'canvas-container' : ''}`}
            style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
          >
            <canvas
              ref={mainCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute top-0 left-0 border border-border shadow-md"
              style={{ backgroundColor: 'white' }}
            />
            <canvas
              ref={tempCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ backgroundColor: 'transparent' }}
            />
            <div 
              className="absolute top-0 left-0 w-full h-full z-10"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              onTouchStart={(e) => {
                // Prevent scrolling when drawing
                e.preventDefault();
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                // Start drawing
                setIsDrawing(true);
                setStartPoint({ x, y });
                setLastPoint({ x, y });
                
                // Get temp canvas context
                const tempCanvas = tempCanvasRef.current;
                if (!tempCanvas) return;
                
                const tempCtx = tempCanvas.getContext('2d');
                if (!tempCtx) return;
                
                // Clear the temp canvas
                tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Set drawing styles
                tempCtx.lineCap = 'round';
                tempCtx.lineJoin = 'round';
                
                // Handle eraser tool
                if (currentTool === 'eraser') {
                  // Get main canvas
                  const mainCanvas = mainCanvasRef.current;
                  if (!mainCanvas) return;
                  
                  const mainCtx = mainCanvas.getContext('2d');
                  if (!mainCtx) return;
                  
                  // Use destination-out for eraser
                  mainCtx.save();
                  mainCtx.globalCompositeOperation = 'destination-out';
                  mainCtx.beginPath();
                  mainCtx.arc(x, y, lineWidth, 0, Math.PI * 2);
                  mainCtx.fill();
                  mainCtx.restore();
                } else if (currentTool === 'pencil') {
                  // Set drawing styles for pencil
                  tempCtx.strokeStyle = strokeStyle;
                  tempCtx.lineWidth = lineWidth;
                  tempCtx.globalAlpha = opacity / 100;
                  
                  // Start drawing
                  tempCtx.beginPath();
                  tempCtx.moveTo(x, y);
                  tempCtx.lineTo(x, y);
                  tempCtx.stroke();
                }
              }}
              onTouchMove={(e) => {
                if (!isDrawing) return;
                e.preventDefault();
                
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                // Get current point
                const currentPoint = { x, y };
                
                // Get temp canvas context
                const tempCanvas = tempCanvasRef.current;
                if (!tempCanvas) return;
                
                const tempCtx = tempCanvas.getContext('2d');
                if (!tempCtx) return;
                
                // Handle eraser tool
                if (currentTool === 'eraser') {
                  // Get main canvas
                  const mainCanvas = mainCanvasRef.current;
                  if (!mainCanvas) return;
                  
                  const mainCtx = mainCanvas.getContext('2d');
                  if (!mainCtx) return;
                  
                  // Use destination-out for eraser
                  mainCtx.save();
                  mainCtx.globalCompositeOperation = 'destination-out';
                  mainCtx.beginPath();
                  mainCtx.arc(x, y, lineWidth, 0, Math.PI * 2);
                  mainCtx.fill();
                  mainCtx.restore();
                } else if (currentTool === 'pencil') {
                  // Set drawing styles for pencil
                  tempCtx.strokeStyle = strokeStyle;
                  tempCtx.lineWidth = lineWidth;
                  tempCtx.globalAlpha = opacity / 100;
                  
                  // Continue drawing
                  tempCtx.beginPath();
                  if (lastPoint) {
                    tempCtx.moveTo(lastPoint.x, lastPoint.y);
                    tempCtx.lineTo(currentPoint.x, currentPoint.y);
                    tempCtx.stroke();
                  }
                }
                
                // Update last point
                setLastPoint(currentPoint);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                if (!isDrawing) return;
                
                // Get main canvas
                const mainCanvas = mainCanvasRef.current;
                if (!mainCanvas) return;
                
                const mainCtx = mainCanvas.getContext('2d');
                if (!mainCtx) return;
                
                // Get temp canvas
                const tempCanvas = tempCanvasRef.current;
                if (!tempCanvas) return;
                
                // Draw temp canvas to main canvas
                if (currentTool !== 'eraser') {
                  mainCtx.drawImage(tempCanvas, 0, 0);
                  
                  // Clear temp canvas
                  const tempCtx = tempCanvas.getContext('2d');
                  if (tempCtx) {
                    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                  }
                }
                
                // Save to history
                saveToHistory();
                
                // Reset drawing state
                setIsDrawing(false);
                setStartPoint(null);
                setLastPoint(null);
              }}
              style={{ 
                cursor: currentTool === 'eraser' ? 'cell' : 'default'
              }}
            />
            {/* Selection overlay removed */}
            <div 
              ref={cursorRef}
              className="absolute rounded-full pointer-events-none opacity-70 z-20 hidden"
              style={{ 
                width: `${lineWidth}px`, 
                height: `${lineWidth}px`, 
                backgroundColor: currentTool === 'eraser' ? '#f3f4f6' : strokeStyle,
                border: '2px solid var(--text-primary)',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
              }}
            />
          </div>
        </div>
        
        {/* Tool Settings Panel */}
        <ModernToolSettings 
          showToolSettings={showToolSettings}
          setShowToolSettings={setShowToolSettings}
          setShowLayersPanel={() => {}}
          currentTool={currentTool}
          strokeStyle={strokeStyle}
          setStrokeStyle={setStrokeStyle}
          fillStyle={fillStyle}
          setFillStyle={setFillStyle}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          opacity={opacity}
          setOpacity={setOpacity}
          colorPalette={[
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#90EE90',
            '#808080', '#A52A2A', '#800080', '#008080', '#000080'
          ]}
        />
      </div>
      
      {/* Status Bar */}
      <div className="bg-surface border-t border-border py-1 px-4 text-xs flex flex-wrap justify-between items-center relative">
        <div className="font-medium">Canvas: {canvasSize.width} × {canvasSize.height}px</div>
        <div className="font-medium">Tool: {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}</div>
        
        {/* Hint Box */}
        <div className="hint-box absolute bottom-10 right-0 md:right-0 bg-primary/10 border border-primary/30 rounded-lg p-3 shadow-md max-w-[calc(100vw-32px)] md:max-w-xs">
          <div className="flex items-start gap-2">
            <div className="text-primary mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Tip: Click the <span className="font-bold text-primary">Settings</span> button to adjust brush size, color, and opacity.</p>
            </div>
            <button 
              className="text-text-secondary hover:text-text-primary mt-0.5"
              aria-label="Close tip"
              onClick={() => {
                const hintBox = document.querySelector('.hint-box');
                if (hintBox) hintBox.classList.add('hidden');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDrawingApp;
