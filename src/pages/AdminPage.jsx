import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
} from "recharts";

export const AdminPage = () => {
  const dashboard = import.meta.env.VITE_DASHBOARD_API_ENDPOINT;

  const userRole = localStorage.getItem("userRole");

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  const [studentStatus, setStudentStatus] = useState(0);
  const [teacherStatus, setTeacherStatus] = useState(0);

  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${dashboard}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.meta?.code === 1) {
        console.log(response.data);
        setTotalStudents(response.data.data?.student?.total);
        setTotalTeachers(response.data.data?.teacher?.total);
        setStudentStatus(response.data.data?.student?.active);
        setTeacherStatus(response.data.data?.teacher?.active);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/");
      }
      console.error(
        "Failed to fetch data:",
        error.response?.data?.meta?.message || error.message,
      );
    }
  };
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      navigate("/");
    }
  }, [token]);

  const totalUsers = totalStudents + totalTeachers;
  const totalActiveUsers = studentStatus + teacherStatus;

  const data = [
    { name: "STUDENTS", value: totalStudents },
    { name: "TEACHERS", value: totalTeachers },
  ];

  const data2 = [
    { name: "ACTIVE STUDENTS", value: studentStatus },
    { name: "ACTIVE TEACHERS", value: teacherStatus },
  ];

  const COLORS = ["#00C49F", "#FFBB28"];
  const COLORS2 = ["#0ea5e9", "#f59e0b"];

  console.log("total teachers", totalTeachers);
  console.log("active teachers", teacherStatus);

  return (
    // <>
    //   <div className="flex justify-between mx-60 ">
    //     <div className="text-2xl font-bold rounded-2xl py-6 px-20 border-slate-300 shadow-md border cursor-pointer">
    //       {userRole === "admin"
    //         ? "Total Users"
    //         : userRole === "user"
    //           ? "Total Students"
    //           : userRole === "teacher"
    //             ? "Total Teachers"
    //             : ""}
    //       <div className=" text-center text-blue-600 mt-4">
    //         {userRole === "admin"
    //           ? totalUsers
    //           : userRole === "user"
    //             ? totalStudents
    //             : userRole === "teacher"
    //               ? totalTeachers
    //               : ""}
    //       </div>
    //     </div>
    //     <div className="text-2xl font-bold rounded-2xl  py-6 px-20 border-slate-300 shadow-md border cursor-pointer">
    //       {userRole === "admin"
    //         ? "Active Users"
    //         : userRole === "user"
    //           ? "Active Students"
    //           : userRole === "teacher"
    //             ? "Active Teachers"
    //             : ""}
    //       <div className="text-center text-blue-600 mt-4">
    //         {userRole === "admin"
    //           ? totalActiveUsers
    //           : userRole === "user"
    //             ? studentStatus
    //             : userRole === "teacher"
    //               ? teacherStatus
    //               : ""}
    //       </div>
    //     </div>
    //   </div>

    //   {userRole === "admin" && (
    //     <div className="flex justify-between gap-10 rounded-2xl mx-24 mt-5">
    //       <PieChart
    //         width={600}
    //         height={300}
    //         className="border rounded-md border-slate-300 shadow-lg"
    //       >
    //         <Pie label data={data} dataKey="value">
    //           {data.map((cur, index) => (
    //             <Cell key={index} fill={COLORS[index]} />
    //           ))}
    //         </Pie>
    //         <Legend
    //           iconType="square"
    //           layout="horizontal"
    //           horizontalAlign="bottom"
    //           align="center"
    //         />
    //         <Tooltip />
    //       </PieChart>

    //       <PieChart
    //         width={600}
    //         height={300}
    //         className="border rounded-md border-slate-300 shadow-lg"
    //       >
    //         <Pie label data={data2} dataKey="value">
    //           {data.map((cur, index) => (
    //             <Cell key={index} fill={COLORS2[index]} />
    //           ))}
    //         </Pie>
    //         <Legend
    //           iconType="square"
    //           layout="horizontal"
    //           verticalAlign="bottom"
    //           align="center"
    //         />
    //         <Tooltip />
    //       </PieChart>
    //     </div>
    //   )}
    // </>
    <>
      <div className="max-w-5xl mx-auto px-4 my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
        <div className="text-2xl font-bold rounded-2xl py-6 px-6 sm:px-12 border-slate-300 shadow-md border cursor-pointer text-center bg-white">
          {userRole === "admin"
            ? "Total Users"
            : userRole === "user"
              ? "Total Students"
              : userRole === "teacher"
                ? "Total Teachers"
                : ""}
          <div className="text-blue-600 mt-4">
            {userRole === "admin"
              ? totalUsers
              : userRole === "user"
                ? totalStudents
                : userRole === "teacher"
                  ? totalTeachers
                  : ""}
          </div>
        </div>

        <div className="text-2xl font-bold rounded-2xl py-6 px-6 sm:px-12 border-slate-300 shadow-md border cursor-pointer text-center bg-white">
          {userRole === "admin"
            ? "Active Users"
            : userRole === "user"
              ? "Active Students"
              : userRole === "teacher"
                ? "Active Teachers"
                : ""}
          <div className="text-blue-600 mt-4">
            {userRole === "admin"
              ? totalActiveUsers
              : userRole === "user"
                ? studentStatus
                : userRole === "teacher"
                  ? teacherStatus
                  : ""}
          </div>
        </div>
      </div>

      {userRole === "admin" && (
        <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col lg:flex-row justify-between gap-6">
          <div className="w-full h-80 p-4 border rounded-2xl border-slate-300 shadow-lg bg-white">
            <PieChart width="100%" height="100%">
              <Pie label data={data} dataKey="value">
                {data.map((cur, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend
                iconType="square"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
              <Tooltip />
            </PieChart>
          </div>

          <div className="w-full h-80 p-4 border rounded-2xl border-slate-300 shadow-lg bg-white">
            <PieChart width="100%" height="100%">
              <Pie label data={data2} dataKey="value">
                {data2.map((cur, index) => (
                  <Cell key={index} fill={COLORS2[index]} />
                ))}
              </Pie>
              <Legend
                iconType="square"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}
    </>
  );
};
