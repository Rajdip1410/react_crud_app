import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImNext2 } from "react-icons/im";
import { ImPrevious2 } from "react-icons/im";

import { VscEdit } from "react-icons/vsc";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { cn } from "../utils/cn";
import { StudentForm } from "../component/StudentForm";
import { Pagination } from "../component/Pagination";

export const StudentTable = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_STUDENT_API_ENDPOINT;
  const [apidata, setApiData] = useState([]);
  const [deleteid, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [limit, setLimit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const token = localStorage.getItem("authToken");

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${api}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.meta.code === 1) {
        setApiData(response.data.data || []);
        setPagination(response.data.meta.pagination);
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
  // console.log("total users",pagination.total)
  // console.log(pagination)
  useEffect(() => {
    fetchStudentData();
  }, [api, page, limit]);

  function handleback() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  }

  const handledelete = async (id) => {
    try {
      const response = await axios.delete(`${api}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // fetchStudentData;

      if (response.data.meta.code === 1) {
        toast.success(response.data.meta.message);

        fetchStudentData();
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/");
        localStorage.removeItem("authToken");
      }
      console.error(error.response.data.meta.message);
    }
  };

  const handleconformdelete = () => {
    if (deleteid) {
      handledelete(deleteid);
    }
    setDeleteId(null);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student); // Save current student data to state
    setShowForm(true); // Explicitly open form
  };

  const handleAddClick = () => {
    setSelectedStudent(); // Reset editing context
    setShowForm(true); // Explicitly open form
  };

  async function handleStatusEdit(id) {
    const student = apidata.find((item) => item.id === id);

    try {
      const response = await axios.put(
        `${api}/status/${id}`,
        {
          status: student.status === "active" ? "inactive" : "active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.meta.code === 1) {
        setApiData((prevData) =>
          prevData.map((item) => {
            if (item.id === id) {
              const nextStatus =
                item.status === "active" ? "inactive" : "active";
              return { ...item, status: nextStatus };
            }
            return item;
          }),
        );
      }
    } catch (err) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/");
      }
      console.error(error.response?.data?.meta?.message || error.message);
    }
  }

  const userRole = localStorage.getItem("userRole");

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-600 w-full">
      <div className="text-center font-bold text-3xl py-1.5 text-slate-800 h-12  bg-green-100">
        Student data
      </div>

      <div className="w-full space-y-0">
        {/* 1. Main Header Card - Modified to guarantee un-restricted fluid full width */}
        <div className="sticky top-0 z-40 w-full overflow-hidden bg-white border-b border-slate-200/60 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Background abstract gradient decoration */}
          <div className="absolute top-0 right-0 mt-4 mr-4 w-32 h-32 from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-6 bg-indigo-600 rounded-full" />
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 from-slate-900 to-slate-700 bg-clip-text ">
                Students Record
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Manage, update, and monitor registered student profiles.
            </p>
          </div>

          {userRole === "admin" && (
            <div className="flex items-center gap-3 z-10">
              {/* <button
              onClick={handleback}
              className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-600/30 rounded-xl transition-all cursor-pointer hover:shadow-sm"
            >
              Logoutaction
            </button> */}
              <button
                onClick={handleAddClick}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <IoAddSharp className="h-6 w-6 font-bold" />
                Add Student
              </button>
            </div>
          )}
        </div>

        {/* 2. Table Component Container Box - Set to fluid full-width layout */}
        <div className="w-full bg-white border-b border-slate-200/70 shadow-sm overflow-hidden">
          {/* Scroll Viewport Window - Dynamic height tracking while enforcing full horizontal span max-h-[calc(100vh-200px)]*/}
          <div className="overflow-x-auto w-full block ">
            <table className="mx-auto w-full border-collapse text-left text-sm text-slate-600 table-auto">
              <thead className="text-[16px] font-bold uppercase tracking-widest text-slate-800 w-full">
                <tr className="sticky top-0 border-b border-slate-300/80">
                  <th className="z-20 bg-slate-50 px-6 py-4">SR NO.</th>
                  <th className="z-20 bg-slate-50 px-6 py-4">ID</th>
                  <th className="z-20 bg-slate-50 px-6 py-4">Student Name</th>
                  <th className="z-20 bg-slate-50 px-6 py-4">Location</th>
                  <th className="z-20 bg-slate-50 px-6 py-4">Contact Phone</th>

                  <th className="z-20 bg-slate-50 py-4 pl-6 pr-16 text-right">
                    Status
                  </th>

                  {userRole === "admin" && (
                    <th className="z-20 bg-slate-50 py-4 pl-6 pr-6 text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {apidata && apidata.length > 0 ? (
                  apidata.map((curdata, index) => (
                    <tr
                      key={curdata.id}
                      className={cn(
                        "hover:bg-indigo-50/20 transition-colors group",
                        (index + 1) % 2 === 0 ? " bg-gray-100" : "",
                      )}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 text-md font-bold">
                          {(page - 1) * limit + (index + 1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 text-md font-bold font-mono text-indigo-600 bg-indigo-50 rounded-md border border-indigo-100">
                          #{curdata.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 text-md hover:text-indigo-600 transition-colors">
                        {curdata.name}
                      </td>
                      <td className="px-6 py-4 text-md text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          {curdata.place}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-800 text-md">
                        {curdata.phone}
                      </td>

                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {/* Status Badge on top */}
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide",
                              curdata.status === "active"
                                ? " text-indigo-800"
                                : " text-rose-800",
                            )}
                          >
                            {curdata.status}
                          </span>

                          {/* Toggle Switch directly underneath */}
                          {userRole === "admin" && (
                            <button
                              type="button"
                              onClick={() => handleStatusEdit(curdata.id)}
                              className={cn(
                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                curdata.status === "active"
                                  ? "bg-indigo-600"
                                  : "bg-gray-300 ",
                              )}
                            >
                              <span className="sr-only">Toggle Status</span>
                              <span
                                className={cn(
                                  "pointer-events-none inline-block h-4 w-4 mt-px transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                                  curdata.status === "active"
                                    ? "translate-x-4"
                                    : "translate-x-0.5",
                                )}
                              />
                            </button>
                          )}
                        </div>
                      </td>

                      {userRole === "admin" && (
                        <td className="py-4 pl-6 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(curdata)}
                              className="flex items-center justify-center w-8 h-8 text-white bg-indigo-700 border border-slate-200 rounded-lg hover:bg-indigo-800 hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
                              title="Edit Student"
                            >
                              <VscEdit />
                            </button>
                            <button
                              onClick={() => setDeleteId(curdata.id)}
                              className="flex items-center justify-center w-8 h-8 text-white bg-red-700 hover:bg-red-800 border-slate-800 hover:border-red-800 rounded-lg transition-colors cursor-pointer shadow-md focus:outline-hidden focus:ring-2 focus:ring-red-500/40"
                              title="Delete Student"
                              aria-label="Delete Student"
                            >
                              <MdOutlineDeleteOutline />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 18 22.5H6a2.25 2.25 0 0 1-2.25-2.25V15.75a2.25 2.25 0 0 1 2.25-2.25Zm0-4.5h18A2.25 2.25 0 0 0 22.5 9V4.5A2.25 2.25 0 0 0 20 2.25H4a2.25 2.25 0 0 0-2.25 2.25V9a2.25 2.25 0 0 0 2.25 2.25Z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-slate-400">
                          No student records found
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3. Pagination Footer Row */}
          <div className="border-t border-slate-100 bg-slate-50/40 px-4 w-full">
            <Pagination
              currentPage={pagination.page}
              lastPage={pagination.totalPage}
              total={pagination.total}
              onpagechange={(page) => setPage(page)}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <StudentForm
              selectedStudent={selectedStudent}
              onClose={() => setShowForm(false)}
              fetchStudentData={fetchStudentData}
            />
          </div>
        </div>
      )}
      {deleteid && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <GoAlert />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              Remove Record
            </h3>
            <p className="text-xs font-medium text-slate-400 max-w-60 mx-auto mb-6">
              Are you sure? This operation is permanent and cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleconformdelete}
                className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-linear-to-r from-rose-600 to-red-600 text-white rounded-xl hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-600/10 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
