import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { addPost } from "../store/reducers/postsSlice";
import { FaPenNib } from "react-icons/fa";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
interface AddPostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddPostModal = ({ isOpen, onClose }: AddPostModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(addPost({ title, content }));
            setTitle("");
            setContent("");
            onClose();
        } catch (err) {
            console.error("Failed to add post:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 transition-all duration-300 transform scale-100 opacity-100">

                <div className="flex items-center justify-center mb-6">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-3">
                        <FaPenNib size={22} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Add New Blog Post</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Title</label>
                        <input
                            type="text"
                            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none p-3 w-full rounded-lg bg-white text-gray-800 placeholder-gray-400 transition"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Content</label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            placeholder="Update your blog post content..."
                            className="bg-white text-gray-800"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-white font-medium hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2.5 rounded-lg font-medium text-white shadow-sm transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Publishing..." : "Publish Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
