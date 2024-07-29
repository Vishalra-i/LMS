import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/course/description", { state: { ...data } })}
      className="w-[22rem] h-[430px] bg-white shadow-lg rounded-lg cursor-pointer overflow-hidden transition-transform transform hover:scale-105"
    >
      <div className="relative">
        <img
          className="w-full h-48 object-cover rounded-t-lg"
          src={data?.thumbnail?.secure_url}
          alt="course thumbnail"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {data?.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {data?.description}
        </p>
        <div className="space-y-1">
          <p className="text-gray-800 font-medium">
            <span className="text-yellow-600">Category:</span> {data?.category}
          </p>
          <p className="text-gray-800 font-medium">
            <span className="text-yellow-600">Total Lectures:</span> {data?.numberOfLectures}
          </p>
          <p className="text-gray-800 font-medium">
            <span className="text-yellow-600">Instructor:</span> {data?.createdBy}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
