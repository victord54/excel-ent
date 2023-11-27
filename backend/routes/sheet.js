import { Router } from 'express';
import {
    getAllFromUser,
    getOne,
    create,
    update,
} from '../controllers/sheet.js';
const router = Router();

/**
 * get all sheets route
 */
router.get('/', getAllFromUser);

/**
 * get one sheet route
 */
router.get('/getOne', getOne);

/**
 * create sheet route
 */
router.post('/', create);

/**
 * update sheet route
 */
router.put('/:id', update);

export default router;
