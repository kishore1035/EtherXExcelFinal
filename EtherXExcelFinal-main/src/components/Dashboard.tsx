import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { FileSpreadsheet, Plus, Sparkles, Upload, Clock, Moon, Sun, Trash2 } from "lucide-react";
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";
import { getRecentSheets, formatDate, deleteSpreadsheet, type SpreadsheetData } from "../utils/spreadsheetStorage";
import { trackActivity } from "../utils/notificationSystem";
import { NotificationCenter } from "./NotificationCenter";
import { ProfileMenu } from "./ProfileMenu";
import { TemplatePickerDialog } from "./TemplatePickerDialog";
import { CollaborationPanel } from "./CollaborationPanel";

interface DashboardProps {
  userName: string;
  userEmail: string;
  userPhone?: string;
  onNewSheet: () => void;
  onLoadTemplates: () => void;
  onImportFile?: (data: any) => void;
  onOpenSheet?: (sheetId: string) => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  onUpdateProfile?: (name: string, email: string, phone: string) => void;
}

export function Dashboard({ 
  userName, 
  userEmail, 
  userPhone,
  onNewSheet, 
  onLoadTemplates, 
  onImportFile, 
  onOpenSheet,
  onOpenSettings,
  onLogout,
  onUpdateProfile,
}: DashboardProps) {
  const [recentSheets, setRecentSheets] = useState<SpreadsheetData[]>([]);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [collaborationPanelOpen, setCollaborationPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage, default to light mode
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Default to light mode instead of system preference
    return false;
  });

  useEffect(() => {
    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Load recent sheets
  useEffect(() => {
    const sheets = getRecentSheets(userEmail);
    setRecentSheets(sheets);
  }, [userEmail]);

  const handleDeleteSheet = (e: React.MouseEvent, sheetId: string) => {
    e.stopPropagation();
    const sheet = recentSheets.find(s => s.id === sheetId);
    if (confirm('Are you sure you want to delete this spreadsheet?')) {
      deleteSpreadsheet(sheetId, userEmail);
      setRecentSheets(getRecentSheets(userEmail));
      // Track delete activity
      if (sheet) {
        trackActivity(userEmail, 'delete', sheetId, sheet.title);
      }
    }
  };

  const handleOpenSheet = (sheetId: string) => {
    if (onOpenSheet) {
      const sheet = recentSheets.find(s => s.id === sheetId);
      onOpenSheet(sheetId);
      // Track open activity
      if (sheet) {
        trackActivity(userEmail, 'open', sheetId, sheet.title);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTemplateSelect = (templateData: any) => {
    // Pass the template data to the parent component
    if (onLoadTemplates) {
      onLoadTemplates();
    }
    // Store template data for the spreadsheet to load
    if (templateData && templateData.cells) {
      localStorage.setItem('pendingTemplateData', JSON.stringify(templateData));
    }
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xls,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          
          let data: { [key: string]: string } = {};
          
          if (fileExtension === 'csv') {
            // Parse CSV
            const rows = content.split('\n').map(row => {
              // Handle quoted values with commas
              const cells: string[] = [];
              let current = '';
              let inQuotes = false;
              
              for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  cells.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              cells.push(current.trim());
              return cells;
            });
            
            rows.forEach((row, rowIndex) => {
              row.forEach((cell, colIndex) => {
                const cellKey = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
                data[cellKey] = cell.replace(/^"(.*)"$/, '$1').trim();
              });
            });
          } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            // For XLS/XLSX files, parse as tab-separated or treat as CSV
            const rows = content.split('\n').map(row => row.split(/\t|,/));
            
            rows.forEach((row, rowIndex) => {
              row.forEach((cell, colIndex) => {
                const cellKey = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
                data[cellKey] = cell.trim();
              });
            });
          }
          
          if (onImportFile) {
            onImportFile(data);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-8">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDarkMode(prev => !prev);
          }}
          className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300"
          style={{
            border: "2px solid transparent",
            backgroundImage: `linear-gradient(var(--background), var(--background)), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.backgroundImage = "linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)";
            el.style.animation = "shine 2s linear infinite";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.backgroundImage = `linear-gradient(var(--background), var(--background)), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)`;
            el.style.animation = "";
          }}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" style={{fill: '#FFFFFF', color: '#FFFFFF !important', pointerEvents: 'none'}}>
              <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" style={{fill: '#000000', color: '#000000 !important', pointerEvents: 'none'}}>
              <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Top Right Action Buttons */}
      <div className="fixed top-4 right-4 z-[99998] flex gap-3 items-center">
        {/* Notification Center */}
        <div className="relative" style={{ zIndex: 99998 }}>
          <NotificationCenter userEmail={userEmail} isDarkMode={isDarkMode} />
        </div>

        {/* Profile Menu */}
        <div className="relative" style={{ zIndex: 99998 }}>
          <ProfileMenu
            userName={userName}
            userEmail={userEmail}
            userPhone={userPhone}
            isDarkMode={isDarkMode}
            onOpenSettings={() => onOpenSettings?.()}
            onOpenMySheets={() => {}}
            onOpenCollaboration={() => setCollaborationPanelOpen(true)}
            onLogout={() => onLogout?.()}
          />
        </div>
      </div>

      {/* Old Profile Button - Remove this */}
      <div style={{ display: 'none' }}>
        <button
          className="rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300"
          style={{
            border: "2px solid transparent",
            backgroundImage: `linear-gradient(var(--background), var(--background)), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.backgroundImage = "linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)";
            el.style.animation = "shine 2s linear infinite";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.backgroundImage = `linear-gradient(var(--background), var(--background)), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)`;
            el.style.animation = "";
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" style={{fill: isDarkMode ? '#FFFFFF' : '#000000', color: isDarkMode ? '#FFFFFF !important' : '#000000 !important'}}>
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path>
          </svg>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <img src={logoImage} alt="EtherX Excel" className="w-full h-full object-contain" />
            </div>
          </motion.div>
          <h1 className="text-4xl mb-2">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground text-xl">
            What would you like to work on today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2" style={{borderImage: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%) 1'}}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                  <Plus className="w-6 h-6" style={{color: '#000'}} />
                </div>
                <CardTitle>Blank Spreadsheet</CardTitle>
                <CardDescription>Start with an empty spreadsheet</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onNewSheet} className="w-full">
                  Create New
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2" style={{borderImage: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%) 1'}}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                  <Sparkles className="w-6 h-6" style={{color: '#000'}} />
                </div>
                <CardTitle>Use Templates</CardTitle>
                <CardDescription>Budget, study, workout & more</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setTemplateDialogOpen(true)} className="w-full" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)', color: '#000', fontWeight: 'bold', border: 'none' }}>
                  Browse Templates
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2" style={{borderImage: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%) 1'}}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                  <Upload className="w-6 h-6" style={{color: '#000'}} />
                </div>
                <CardTitle>Import File</CardTitle>
                <CardDescription>Upload CSV file</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleImportFile} className="w-full">
                  Import
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Sheets */}
        {recentSheets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl mb-6 flex items-center gap-2 text-foreground">
              <Clock className="w-6 h-6" />
              Recent Sheets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSheets.map((sheet) => (
                <Card 
                  key={sheet.id} 
                  className="cursor-pointer hover:shadow-lg transition-all group border-2"
                  style={{
                    borderImage: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 50%, #FFFACD 100%) 1'
                  }}
                  onClick={() => handleOpenSheet(sheet.id)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)'}}>
                        <FileSpreadsheet className="w-5 h-5" style={{color: '#000'}} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate text-foreground">{sheet.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {formatDate(sheet.lastModified)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-transparent"
                        onClick={(e) => handleDeleteSheet(e, sheet.id)}
                        title="Delete spreadsheet"
                        style={{ color: isDarkMode ? '#fca5a5' : '#ef4444' }}
                      >
                        <Trash2 
                          className="w-4 h-4" 
                          style={{ 
                            color: isDarkMode ? '#fca5a5' : '#ef4444',
                            stroke: isDarkMode ? '#fca5a5' : '#ef4444',
                            fill: 'none'
                          }} 
                        />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl mb-6">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Advanced Formulas",
              "Conditional Formatting",
              "Charts & Graphs",
              "Export/Import",
              "Auto-Save",
              "Keyboard Shortcuts",
              "Data Validation",
              "Multiple Sheets",
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-lg text-center"
                style={{
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(var(--background), var(--background)), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  color: "var(--foreground)",
                }}
              >
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Template Picker Dialog */}
      <TemplatePickerDialog 
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSelectTemplate={handleTemplateSelect}
        isDarkMode={isDarkMode}
      />

      {/* Collaboration Panel */}
      <CollaborationPanel
        isOpen={collaborationPanelOpen}
        onClose={() => setCollaborationPanelOpen(false)}
        userEmail={userEmail}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
