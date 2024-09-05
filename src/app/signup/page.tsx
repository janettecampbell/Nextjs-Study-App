"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/signup", { name, email, password });
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 form">
        <h1 className="text-4xl font-bold mb-12 text-center">Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Name"
          required
          className="p-2 border"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          required
          className="p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white">
          Sign Up
        </button>
      </form>
    </main>
  );
};

export default Signup;
