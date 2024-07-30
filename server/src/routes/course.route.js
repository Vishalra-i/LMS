import { Router } from 'express';
import {
  addLectureToCourseById,
  createCourse,
  deleteCourseById,
  getAllCourses,
  getLecturesByCourseId,
  removeLectureFromCourse,
  updateCourseById,
} from '../controller/courses.controller.js';

import upload from '../middleware/multer.middleware.js';
import isLoggedin, { authorizeRoles, authorizeSubscribers } from '../middleware/auth.middleware.js';

const router = Router();

router
  .route('/')
  .get(getAllCourses)
  .post(
    isLoggedin,
    authorizeRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
  )

router.route('/:courseId/lectures/:lectureId') // Change to use parameters
  .delete(isLoggedin, authorizeRoles('ADMIN'), removeLectureFromCourse);
  
router
  .route('/:id')
  .get(isLoggedin, authorizeSubscribers, getLecturesByCourseId) // Added authorizeSubscribers to check if user is admin or subscribed if not then forbid the access to the lectures
  .post(
    isLoggedin,
    authorizeRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById
  )
  .put(isLoggedin, authorizeRoles('ADMIN'), updateCourseById);

export default router;