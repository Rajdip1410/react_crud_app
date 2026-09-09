import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validataform } from "../utils/helper";
import { toast } from "react-toastify";

export const StudentForm = ({ selectedStudent, onClose, fetchStudentData }) => {
  const navigate = useNavigate();

  const isEditMode = Boolean(selectedStudent?.id); // true if editing, false if adding

  const [student, setstudent] = useState({
    name: "",
    place: "",
    phone: "",
  });
  const [errors, seterrors] = useState({});
  const [changes, setChanges] = useState(false);

  const studentapi = import.meta.env.VITE_STUDENT_API_ENDPOINT;
  const teacherapi = import.meta.env.VITE_TEACHER_API_ENDPOINT;
  const token = localStorage.getItem("authToken");
  const location = useLocation();
  const studentPath = location.pathname === "/student-detail";

  const handlechange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      let cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.length > 10) {
        cleanedValue = cleanedValue.slice(0, 10);
      }
      setstudent((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setstudent((prev) => ({ ...prev, [name]: value }));
    }
    seterrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    setstudent({
      name: selectedStudent?.name,
      phone: selectedStudent?.phone,
      place: selectedStudent?.place,
    });
  }, [selectedStudent?.id]);

  const hasDataChanged = () => {
    return (
      student.name !== (selectedStudent?.name || "") ||
      student.place !== (selectedStudent?.place || "") ||
      student.phone !== (selectedStudent?.phone || "")
    );
  };

  // 3. Unified Submit Action (POST for Add / PUT for Edit)
  async function handlesubmit(e) {
    e.preventDefault();

    const validationerror = validataform(student);
    if (Object.keys(validationerror).length > 0) {
      seterrors(validationerror);
      return;
    }

    //const pathName = window.location.pathname;
    console.log("pathname", location.pathname); // - /teacher-dashboard

    try {
      let response;
      if (isEditMode) {
        // PUT request for editing entries

        response = await axios.put(
          `${studentPath ? studentapi : teacherapi}/update/${selectedStudent.id}`,
          student,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        // POST request for adding new entries
        response = await axios.post(
          `${studentPath ? studentapi : teacherapi}/create`,
          student,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      if (response.data?.meta?.code === 1 || response.status === 200) {
        if (!isEditMode) {
          setstudent({ name: "", place: "", phone: "" });
        }
        onClose();
        fetchStudentData();
        toast.success(response.data.meta.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/");
      }
      console.error(error.response?.data?.meta?.message || error.message);
    }

    setChanges(true);
  }

  function handleback() {
    conformationPopup();
  }

  function conformationPopup() {
    if (isEditMode && hasDataChanged()) {
      const confirmSave = window.confirm(
        "Are you sure you want to save these changes?",
      );
      if (!confirmSave) {
        return;
      }
    }
    // handlesubmit();
    onClose();
  }

  return (
    <div className="l-full bg-linear-to-l from-gray-50 to-gray-100 ">
      <div className="max-w-md  mx-auto rounded-2xl bg-gray-100 border border-slate-200/70 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-50/70 border-b border-slate-200/80 px-6 py-4">
          {studentPath ? (
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isEditMode ? "Edit Student Data" : "Add New Student"}
            </h2>
          ) : (
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isEditMode ? "Edit Teacher Data" : "Add New Teacher"}
            </h2>
          )}

          <p className="text-xs text-slate-500 mt-0.5">
            Please fill out all fields accurately.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handlesubmit} className="p-6 space-y-4">
          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            {studentPath ? (
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Student Name
              </label>
            ) : (
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Teacher Name
              </label>
            )}

            <input
              type="text"
              name="name"
              maxLength={20}
              value={student.name}
              onChange={handlechange}
              placeholder={`Enter ${studentPath ? "Student" : "Teacher"} Name`}
              className={`w-full px-3.5 py-2 text-sm border bg-white rounded-xl focus:outline-hidden focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
              }`}
            />

            {/* <input
                type="text"
                name="name"
                maxLength={20}
                value={student.name}
                onChange={handlechange}
                placeholder="Enter student name"
                className={`w-full px-3.5 py-2 text-sm border bg-white rounded-xl focus:outline-hidden focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                }`}
              /> */}

            {errors.name && (
              <span className="text-red-600 text-xs font-medium pl-1">
                {errors.name}
              </span>
            )}
          </div>

          {/* Place Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Location
            </label>
            <input
              type="text"
              name="place"
              maxLength={100}
              value={student.place}
              onChange={handlechange}
              placeholder="e.g. Guj, Raj"
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium ${
                errors.place
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
              }`}
            />
            {errors.place && (
              <span className="text-red-600 text-xs font-medium pl-1">
                {errors.place}
              </span>
            )}
          </div>

          {/* Phone Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Contact Phone
            </label>
            <input
              type="text"
              name="phone"
              inputMode="numeric"
              maxLength={10}
              value={student.phone}
              onChange={handlechange}
              placeholder="10-digit number"
              className={`w-full px-3.5 py-2 text-sm border bg-white rounded-xl focus:outline-hidden focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-mono ${
                errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
              }`}
            />
            {errors.phone && (
              <span className="text-red-600 text-xs font-medium pl-1">
                {errors.phone}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleback}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-500/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40"
            >
              {isEditMode ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
