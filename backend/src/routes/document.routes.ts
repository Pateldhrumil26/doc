import { Router } from 'express';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  duplicateDocument,
  renameDocument,
} from '../controllers/document.controller.js';

const router = Router();

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

router.post('/:id/duplicate', duplicateDocument);
router.put('/:id/rename', renameDocument);

export default router;
