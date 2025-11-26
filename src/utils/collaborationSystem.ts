// Collaboration System for sharing spreadsheets and tracking active users

export interface CollaborationLink {
  linkId: string;
  spreadsheetId: string;
  spreadsheetTitle: string;
  ownerEmail: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ActiveCollaborator {
  email: string;
  name: string;
  joinedAt: string;
  lastActive: string;
  isActive: boolean;
}

const COLLABORATION_LINKS_KEY = 'collaboration_links_';
const ACTIVE_COLLABORATORS_KEY = 'active_collaborators_';
const COLLABORATION_ACCESS_KEY = 'collaboration_access_';

/**
 * Generate a unique collaboration link ID
 */
export function generateLinkId(): string {
  return `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a shareable collaboration link
 */
export function createCollaborationLink(
  spreadsheetId: string,
  spreadsheetTitle: string,
  ownerEmail: string
): CollaborationLink {
  const linkId = generateLinkId();
  const link: CollaborationLink = {
    linkId,
    spreadsheetId,
    spreadsheetTitle,
    ownerEmail,
    createdAt: new Date().toISOString(),
  };

  // Save the link
  localStorage.setItem(
    `${COLLABORATION_LINKS_KEY}${linkId}`,
    JSON.stringify(link)
  );

  // Add to owner's links list
  const ownerLinks = getOwnerLinks(ownerEmail);
  ownerLinks.push(linkId);
  localStorage.setItem(`owner_links_${ownerEmail}`, JSON.stringify(ownerLinks));

  return link;
}

/**
 * Get collaboration link by ID
 */
export function getCollaborationLink(linkId: string): CollaborationLink | null {
  const data = localStorage.getItem(`${COLLABORATION_LINKS_KEY}${linkId}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Get all links owned by a user
 */
export function getOwnerLinks(ownerEmail: string): string[] {
  const data = localStorage.getItem(`owner_links_${ownerEmail}`);
  return data ? JSON.parse(data) : [];
}

/**
 * Add a collaborator to a spreadsheet
 */
export function addCollaborator(
  linkId: string,
  userEmail: string,
  userName: string
): boolean {
  const link = getCollaborationLink(linkId);
  if (!link) return false;

  const collaborator: ActiveCollaborator = {
    email: userEmail,
    name: userName,
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    isActive: true,
  };

  // Get existing collaborators
  const collaborators = getActiveCollaborators(link.spreadsheetId);
  
  // Check if user already exists
  const existingIndex = collaborators.findIndex(c => c.email === userEmail);
  if (existingIndex >= 0) {
    // Update existing collaborator
    collaborators[existingIndex] = {
      ...collaborators[existingIndex],
      lastActive: new Date().toISOString(),
      isActive: true,
    };
  } else {
    // Add new collaborator
    collaborators.push(collaborator);
  }

  // Save collaborators
  localStorage.setItem(
    `${ACTIVE_COLLABORATORS_KEY}${link.spreadsheetId}`,
    JSON.stringify(collaborators)
  );

  // Track access for the user
  const userAccess = getUserCollaborations(userEmail);
  if (!userAccess.includes(link.spreadsheetId)) {
    userAccess.push(link.spreadsheetId);
    localStorage.setItem(
      `${COLLABORATION_ACCESS_KEY}${userEmail}`,
      JSON.stringify(userAccess)
    );
  }

  // Notify owner
  notifyOwnerOfNewCollaborator(link.ownerEmail, userName, link.spreadsheetTitle);

  return true;
}

/**
 * Get all active collaborators for a spreadsheet
 */
export function getActiveCollaborators(spreadsheetId: string): ActiveCollaborator[] {
  const data = localStorage.getItem(`${ACTIVE_COLLABORATORS_KEY}${spreadsheetId}`);
  if (!data) return [];

  const collaborators: ActiveCollaborator[] = JSON.parse(data);
  
  // Update active status based on last activity (active if within last 5 minutes)
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  return collaborators.map(collab => ({
    ...collab,
    isActive: now - new Date(collab.lastActive).getTime() < fiveMinutes,
  }));
}

/**
 * Update collaborator activity timestamp
 */
export function updateCollaboratorActivity(
  spreadsheetId: string,
  userEmail: string
): void {
  const collaborators = getActiveCollaborators(spreadsheetId);
  const collaborator = collaborators.find(c => c.email === userEmail);
  
  if (collaborator) {
    collaborator.lastActive = new Date().toISOString();
    collaborator.isActive = true;
    
    localStorage.setItem(
      `${ACTIVE_COLLABORATORS_KEY}${spreadsheetId}`,
      JSON.stringify(collaborators)
    );
  }
}

/**
 * Remove a collaborator from a spreadsheet
 */
export function removeCollaborator(
  spreadsheetId: string,
  userEmail: string
): void {
  const collaborators = getActiveCollaborators(spreadsheetId);
  const filtered = collaborators.filter(c => c.email !== userEmail);
  
  localStorage.setItem(
    `${ACTIVE_COLLABORATORS_KEY}${spreadsheetId}`,
    JSON.stringify(filtered)
  );
}

/**
 * Get spreadsheets a user has access to via collaboration
 */
export function getUserCollaborations(userEmail: string): string[] {
  const data = localStorage.getItem(`${COLLABORATION_ACCESS_KEY}${userEmail}`);
  return data ? JSON.parse(data) : [];
}

/**
 * Notify owner of new collaborator
 */
function notifyOwnerOfNewCollaborator(
  ownerEmail: string,
  collaboratorName: string,
  spreadsheetTitle: string
): void {
  const { trackActivity } = require('./notificationSystem');
  trackActivity(
    ownerEmail,
    'collaboration_joined',
    undefined,
    `${collaboratorName} joined "${spreadsheetTitle}"`
  );
}

/**
 * Get collaboration link URL
 */
export function getCollaborationLinkUrl(linkId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}?collab=${linkId}`;
}

/**
 * Parse collaboration link from URL
 */
export function parseCollaborationLink(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('collab');
}

/**
 * Check if user owns the spreadsheet
 */
export function isSpreadsheetOwner(
  spreadsheetId: string,
  userEmail: string
): boolean {
  const ownerLinks = getOwnerLinks(userEmail);
  return ownerLinks.some(linkId => {
    const link = getCollaborationLink(linkId);
    return link?.spreadsheetId === spreadsheetId;
  });
}
