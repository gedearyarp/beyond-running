"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = () => {
        try {
            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("accessToken");

            if (userStr && token) {
                const userData = JSON.parse(userStr);
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            setUser(null);
            // Clear invalid data
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            const userData = response.data.user;
            setUser(userData);
            toast.success("Successfully logged in!");
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        toast.success("Successfully logged out!");
        router.push("/");
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
