import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

type User = { id: string; name: string; role: string } | null;

interface AuthContextType {
    user: User;
    login: (email: string, password: string) => Promise<User>;
    register: (name: string, email: string, password: string, role: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        if (token && userJson) {
            setUser(JSON.parse(userJson));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const register = async (name: string, email: string, password: string, role: string) => {
        const { data } = await API.post("/auth/register", { name, email, password, role });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-gray-600">
                Loading...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
