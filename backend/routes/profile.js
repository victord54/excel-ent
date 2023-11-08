import { Router } from 'express';
import { editProfile } from '../controllers/profile.js';
const router = Router();

/**
 * Login route
 */
router.put('/editprofile', editProfile);

/**
 * 
 */

export default router;
