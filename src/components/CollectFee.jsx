import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function CollectFee() {

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState()
  const [remark, setRemark] = useState('')
  const [courseId, setCourseId] = useState('')
  const [courselist, setcourseList] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()



  useEffect(() => {
    getcourses()
  }, [])


  const getcourses = () => {
    axios.get(`http://localhost:3000/course/all-courses/`, {
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
        toast.error("failed")
      })
  }


  const submitHandler = (e) => {
    setLoading(true)
    e.preventDefault()
    axios.post(`http://localhost:3000/fee/add-fee`, {
      fullName: fullName,
      amount: amount,
      phone: phone,
      remark: remark,
      courseId: courseId
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('stoken')}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        // console.log(res)
        toast.success("Yor fee is submited")
        setLoading(false)
        setFullName('')
        setPhone('')
        setRemark('')
        setAmount('')
        navigate('/dashboard/payment-history')
      })
      .catch(err => {
        console.log(err)
        toast.error("Fee submitted failed")
        setLoading(false)
      })
  }


  return (
    <>
      <div className='w-full'>
        <form onSubmit={submitHandler} className='from'>
          <h1 className='font-bold text-md md:text-xl capitalize'>Fee collection form</h1>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder=' Full Name' type="text" name="" id="" />
          <input
          required
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            placeholder="Amount"
            type="text"
          />
          <input value={phone}
          required
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setPhone(value);
              }
            }}
            placeholder='Mobile' type="text" name="" id="" />
          <input required value={remark} onChange={(e) => setRemark(e.target.value)} placeholder='Remark' type="text" name="" id="" />
          <select required value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={!!location.state} >
            <option value="">Select course</option>
            {courselist && courselist.map((item) => (
              <option key={item._id} value={item._id}>
                {item.courseName}
              </option>
            ))}
          </select>
          <button type='submit'>{loading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}
            Submit
          </button>
        </form>
      </div>


    </>)
}

export default CollectFee