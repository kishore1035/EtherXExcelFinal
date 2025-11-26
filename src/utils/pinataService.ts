import axios from 'axios';

// Pinata API configuration - Access Vite env variables correctly
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || 'your_pinata_api_key';
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || 'your_pinata_secret_key';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || 'your_pinata_jwt';

console.log('Pinata Config:', {
  apiKey: PINATA_API_KEY?.substring(0, 10) + '...',
  jwtLength: PINATA_JWT?.length,
  jwtStart: PINATA_JWT?.substring(0, 20) + '...'
});

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

// Upload JSON data to IPFS via Pinata
export const uploadToIPFS = async (data: any, filename: string): Promise<PinataResponse> => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: data,
        pinataMetadata: {
          name: filename,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

// Retrieve data from IPFS
export const getFromIPFS = async (hash: string): Promise<any> => {
  try {
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
};

// Save user credentials to IPFS
export const saveUserCredentials = async (email: string, password: string): Promise<string> => {
  const credentials = {
    email,
    password, // In production, this should be hashed!
    createdAt: new Date().toISOString(),
  };
  const result = await uploadToIPFS(credentials, `user_${email}`);
  return result.IpfsHash;
};

// Save spreadsheet data to IPFS
export const saveSpreadsheetToIPFS = async (cellData: any, metadata?: any): Promise<string> => {
  const spreadsheetData = {
    cellData,
    metadata: {
      ...metadata,
      savedAt: new Date().toISOString(),
      version: '1.0',
    },
  };
  const result = await uploadToIPFS(spreadsheetData, `spreadsheet_${Date.now()}`);
  return result.IpfsHash;
};

// Load spreadsheet data from IPFS
export const loadSpreadsheetFromIPFS = async (hash: string): Promise<any> => {
  const data = await getFromIPFS(hash);
  return data;
};

// Save user's IPFS hashes mapping (to track their data)
export const saveUserDataMapping = async (email: string, mappings: any): Promise<string> => {
  const userMapping = {
    email,
    mappings,
    lastUpdated: new Date().toISOString(),
  };
  const result = await uploadToIPFS(userMapping, `user_mapping_${email}`);
  return result.IpfsHash;
};

// Get user's latest data mapping
export const getUserDataMapping = async (hash: string): Promise<any> => {
  return await getFromIPFS(hash);
};

// Auto-save functionality with IPFS
export const autoSaveToIPFS = async (data: any, type: 'spreadsheet' | 'credentials' | 'settings'): Promise<string> => {
  const timestamp = Date.now();
  const result = await uploadToIPFS(
    {
      type,
      data,
      timestamp,
      autoSaved: true,
    },
    `autosave_${type}_${timestamp}`
  );
  return result.IpfsHash;
};
