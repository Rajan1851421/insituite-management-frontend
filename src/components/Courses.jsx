import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './courses.css';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Initialize with true to show loading initially
  const [data, setData] = useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    axios
      .get(`http://localhost:3000/course/all-courses/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('stoken')}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setData(res.data.courses);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // Ensure loading is turned off after the request
      });
  };

  return (
    <div className="course-wrapper">
      {loading ? (
        <p>Loading courses...</p> // Show a loading message
      ) : data.length > 0 ? (
        data.map((item, index) => (
          <div
            onClick={() => navigate(`/dashboard/course-details/${item._id}`)}
            key={index}
            className="course-box"
          >
            <img className="course-thumbnail" src={item.imageUrl} alt="" />
            <h3 className="course-title">{item.courseName}</h3>
            <p className="course-price">{`Price: ${item.price}/- only`}</p>
          </div>
        ))
      ) : (
        <h1>No courses available</h1>
      )}
    </div>
  );
}

export default Courses;
