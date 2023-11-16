import { Router } from 'express';
import { editPassword, editProfile } from '../controllers/profile.js';
const router = Router();

/**
 * Edit Profile route
 */
router.put('/editprofile', editProfile);

/**
 * Edit Password route
 */
router.put('/editpassword', editPassword);

export default router;
