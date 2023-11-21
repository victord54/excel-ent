import { Router } from 'express';
import { editPassword, editProfile, fetchData } from '../controllers/profile.js';
const router = Router();


router.get('/', fetchData);

/**
 * Edit Profile route
 */
router.put('/editprofile', editProfile);

/**
 * Edit Password route
 */
router.put('/editpassword', editPassword);

export default router;
