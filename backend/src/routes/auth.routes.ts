import { Router } from 'express';
import { getMe, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
