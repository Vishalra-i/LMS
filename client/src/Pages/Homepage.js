import React from "react";
import Layout from "../Layout/Layout";
import homePageMainImage from "../Assets/Images/homePageMainImage.png";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <Layout>
      <div className="pt-10  h-full text-gray-300">
        {/* Hero Section */}
        <section className="flex animate-slideInFromLeft flex-col lg:flex-row items-center justify-between gap-10 mb-16 lg:mb-32  min-h-full px-4 sm:px-12 lg:px-16">
          {/* Platform Details */}
          <div className="w-full lg:w-1/2 space-y-6 ">
            <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
              Find the Best{" "}
              <span className="text-yellow-500 font-bold">Online Courses</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600">
              Discover our extensive library of courses taught by skilled instructors at affordable prices.
            </p>
            <div className="space-x-4">
              <Link to={"/courses"}>
                <button className="bg-yellow-500 px-6 py-3 rounded-md font-semibold text-lg text-white cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                  Explore Courses
                </button>
              </Link>
              <Link to={"/contact"}>
                <button className="border border-yellow-500 px-6 py-3 rounded-md font-semibold text-lg text-yellow-500 cursor-pointer hover:border-yellow-600 transition-all ease-in-out duration-300">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
          {/* Hero Image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img src={homePageMainImage} alt="Home Page" className="w-full max-w-md" />
          </div>
        </section>

        {/* Our Courses Section */}
        <section className="bg-gray-100 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Popular Courses</h2>
            <p className="text-lg text-gray-600 mt-2">
              Explore some of the most popular courses offered by our platform.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {/* Example Course Cards */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
              <img
                src="https://res.cloudinary.com/vishalscloud/image/upload/v1722185019/lms/horhxaffqujsezmzmsvg.png"
                alt="Course Thumbnail"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">React Native</h3>
              <p className="text-gray-600 mb-4">Brief description of the course goes here.</p>
              <Link to="/courses">
                <button className="bg-yellow-500 px-4 py-2 rounded-md font-semibold text-white cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                  Learn More
                </button>
              </Link>
            </div>
            {/* Repeat similar course cards as needed */}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-300">What Our Students Say</h2>
            <p className="text-lg text-gray-600 mt-2">
              Hear from our satisfied students about their learning experiences.
            </p>
          </div>
          <div className="flex  justify-center gap-8 animate-slide">
            {/* Example Testimonial Cards */}
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
              <p className="text-gray-800 mb-4">
                The courses are well-structured and the instructors are knowledgeable. Highly recommended!
              </p>
              <h4 className="font-semibold text-gray-800">Vishal</h4>
              <p className="text-gray-600">Full stack development course</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
              <p className="text-gray-800 mb-4">
                Best resources for study
              </p>
              <h4 className="font-semibold text-gray-800">Prasann</h4>
              <p className="text-gray-600">Java development course</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
              <p className="text-gray-800 mb-4">
                The courses are well-structured and the instructors are knowledgeable. Highly recommended!
              </p>
              <h4 className="font-semibold text-gray-800">Aman</h4>
              <p className="text-gray-600">Java development course</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
              <p className="text-gray-800 mb-4">
                The courses are well-structured and the instructors are knowledgeable. Highly recommended!
              </p>
              <h4 className="font-semibold text-gray-800">Ankit</h4>
              <p className="text-gray-600">Java development course</p>
            </div>
            {/* Repeat similar testimonial cards as needed */}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-yellow-500 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">
            Join our community of learners and start your journey today!
          </p>
          <Link to="/signup">
            <button className="bg-white text-yellow-500 px-6 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-gray-100 transition-all ease-in-out duration-300">
              Create an Account
            </button>
          </Link>
        </section>
      </div>
    </Layout>
  );
};

export default Homepage;
