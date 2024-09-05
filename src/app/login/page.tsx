"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check");
      const data = await response.json();

      if (data.authenticated) {
        // If authenticated, redirect to home
        router.push("/home");
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatch the login action
      const resultAction = await dispatch(login({ email, password }));
      console.log("resultAction", resultAction);

      // Check if the login was successful
      if (login.fulfilled.match(resultAction)) {
        router.push("/home"); // Navigate on successful login
      } else {
        console.error("Login failed:", resultAction.payload); // Handle error
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 form">
        <h1 className="text-4xl font-bold mb-12 text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="email"
          required
          className="p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="password"
          required
          className="p-2 border"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white">
          Login
        </button>
      </form>
    </main>
  );
};

export default Login;
