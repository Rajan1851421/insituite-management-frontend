import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Student() {

  const [studentList, setStudentList] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getStudentList()
  }, [])

  const getStudentList = async () => {
    try {
      const response = await axios.get(
        `https://insituite-management-backend.onrender.com/student/all-students`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('stoken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response)
      // setCourseDetails(response.data.course);
      setStudentList(response.data.students || []);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };





  return (
    <>
      <h1 className="text-center font-semibold my-2 text-xl sm:text-2xl lg:text-3xl">
        All Students
      </h1>
      {studentList.length > 0 ? (
        <div className="h-[50%] overflow-y-auto px-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Image</th>
                <th className="p-2">Full Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student, index) => (
                <tr
                  onClick={() => {
                    navigate('/dashboard/student-detail/' + student._id);
                  }}
                  key={index}
                  className="hover:bg-[#7033ff] hover:text-white cursor-pointer border-b transition-all "
                >
                  <td className="p-2">
                    <img
                      src={student.imageUrl}
                      alt={student.fullName}
                      className="w-12 h-12 object-cover rounded-full border"
                    />
                  </td>
                  <td className="p-2 capitalize ">{student.fullName}</td>
                  <td className="p-2">{student.phone}</td>
                  <td className="p-2">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <img
            src="https://cdn-icons-png.flaticon.com/128/17134/17134620.png"
            alt="No students"
            className="w-24 h-24 sm:w-32 sm:h-32"
          />
          <p className="text-gray-500 text-lg sm:text-xl mt-2">
            No students found
          </p>
        </div>
      )}
    </>

  )
}

export default Student