import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
const unlinkFile = promisify(fs.unlink);

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

  if (req.file) {
    // Handle Cloudinary file upload in the background
    uploadOnCloudinary(req.file.path)
      .then(async (result) => {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
        await course.save();
        await unlinkFile(req.file.path); // Clean up the uploaded file
      })
      .catch((error) => {
        console.error('Cloudinary Upload Failed:', error);
      });
  }

  res.status(201).json(new ApiResponse(201, { course }, 'Course created successfully'));
});


/**
 * @ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses
 * @ACCESS Public
 */
export const getAllCourses = asyncHandler(async (req, res, next) => {
 try {
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
 } catch (error) {
   console.error('Error fetching courses:', error);
   throw new ApiError(500, 'Internal server error');
 }
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
    // Handle Cloudinary file upload in the background
    uploadOnCloudinary(req.file.path)
      .then(async (result) => {
        if (result) {
          lectureData.public_id = result.public_id;
          lectureData.secure_url = result.secure_url;
        }

        course.lectures.push({ title, description, lecture: lectureData });
        course.numberOfLectures = course.lectures.length;
        await course.save();

        res.status(200).json(new ApiResponse(200, { course }, 'Lecture added successfully'));
      })
      .catch((error) => {
        console.error('Cloudinary Upload Failed:', error);
        throw new ApiError(400, 'File upload failed, please try again');
      });
  } else {
    course.lectures.push({ title, description });
    course.numberOfLectures = course.lectures.length;
    await course.save();

    res.status(200).json(new ApiResponse(200, { course }, 'Lecture added successfully'));
  }
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
    throw new ApiError(404, 'Invalid course id or course not found.');
  }

  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  if (lectureIndex === -1) {
    throw new ApiError(404, 'Lecture does not exist.');
  }

  const lecture = course.lectures[lectureIndex];

  // Remove lecture from Cloudinary in background
  deleteOnCloudnary(lecture.lecture.public_id)
    .then(() => {
      course.lectures.splice(lectureIndex, 1);
      course.numberOfLectures = course.lectures.length;
      return course.save();
    })
    .then(() => {
      res.status(200).json(new ApiResponse(200, {}, 'Lecture removed successfully'));
    })
    .catch((error) => {
      console.error('Cloudinary Deletion Failed:', error);
      throw new ApiError(400, 'File deletion failed, please try again');
    });
});


