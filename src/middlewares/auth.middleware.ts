import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
  };
}

export function authMiddleware(allowedUsername: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const username = token.trim();

    if (username !== allowedUsername) {
      res.status(403).json({ error: 'Forbidden. Access denied.' });
      return;
    }
    next(); // Allow request
  };
}
