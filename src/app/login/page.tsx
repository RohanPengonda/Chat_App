// Login.tsx
"use client";

import React, { useState, useEffect } from "react"; // Add useEffect for localforage config
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import localforage from "localforage"; // Import localforage

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Configure localforage store (optional, but good practice)
  useEffect(() => {
    localforage.config({
      name: "ChatApp", // Use the same name as in Main_Page.tsx
      storeName: "userStore", // Use the same storeName
      description: "User session and chat data",
    });
  }, []); // Run once on component mount

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .or(`email.eq.${emailOrMobile},mobile.eq.${emailOrMobile}`)
      .eq("password", password)
      .single();

    if (error || !data) {
      toast.error("User not available");
      return;
    }

    // ✅ Store in IndexedDB using localforage
    try {
      await localforage.setItem("current_user_id", data.id);
      await localforage.setItem("current_user_name", data.name);
      await localforage.setItem("current_user_email", data.email || "");
      await localforage.setItem("current_user_mobile", data.mobile || "");
      console.log(
        "User data stored in IndexedDB:",
        data.name,
        data.mobile,
        data.id
      );
    } catch (dbError) {
      console.error("Error storing user data in IndexedDB:", dbError);
      toast.error("Failed to save session data.");
      return; // Stop execution if IndexedDB save fails
    }

    toast.success("Logged in successfully!");
    router.push("/"); // Navigate to home
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Toaster />
      <div className="border p-6 rounded w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block p-2">Email / Mobile No:</label>
            <input
              type="text"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block p-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded cursor-pointer hover:bg-green-700"
          >
            Login
          </button>
        </form>

        <button
          className="w-full p-2 cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          Create an account???
        </button>
      </div>
    </div>
  );
};

export default Login;
