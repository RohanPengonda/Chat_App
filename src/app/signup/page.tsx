"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("clients").insert([
      {
        name,
        email,
        mobile,
        password,
      },
    ]);

    if (error) {
      console.log(error);
      toast.error("Error saving user data to database");
      return;
    }

    toast.success("User Created.Now You can Login");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Toaster />
      <div className="border p-6 rounded w-80">
        <h2 className="text-2xl font-bold mb-4 text-center border-b-2">
          Sign Up
        </h2>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block">Name:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Mobile:</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Password:</label>
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
            className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Sign Up
          </button>
        </form>
        <button
          className="w-full p-2 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Already have an account???
        </button>
      </div>
    </div>
  );
};

export default Signup;
