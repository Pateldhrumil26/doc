import { Router } from 'express';
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/letterheadProfile.controller.js';

const router = Router();

router.get('/', getProfiles);
router.post('/', createProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router;
