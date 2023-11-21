import { Router } from 'express';
import { create, getAllForUser, getOne, updateName, updateData, remove } from '../controllers/sheet.js';
const router = Router();

/**
 * Route to get all sheets from a user
 */
router.get('/', getAllForUser);

/**
 * Route to get one sheet
 */
router.get('/:id', getOne);

/**
 * Route to create sheet
 */
router.post('/', create);

/**
 * Route to update name's sheet
 */
router.put('/name/:id', updateName);

/**
 * Route to update data's sheet
 */
router.put('/data/:id', updateData);

/**
 * Route to delete sheet
 */
router.delete('/:id', remove);

export default router;
