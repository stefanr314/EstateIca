// src/app/hooks/useAuthInit.ts
import { useEffect } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchCurrentUser } from "@/features/auth/authSlice";

export function useAuthInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    dispatch(fetchCurrentUser());
  }, [dispatch]);
}
