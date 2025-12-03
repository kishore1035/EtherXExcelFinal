// Spreadsheet Storage Utility for managing user spreadsheets

export interface SpreadsheetData {
  id: string;
  title: string;
  userEmail: string;
  cellData: Record<string, any>;
  cellFormats?: Record<string, any>;
  lastModified: string;
  created: string;
}

const STORAGE_KEY_PREFIX = 'spreadsheet_';
const RECENT_SHEETS_KEY = 'recent_sheets_';

/**
 * Generate a unique ID for a spreadsheet
 */
export function generateSpreadsheetId(): string {
  return `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save a spreadsheet to localStorage
 */
export function saveSpreadsheet(
  spreadsheetData: Omit<SpreadsheetData, 'lastModified'>,
): SpreadsheetData {
  const data: SpreadsheetData = {
    ...spreadsheetData,
    lastModified: new Date().toISOString(),
  };

  // Save the spreadsheet
  localStorage.setItem(
    `${STORAGE_KEY_PREFIX}${data.id}`,
    JSON.stringify(data)
  );

  // Update recent sheets list
  updateRecentSheets(data.userEmail, data.id);

  return data;
}

/**
 * Load a spreadsheet from localStorage
 */
export function loadSpreadsheet(id: string): SpreadsheetData | null {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse spreadsheet data:', error);
    return null;
  }
}

/**
 * Get all recent sheets for a user
 */
export function getRecentSheets(userEmail: string): SpreadsheetData[] {
  const recentIds = getRecentSheetIds(userEmail);
  const sheets: SpreadsheetData[] = [];

  for (const id of recentIds) {
    const sheet = loadSpreadsheet(id);
    if (sheet) {
      sheets.push(sheet);
    }
  }

  // Sort by last modified (most recent first)
  return sheets.sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

/**
 * Get recent sheet IDs for a user
 */
function getRecentSheetIds(userEmail: string): string[] {
  const data = localStorage.getItem(`${RECENT_SHEETS_KEY}${userEmail}`);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

/**
 * Update the recent sheets list for a user
 */
function updateRecentSheets(userEmail: string, sheetId: string): void {
  let recentIds = getRecentSheetIds(userEmail);
  
  // Remove the sheet if it already exists
  recentIds = recentIds.filter(id => id !== sheetId);
  
  // Add to the beginning
  recentIds.unshift(sheetId);
  
  // Keep only the last 10
  recentIds = recentIds.slice(0, 10);
  
  localStorage.setItem(
    `${RECENT_SHEETS_KEY}${userEmail}`,
    JSON.stringify(recentIds)
  );
}

/**
 * Delete a spreadsheet
 */
export function deleteSpreadsheet(id: string, userEmail: string): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
  
  // Remove from recent sheets
  let recentIds = getRecentSheetIds(userEmail);
  recentIds = recentIds.filter(sheetId => sheetId !== id);
  localStorage.setItem(
    `${RECENT_SHEETS_KEY}${userEmail}`,
    JSON.stringify(recentIds)
  );
}

/**
 * Get the last active spreadsheet for a user (for auto-restore)
 */
export function getLastActiveSpreadsheet(userEmail: string): SpreadsheetData | null {
  const recentSheets = getRecentSheets(userEmail);
  return recentSheets.length > 0 ? recentSheets[0] : null;
}

/**
 * Clear any cached data for a new blank spreadsheet
 */
export function clearNewSpreadsheetCache(id: string): void {
  // Remove any existing cache for this ID
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
}

/**
 * Auto-save current spreadsheet (called periodically)
 * Skip saving if the sheet is completely empty (new blank sheet)
 */
export function autoSaveSpreadsheet(
  id: string,
  title: string,
  userEmail: string,
  cellData: Record<string, any>,
  cellFormats?: Record<string, any>
): void {
  // Don't save completely empty sheets titled "Untitled"
  const hasData = cellData && Object.keys(cellData).length > 0;
  const hasFormats = cellFormats && Object.keys(cellFormats).length > 0;
  
  if (!hasData && !hasFormats && title === "Untitled") {
    // This is a new blank sheet, don't save yet
    return;
  }
  
  const existing = loadSpreadsheet(id);
  
  const data: Omit<SpreadsheetData, 'lastModified'> = {
    id,
    title,
    userEmail,
    cellData: cellData || {},
    cellFormats: cellFormats || {},
    created: existing?.created || new Date().toISOString(),
  };

  saveSpreadsheet(data);
}

/**
 * Format date for display
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
