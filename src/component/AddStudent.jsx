// import axios from 'axios';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { validataform } from '../utils/helper';


// export const AddStudent = () => {
//     const [student, setstudent] = useState({
//         name: '',
//         place: '',
//         phone: ''
//     });
//     const [errors, seterrors] = useState({});
//     const navigate = useNavigate();

//     const handlechange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'phone') {
//             // Remove non-numeric characters and cap length at 10 digits
//             let cleanedValue = value.replace(/\D/g, '');
//             if (cleanedValue.length > 10) {
//                 cleanedValue = cleanedValue.slice(0, 10);
//             }

//             setstudent((prev) => ({
//                 ...prev,
//                 [name]: cleanedValue
//             }));
//         } else {
//             setstudent((prev) => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }

//         seterrors((prev) => ({
//             ...prev,
//             [name]: ''
//         }));
//     };

    
//     async function handlesubmit(e) {
//         e.preventDefault();

//         // 1. Validate form first before running API logic
//         const validationerror = validataform(student);
//         if (Object.keys(validationerror).length > 0) {
//             seterrors(validationerror);
//             return; // Prevent API execution if errors exist
//         }

//         const api = import.meta.env.VITE_STUDENT_API_ENDPOINT;
//         const token = localStorage.getItem('authToken');

//         try {
//             const response = await axios.post(`${api}/create`,
//                 student,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             );
//             if (response.data?.meta?.code === 1) {
//                 setstudent({
//                     name: '',
//                     place: '',
//                     phone: ''
//                 });
//                 navigate('/studentdetail');
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 localStorage.removeItem('authToken');
//                 navigate('/');
//             }
//             console.error(error.response?.data?.meta?.message || error.message);
//         }
//     }

//     function handleback() {
//         navigate('/studentdetail');
//     }

//     return (
//         <>
//             <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
//                 <div className="text-indigo-500 font-semibold text-3xl text-center mb-6">
//                     Add New Student
//                 </div>

//                 <form onSubmit={handlesubmit} className="space-y-4">

//                     <div className="flex flex-col gap-1.5">
//                         <label className="text-sm font-bold text-gray-700">Name:</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={student.name}
//                             onChange={handlechange}
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all text-gray-900 ${errors.name
//                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                                 : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
//                                 }`}
//                         />
//                         {errors.name && <span className='text-red-600 text-sm'>{errors.name}</span>}
//                     </div>

//                     <div className="flex flex-col gap-1.5">
//                         <label className="text-sm font-bold text-gray-700">Place:</label>
//                         <input
//                             type="text"
//                             name="place"
//                             value={student.place}
//                             onChange={handlechange}
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all text-gray-900 ${errors.place
//                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                                 : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
//                                 }`}
//                         />
//                         {errors.place && <span className='text-red-600 text-sm'>{errors.place}</span>}
//                     </div>

//                     <div className="flex flex-col gap-1.5">
//                         <label className="text-sm font-bold text-gray-700">Phone:</label>
//                         <input
//                             type="text"
//                             name="phone"
//                             inputMode="numeric"
//                             maxLength={10}
//                             value={student.phone}
//                             onChange={handlechange}
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all text-gray-900 ${errors.phone
//                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
//                                 : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
//                                 }`}
//                         />
//                         {errors.phone && <span className='text-red-600 text-sm'>{errors.phone}</span>}
//                     </div>

//                     <div className="pt-2">
//                         <button
//                             type="submit"
//                             className="mr-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Save
//                         </button>
//                         <button
//                             type="button"
//                             onClick={handleback}
//                             className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Back
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };
