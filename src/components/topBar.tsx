import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar: React.FC = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full bg-black border-b border-gray-200 shadow-sm">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-7xl flex justify-between items-center py-4 px-4">
                    <Link to="/" className="text-2xl font-bold text-white">
                        Blogs
                    </Link>

                    <nav className="flex items-center space-x-6">
                        {!user ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `text-white hover:text-blue-600 transition ${isActive ? "font-semibold text-blue-600" : ""
                                        }`
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        `text-white hover:text-blue-600 transition ${isActive ? "font-semibold text-blue-600" : ""
                                        }`
                                    }
                                >
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-white font-medium">{user.name}</span>
                                </div>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 cursor-pointer">
                                        <div
                                            onClick={() => {
                                                logout();
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-1 text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
