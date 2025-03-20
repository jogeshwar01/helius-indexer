// signup with email and password

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        formData
      );

      if (response.data.token && response.data?.user?.email) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.user.email);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Invalid email or password");
    }
  };

  if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
      {error && <p>{error}</p>}

      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default Signup;
