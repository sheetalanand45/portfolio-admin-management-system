import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn } from "lucide-react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <span>⌂</span>
        </div>

        <h1>My Portfolio CMS</h1>

        <p className="login-subtitle">
          Welcome back! Please login to your account.
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Username</label>

            <div className="input-wrapper">
              <Mail size={17} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={17} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="login-button" type="submit">
            <LogIn size={17} />
            Login
          </button>

        </form>

        <button className="forgot-password">
          Forgot password?
        </button>

      </div>
    </div>
  );
}

export default Login;