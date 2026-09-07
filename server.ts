import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SERVER_CONFIG } from './server/config.js';
import { authenticate } from './server/middleware/auth.js';
import { authRouter } from './server/routes/auth.js';
import { tenantsRouter } from './server/routes/tenants.js';
import { eventsRouter } from './server/routes/events.js';
import { activitiesRouter } from './server/routes/activities.js';
import { galleryRouter } from './server/routes/gallery.js';
import { achievementsRouter } from './server/routes/achievements.js';
import { reportsRouter } from './server/routes/reports.js';
import { teamRouter } from './server/routes/team.js';
import { volunteersRouter } from './server/routes/volunteers.js';
import { contactRouter } from './server/routes/contact.js';
import { uploadsRouter } from './server/routes/uploads.js';
import { auditRouter } from './server/routes/audit.js';
import { searchRouter } from './server/routes/search.js';
import { analyticsRouter } from './server/routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = SERVER_CONFIG.port || 3000;

  // Basic Security & CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Serve local uploads folder statically
  const uploadsPath = path.join(__dirname, 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Global Authentication Middleware (attaches user & tenant to req)
  app.use('/api', authenticate);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'NSS SaaS Unit Portal Backend',
      timestamp: new Date().toISOString(),
      googleConnected: Boolean(SERVER_CONFIG.google.sheetsDatabaseId && SERVER_CONFIG.google.clientEmail),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/tenant', tenantsRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/activities', activitiesRouter);
  app.use('/api/gallery', galleryRouter);
  app.use('/api/achievements', achievementsRouter);
  app.use('/api/reports', reportsRouter);
  app.use('/api/team', teamRouter);
  app.use('/api/volunteers', volunteersRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/uploads', uploadsRouter);
  app.use('/api/audit', auditRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/analytics', analyticsRouter);

  // Global Error Handler for API
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[API Error]:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, SERVER_CONFIG.host, () => {
    console.log(`[NSS SaaS Portal] Server running on http://${SERVER_CONFIG.host}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
