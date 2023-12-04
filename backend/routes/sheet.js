import { Router } from 'express';
import {
    create,
    getAllForUser,
    getOne,
    updateName,
    updateData,
    remove,
    getCells,
    addSharing,
    removeSharing,
    createLink,
    checkAccess,
    // search
} from '../controllers/sheet.js';
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
 * Route to get all cells from a sheet
 */
router.get('/data/:id', getCells);

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

router.post('/share/:id', addSharing);

router.delete('/share/:id', removeSharing);

router.post('/invite/:id', createLink);

router.get('/check/:id', checkAccess);

// router.get('/search/:keywords', search);

export default router;
