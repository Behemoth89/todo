import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AccessTokenPayload } from '../services/token';

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies.accessToken;

  if (!token) {
    req.user = undefined;
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
  } catch {
    req.user = undefined;
  }

  next();
}