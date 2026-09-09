// import React from "react";
// import {
//   createBrowserRouter,
//   Outlet,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";

// import { ViewDetail } from "./ViewDetail";

// import { Login } from "../pages/Login";

// import { StudentForm } from "./StudentForm";
// import { StudentTable } from "../pages/StudentTable";

// export const Routing = () => {
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Login />,
//     },

//     {
//       element: <ProtectedRoute />,
//       children: [
//         {
//           path: "/studentdetail",
//           element: <StudentTable />,
//         },
//       ],
//     },
//     {
//       path: "*",
//       element: <Navigate to="/" replace />,
//     },
//   ]);

//   return <RouterProvider router={router} />;
// };
