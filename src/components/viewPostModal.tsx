import { FaTimes } from "react-icons/fa";

interface ViewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: any;
}

export const ViewPostModal = ({ isOpen, onClose, post }: ViewPostModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 transform transition-all duration-300 scale-100 opacity-100">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-4 text-gray-400 hover:text-blue-600 transition"
                >
                    <FaTimes size={16} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                    View Blog Post
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Title</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {post?.title}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Content</h3>
                        <div
                            className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-5 [&_li]:mb-1"
                            dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                        />

                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t">
                        <span>By: {post?.authorId?.name || "Unknown"}</span>
                        <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
