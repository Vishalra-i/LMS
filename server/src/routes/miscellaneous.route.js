import { Router } from 'express';
import isLoggedin, { authorizeRoles } from '../middleware/auth.middleware.js';
import { contactUs, userStats } from '../controller/miscellaneous.controller.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedin, authorizeRoles('ADMIN'), userStats);

export default router;