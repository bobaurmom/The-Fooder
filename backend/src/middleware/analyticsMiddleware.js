import { adminService } from '../services/adminService.js';
import crypto from 'crypto';

export async function trackAnalytics(req, res, next) {
  // Skip tracking for admin routes and health checks
  if (req.path.startsWith('/api/admin') || req.path === '/api/health') {
    return next();
  }

  // Generate or retrieve visitor ID from cookie
  let visitorId = req.cookies?.visitor_id;
  
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    res.cookie('visitor_id', visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    });
  }

  // Track page view asynchronously (don't block the request)
  const pagePath = req.path || '/';
  
  // Use setImmediate to track without blocking
  setImmediate(async () => {
    try {
      await adminService.trackPageView(pagePath, visitorId);
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw error - analytics shouldn't break the app
    }
  });

  next();
}
