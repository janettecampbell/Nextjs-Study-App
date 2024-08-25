"use client";
import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReduxProvider from "./redux-provider";
import axios from "axios";
import { setUser } from "@/redux/slices/userSlice";

function AuthWrapper() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/verify", { withCredentials: true });
        if (data.user) {
          dispatch(setUser(data.user));
          router.push('/home'); // Redirect to home after successful login
        }
      } catch (error) {
        console.log("User is not authenticated");
      }
    };
    verifyUser();
  }, [dispatch]);

  return null;
}

export default function Providers({ children }: PropsWithChildren<any>) {
  return (
    <ReduxProvider>
      <AuthWrapper />
      {children}
    </ReduxProvider>
  );
}
