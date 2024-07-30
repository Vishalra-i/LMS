import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { addCourseLecture } from "../../Redux/lectureSlice";

const AddLectures = () => {
  const courseDetails = useLocation().state;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting , setIsSubmitting] = useState(false)

  const [userInput, setUserInput] = useState({
    id: courseDetails?._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: "",
  });

  // function to handle the input box change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput({ ...userInput, [name]: value });
  };

  // function to get video and its link from the input
  const getVideo = (event) => {
    const video = event.target.files[0];
    const source = window.URL.createObjectURL(video);
    setUserInput({ ...userInput, videoSrc: source, lecture: video });
  };

  // function to handle the form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true)

    try {
      if (!userInput.lecture || !userInput.title || !userInput.description) {
        toast.error("All fields are mandatory");
        return;
      }
      const res = await dispatch(addCourseLecture(userInput));
  
      setUserInput({
        id: courseDetails?._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: "",
      });
      navigate(-1);
    } catch (error) {
       console.log(error)
    } finally {
      setIsSubmitting(false)
    }

  };

  // redirecting the user if no course details
  useEffect(() => {
    if (!courseDetails) {
      navigate(-1);
    }

  }, [courseDetails, navigate]);

  return (
    <Layout>
      <div className="text-white flex flex-col items-center justify-center gap-10 mx-16 min-h-[90vh]">
        <div className="flex flex-col gap-5 p-6 shadow-[0_0_10px_black] w-96 rounded-lg bg-gray-800">
          <header className="flex items-center justify-center relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 text-xl text-green-500"
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">
              Add your new lecture
            </h1>
          </header>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              value={userInput.title}
              onChange={handleInputChange}
              placeholder="Enter the title for lecture"
              className="bg-transparent px-3 py-2 border rounded-md focus:outline-none focus:border-yellow-500"
            />

            <textarea
              name="description"
              value={userInput.description}
              onChange={handleInputChange}
              placeholder="Enter the description for lecture"
              className="resize-none overflow-y-scroll h-24 bg-transparent px-3 py-2 border rounded-md focus:outline-none focus:border-yellow-500"
            />
            {userInput.videoSrc ? (
              <video
                src={userInput.videoSrc}
                muted
                controls
                controlsList="nodownload nofullscreen"
                disablePictureInPicture
                className="object-fill rounded-md w-full"
              ></video>
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer rounded-md hover:border-yellow-500 transition-all">
                <label
                  htmlFor="lecture"
                  className="font-semibold text-xl cursor-pointer"
                >
                  <p className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 rounded-md">
                    Choose your video
                  </p>
                </label>
                <input
                  type="file"
                  name="lecture"
                  id="lecture"
                  onChange={getVideo}
                  accept="video/mp4,video/x-m4v,video/*"
                  className="hidden"
                />
              </div>
            )}

            <button disabled={isSubmitting} 
                    className={`${isSubmitting && 'cursor-not-allowed'} py-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 rounded-md font-semibold text-lg`}
            >
               {
                isSubmitting ? <> <span>Please wait...</span><span className="loading loading-spinner text-secondary"></span> </>: "Add lecture"
               }
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddLectures;
