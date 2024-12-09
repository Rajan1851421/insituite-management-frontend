import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function AddStudent() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [courseId, setCourseId] = useState('')
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [courselist, setcourseList] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getcourses()
    console.log("location", location)
    if (location.state) {
      setFullName(location.state.student.fullName)
      setPhone(location.state.student.phone)
      setEmail(location.state.student.email)
      setAddress(location.state.student.address)
      setCourseId(location.state.student.courseId)
      setImageUrl(location.state.student.imageUrl)
    } else {
      setFullName('')
      setPhone("")
      setEmail('')
      setAddress('')
      setCourseId('')
      setImageUrl('')
    }
  }, [location])


  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('courseId', courseId);
    if (image) {
      formData.append('image', image);
    }

    if (location.state) {
      axios.put(
        `https://insituite-management-backend.onrender.com/student/${location.state.student._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('stoken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
        .then((response) => {
          console.log('Student added successfully:', response.data);
          toast.success("Student updadted");
          // Reset form fields
          setFullName('');
          setEmail('');
          setAddress('');
          setCourseId('');
          setPhone('');
          setImageUrl('');
          navigate('/dashboard/student-detail/' + location.state.student._id)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error adding student:', error);
          toast.error("Something went to wrong")
          setLoading(false)

        })
    }

    else {


      axios.post('https://insituite-management-backend.onrender.com/student/add-student', formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('stoken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
        .then((response) => {
          console.log('Student added successfully:', response.data);
          toast.success(response.data.message);
          setLoading(false)
          // Reset form fields
          setFullName('');
          setEmail('');
          setAddress('');
          setCourseId('');
          setPhone('');
          setImageUrl('');
        })
        .catch((error) => {
          console.error('Error adding student:', error);
          toast.error('Failed to add student. Please try again.');
          setLoading(false)
        })
    }


  };

  const getcourses = () => {
    axios.get(`https://insituite-management-backend.onrender.com/course/all-courses/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('stoken')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        // console.log(res.data.courses)
        setcourseList(res.data.courses)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="">
      <h2 className='font-semibold md:text-lg text-center  text-sm '> {location.state ? "Edit Student Details" : "Add New Student"} </h2>
      <form onSubmit={handleAddStudent} className="from">
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Student Name" type="text" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" type="text" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full Address" type="text" />
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={!!location.state} >
          <option value="">Select course</option>
          {courselist && courselist.map((item) => (
            <option key={item._id} value={item._id}>
              {item.courseName}
            </option>
          ))}
        </select>
        <input onChange={fileHandler} type="file" />
        {image && <img className="logo-url" src={imageUrl} alt="student image" />}
        <button type="submit" disabled={loading}>
          {loading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;
