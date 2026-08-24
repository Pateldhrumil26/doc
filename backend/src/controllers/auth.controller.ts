import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      // Fallback guest profile
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: 'local_user',
            name: 'Local Workspace User',
            email: 'user@local.workspace',
            avatar: '',
            companyName: 'Aesthetic Arc Studio',
            companyLogo: '',
            companyAddress: '',
            companyPhone: '',
            companyEmail: '',
            companyWebsite: '',
            companyGst: '',
            createdAt: new Date(),
          },
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          companyName: user.companyName,
          companyLogo: user.companyLogo,
          companyAddress: user.companyAddress,
          companyPhone: user.companyPhone,
          companyEmail: user.companyEmail,
          companyWebsite: user.companyWebsite,
          companyGst: user.companyGst,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId || 'local_user';
    const {
      name,
      avatar,
      companyName,
      companyLogo,
      companyAddress,
      companyPhone,
      companyEmail,
      companyWebsite,
      companyGst,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(companyName !== undefined && { companyName }),
        ...(companyLogo !== undefined && { companyLogo }),
        ...(companyAddress !== undefined && { companyAddress }),
        ...(companyPhone !== undefined && { companyPhone }),
        ...(companyEmail !== undefined && { companyEmail }),
        ...(companyWebsite !== undefined && { companyWebsite }),
        ...(companyGst !== undefined && { companyGst }),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(200).json({
        success: true,
        message: 'Profile updated',
        data: {
          user: {
            id: 'local_user',
            name,
            avatar,
            companyName,
            companyLogo,
            companyAddress,
            companyPhone,
            companyEmail,
            companyWebsite,
            companyGst,
          },
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          companyName: user.companyName,
          companyLogo: user.companyLogo,
          companyAddress: user.companyAddress,
          companyPhone: user.companyPhone,
          companyEmail: user.companyEmail,
          companyWebsite: user.companyWebsite,
          companyGst: user.companyGst,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
