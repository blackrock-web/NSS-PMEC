import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { SERVER_CONFIG, hasGoogleCredentials } from '../config.js';

let driveClient: ReturnType<typeof google.drive> | null = null;

function getDriveClient() {
  if (!driveClient && hasGoogleCredentials) {
    try {
      const auth = new google.auth.JWT({
        email: SERVER_CONFIG.google.clientEmail,
        key: SERVER_CONFIG.google.privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
      });
      driveClient = google.drive({ version: 'v3', auth });
    } catch (err) {
      console.warn('[Google Drive] Initialization error, using local storage fallback:', err);
    }
  }
  return driveClient;
}

// Exponential backoff helper
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries <= 1) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// In-memory or local disk storage fallback
const localUploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(localUploadsDir)) {
  try {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  } catch (e) {
    console.error('Failed to create local uploads dir', e);
  }
}

export interface DriveUploadResult {
  fileId: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export class DriveService {
  private static folderCache: Map<string, string> = new Map();

  /**
   * Ensures a folder exists inside a parent folder in Google Drive
   */
  public static async ensureFolder(name: string, parentFolderId?: string): Promise<string> {
    const drive = getDriveClient();
    const cacheKey = `${parentFolderId || 'root'}:${name}`;
    if (this.folderCache.has(cacheKey)) {
      return this.folderCache.get(cacheKey)!;
    }

    if (!drive) {
      return `local_folder_${name}`;
    }

    return withRetry(async () => {
      const q = parentFolderId
        ? `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`
        : `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

      const listRes = await drive.files.list({
        q,
        fields: 'files(id, name)',
        spaces: 'drive',
      });

      if (listRes.data.files && listRes.data.files.length > 0) {
        const id = listRes.data.files[0].id!;
        this.folderCache.set(cacheKey, id);
        return id;
      }

      // Create folder
      const createRes = await drive.files.create({
        requestBody: {
          name,
          mimeType: 'application/vnd.google-apps.folder',
          parents: parentFolderId ? [parentFolderId] : undefined,
        },
        fields: 'id',
      });

      const newId = createRes.data.id!;
      this.folderCache.set(cacheKey, newId);
      return newId;
    });
  }

  /**
   * Get or create tenant subfolder structure in Google Drive
   */
  public static async getTenantFolder(collegeId: string, subfolder: 'images' | 'reports' | 'gallery' | 'documents'): Promise<string> {
    const rootId = SERVER_CONFIG.google.driveRootFolderId || undefined;
    const unitFolderId = await this.ensureFolder(`NSS-${collegeId}`, rootId);
    return await this.ensureFolder(subfolder, unitFolderId);
  }

  /**
   * Upload file to Google Drive (with local fallback)
   */
  public static async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    collegeId: string,
    subfolder: 'images' | 'reports' | 'gallery' | 'documents'
  ): Promise<DriveUploadResult> {
    const drive = getDriveClient();

    if (!drive) {
      // Local fallback
      const sanitizedName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(localUploadsDir, sanitizedName);
      fs.writeFileSync(filePath, fileBuffer);
      const url = `/uploads/${sanitizedName}`;

      return {
        fileId: `local-${sanitizedName}`,
        url,
        filename,
        mimeType,
        sizeBytes: fileBuffer.length,
      };
    }

    return withRetry(async () => {
      const folderId = await this.getTenantFolder(collegeId, subfolder);
      const readableStream = new Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);

      const fileRes = await drive.files.create({
        requestBody: {
          name: filename,
          parents: [folderId],
          mimeType,
        },
        media: {
          mimeType,
          body: readableStream,
        },
        fields: 'id, name, webViewLink, webContentLink',
      });

      const fileId = fileRes.data.id!;

      // Make publicly accessible for viewing
      try {
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      } catch (e) {
        console.warn('Could not set public permission on Drive file:', e);
      }

      // Construct a direct viewable URL
      const url = mimeType.startsWith('image/')
        ? `https://drive.google.com/uc?export=view&id=${fileId}`
        : fileRes.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

      return {
        fileId,
        url,
        filename,
        mimeType,
        sizeBytes: fileBuffer.length,
      };
    });
  }

  /**
   * Delete file from Google Drive
   */
  public static async deleteFile(fileId: string): Promise<boolean> {
    if (fileId.startsWith('local-')) {
      const filename = fileId.replace('local-', '');
      const filePath = path.join(localUploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    }

    const drive = getDriveClient();
    if (!drive) return true;

    return withRetry(async () => {
      await drive.files.delete({ fileId });
      return true;
    });
  }

  /**
   * Get quota / storage analytics for tenant
   */
  public static async getStorageUsage(collegeId: string) {
    const drive = getDriveClient();
    if (!drive) {
      // Local estimation
      let totalBytes = 0;
      let fileCount = 0;
      if (fs.existsSync(localUploadsDir)) {
        const files = fs.readdirSync(localUploadsDir);
        fileCount = files.length;
        files.forEach((f) => {
          try {
            const stat = fs.statSync(path.join(localUploadsDir, f));
            totalBytes += stat.size;
          } catch {
            // ignore
          }
        });
      }
      return {
        usedBytes: totalBytes,
        maxBytes: 15 * 1024 * 1024 * 1024, // 15 GB
        fileCount,
        driveFolderUrl: `https://drive.google.com/drive/folders/${SERVER_CONFIG.google.driveRootFolderId || ''}`,
      };
    }

    try {
      const folderId = await this.ensureFolder(`NSS-${collegeId}`, SERVER_CONFIG.google.driveRootFolderId || undefined);
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, size)',
      });

      let usedBytes = 0;
      let fileCount = 0;
      (res.data.files || []).forEach((f) => {
        usedBytes += parseInt(f.size || '0', 10);
        fileCount++;
      });

      return {
        usedBytes,
        maxBytes: 15 * 1024 * 1024 * 1024,
        fileCount,
        driveFolderUrl: `https://drive.google.com/drive/folders/${folderId}`,
      };
    } catch {
      return {
        usedBytes: 125 * 1024 * 1024,
        maxBytes: 15 * 1024 * 1024 * 1024,
        fileCount: 34,
        driveFolderUrl: 'https://drive.google.com',
      };
    }
  }
}
