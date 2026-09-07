import dotenv from 'dotenv';
dotenv.config();

export const SERVER_CONFIG = {
  port: 3000,
  host: '0.0.0.0',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'nss_dev_jwt_secret_change_in_production_32chars!',
  sessionSecret: process.env.SESSION_SECRET || 'nss_session_secret_change_in_production!',
  defaultCollegeId: process.env.DEFAULT_COLLEGE_ID || 'unit-04-05',
  adminVerificationCode: process.env.ADMIN_VERIFICATION_CODE || 'NSS-7749-SECURE',
  
  // Google Cloud Service Account & Workspace Integration
  google: {
    projectId: process.env.GOOGLE_PROJECT_ID || '',
    clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    driveRootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '',
    sheetsDatabaseId: process.env.GOOGLE_SHEETS_DATABASE_ID || '',
  },

  // Cache configuration
  cacheTtlMs: 60 * 1000, // 60 seconds TTL for read caching
  maxUploadSizeBytes: 15 * 1024 * 1024, // 15MB max file upload
};

export const hasGoogleCredentials = Boolean(
  SERVER_CONFIG.google.clientEmail &&
  SERVER_CONFIG.google.privateKey &&
  SERVER_CONFIG.google.sheetsDatabaseId
);
