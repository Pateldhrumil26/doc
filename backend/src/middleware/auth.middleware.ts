import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.js';
import { User, IUser } from '../models/User.js';
import mongoose from 'mongoose';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  userId?: string;
}

const DEFAULT_GUEST_ID = new mongoose.Types.ObjectId('000000000000000000000001');

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = user._id.toString();
          return next();
        }
      } catch (err) {
        // Token invalid/expired - fall through to guest mode seamlessly
      }
    }

    // No token provided or token expired: use guest identifier
    const guestIdHeader = req.headers['x-guest-id'] as string;
    if (guestIdHeader && mongoose.Types.ObjectId.isValid(guestIdHeader)) {
      req.userId = guestIdHeader;
    } else {
      req.userId = DEFAULT_GUEST_ID.toString();
    }

    next();
  } catch (error) {
    req.userId = DEFAULT_GUEST_ID.toString();
    next();
  }
};

