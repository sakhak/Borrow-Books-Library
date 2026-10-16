import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../../utils/request";
import Cookies from "js-cookie";
import LoadingComponent from "../../../components/loading/LoadingSpin";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      return navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      email: formData.email,
      password: formData.password,
    };
    try {
      setLoading(true);
      const res = await request("/login", "POST", data);
      setLoading(false);
      console.log(res);
      const token = Cookies.get("access_token");
      if (token) {
        return navigate("/");
      }
    } catch (error) {
      alert(error);
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div>
      <div>
        {loading && <LoadingComponent/>}
        <div>
          <h1 className="text-4xl font-bold text-center mb-5">Sign In</h1>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label className="text-xl"> Email</label>
          <input
            type="text"
            className="border-1 w-100 p-2 mt-2 mb-4 rounded-1xl"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <label className="text-xl"> Password</label>
          <input
            type="password"
            className="border-1 w-100 p-2 mt-2 rounded-1xl"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <a href="#" className="underline mb-1">
            Forgot password?
          </a>
          <button className="bg-main p-3 text-2xl font-medium text-text-white">
            Sign In
          </button>
        </form>
        <Link to="/register">Don't have account?Sign Up</Link>
      </div>
    </div>
  );
}

export default LoginPage;
