import { Router } from 'express';
import { login, signup } from '../controllers/auth.js';
const router = Router();

/**
 * Login route
 */
router.post('/login', login);

/**
 * Signup route
 */
router.post('/signup', signup);

export default router;
