import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LiaEyeSolid } from "react-icons/lia";
import { FaRegEyeSlash } from "react-icons/fa6";
import axios, { create } from "axios";
import { toast } from "react-toastify";
import { cn } from "../utils/cn";

export const Login = () => {
  const [logindata, setlogindata] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      return navigate("/student-detail");
    }
  }, []);

  function handlechange(e) {
    const { name, value } = e.target;
    setlogindata((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handlesubmit(e) {
    e.preventDefault();

    const validation = validationform(logindata);
    setError(validation);
    // console.log(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      const api = import.meta.env.VITE_APIFORAUTH;
      const response = await axios.post(`${api}`, logindata);
      toast.success("Login successful! Welcome back.");
      if (response.data.meta.code === 1) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("userRole", response.data.data.user.role);
        const userRole = localStorage.getItem("userRole");
        navigate("/dashboard");
      }
      const token = localStorage.getItem("authToken");

      setlogindata({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  function validationform(data) {
    const error = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!data.email) {
      error.email = "email is required";
    } else if (!emailRegex.test(data.email)) {
      error.email = "Please enter a valid email address";
    }
    // Regex for password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!data.password) {
      error.password = "password is required";
    } else if (!passwordRegex.test(data.password)) {
      error.password =
        "Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character";
    }
    return error;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-l from-purple-300 to-indigo-500 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl hover:shadow-4xl bg-white p-8 shadow-xl border border-slate-100">
        <div>
          <h2 className="text-center font-semibold text-3xl text-slate-700">
            Sign in
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handlesubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-small text-slate-500 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ",
                  error.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20",
                )}
                //type="email"
                placeholder="Enter email"
                name="email"
                value={logindata.email}
                // onChange={(e) => setemail(e.target.value)}
                onChange={handlechange}
              />
              {error.email && (
                <span className="text-red-600">{error.email}</span>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-small text-slate-500 mb-1"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm",
                    error.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20",
                  )}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  name="password"
                  value={logindata.password}
                  onChange={handlechange}
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={20} />
                  ) : (
                    <LiaEyeSolid size={20} />
                  )}
                </button>
              </div>

              {error.password && (
                <span className="text-red-600 block mt-1">
                  {error.password}
                </span>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group cursor-pointer relative flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
