import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import './CourseDetails.css'; // Assume you have relevant styles here

function CourseDetails() {
    const { id } = useParams();
    const [courseDetails, setCourseDetails] = useState(null); // Use `null` to represent uninitialized state
    const [studentList, setStudentList] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        getCourseDetails();
    }, []);

    const getCourseDetails = async () => {
        try {
            const response = await axios.get(
                `https://insituite-management-backend.onrender.com/course/course-details/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('stoken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setCourseDetails(response.data.course);
            setStudentList(response.data.studentsList || []);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    const deleteCourse = async (id) => {
        console.log(id)
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                const response = await axios.delete(`https://insituite-management-backend.onrender.com/course/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('stoken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log("Course deleted successfully:", response.data);
                navigate('/dashboard/courses')
                toast.success("Course deleted successfully");
            } catch (error) {
                console.error("Error deleting course:", error);
                toast.error("Failed to delete course. Please try again later.");
            }
        } else {
            toast.info("Course deletion canceled");
        }
    };





    return (
        <div className="course-detail-main-wrapper">
            {courseDetails ? (
                <>
                    <div className="course-detail-wrapper">
                        <img
                            className="course-details-thumbnail"
                            src={courseDetails.imageUrl}
                            alt="course"
                        />
                        <div className="course-details">
                            <h2 className="course-title">{courseDetails.courseName}</h2>
                            <p>{`Price: ${courseDetails.price}`}</p>
                            <p>{`Start Date: ${courseDetails.startingDate}`}</p>
                            <p>{`End Date: ${courseDetails.endDate}`}</p>

                            <div className='course-btn-container'>
                                <button onClick={() => { navigate('/dashboard/update-course/' + courseDetails._id, { state: { courseDetails } }) }} className='edit-btn'>Edit</button>
                                <button onClick={() => { deleteCourse(courseDetails._id) }} className='delete-btn'>Delete</button>
                            </div>
                        </div>
                        <div className='course-description-container'>
                            <h4 style={{ fontWeight: 600 }}>Course Discription</h4>
                            <p className="course-description">{courseDetails.description}</p>
                        </div>
                    </div>

                    {studentList.length > 0 ? (
                        <div className="studentlist-container">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Full Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentList.map((student, index) => (
                                        <tr className='table-row' key={index} onClick={() => { navigate('/dashboard/student-detail/' + student._id) }} >
                                            <td>
                                                <img
                                                    src={student.imageUrl}
                                                    alt={student.fullName}
                                                    className="student-image"
                                                />
                                            </td>
                                            <td className="student-name">
                                                {student.fullName}
                                            </td>
                                            <td>{student.phone}</td>
                                            <td>{student.email}</td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='no-student'>

                            <img src="https://cdn-icons-png.flaticon.com/128/17134/17134620.png" alt="" />
                        </div>
                    )}
                </>
            ) : (
                <h1>Loading course details...</h1>
            )}
        </div>
    );
}

export default CourseDetails;
