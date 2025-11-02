import React, { useEffect } from "react";
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalyticsByRole } from "../store/reducers/analyticsSlice";
import { useAuth } from "../context/AuthContext";
import type { AppDispatch, RootState } from "../store/store";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { overview, isLoading, error } = useSelector(
        (state: RootState) => state.analytics
    );

    useEffect(() => {
        if (user?.role) {
            dispatch(fetchAnalyticsByRole({ role: user.role }));
        }
    }, [user, dispatch]);

    if (isLoading) return <div>Loading dashboard...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!overview) return <div>No analytics found</div>;

    const projectStatus = overview.projectStatus?.map((p: any) => ({
        name: p._id,
        value: p.count,
    }));
    const taskDist = overview.taskDist?.map((t: any) => ({
        name: t._id,
        value: t.count,
    }));
    const ticketsResolved = overview.ticketsResolved;
    const modPerf = overview.moderatorPerf;
    const role = user?.role;

    const renderSection = (
        title: string,
        description: string,
        chart: React.ReactNode
    ) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-1 text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div style={{ height: 250 }}>{chart}</div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome, <span className="font-medium">{user?.name}</span> —{" "}
                    <span className="capitalize">{role}</span>
                </p>
            </div>

            {role === "admin" && (
                <>
                    <p className="text-gray-500 mb-6">
                        Manage users, view system-wide analytics, and oversee all projects.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {renderSection(
                            "Project Status (Active vs Completed)",
                            "Shows how many projects are currently active and how many are completed across the system.",
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={projectStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={80}
                                        label
                                    />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}

                        {renderSection(
                            "Task Distribution",
                            "Displays how tasks are distributed by status (open, in-progress, resolved).",
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskDist}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {renderSection(
                            "Tickets Resolved per User",
                            "Shows how many tickets each user has successfully resolved.",
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ticketsResolved}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="resolvedCount" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {renderSection(
                            "Moderator Performance (Team Progress)",
                            "Displays how many tasks were resolved under each moderator’s projects — useful to compare team performance.",
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={modPerf}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="resolved" name="Resolved Tasks" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}

            {role === "moderator" && (
                <>
                    <p className="text-gray-500 mb-6">
                        Manage your projects, assign tasks, and track your team’s progress.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {renderSection(
                            "Project Status",
                            "Shows the current state of your projects (active vs completed).",
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={projectStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={80}
                                        label
                                    />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {renderSection(
                            "Team Task Distribution",
                            "Displays how your team’s tasks are divided between open, in-progress, and resolved statuses.",
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskDist}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}

            {role === "user" && (
                <>
                    <p className="text-gray-500 mb-6 w-full">
                        Track your progress and monitor your resolved tickets.
                    </p>
                    <div className="grid grid-cols-1 gap-8">
                        {renderSection(
                            "Your Ticket Resolution Progress",
                            "Shows how many tickets you’ve resolved to date.",
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={ticketsResolved?.filter(
                                        (t: any) => t.name === user?.name
                                    )}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="resolvedCount" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
