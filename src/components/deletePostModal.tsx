import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { deletePost } from "../store/reducers/postsSlice";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeletePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: any;
}

export const DeletePostModal = ({ isOpen, onClose, post }: DeletePostModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isDeleting } = useSelector((state: RootState) => state.posts);

    if (!isOpen) return null;

    const handleDeletePost = async () => {
        await dispatch(deletePost(post?._id));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 transform transition-all duration-300 scale-100 opacity-100">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 text-red-600 p-3 rounded-full mb-4">
                        <FaExclamationTriangle size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Delete Post
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Are you sure you want to permanently delete{" "}
                        <span className="font-semibold text-gray-900">
                            “{post?.title}”
                        </span>
                        ? This action <span className="text-red-600 font-medium">cannot be undone</span>.
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-white font-medium hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeletePost}
                        disabled={isDeleting}
                        className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-sm transition ${isDeleting
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};
