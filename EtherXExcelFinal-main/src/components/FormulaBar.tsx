import { useState, useRef, useEffect } from 'react';
import { X, Check, Sigma } from 'lucide-react';
import { useSpreadsheet } from '../contexts/SpreadsheetContext';
import { FormulaBuilder, FormulaDefinition } from './FormulaBuilder';

interface FormulaBarProps {
  isDarkMode?: boolean;
}

export function FormulaBar({ isDarkMode = false }: FormulaBarProps) {
  const { selectedCell, cellData, setCellData, getCellKey, setIsFormulaMode, setFormulaSelectionCells, setActiveFormula, isFormulaMode } = useSpreadsheet();
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [builderPosition, setBuilderPosition] = useState({ x: 0, y: 0 });
  const formulaButtonRef = useRef<HTMLButtonElement>(null);
  
  const cellKey = selectedCell ? getCellKey(selectedCell.row, selectedCell.col) : '';
  const formula = cellKey ? (cellData[cellKey] || '') : '';
  const displayCell = selectedCell ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}` : 'A1';

  const handleFormulaChange = (value: string) => {
    if (cellKey) {
      setCellData(prev => ({ ...prev, [cellKey]: value }));
    }
  };

  const handleFormulaButtonClick = () => {
    console.log('Formula button clicked!');
    if (formulaButtonRef.current) {
      const rect = formulaButtonRef.current.getBoundingClientRect();
      console.log('Button position:', rect);
      // Adjust for any parent scaling (ExcelSpreadsheet has scale(1.5))
      setBuilderPosition({ 
        x: Math.max(10, rect.left), 
        y: Math.max(10, rect.bottom + 5) 
      });
    }
    console.log('Opening formula builder...');
    setShowFormulaBuilder(true);
  };

  const handleSelectFormula = (formula: FormulaDefinition) => {
    setActiveFormula(formula.name);
    setIsFormulaMode(true);
    setFormulaSelectionCells([]);
    setShowFormulaBuilder(false);
  };

  const handleCancelFormula = () => {
    setIsFormulaMode(false);
    setFormulaSelectionCells([]);
    setActiveFormula(null);
  };

  const handleConfirmFormula = () => {
    // Apply formula logic would go here if needed
    // For now, just clear the mode
    setIsFormulaMode(false);
    setFormulaSelectionCells([]);
    setActiveFormula(null);
  };

  // Add global ESC key listener for formula mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormulaMode) {
        e.preventDefault();
        e.stopPropagation();
        handleCancelFormula();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isFormulaMode]);

  return (
    <>
      <div 
        className="h-8 flex items-center px-2 gap-2 border-b" 
        style={{
          background: isDarkMode ? '#000000' : '#FFFFFF',
          borderColor: isDarkMode ? '#374151' : '#d1d5db'
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-12 sm:w-16 h-7 border rounded px-2 flex items-center text-xs sm:text-sm"
            style={{
              borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
              color: isDarkMode ? '#FFFFFF' : '#111827',
              background: isDarkMode ? '#1a1a1a' : '#FFFFFF'
            }}
          >
            {displayCell}
          </div>
          <button 
            ref={formulaButtonRef}
            onClick={handleFormulaButtonClick}
            className="h-7 w-7 flex items-center justify-center rounded transition-all"
            style={{
              background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 100%)',
              border: '1px solid #FFD700'
            }}
            title="Insert Function"
          >
            <Sigma className="w-4 h-4 text-black" />
          </button>
          <button 
            onClick={handleCancelFormula}
            className="h-7 w-7 flex items-center justify-center rounded"
            style={{
              background: isDarkMode ? '#1a1a1a' : 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#374151' : '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = isDarkMode ? '#1a1a1a' : 'transparent'}
            title="Cancel Formula"
          >
            <X className="w-4 h-4" style={{ color: isDarkMode ? '#CCCCCC' : '#4b5563' }} />
          </button>
          <button 
            onClick={handleConfirmFormula}
            className="h-7 w-7 flex items-center justify-center rounded"
            style={{
              background: isDarkMode ? '#1a1a1a' : 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#374151' : '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = isDarkMode ? '#1a1a1a' : 'transparent'}
            title="Confirm Formula"
          >
            <Check className="w-4 h-4" style={{ color: isDarkMode ? '#10B981' : '#059669' }} />
          </button>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={formula}
            onChange={(e) => handleFormulaChange(e.target.value)}
            placeholder="Enter formula or value..."
            className="w-full h-7 px-2 text-xs sm:text-sm border-none outline-none"
            style={{
              background: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              color: isDarkMode ? '#FFFFFF' : '#111827'
            }}
          />
        </div>
      </div>
      
      <FormulaBuilder
        show={showFormulaBuilder}
        position={builderPosition}
        onClose={() => setShowFormulaBuilder(false)}
        onSelectFormula={handleSelectFormula}
      />
    </>
  );
}
