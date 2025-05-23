"use client";

import { useEffect } from "react";
import localforage from "localforage";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await localforage.removeItem("current_user_id");
        await localforage.removeItem("current_user_name");
        await localforage.removeItem("current_user_email");
        await localforage.removeItem("current_user_mobile");

        // Optional: clear everything in the store if needed
        // await localforage.clear();

        console.log("User data cleared from IndexedDB.");
        router.push("/login"); // Redirect to login
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    performLogout();
  }, [router]);

  return null; // No UI needed
};

export default Logout;
