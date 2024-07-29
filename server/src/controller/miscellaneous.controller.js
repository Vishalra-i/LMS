import asyncHandler from '../utils/asynchandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../model/User.model.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @CONTACT_US
 * @ROUTE @POST {{URL}}/api/v1/contact
 * @ACCESS Public
 */
export const contactUs = asyncHandler(async (req, res, next) => {
  // Destructuring the required data from req.body
  const { name, email, message } = req.body;

  // Checking if values are valid
  if (!name || !email || !message) {
    throw new ApiError(402,'Name, Email, Message are required')
  }

    const subject = 'Contact Us Form';
    const textMessage = `${name} - ${email} <br /> ${message}`;
    // Await the send email
    await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
 

  res.status(200).json({
    success: true,
    message: 'Your request has been submitted successfully',
  });
});

/**
 * @USER_STATS_ADMIN
 * @ROUTE @GET {{URL}}/api/v1/admin/stats/users
 * @ACCESS Private(ADMIN ONLY)
 */
export const userStats = asyncHandler(async (req, res, next) => {
  const allUsersCount = await User.countDocuments();

  const subscribedUsersCount = await User.countDocuments({
    'subscription.status': 'active', // subscription.status means we are going inside an object and we have to put this in quotes
  });

  res.status(200).json({
    success: true,
    message: 'All registered users count',
    allUsersCount,
    subscribedUsersCount,
  });
});