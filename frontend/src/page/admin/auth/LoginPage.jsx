import React, { useEffect, useState } from "react";
import { request } from "../../../utils/request";
import { useNavigate } from "react-router-dom"; 
import Cookies from "js-cookie";

function LoginPage() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Check if already logged in, redirect to home
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [navigate]);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await request("/login", "POST", formData);
      console.log('Login success:', res);
      
      // Token is already saved in cookies by your request function
      // Now redirect to home
      navigate('/'); // Go to homepage after successful login
      
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-3xl font-bold text-blue-600 mb-5">
          Login account
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <span>Email</span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleOnchange}
            value={data.email}
            required
            className="border-1 p-2 mt-1 mb-5 text-gray-400"
          />
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={handleOnchange}
            name="password"
            required
            className="border-1 p-2 mt-1 mb-5 text-gray-400"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 p-2 text-white text-2xl font-bold disabled:bg-blue-300"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;