import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../../utils/request";
import LoadingComponent from "../../../components/loading/LoadingSpin";
import Cookies from "js-cookie";

function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    password: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    password_confirmation: "",
    age: "",
  });

  const [isLoading , setIsLoading] = useState(false)
  const [prevImage, setPrevImage] = useState(null);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevImage = (e) => {
    const getImage = e.target.files?.[0];
    if (getImage) {
      setImage(getImage);
      setPrevImage(URL.createObjectURL(getImage));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const name in formData) {
      form.append(name, formData[name]);
    }
    if (image) {
      form.append("image", image);
    }

    try{
    setIsLoading(true) 
    const data = await request("/register", "POST", form);
    setIsLoading(false)
    if (data?.access_token) {
      Cookies.set("access_token", data.access_token);
      navigate("/");
    }
    }catch(err) {
      console.error(err)
    }finally{
      setIsLoading(false)
    }

  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-text-white">
      {isLoading ? <LoadingComponent/> : null}
      <div className="w-full max-w-2xl p-8 space-y-8bg-gray-800 ">
        <h1 className="text-3xl font-bold text-center text-main mb-6">Sign Up</h1>

        <form className="flex flex-col items-center justify-center">
          
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-text-white border-2 border-gray-600 rounded-full">
              {prevImage && (
                <img
                  src={prevImage}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              )}
            </div>
            <div className="absolute inset-0">
              <input
                type="file"
                accept="image/*"
                onChange={handlePrevImage}
                className="w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          
          <div className="flex flex-col w-full gap-1 mb-4">
            <label className="text-xl">First Name</label>
            <input
              className="p-2 border-1"
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />

            <label className="text-xl">Last Name</label>
            <input
              className="p-2 border-1"
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />

            <label className="text-xl">Full Name</label>
            <input
              className="p-2 border-1"
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
            />

            <label className="text-xl">Email</label>
            <input
              className="p-2 border-1"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="text-xl">Password</label>
            <input
              className="p-2 border-1"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <label className="text-xl">Password Confirmation</label>
            <input
              className="p-2 border-1"
              type="password"
              name="password_confirmation"
              placeholder="Password"
              value={formData.password_confirmation}
              onChange={handleChange}
            />

            <label className="text-xl">Phone</label>
            <input
              className="p-2 border-1"
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label className="text-xl">Address</label>
            <input
              className="p-2 border-1"
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xl">Date Of Birth</label>
              <input
                className="p-2 border-1 w-full"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xl">Age</label>
              <input
                className="p-2 border-1 w-full"
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center justify-center w-full gap-6 mb-8 text-black">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              <span className="text-xl">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              <span className="text-xl">Female</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
              />
              <span className="text-xl">Other</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold text-white transition-colors bg-main focus:outline-none focus:ring-4 focus:ring-indigo-300"
            onClick={handleRegister}
          >
            Create Account
          </button>
        </form>

        <Link to="/login">Already have account? Sign In</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
