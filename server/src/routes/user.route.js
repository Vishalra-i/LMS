import  { Router } from 'express';
import { login, logout, profile, register, resetPassword , forgotpassword ,updateUser} from '../controller/user.controller.js';
import isLoggedin from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js' ;

const router = Router();

router.route('/register').post(
    upload.single('avatar'),
    register
);

router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile').get(isLoggedin,profile);
router.route('/forgot-password').post(forgotpassword);
router.route('/reset/:resetToken').post(resetPassword);
router.put("/update/:id", isLoggedin, upload.single("avatar"), updateUser);


export default router