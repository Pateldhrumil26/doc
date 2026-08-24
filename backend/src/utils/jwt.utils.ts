import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: Types.ObjectId | string, email: string): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_letterpad_jwt_key_2026_dev_prod';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId: userId.toString(), email }, secret, {
    expiresIn: expiresIn as any,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'super_secret_letterpad_jwt_key_2026_dev_prod';
  return jwt.verify(token, secret) as TokenPayload;
};
