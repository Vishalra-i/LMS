import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import {
  deleteCourseLecture,
  getCourseLecture,
} from "../../Redux/lectureSlice";

const DisplayLectures = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courseDetails = useLocation().state;
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleLectureDelete = async (courseId, lectureId) => {
    try {
      if (!courseId || !lectureId) {
        console.error("Invalid courseId or lectureId " + "courseid:: " + courseId + '  lectureId ::' + lectureId);
        return;
      }
      const data = { courseId, lectureId };
      await dispatch(deleteCourseLecture(data));
      // await dispatch(getCourseLecture())
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await dispatch(getCourseLecture(courseDetails?._id));
    })();
  }, [dispatch, courseDetails]);

  return (
    <Layout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
        <div className="flex flex-col md:flex-row gap-10 w-full">
          <div className="space-y-5 w-full md:w-2/3 p-4 bg-gray-800 rounded-lg shadow-lg">
            <video
              className="object-fill rounded-lg w-full"
              src={lectures && lectures[currentVideoIndex]?.lecture?.secure_url}
              controls
              disablePictureInPicture
              muted
              controlsList="nodownload"
            ></video>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-yellow-500">Title: </span>
                {lectures && lectures[currentVideoIndex]?.title}
              </h1>
              <p className="mt-2">
                <span className="text-yellow-500">Description: </span>
                {lectures && lectures[currentVideoIndex]?.description}
              </p>
            </div>
          </div>

          <ul className="w-full md:w-1/3 p-4 bg-gray-800 rounded-lg shadow-lg space-y-4">
            <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
              <p>Lectures List</p>
              {role === "ADMIN" && (
                <button
                  onClick={() =>
                    navigate("/course/addlecture", {
                      state: { ...courseDetails },
                    })
                  }
                  className="btn-primary px-4 py-2 rounded-md font-semibold text-sm bg-green-500 hover:bg-green-600 transition"
                >
                  Add New Lecture
                </button>
              )}
            </li>
            {lectures &&
              lectures.map((element, index) => (
                <li
                  key={element._id}
                  className="p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition flex items-center justify-between"
                >
                  <p
                    className="cursor-pointer"
                    onClick={() => setCurrentVideoIndex(index)}
                  >
                    <span className="text-yellow-500">Lecture {index + 1}: </span>
                    {element?.title}
                  </p>
                  {role === "ADMIN" && (
                    <button
                      onClick={() =>
                        handleLectureDelete(courseDetails?._id, element?._id)
                      }
                      className="btn-primary px-4 py-2 rounded-md font-semibold text-sm bg-red-500 hover:bg-red-600 transition"
                    >
                      Delete Lecture
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default DisplayLectures;
