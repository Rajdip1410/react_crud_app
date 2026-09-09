import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { accessRole } from "./utils/accessRole";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  Link,
  NavLink,
} from "react-router-dom";
import { StudentTable } from "./pages/StudentTable";
import { Login } from "./pages/Login";
import { Unauthorized } from "./component/Unauthorized";
import { AdminPage } from "./pages/AdminPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { useNavigate } from "react-router-dom";
import { cn } from "./utils/cn";

export const Sidebar = () => {
  const [logout, setLogout] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const userRole = localStorage.getItem("userRole")?.trim().toLocaleLowerCase();
  const navigationLinks = [
    {
      path: "/dashboard",
      label: "⚙️ Dashboard",
      allowedRoles: ["admin", "user", "teacher"],
    },
    {
      path: "/teacher-dashboard",
      label: " 👩‍🏫 Teacher List",
      allowedRoles: ["admin", "teacher"],
    },
    {
      path: "/student-detail",
      label: "👨‍🎓 Student List",
      allowedRoles: ["admin", "user"],
    },
  ];

  return (
    <div className="w-60 bg-slate-800 text-white flex flex-col p-5 shadow-md h-screen">
      <h3 className="mb-7 text-center pb-3.5 border-b border-slate-700 font-semibold text-lg">
        Rajdip
      </h3>
      <ul className="p-0 m-0 flex-1 list-none">
        {navigationLinks
          .filter((link) => link.allowedRoles.includes(userRole))
          .map((link, index) => (
            <li key={index}>
              {/* 2. Use NavLink with a dynamic className function */}

              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "block no-underline py-3 px-4 rounded-md mb-2.5 text-base transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white font-medium shadow-sm"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white",
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
      </ul>
      <button
        onClick={() => setLogout(true)}
        className="p-3 bg-red-500 hover:bg-red-600 text-white border-none rounded-md cursor-pointer font-bold transition-colors"
      >
        Log Out
      </button>

      {logout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setLogout(false)}
        >
          <div
            className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl m-4 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content Area */}
            <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="text-center sm:text-left mt-2 sm:mt-0">
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Confirm Logout
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to log out of your account? You will
                  need to re-enter your credentials to log back in.
                </p>
              </div>
            </div>

            {/* Responsive Action Buttons */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setLogout(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // console.log("Current User Role from LocalStorage:", JSON.stringify(userRole));
  // console.log("Allowed Roles for this route:", allowedRoles);
  // console.log("Does it match?", allowedRoles.includes(userRole));

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Wrapped the Outlet in a Flexbox layout alongside the Sidebar
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/student-detail" element={<StudentTable />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["teacher", "admin"]} />}
          >
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "user", "teacher"]} />
            }
          >
            <Route path="/dashboard" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
