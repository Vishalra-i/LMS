import asyncHandler from '../utils/asynchandler.js';
import Course from '../model/courses.model.js';
import { ApiError } from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { deleteOnCloudnary, uploadOnCloudinary } from '../utils/cloudinary.js';

/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */
export const getAllCourses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 courses per page
  const skip = (page - 1) * limit;

  const courses = await Course.find({})
    .select('-lectures')
    .skip(skip)
    .limit(limit);

  const totalCourses = await Course.countDocuments();

  res.status(200).json(
    new ApiResponse(200, { courses, totalPages: Math.ceil(totalCourses / limit), currentPage: page }, 'Courses fetched successfully')
  );
    
});

/**
 * @CREATE_COURSE
 * @ROUTE @POST {{URL}}/api/v1/courses
 * @ACCESS Private (admin only)
 */
export const createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    throw new ApiError(400, 'All fields are required');
  }

  

  const course = await Course.create({ title, description, category, createdBy });

  if (!course) {
    throw new ApiError(400, 'Course could not be created, please try again');
  }

  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.path);
      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }
    } catch (error) {
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      throw new ApiError(400, 'File not uploaded, please try again');
    }
  }

  await course.save();
  res.status(201).json(new ApiResponse(201, { course }, 'Course created successfully'));
});

/**
 * @GET_LECTURES_BY_COURSE_ID
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private(ADMIN, subscribed users only)
 */
export const getLecturesByCourseId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  

  const course = await Course.findById(id);

  if (!course) {
    throw new ApiError(404, 'Invalid course id or course not found.');
  }

  res.status(200).json(new ApiResponse(200, { lectures: course.lectures }, 'Course lectures fetched successfully'));
});

/**
 * @ADD_LECTURE
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS Private (Admin Only)
 */
export const addLectureToCourseById = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    throw new ApiError(400, 'Title and Description are required');
  }

  const course = await Course.findById(id);

  if (!course) {
    throw new ApiError(400, 'Invalid course id or course not found.');
  }

  let lectureData = {};

  if (req.file) {
      const result = await uploadOnCloudinary( req.file.path);
      console.log(result)
      if (result) {
        lectureData.public_id = result.public_id;
        lectureData.secure_url = result.secure_url;
      }
    
  }
  course.lectures.push({ title, description, lecture: lectureData });
  course.numberOfLectures = course.lectures.length;
  await course.save();

  res.status(200).json(new ApiResponse(200, { course }, 'Course lecture added successfully'));
});

/**
 * @Remove_LECTURE
 * @ROUTE @DELETE {{URL}}/api/v1/courses/:courseId/lectures/:lectureId
 * @ACCESS Private (Admin only)
 */
export const removeLectureFromCourse = asyncHandler(async (req, res, next) => {
  const { courseId, lectureId } = req.params;

  if (!courseId || !lectureId) {
    throw new ApiError(400, 'Course ID and Lecture ID are required');
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, 'Invalid ID or Course does not exist.');
  }

  const lectureIndex = course.lectures.findIndex(lecture => lecture._id.toString() === lectureId.toString());

  if (lectureIndex === -1) {
    throw new ApiError(404, 'Lecture does not exist.');
  }

  
  const result = await deleteOnCloudnary(course.lectures[lectureIndex].lecture.public_id);
  if (!result) {
    throw new ApiError(400, 'File not deleted, please try again');
  }
  course.lectures.splice(lectureIndex, 1);
  course.numberOfLectures = course.lectures.length;
  await course.save();

  res
  .status(200)
  .json(new ApiResponse(200, {}, 'Course lecture removed successfully'));
});

/**
 * @UPDATE_COURSE_BY_ID
 * @ROUTE @PUT {{URL}}/api/v1/courses/:id
 * @ACCESS Private (Admin only)
 */
export const updateCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findByIdAndUpdate(id, { $set: req.body }, { runValidators: true });

  if (!course) {
    throw new ApiError(400, 'Invalid course id or course not found.');
  }

  res.status(200).json(new ApiResponse(200, {}, 'Course updated successfully'));
});

/**
 * @DELETE_COURSE_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/courses/:id
 * @ACCESS Private (Admin only)
 */
export const deleteCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    throw new ApiError(404, 'Course with given id does not exist.');
  }

  await course.remove();
  res.status(200).json(new ApiResponse(200, {}, 'Course deleted successfully'));
});
