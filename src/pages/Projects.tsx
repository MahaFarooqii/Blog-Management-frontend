import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { getProjects } from "../store/reducers/projectsSlice";
const Projects: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { projects, isLoading } = useSelector(
        (state: RootState) => state.projects
    );
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                await dispatch(getProjects());
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch projects");
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) return <div className="p-6">Loading projects...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-white min-h-screen ">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Projects</h1>

            {projects?.length === 0 ? (
                <div className="text-gray-500">No projects found.</div>
            ) : (
                <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Project Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {projects?.map?.((project) => (
                                <tr key={project._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {project.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {project.description || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${project.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : project.status === "completed"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {project.owner?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Projects;
