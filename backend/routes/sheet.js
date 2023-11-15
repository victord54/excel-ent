import { Router } from 'express';
import { getAll, getOne, create, update } from '../controllers/sheet.js';
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

/**
 * update sheet route
 */
router.put('/:id', update);

export default router;
