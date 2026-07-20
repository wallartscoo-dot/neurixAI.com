"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const data = await login(email, password);

      localStorage.setItem("neurixToken", data.token);

      alert("Login Successful!");

      window.location.href = "/";
    } catch (err) {
      alert("Login Failed");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: 300 }}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: 10 }}
        >
          Login
        </button> 
        <p style={{ marginTop: 15 }}>
  Don't have an account?{" "}
  <a href="/signup">Sign Up</a>
</p>
      </div>
    </div>
  );
}
