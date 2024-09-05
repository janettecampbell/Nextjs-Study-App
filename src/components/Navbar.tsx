// navbar.tsx
"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "@/redux/slices/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { loadUser } from "@/redux/slices/authSlice";

const Navbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    console.log("Navbar isAuthenticated", isAuthenticated);
    if (!isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async (): Promise<void> => {
    // Dispatch logout action
    await dispatch(logoutAction());

    // Optionally, you can make an API call to your logout route here if needed
    await fetch("/api/auth/logout", { method: "POST" });

    // Redirect to login page after logout
    router.push("/login");
  };

  return (
    <nav className="p-4 bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/home" className="text-lg font-bold">
          Study App
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <span className="mr-4">Welcome, {user?.name || "User"}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4">
                Login
              </Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
