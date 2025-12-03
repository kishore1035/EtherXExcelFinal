import { FileSpreadsheet, Save, Undo, Redo, LayoutDashboard, Edit2, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useUndoRedo } from '../contexts/UndoRedoContext';
import { useSpreadsheet } from '../contexts/SpreadsheetContext';
import { exportToCSV } from '../utils/csvExport';
import { useState, useRef, useEffect } from 'react';
import { saveSpreadsheetToIPFS } from '../utils/pinataService';
import { autoSaveSpreadsheet } from '../utils/spreadsheetStorage';
import { trackActivity } from '../utils/notificationSystem';
import { CollaborationMenu } from './CollaborationMenu';

interface HeaderProps {
  spreadsheetId: string;
  spreadsheetTitle: string;
  onTitleChange: (newTitle: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Header({ spreadsheetId, spreadsheetTitle, onTitleChange, isDarkMode = false, onToggleTheme }: HeaderProps) {
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const { setCellData, setCellFormats, cellData, inputMessage, cellFormats } = useSpreadsheet();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(spreadsheetTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Get user info from localStorage
  const userEmail = localStorage.getItem('userEmail') || 'user@etherx.com';
  const userName = localStorage.getItem('userName') || 'User';
  
  // Update title when prop changes
  useEffect(() => {
    setTitle(spreadsheetTitle);
  }, [spreadsheetTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (cellData && Object.keys(cellData).length > 0) {
        autoSaveSpreadsheet(spreadsheetId, title, userEmail, cellData, cellFormats);
        console.log('Auto-saved spreadsheet:', title);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [spreadsheetId, title, userEmail, cellData, cellFormats]);

  const handleUndo = () => {
    const prevState = undo();
    if (prevState) {
      setCellData(prevState.cellData);
      setCellFormats(prevState.cellFormats);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setCellData(nextState.cellData);
      setCellFormats(nextState.cellFormats);
    }
  };

  const handleTitleSubmit = () => {
    if (title.trim()) {
      onTitleChange(title.trim());
      autoSaveSpreadsheet(spreadsheetId, title.trim(), userEmail, cellData, cellFormats);
      // Track edit activity
      trackActivity(userEmail, 'edit', spreadsheetId, title.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(spreadsheetTitle);
      setIsEditingTitle(false);
    }
  };

  const handleSave = async () => {
    // Save to localStorage
    autoSaveSpreadsheet(spreadsheetId, title, userEmail, cellData, cellFormats);
    alert(`"${title}" saved successfully!`);
    
    // Track save activity
    trackActivity(userEmail, 'save', spreadsheetId, title);
    
    // Also export to CSV
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `${title.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.csv`;
    exportToCSV(cellData, filename);
    
    // Track export activity
    trackActivity(userEmail, 'export', spreadsheetId, title);
  };

  const handleDashboardClick = () => {
    // Auto-save before leaving
    autoSaveSpreadsheet(spreadsheetId, title, userEmail, cellData, cellFormats);
    console.log('Auto-saved before dashboard navigation');
    
    // Trigger navigation back to dashboard
    window.dispatchEvent(new CustomEvent('navigateToDashboard'));
  };

  return (
    <div className="h-8 flex items-center px-3 gap-3 text-black" style={{ 
        background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)'
      }}>
      <div className="flex items-center gap-2">
        <img 
          src="/src/assets/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png" 
          alt="EtherX Logo" 
          className="h-6 w-auto object-contain"
        />
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            className="font-semibold text-[4px] bg-white/50 px-1 rounded border border-black/20 focus:outline-none focus:border-black/40"
            style={{ width: '120px', color: '#000000' }}
          />
        ) : (
          <div 
            className="flex items-center gap-1 cursor-pointer hover:bg-black/5 px-1 rounded"
            onClick={() => setIsEditingTitle(true)}
            title="Click to rename"
          >
            <span className="font-semibold text-[4px]" style={{ color: '#000000' }}>{title}</span>
            <Edit2 className="w-1.5 h-1.5 opacity-60" style={{ color: '#000000' }} />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-4 w-4 p-0 text-black hover:bg-black hover:bg-opacity-10"
          onClick={handleSave}
          title="Save as CSV"
        >
          <Save className="w-2 h-2" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-4 w-4 p-0 text-black hover:bg-black hover:bg-opacity-10 ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleUndo}
          disabled={!canUndo}
        >
          <Undo className="w-2 h-2" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-4 w-4 p-0 text-black hover:bg-black hover:bg-opacity-10 ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleRedo}
          disabled={!canRedo}
        >
          <Redo className="w-2 h-2" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 text-black hover:bg-black hover:bg-opacity-10"
            onClick={onToggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-2 h-2" style={{ color: '#000000' }} />
            ) : (
              <Moon className="w-2 h-2" style={{ color: '#000000' }} />
            )}
          </Button>
        )}
        
        {/* Collaboration Menu */}
        <CollaborationMenu
          spreadsheetId={spreadsheetId}
          spreadsheetTitle={title}
          userEmail={userEmail}
          userName={userName}
          isDarkMode={isDarkMode}
        />
        
        {/* Dashboard Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 px-3 text-black hover:bg-black hover:bg-opacity-10"
          onClick={handleDashboardClick}
          title="Go to Dashboard (saves automatically)"
          style={{ 
            display: 'flex !important', 
            visibility: 'visible !important', 
            opacity: '1 !important', 
            color: '#000000',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <LayoutDashboard className="w-2 h-2" style={{ color: '#000000' }} />
          <span className="text-[4px]" style={{ color: '#000000', display: 'inline !important' }}>Dashboard</span>
        </Button>
      </div>
    </div>
  );
}
