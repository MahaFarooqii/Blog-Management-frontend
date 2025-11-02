import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import API from "../api/axios";
import { addTasks } from "../store/reducers/tasksSlice";
import { getProjects } from "../store/reducers/projectsSlice";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [project, setProject] = useState("");
    const [assignee, setAssignee] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [status, setStatus] = useState<"open" | "in-progress" | "resolved">("open");
    const { projects } = useSelector(
        (state: RootState) => state.projects
    );
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
            fetchUsers();
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        try {
            await dispatch(getProjects());
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await API.get("/auth/users");
            console.log('data', data)
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(
                addTasks({ title, description, project, assignee, priority, status })
            ).unwrap();

            onClose();
            setTitle("");
            setDescription("");
            setProject("");
            setAssignee("");
            setPriority("medium");
            setStatus("open");
        } catch (err) {
            console.error("Failed to add task:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4 text-black">Add New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1 text-black">Title</label>
                        <input
                            type="text"
                            className="border p-2 w-full rounded bg-white text-black"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-black">Description</label>
                        <textarea
                            className="border p-2 w-full rounded bg-white text-black"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-black">Project</label>
                        <select
                            className="border p-2 w-full rounded bg-white text-black"
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            required
                        >
                            <option value="">Select a project</option>
                            {projects.map((proj) => (
                                <option key={proj._id} value={proj._id}>
                                    {proj.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-black">Assignee</label>
                        <select
                            className="border p-2 w-full rounded bg-white text-black"
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        >
                            <option value="">Unassigned</option>
                            {users.map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block font-medium mb-1 text-black">Priority</label>
                            <select
                                className="border p-2 w-full rounded bg-white text-black"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block font-medium mb-1 text-black">Status</label>
                            <select
                                className="border p-2 w-full rounded bg-white text-black"
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as "open" | "in-progress" | "resolved")
                                }
                            >
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>

                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 text-black">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                        >
                            {loading ? "Saving..." : "Save Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
