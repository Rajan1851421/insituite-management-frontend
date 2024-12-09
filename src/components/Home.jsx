import axios from "axios";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import Latest5Student from "./Latest5Student";
import TotalStudentAndCourse from "./TotalStudentAndCourse";
ChartJS.register(...registerables);

function Home() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [chartKey, setChartKey] = useState(0); // Unique key to force re-render
  const [student5, setStudent5] = useState([])
  const [allcourse, setAllcourse] = useState(null)
  const [allstudent, setAllStudent] = useState(null)

  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = async () => {
    try {
      const response = await axios.get("http://localhost:3000/course/home", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("stoken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Home :", response);
      const data = response.data;
      setTotalAmount(data.totalAmount);
      setStudent5(data.students)
      setAllStudent(data.totalStudent)
      setAllcourse(data.totalCourse)
      setChartKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const comparisonAmount = 20000;

  const chartData = {
    labels: [
      ``,
      "",
      ``,
    ],
    datasets: [
      {
        data: [
          totalAmount,
          comparisonAmount - totalAmount,
          comparisonAmount,
        ],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const legendLabels = [
    `Total Amount Collected: ${totalAmount} INR`,
    `Remaining Amount: ${comparisonAmount - totalAmount} INR`,
    `Comparison Amount: ${comparisonAmount} INR`,
  ];

  return (
    <>
      <div className="h-[80vh] overflow-y-auto ">
        <div className="flex justify-center items-start space-x-2">
          {/* Left-aligned labels */}
          <div>
            {legendLabels.map((label, index) => (
              <div key={index} className="text-sm font-medium mb-2">
                <span
                  className="inline-block w-4 h-4 mr-2 rounded-full"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                ></span>
                {label}
              </div>
            ))}
          </div>

          {/* Doughnut Chart */}
          <div className="w-64">
            <Doughnut data={chartData} key={chartKey} />
          </div>
        </div>
        <div className="py-4">
          <Latest5Student student={student5} />
        </div>
        <TotalStudentAndCourse allstudent={allstudent} allcourse={allcourse} />
      </div>
    </>
  );
}

export default Home;
