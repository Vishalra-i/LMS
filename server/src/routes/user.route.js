import  { Router } from 'express';
import { login, logout, profile, register, resetPassword } from '../controller/user.controller.js';
import isLoggedin from '../middleware/auth.middleware.js';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile').get(isLoggedin,profile);


export default router