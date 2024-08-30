"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { setAuthUser, logout, loadUser } from "@/redux/slices/authSlice";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = async () => {
    const response = await fetch("/api/auth/check");
    const data = await response.json();
    if (data.authenticated) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  };
  
  checkAuth()
  
  useEffect(() => {
    // Load user on initial mount
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch the user details from the backend
      axios.get("/api/auth/me")
        .then((response) => {
          console.log("resopnse.data.user", response.data.user)
          if (response.data.user) {
            // Dispatch an action to set the user in the Redux store
            dispatch(setAuthUser({ user: response.data.user }));
          } else {
            // If there's no user, log them out
            dispatch(logout());
            router.push("/login");
          }
        })
        .catch(() => {
          // Handle error: remove the token and redirect to login
          Cookies.remove("token");
          dispatch(logout());
          router.push("/login");
        });
    } else {
      // If there's no token, redirect to login if the user isn't already authenticated
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [dispatch, router, isAuthenticated]);

  return <>{children}</>;
}
