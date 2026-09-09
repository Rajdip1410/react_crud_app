// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { Navigate, useNavigate, useParams } from 'react-router-dom';
// import { validataform } from '../utils/helper';

// export const EditStudentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [student, setstudent] = useState({
//     name: '',
//     place: '',
//     phone: ''
//   });
//   const [errors, seterrors] = useState({});
//   const api = import.meta.env.VITE_STUDENT_API_ENDPOINT;
//   const token = localStorage.getItem('authToken');

//   const handlechange = (e) => {
//     const { name, value } = e.target;
//     setstudent((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     seterrors((prev) => ({
//       ...prev,
//       [name]: ''
//     }))
//   }

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const response = await axios.get(`${api}/${id}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           }
//         );
//         if (response.data.meta.code === 1) {
//           setstudent({
//             name: response.data.data.name,
//             phone: response.data.data.phone,
//             place: response.data.data.place
//           })
//         }
//       } catch (errors) {
//         console.log(errors.response)
//         if (errors.response.status === 401) {
//           navigate('/');
//           localStorage.removeItem('authToken');
//         }
//         console.errors("Failed to fetch data:", errors.response.data.meta.message);
//       }
//     };
//     fetchStudentData();
//   }, [api]);


//   async function handlesubmit(e) {
//     e.preventDefault();
//     const validation = validataform(student);
//     seterrors(validation)
//     if (Object.keys(validation).length > 0) {
//       return;
//     }
//     try {
//       const response = await axios.put(`${api}/update/${id}`,
//         student,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       console.log("Edit response is", response);
//     } catch (errors) {
//       console.log(errors.message)
//     }

//   }


//   function handleback() {
//     navigate('/studentdetail')
//   }
//   return (
//     <>
//       <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
//         <div className="text-indigo-500 font-semibold text-3xl text-center mb-6">
//           Edit student data
//         </div>

//         <form onSubmit={handlesubmit} className="space-y-4">

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-bold text-gray-700">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={student.name}
//               onChange={handlechange}
//               className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900  ${errors.name
//                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                 : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
//                 }`}
//             />
//             {errors.name && <span className='text-red-600'>{errors.name}</span>}
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-bold text-gray-700">Place:</label>
//             <input
//               type="text"
//               name="place"
//               value={student.place}
//               onChange={handlechange}
//               className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900  ${errors.place
//                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                 : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
//                 }`} />
//             {errors.place && <span className='text-red-600'>{errors.place}</span>}

//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-bold text-gray-700">Phone:</label>
//             <input
//               type="text"
//               name="phone"
//               value={student.phone}
//               onChange={handlechange}
//               className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900  ${errors.phone
//                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                 : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
//                 }`} />
//             {errors.phone && <span className='text-red-600'>{errors.phone}</span>}

//           </div>
//           <button
//             type="submit"
//             className="mt-2 mr-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             Edit
//           </button>
//           <button onClick={handleback} className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >Back</button>
//         </form>

//       </div>
//     </>
//   )
// }
