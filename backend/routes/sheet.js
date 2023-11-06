import { Router } from 'express';
import { getAll, getOne, create } from '../controllers/sheet.js';
const router = Router();

/**
 * get all sheets route
 */
router.get('/', getAll);

/**
 * get one sheet route
 */
router.get('/:id', getOne);

/**
 * create sheet route
 */
router.post('/', create);

export default router;
