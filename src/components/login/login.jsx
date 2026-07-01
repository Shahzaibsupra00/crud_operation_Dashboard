import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        // Extract the user data from our updated backend response
        const user = res.data.userData;

        // Store the user data in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Route the user based on their role
        window.location.href = "/dashboard";
      }
    } catch (error) {
      // The backend now returns a 403 error with a message if the status is "N".
      // This catch block will automatically display that backend alert!
      alert(error.response?.data?.message || "Login Failed");
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login Page</h2>

      <form className="login-form" onSubmit={handleLogin}>
        <span className="form-label">Email</span>

        <input
          className="form-input"
          type="text"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          required
        />

        <span className="form-label">Password</span>

        <input
          className="form-input"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          required
        />

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
