import { uploadToIPFS, getFromIPFS } from './pinataService';

export interface SpreadsheetState {
  cellData: { [key: string]: string };
  cellFormats: { [key: string]: any };
  cellValidations: { [key: string]: any };
  floatingImages: any[];
  floatingShapes: any[];
  floatingCharts: any[];
  floatingTextBoxes: any[];
  metadata: {
    name: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

// Save complete spreadsheet state to IPFS
export const saveSpreadsheetState = async (
  state: Partial<SpreadsheetState>,
  userEmail: string,
  spreadsheetName: string = 'Untitled'
): Promise<string> => {
  const completeState: SpreadsheetState = {
    cellData: state.cellData || {},
    cellFormats: state.cellFormats || {},
    cellValidations: state.cellValidations || {},
    floatingImages: state.floatingImages || [],
    floatingShapes: state.floatingShapes || [],
    floatingCharts: state.floatingCharts || [],
    floatingTextBoxes: state.floatingTextBoxes || [],
    metadata: {
      name: spreadsheetName,
      owner: userEmail,
      createdAt: state.metadata?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
    },
  };

  try {
    const result = await uploadToIPFS(completeState, `spreadsheet_${spreadsheetName}_${Date.now()}`);
    
    // Store the hash in localStorage for quick access
    const savedSheets = JSON.parse(localStorage.getItem(`sheets_${userEmail}`) || '[]');
    savedSheets.unshift({
      name: spreadsheetName,
      hash: result.IpfsHash,
      savedAt: new Date().toISOString(),
    });
    
    // Keep only last 10 saves
    if (savedSheets.length > 10) {
      savedSheets.pop();
    }
    
    localStorage.setItem(`sheets_${userEmail}`, JSON.stringify(savedSheets));
    
    return result.IpfsHash;
  } catch (error) {
    console.error('Error saving spreadsheet to IPFS:', error);
    // Fallback to localStorage
    const fallbackKey = `spreadsheet_${userEmail}_${Date.now()}`;
    localStorage.setItem(fallbackKey, JSON.stringify(completeState));
    return fallbackKey;
  }
};

// Load spreadsheet state from IPFS
export const loadSpreadsheetState = async (hash: string): Promise<SpreadsheetState | null> => {
  try {
    // Check if it's an IPFS hash or localStorage key
    if (hash.startsWith('spreadsheet_')) {
      const localData = localStorage.getItem(hash);
      return localData ? JSON.parse(localData) : null;
    }
    
    const data = await getFromIPFS(hash);
    return data as SpreadsheetState;
  } catch (error) {
    console.error('Error loading spreadsheet from IPFS:', error);
    return null;
  }
};

// Auto-save functionality (called periodically)
export const autoSaveSpreadsheet = async (
  state: Partial<SpreadsheetState>,
  userEmail: string,
  spreadsheetName: string = 'Untitled'
): Promise<void> => {
  try {
    const hash = await saveSpreadsheetState(state, userEmail, `${spreadsheetName}_autosave`);
    localStorage.setItem(`autosave_${userEmail}_latest`, hash);
    console.log('Auto-saved to IPFS:', hash);
  } catch (error) {
    console.error('Auto-save failed:', error);
  }
};

// Get user's saved spreadsheets list
export const getUserSpreadsheets = (userEmail: string): Array<{ name: string; hash: string; savedAt: string }> => {
  const savedSheets = localStorage.getItem(`sheets_${userEmail}`);
  return savedSheets ? JSON.parse(savedSheets) : [];
};

// Export spreadsheet data for CSV/PDF
export const prepareExportData = (state: Partial<SpreadsheetState>) => {
  return {
    cellData: state.cellData || {},
    cellFormats: state.cellFormats || {},
    metadata: state.metadata || {},
  };
};
