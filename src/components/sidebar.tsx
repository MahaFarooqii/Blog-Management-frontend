import { LayoutDashboard, Folder, CheckSquare, Ticket, Menu } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const links = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { name: "Projects", icon: <Folder size={20} />, path: "/projects" },
        { name: "Tasks", icon: <CheckSquare size={20} />, path: "/tasks" },
        { name: "Tickets", icon: <Ticket size={20} />, path: "/tickets" },
    ];

    return (
        <div
            className={`${collapsed ? "w-20" : "w-60"
                } bg-gray-50 h-screen shadow-md border-r border-gray-200 flex flex-col transition-all duration-300`}
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className={`font-bold text-xl text-gray-700 ${collapsed ? "hidden" : "block"}`}>
                    Admin Panel
                </h2>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg"
                >
                    <Menu size={22} />
                </button>
            </div>

            <nav className="flex flex-col p-3 gap-2">
                {links?.map((link) => (
                    <NavLink
                        to={link.path}
                        key={link.name}
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-lg transition ${isActive
                                ? "bg-blue-100 text-blue-600 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.icon}
                        {!collapsed && <span>{link.name}</span>}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
