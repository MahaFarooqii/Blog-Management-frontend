import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddTaskModal from "../components/addTaskModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { getTasks, updateTaskStatus } from "../store/reducers/tasksSlice";

const Tasks = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);

    const handleStatusChange = async (taskId: string, newStatus: "open" | "in-progress" | "resolved") => {
        try {
            await dispatch(updateTaskStatus({ id: taskId, status: newStatus })).unwrap();
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    if (isLoading) return <p className="text-center p-4">Loading tasks...</p>;

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                {(user?.role === "admin" || user?.role === "moderator") && (
                    <button
                        className="bg-black text-white px-4 py-2 rounded transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Task
                    </button>
                )}
            </div>

            {tasks?.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg border border-gray-100">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 text-black">Title</th>
                                <th className="p-3 text-black">Description</th>
                                <th className="p-3 text-black">Project</th>
                                <th className="p-3 text-black">Assignee</th>
                                <th className="p-3 text-black">Priority</th>
                                <th className="p-3 text-black">Status</th>
                                <th className="p-3 text-black">Resolutions</th>
                                <th className="p-3 text-black">Created</th>
                                <th className="p-3 text-black text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks?.map?.((task) => (
                                <tr key={task._id} className="border-b hover:bg-gray-50 transition duration-150">
                                    <td className="p-3 text-black">{task?.title}</td>
                                    <td className="p-3 text-black">{task?.description || "—"}</td>
                                    <td className="p-3 text-black">{task?.project?.title || "N/A"}</td>
                                    <td className="p-3 text-black">{task?.assignee?.name || "Unassigned"}</td>
                                    <td
                                        className={`p-3 font-medium ${task?.priority === "high"
                                            ? "text-red-600"
                                            : task?.priority === "medium"
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {task?.priority}
                                    </td>
                                    <td
                                        className={`p-3 ${task?.status === "resolved"
                                            ? "text-green-600"
                                            : task?.status === "in-progress"
                                                ? "text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        {task?.status}
                                    </td>
                                    <td className="p-3 text-center text-black">
                                        {task?.resolutions?.length || 0}
                                    </td>
                                    <td className="p-3 text-black">
                                        {new Date(task?.createdAt)?.toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-center">
                                        {task?.status !== "in-progress" && (
                                            <button
                                                onClick={() => handleStatusChange(task?._id, "in-progress")}
                                                className="text-blue-600 hover:underline mr-2 bg-white"
                                            >
                                                In Progress
                                            </button>
                                        )}
                                        {task?.status !== "resolved" && (
                                            <button
                                                onClick={() => handleStatusChange(task?._id, "resolved")}
                                                className="text-green-600 hover:underline bg-white"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Tasks;
