import { Router } from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  deleteTemplate,
} from '../controllers/template.controller.js';

const router = Router();

router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.post('/', createTemplate);
router.delete('/:id', deleteTemplate);

export default router;
