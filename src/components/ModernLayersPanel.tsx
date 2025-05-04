import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  canvas: HTMLCanvasElement | null;
  isEmpty: boolean;
  locked: boolean;
}

interface LayersPanelProps {
  layers: Layer[];
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  showLayersPanel: boolean;
  setShowLayersPanel: (show: boolean) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  renameLayer: (id: string, newName: string) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  mergeLayerDown: (id: string) => void;
  addLayer: () => void;
}

const ModernLayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  setActiveLayerId,
  showLayersPanel,
  setShowLayersPanel,
  toggleLayerVisibility,
  toggleLayerLock,
  renameLayer,
  deleteLayer,
  duplicateLayer,
  moveLayerUp,
  moveLayerDown,
  mergeLayerDown,
  addLayer
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingLayerId, setRenamingLayerId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startRenaming = (layer: Layer) => {
    setRenamingLayerId(layer.id);
    setNewName(layer.name);
    setIsRenaming(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleRename = () => {
    if (newName.trim()) {
      renameLayer(renamingLayerId, newName.trim());
    }
    setIsRenaming(false);
  };

  const renderLayerItem = (layer: Layer) => {
    const isActiveLayer = layer.id === activeLayerId;
    const isRenamingThisLayer = isRenaming && layer.id === renamingLayerId;

    return (
      <motion.div
        key={layer.id}
        className={`layer-item ${isActiveLayer ? 'active' : ''}`}
        onClick={() => setActiveLayerId(layer.id)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className={`text-text-secondary hover:text-text-primary p-1 ${!layer.visible ? 'opacity-50' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLayerVisibility(layer.id);
          }}
          title={layer.visible ? "Hide Layer" : "Show Layer"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {layer.visible ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            )}
          </svg>
        </button>
        
        <div className="flex-1 mx-2 truncate">
          {isRenamingThisLayer ? (
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="w-full px-1 py-0.5 text-sm border rounded bg-surface text-text-primary"
            />
          ) : (
            <div 
              className="text-sm font-medium truncate text-text-primary"
              onDoubleClick={() => startRenaming(layer)}
            >
              {layer.name} {layer.locked && <span className="text-xs text-danger font-medium">(Locked)</span>}
            </div>
          )}
        </div>
        
        <div className="flex">
          <button
            className={`text-text-secondary hover:text-text-primary p-1 ${layer.locked ? 'bg-danger bg-opacity-10' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerLock(layer.id);
            }}
            title={layer.locked ? "Unlock Layer" : "Lock Layer"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {layer.locked ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-13V3a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2h-2z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              )}
            </svg>
          </button>
          
          <div className="relative group">
            <button
              className="text-text-secondary hover:text-text-primary p-1"
              title="Layer Options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <div className="absolute right-0 mt-1 bg-surface border border-border rounded-md shadow-md z-50 hidden group-hover:block w-36">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-1 text-sm text-text-primary hover:bg-surface-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateLayer(layer.id);
                  }}
                >
                  Duplicate
                </button>
                <button
                  className="w-full text-left px-4 py-1 text-sm text-text-primary hover:bg-surface-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayerUp(layer.id);
                  }}
                >
                  Move Up
                </button>
                <button
                  className="w-full text-left px-4 py-1 text-sm text-text-primary hover:bg-surface-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayerDown(layer.id);
                  }}
                >
                  Move Down
                </button>
                <button
                  className="w-full text-left px-4 py-1 text-sm text-text-primary hover:bg-surface-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    mergeLayerDown(layer.id);
                  }}
                >
                  Merge Down
                </button>
                <button
                  className="w-full text-left px-4 py-1 text-sm text-danger hover:bg-danger hover:bg-opacity-10 hover:text-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLayer(layer.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {showLayersPanel && (
        <motion.div
          className="app-panel bg-surface border-l border-border shadow-md z-10 flex flex-col"
          initial={{ x: 280 }}
          animate={{ x: 0 }}
          exit={{ x: 280 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-medium text-text-primary">Layers</h3>
            <button
              className="tool-btn"
              onClick={() => setShowLayersPanel(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {layers.length === 0 ? (
              <div className="text-center text-text-secondary py-4">
                No layers yet. Add a layer to start drawing.
              </div>
            ) : (
              <div className="space-y-2">
                {layers.map((layer) => (
                  <React.Fragment key={layer.id}>
                    {renderLayerItem(layer)}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-border">
            <div className="flex space-x-2">
              <button
                className="flex-1 tool-btn flex items-center justify-center"
                onClick={addLayer}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-text-primary">Add Layer</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernLayersPanel;
