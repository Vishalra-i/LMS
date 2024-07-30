import { Router } from 'express';
import {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayments,
} from '../controller/payment.controller.js';
import isLoggedin, { authorizeRoles, authorizeSubscribers } from '../middleware/auth.middleware.js';


const router = Router();

router.route('/subscribe').post(isLoggedin, buySubscription);
router.route('/verify').post(isLoggedin, verifySubscription);
router
  .route('/unsubscribe')
  .post(isLoggedin, authorizeSubscribers, cancelSubscription);
router.route('/razorpay-key').get(isLoggedin, getRazorpayApiKey);
router.route('/').get(isLoggedin, authorizeRoles('ADMIN'), allPayments);

export default router;