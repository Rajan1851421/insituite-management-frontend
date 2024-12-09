import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

function AddCourses() {
  const [coursename, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state) {
      // console.log("data:", location.state.courseDetails);
      setCourseName(location.state.courseDetails.courseName)
      setDescription(location.state.courseDetails.description)
      setPrice(location.state.courseDetails.price)
      setStartingDate(location.state.courseDetails.startingDate)
      setEndDate(location.state.courseDetails.endDate)
      setImageUrl(location.state.courseDetails.imageUrl)

    } else {
      setCourseName('')
      setDescription('')
      setPrice('')
      setStartingDate('')
      setEndDate('')
      setImageUrl('')
    }


  }, [location])

  const handleAddCourse = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!coursename || !description || !price || !startingDate || !endDate) {
      alert('Please fill all fields and upload an image');
      return;
    }

    setLoading(true); // Start loading spinner

    const formData = new FormData();
    formData.append('courseName', coursename);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startingDate', startingDate);
    formData.append('endDate', endDate);
    
    if (image) {
      formData.append('image', image);
    }

    if (location.state) {
      axios.put(
        `http://localhost:3000/course/update-course/${location.state.courseDetails._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("stoken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      ).then(res => {
        // console.log("updaetd:",res)
        navigate(`/dashboard/course-details/${res.data.updatedData._id}`);
        toast.success("course updated")
        setLoading(false)
      })
        .catch(err => {
          console.log("update error:", err)
          toast.error("Course Updated failed")
          setLoading(false)
        })
    }


    axios.post(
      'http://localhost:3000/course/add-course',
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('stoken')}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )
      .then(res => {
        console.log("add:", res)
        toast.success("Course added successfully")
        navigate('/dashboard/courses')
        setLoading(false)
      })
      .catch(err => {
        console.log("add error:", err)
        toast.error("Course added failed")
        setLoading(false)
      })
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="">
      <h2 style={{ fontWeight: 400 }}>{location.state ? 'Edit Course' : "Add New Course"}</h2>
      <form onSubmit={handleAddCourse} className="from">
        <input
          onChange={(e) => setCourseName(e.target.value)}
          value={coursename}
          placeholder="Course name"
          type="text"
        />
        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Description"
          type="text"
        />
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          placeholder="Price"
          type="text"
        />
        <input
          onChange={(e) => setStartingDate(e.target.value)}
          value={startingDate}
          placeholder="Start Date (dd-mm-yyyy)"
          type="text"
        />
        <input
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
          placeholder="End Date (dd-mm-yyyy)"
          type="text"
        />
       <input onChange={fileHandler} type="file" accept="image/*" />
        {image && <img className="logo-url" src={imageUrl} alt="Selected Logo" />}
        <button type="submit" disabled={loading}>
          {loading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AddCourses;
